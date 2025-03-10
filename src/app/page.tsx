"use client";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect , useState } from "react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <SignedIn>
          <WebSocketTest />
        </SignedIn>
      </div>
    </main>
  );
}

function WebSocketTest() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [resetWs, setResetWs] = useState(0);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws");
    setWs(ws);
    ws.onmessage = (event) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      setMessages((prev) => [...prev, event.data]);
    };
  }, [resetWs]);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <input className="text-black" type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => {
        ws?.send(message);
        setMessage("");
      }}>Send</button>

      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <button onClick={() => setResetWs((prev) => prev + 1)}>Reset</button>
    </div>
  );
}
