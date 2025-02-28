# Clerk Nextjs Secure WebSocket Example

This project demonstrates how to implement secure WebSocket connections using Clerk authentication with Nextjs.
It includes both a client and server implementation showing how to maintain authenticated WebSocket connections.

## Prerequisites

- Node.js (v16 or higher recommended)
- A Clerk account and project (get one at [clerk.com](https://clerk.com))

## Setup

1. Clone the repository:

```bash
git clone https://github.com/nicovogel/clerk-nextjs-websocket-example.git
cd clerk-nextjs-websocket-example
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

## Running the project

1. Start the server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000` to access the chat interface.

## Project Structure

- `/src/app`
  - `page.ts` - Main page with the websocket connection
- `/src/server`
  - `server.ts` - Custom nextjs server
  - `ws/web-socket-server.ts` - Websocket implementation

## License

MIT