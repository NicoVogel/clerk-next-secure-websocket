import { type SignedInAuthObject } from "@clerk/backend/internal";
import { createClerkClient } from "@clerk/backend";
import type http from "node:http";
import { type Server } from "node:http";
import type internal from "stream";
import { WebSocketServer } from "ws";
import { env } from "~/env";

export function createWebSocketServer(server: Server) {
  const wss = new WebSocketServer({
    noServer: true,
  });

  wss.on("connection", (ws) => {
    console.log("connection");
    let index = 0;
    ws.on("message", (message) => {
      // the effort of globally extending the WebSocket type with the `auth` property is not worth it
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      const auth: SignedInAuthObject = (ws as any).auth;
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      console.log("message",  message.toString(), auth.userId);
      ws.send(`pong ${index++} ${auth.userId}`);
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  server.on("upgrade", async (req, socket, header) => {
    if (req.url === "/_next/webpack-hmr") {
      return;
    }
    const auth = await authGuard(req, socket);
    if (auth === undefined) {
      return;
    }

    wss.handleUpgrade(req, socket, header, (ws) => {
      // the effort of globally extending the WebSocket type with the `auth` property is not worth it
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      (ws as any).auth = auth;
      wss.emit("connection", ws, req);
    });
  });
}

const clerkClient = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
  publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

function authGuard(req: http.IncomingMessage, socket: internal.Duplex) {
  return clerkClient
    .authenticateRequest(convertIncomingMessageToRequest(req))
    .catch((err) => {
      console.error(
        `Something went wrong while authenticating the user: ${String(err)}`,
      );
      respondUnauthorized(socket);
    })
    .then((client) => {
      if (client === undefined) {
        return;
      }
      if (client.isSignedIn === false) {
        return respondUnauthorized(socket);
      }
      return client.toAuth();
    })
    .catch((err) => {
      console.error(
        `Something went wrong while upgrading the connection to WebSocket: ${String(
          err,
        )}`,
      );
      return responseInternalServerError(socket);
    });
}

function convertIncomingMessageToRequest(req: http.IncomingMessage) {
  const { method } = req;
  const origin = `http://${req.headers.host ?? "localhost"}`;
  const fullUrl = new URL(req.url!, origin);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined || Array.isArray(value)) {
      continue;
    }
    headers.set(key, value);
  }

  return new Request(fullUrl, {
    method,
    headers,
  });
}

function respondUnauthorized(socket: internal.Duplex) {
  socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  socket.destroy();
}

function responseInternalServerError(socket: internal.Duplex) {
  socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
  socket.destroy();
}
