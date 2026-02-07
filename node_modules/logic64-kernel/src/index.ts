import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText } from 'hono/streaming'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import dotenv from 'dotenv'
import { readFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'

dotenv.config();

const app = new Hono()
app.use('/*', cors())

const mcp = new McpServer({
  name: "Logic64 Builder",
  version: "1.0.0"
})

// --- Data Paths ---
const DATA_ROOT = join(process.cwd(), 'data');
const PATHS = {
  CONTRACT: join(DATA_ROOT, 'system/contract.md'),
  GLOBAL: join(DATA_ROOT, 'global_architecture.md'),
  SUMMARY: join(DATA_ROOT, 'summary_index.md'),
  SPECS_DIR: join(DATA_ROOT, 'specs')
};

// --- MCP Tools (Contract & Index Protocol) ---

// 1. Tool: get_initial_context
// Returns the Contract, Global Context, and the Index.
mcp.registerTool("get_initial_context",
  { description: "Get the System Contract, Global Architecture, and Documentation Index. CALL THIS FIRST." },
  async () => {
    try {
      const [contract, global, summary] = [
        readFileSync(PATHS.CONTRACT, 'utf-8'),
        readFileSync(PATHS.GLOBAL, 'utf-8'),
        readFileSync(PATHS.SUMMARY, 'utf-8')
      ];

      return {
        content: [{
          type: "text" as const,
          text: `
=== CONTRACT (MUST OBEY) ===
${contract}

=== GLOBAL ARCHITECTURE ===
${global}

=== DOCUMENTATION INDEX (PICK ONE) ===
${summary}
`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Error loading context: ${error}` }],
        isError: true
      };
    }
  }
);

// 2. Tool: read_specific_spec
// Reads a specific spec file from the index.
mcp.registerTool("read_specific_spec",
  {
    description: "Read a specific technical spec file from the Index.",
    inputSchema: z.object({
      file_path: z.string().describe("The path from the Index (e.g., 'specs/database_rules.md')")
    }) as any
  },
  async (args: any) => {
    // Manual validation to bypass Zod type inference issues
    const file_path = args.file_path;

    if (typeof file_path !== 'string') {
      return {
        content: [{ type: "text" as const, text: "❌ ERROR: Invalid input. 'file_path' must be a string." }],
        isError: true
      };
    }

    // Security: Prevent directory traversal
    if (file_path.includes('..') || file_path.startsWith('/') || file_path.includes('\\')) {
      return {
        content: [{ type: "text" as const, text: "❌ ACCESS DENIED: Invalid path." }],
        isError: true
      };
    }

    // Ensure strictly inside data directory
    const fullPath = resolve(DATA_ROOT, file_path);
    if (!fullPath.startsWith(resolve(DATA_ROOT))) {
      return {
        content: [{ type: "text" as const, text: "❌ ACCESS DENIED: Path traversal detected." }],
        isError: true
      };
    }

    if (!existsSync(fullPath)) {
      return {
        content: [{ type: "text" as const, text: `❌ ERROR: File '${file_path}' not found.` }],
        isError: true
      };
    }

    const content = readFileSync(fullPath, 'utf-8');
    return {
      content: [{ type: "text" as const, text: content }]
    };
  }
);


// --- SSE Transport ---

class HonoSSETransport implements Transport {
  public sessionId: string;
  private writer: (data: string) => Promise<void>;
  public onmessage?: (message: any) => void;
  public onclose?: () => void;
  public onerror?: (error: Error) => void;

  constructor(sessionId: string, writer: (data: string) => Promise<void>) {
    this.sessionId = sessionId;
    this.writer = writer;
  }

  async start() { }

  async close() {
    this.onclose?.();
  }

  async send(message: any) {
    try {
      await this.writer(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
    } catch (e) {
      this.onerror?.(e as Error);
    }
  }

  handleMessage(message: any) {
    if (this.onmessage) {
      this.onmessage(message);
    }
  }
}

const transports = new Map<string, HonoSSETransport>();

// --- Routes ---

app.get('/sse', async (c) => {
  const sessionId = randomUUID();
  console.log(`[SSE] New Logic64 Builder session: ${sessionId}`);

  return streamText(c, async (stream) => {
    const transport = new HonoSSETransport(sessionId, async (data) => {
      await stream.write(data);
    });
    transports.set(sessionId, transport);

    await mcp.connect(transport);
    await stream.write(`event: endpoint\ndata: /messages?sessionId=${sessionId}\n\n`);

    const interval = setInterval(async () => {
      try {
        await stream.write(': keep-alive\n\n');
      } catch (e) {
        clearInterval(interval);
      }
    }, 15000);

    stream.onAbort(async () => {
      console.log(`[SSE] Session ended: ${sessionId}`);
      clearInterval(interval);
      transports.delete(sessionId);
      await transport.close();
    });

    await new Promise(() => { });
  });
});

app.post('/messages', async (c) => {
  const sessionId = c.req.query('sessionId');
  if (!sessionId || !transports.has(sessionId)) {
    return c.text('Session not found', 404);
  }

  const body = await c.req.json();
  const transport = transports.get(sessionId);

  if (transport) {
    transport.handleMessage(body);
  }

  return c.text('Accepted');
});

// --- Start Server ---

const port = 3001;
console.log(`Logic64 Builder Server running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
