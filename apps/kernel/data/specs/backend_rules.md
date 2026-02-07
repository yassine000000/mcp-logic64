# Backend Rules (Apps/Kernel)

## 1. The Stack
- **Framework**: Hono (`hono`).
- **Runtime**: Node.js Adapter (`@hono/node-server`).
- **Streaming**: Server-Sent Events (SSE) via `hono/streaming`.

## 2. Architecture
- **Stateless**: The kernel does not store persistent state.
- **Transport**: MCP over SSE (`/sse` endpoint).
- **Security**: CORS enabled for Cursor/Localhost.

## 3. Coding Standards
- **Async/Await**: Always use async handlers.
- **Validation**: Use strict Typescript interfaces or Zod for tool inputs.
- **Error Handling**: Try/Catch blocks in every tool handler.
