import next from "next";
import { createServer } from "node:http";
import { parse } from "node:url";
import { env } from "~/env";
import { createWebSocketServer } from "./ws/web-socket-server";

const dev = env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (!req.url) return;
    const parsedUrl = parse(req.url, true);
    void handle(req, res, parsedUrl);
  });

  createWebSocketServer(server);

  const port = 3000;

  server.listen(port, () => {
    console.log(
      `✅ Server listening at http://0.0.0.0:${port} as ${
        dev ? "development" : env.NODE_ENV
      }`,
    );
  });
});

