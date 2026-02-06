import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'
import { LOGIC64_ARCHITECTURE } from './logic64-rules.js'

dotenv.config();

const app = new Hono()
app.use('/*', cors())

const mcp = new McpServer({
  name: "Logic64 Governance Kernel",
  version: "1.0.0"
})

// --- MCP Resources: Documentation Access ---

const DOCS_ROOT = join(process.cwd(), '../../_archive/MCP-Core/docs');

// Register resource handlers
mcp.server.setRequestHandler({
  method: "resources/list",
  handler: async () => ({
    resources: [
      {
        uri: "logic64://context-map",
        name: "Logic64 Context Map",
        description: "Index of all architectural documentation",
        mimeType: "text/markdown"
      },
      {
        uri: "logic64://system-architecture",
        name: "System Architecture Specification",
        description: "The 7-layer architecture and Phase-Shift Protocol",
        mimeType: "text/markdown"
      }
    ]
  })
});

mcp.server.setRequestHandler({
  method: "resources/read",
  handler: async (request: any) => {
    const uri = request.params.uri;

    if (uri === "logic64://context-map") {
      const content = readFileSync(join(DOCS_ROOT, 'CONTEXT_MAP.md'), 'utf-8');
      return { contents: [{ uri, mimeType: "text/markdown", text: content }] };
    }

    if (uri === "logic64://system-architecture") {
      const content = readFileSync(join(DOCS_ROOT, 'system_architecture.md'), 'utf-8');
      return { contents: [{ uri, mimeType: "text/markdown", text: content }] };
    }

    throw new Error(`Unknown resource: ${uri}`);
  }
});

// --- MCP Tools ---

mcp.tool("get_architecture_vision",
  {},
  async () => {
    const summary = `
# Logic64 Architecture Vision

**Project**: ${LOGIC64_ARCHITECTURE.project.name} v${LOGIC64_ARCHITECTURE.project.version}
**Purpose**: ${LOGIC64_ARCHITECTURE.project.description}

## Stack
Required: ${LOGIC64_ARCHITECTURE.stack.required.join(', ')}
Forbidden: ${LOGIC64_ARCHITECTURE.stack.forbidden.join(', ')}

## Structure
${Object.entries(LOGIC64_ARCHITECTURE.architecture.structure).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

## Governance Principle
${LOGIC64_ARCHITECTURE.governance.principle}

## Available Documentation
Use MCP Resources to access detailed docs:
- logic64://context-map - Index of all documentation
- logic64://system-architecture - Detailed architecture spec

## Next Steps
1. Read the Context Map to understand the documentation structure
2. Before making ANY code changes, consult specific docs via Resources
3. Use consult_architect tool for intent-specific rules
4. Use verify_compliance before submitting code
`;

    return {
      content: [{ type: "text", text: summary }]
    };
  }
);

mcp.tool("consult_architect",
  { intent: z.string().describe("What you want to build (e.g., 'database query', 'API endpoint')") },
  async ({ intent }) => {
    console.log(`[MCP] Consulting architect for: ${intent}`);

    const matchedConcepts = LOGIC64_ARCHITECTURE.concepts.filter(concept =>
      concept.triggers.some(trigger => intent.toLowerCase().includes(trigger))
    );

    if (matchedConcepts.length === 0) {
      return {
        content: [{
          type: "text",
          text: `No specific rules found for "${intent}". General guidance:\n- Follow the stack requirements\n- Consult the documentation via Resources before proceeding`
        }]
      };
    }

    const guidance = matchedConcepts.map(concept =>
      `**${concept.domain}**:\n${concept.rules.map(r => `- ${r}`).join('\n')}`
    ).join('\n\n');

    return {
      content: [{
        type: "text",
        text: `Architectural Guidance for "${intent}":\n\n${guidance}`
      }]
    };
  }
);

mcp.tool("verify_compliance",
  {
    code_snippet: z.string().describe("Code to verify"),
    target_file: z.string().describe("Target file path")
  },
  async ({ code_snippet, target_file }) => {
    console.log(`[MCP] Verifying ${target_file}`);

    const violations: string[] = [];

    // Check for forbidden imports
    LOGIC64_ARCHITECTURE.stack.forbidden.forEach(forbidden => {
      const importPattern = new RegExp(`import.*['"]${forbidden.toLowerCase()}['"]`, 'i');
      if (importPattern.test(code_snippet)) {
        violations.push(`FORBIDDEN: Import of '${forbidden}' detected. Use approved stack instead.`);
      }
    });

    // Check for inline styles (Tailwind enforcement)
    if (code_snippet.includes('style={{')) {
      violations.push('FORBIDDEN: Inline styles detected. Use Tailwind classes.');
    }

    // Check for CSS Modules
    if (code_snippet.includes('.module.css') || code_snippet.includes('.module.scss')) {
      violations.push('FORBIDDEN: CSS Modules detected. Use Tailwind instead.');
    }

    if (violations.length === 0) {
      return {
        content: [{
          type: "text",
          text: "✅ APPROVED: Code follows Logic64 architectural guidelines."
        }]
      };
    } else {
      return {
        content: [{
          type: "text",
          text: `❌ REJECTED: Code violates architectural rules:\n\n${violations.map((v, i) => `${i + 1}. ${v}`).join('\n')}`
        }]
      };
    }
  }
);

// --- SSE Transport ---

class HonoSSETransport implements Transport {
  private sessionId: string;
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
  console.log(`[SSE] New Logic64 session: ${sessionId}`);

  return c.streamText(async (stream) => {
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
console.log(`Logic64 Governance Kernel running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
