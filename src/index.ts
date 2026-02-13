import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText } from 'hono/streaming'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { Transport } from '@modelcontextprotocol/sdk/shared/transport.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import dotenv from 'dotenv'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { LOGIC64_ARCHITECTURE } from './constants/architecture.js'

dotenv.config();

const app = new Hono()
app.use('/*', cors())

// --- Initialization ---
const mcp = new McpServer({
  name: "Logic64 Cortex Kernel",
  version: "3.0.0"
})

// --- Data Paths & State ---
// Using process.cwd() assumes you run 'npm run dev' from apps/kernel
const DATA_ROOT = join(process.cwd(), 'data');
const PATHS = {
  MANIFEST: join(DATA_ROOT, 'project_manifest.json'),
  SAM: join(DATA_ROOT, '03_data', 'sam_structure.md'), // In a real DB, this is a SQL query
  LAYERS: {
    'principles': join(DATA_ROOT, '00_principles'),
    'architecture': join(DATA_ROOT, '01_architecture'),
    'domains': join(DATA_ROOT, '02_domains'),
    'data': join(DATA_ROOT, '03_data'),
    'api': join(DATA_ROOT, '04_api')
  }
};

// --- Helper: Read SAM State (Simulated DB) ---
function getArchitectureState() {
  // For MVP: We read the JSON part from the MD file or a dedicated JSON file
  // In Production: This queries Supabase
  try {
    // Simulating reading logic64-state.json if it existed
    const statePath = join(DATA_ROOT, 'logic64-state.json');
    if (existsSync(statePath)) return readFileSync(statePath, 'utf-8');
    return null;
  } catch (e) { return null; }
}

// --- MCP Tools Implementation ---

// 1. Tool: get_initial_context (The Handshake)
mcp.tool("get_initial_context",
  { project_api_key: z.string().describe("Project API Key from .env") },
  async ({ project_api_key }) => {
    // 1. Validate Key (Mock)
    if (!project_api_key) return { isError: true, content: [{ type: "text", text: "Missing API Key" }] };

    // 2. Load Manifest
    if (!existsSync(PATHS.MANIFEST)) {
      return { isError: true, content: [{ type: "text", text: "❌ CRITICAL: Manifest not found." }] };
    }
    const manifest = readFileSync(PATHS.MANIFEST, 'utf-8');

    return {
      content: [{
        type: "text",
        text: `✅ Logic64 Kernel Online.\n\n=== PROJECT MANIFEST ===\n${manifest}`
      }]
    };
  }
);

// 2. Tool: ask_cortex (The Brain)
// This is where the Hybrid Logic lives
mcp.tool("ask_cortex",
  {
    intent: z.string().describe("What you want to build"),
    current_file: z.string().optional()
  },
  async ({ intent, current_file }) => {

    // ---------------------------------------------------------
    // LAYER A: The Deterministic Resolver (Code-Based Check) 🛡️
    // ---------------------------------------------------------

    const lowerIntent = intent.toLowerCase();

    // 1. Stack Validation (Forbidden Tech)
    // We check for any forbidden keyword in the user request
    const forbiddenFound = LOGIC64_ARCHITECTURE.stack.forbidden.find(tech =>
      lowerIntent.includes(tech.toLowerCase())
    );

    if (forbiddenFound) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            type: "REJECT",
            reason: "Governance Violation (Layer A)",
            message: `You requested '${forbiddenFound}', but Logic64 strictly forbids it. We use: ${LOGIC64_ARCHITECTURE.stack.required.join(", ")}.`
          }, null, 2)
        }]
      };
    }

    // 2. Domain Concept Triggers
    // Automatically identify the domain based on keywords
    const matchedConcept = LOGIC64_ARCHITECTURE.concepts.find(c =>
      c.triggers.some(t => lowerIntent.includes(t))
    );

    let specificRules = "";
    if (matchedConcept) {
      specificRules = `\n>>> DETECTED DOMAIN: ${matchedConcept.domain} <<<\nRULES:\n- ${matchedConcept.rules.join("\n- ")}\n`;
    }

    // ---------------------------------------------------------
    // LAYER B: The Inference Synthesizer (LLM Prompt) 🧠
    // ---------------------------------------------------------

    // A. Deterministic Layer: Check State
    const samState = getArchitectureState();

    // B. Construct the Prompt/Context for the Client to generate the Blueprint
    let cortexContext = `=== CORTEX ENGINE CONTEXT ===\n`;
    cortexContext += `User Intent: "${intent}"\n`;
    if (specificRules) cortexContext += specificRules; // Inject specific rules only!
    if (current_file) cortexContext += `Context: ${current_file}\n`;

    // Load Cortex Logic
    const engineLogic = readFileSync(join(PATHS.LAYERS.architecture, 'cortex_engine.md'), 'utf-8');
    cortexContext += `\n=== ENGINE LOGIC ===\n${engineLogic}\n`;

    // Load Execution Rules
    const execRules = readFileSync(join(PATHS.LAYERS.domains, 'kernel_execution.md'), 'utf-8');
    cortexContext += `\n=== EXECUTION RULES ===\n${execRules}\n`;

    // Load SAM (State) if available
    if (samState) {
      cortexContext += `\n=== CURRENT ARCHITECTURE STATE (SAM) ===\n${samState}\n`;
    }

    return {
      content: [{
        type: "text",
        text: `🧠 CORTEX ANALYSIS COMPLETE.\n\nInstructions: You are now acting as the Cortex Engine. Based on the context below, generate a strict JSON Blueprint for the user's intent. Do NOT write code yet. Output the Blueprint JSON first.\n\n${cortexContext}`
      }]
    };
  }
);

// 3. Tool: consult_documentation (The Librarian)
mcp.tool("consult_documentation",
  {
    node_id: z.enum(['governance', 'standards', 'system_context', 'db_schema', 'mcp_tools'])
  },
  async ({ node_id }) => {
    // Map IDs to file paths
    const map: Record<string, string> = {
      'governance': join(PATHS.LAYERS.principles, 'governance_rules.md'),
      'standards': join(PATHS.LAYERS.principles, 'coding_standards.md'),
      'system_context': join(PATHS.LAYERS.architecture, 'system_context.md'),
      'db_schema': join(PATHS.LAYERS.data, 'database_schema.md'),
      'mcp_tools': join(PATHS.LAYERS.api, 'mcp_tools.md')
    };

    const targetPath = map[node_id];
    if (!targetPath || !existsSync(targetPath)) {
      return { isError: true, content: [{ type: "text", text: "Document not found." }] };
    }

    const content = readFileSync(targetPath, 'utf-8');
    return {
      content: [{ type: "text", text: content }]
    };
  }
);

// --- Transport & Server Setup ---

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
  async close() { this.onclose?.(); }
  async send(message: any) {
    try {
      await this.writer(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
    } catch (e) { this.onerror?.(e as Error); }
  }
  handleMessage(message: any) { if (this.onmessage) this.onmessage(message); }
}

const transports = new Map<string, HonoSSETransport>();

app.get('/sse', async (c) => {
  const sessionId = randomUUID();
  console.log(`[SSE] New Session: ${sessionId}`);

  return streamText(c, async (stream) => {
    const transport = new HonoSSETransport(sessionId, async (data) => {
      await stream.write(data);
    });
    transports.set(sessionId, transport);

    await mcp.connect(transport);
    await stream.write(`event: endpoint\ndata: /messages?sessionId=${sessionId}\n\n`);

    const interval = setInterval(async () => {
      try { await stream.write(': keep-alive\n\n'); } catch (e) { clearInterval(interval); }
    }, 15000);

    stream.onAbort(async () => {
      console.log(`[SSE] Disconnect: ${sessionId}`);
      clearInterval(interval);
      transports.delete(sessionId);
      await transport.close();
    });

    await new Promise(() => { });
  });
});

app.post('/messages', async (c) => {
  const sessionId = c.req.query('sessionId');
  if (!sessionId || !transports.has(sessionId)) return c.text('Session not found', 404);
  const body = await c.req.json();
  transports.get(sessionId)?.handleMessage(body);
  return c.text('Accepted');
});

// --- Boot ---
const port = 3001;
console.log(`🚀 Logic64 Cortex Kernel v3.0 running on port ${port}`);
serve({ fetch: app.fetch, port });