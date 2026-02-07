"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const cors_1 = require("hono/cors");
const streaming_1 = require("hono/streaming");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const crypto_1 = require("crypto");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const path_1 = require("path");
dotenv_1.default.config();
const app = new hono_1.Hono();
app.use('/*', (0, cors_1.cors)());
const mcp = new mcp_js_1.McpServer({
    name: "Logic64 Builder",
    version: "1.0.0"
});
// --- Data Paths ---
const DATA_ROOT = (0, path_1.join)(process.cwd(), 'data');
const PATHS = {
    CONTRACT: (0, path_1.join)(DATA_ROOT, 'system/contract.md'),
    GLOBAL: (0, path_1.join)(DATA_ROOT, 'global_architecture.md'),
    SUMMARY: (0, path_1.join)(DATA_ROOT, 'summary_index.md'),
    SPECS_DIR: (0, path_1.join)(DATA_ROOT, 'specs')
};
// --- MCP Tools (Contract & Index Protocol) ---
// 1. Tool: get_initial_context
// Returns the Contract, Global Context, and the Index.
mcp.registerTool("get_initial_context", { description: "Get the System Contract, Global Architecture, and Documentation Index. CALL THIS FIRST." }, async () => {
    try {
        const [contract, global, summary] = [
            (0, fs_1.readFileSync)(PATHS.CONTRACT, 'utf-8'),
            (0, fs_1.readFileSync)(PATHS.GLOBAL, 'utf-8'),
            (0, fs_1.readFileSync)(PATHS.SUMMARY, 'utf-8')
        ];
        return {
            content: [{
                    type: "text",
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
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error loading context: ${error}` }],
            isError: true
        };
    }
});
// 2. Tool: read_specific_spec
// Reads a specific spec file from the index.
mcp.registerTool("read_specific_spec", {
    description: "Read a specific technical spec file from the Index.",
    inputSchema: zod_1.z.object({
        file_path: zod_1.z.string().describe("The path from the Index (e.g., 'specs/database_rules.md')")
    })
}, async ({ file_path }) => {
    // Security: Prevent directory traversal
    if (file_path.includes('..') || file_path.startsWith('/') || file_path.includes('\\')) {
        return {
            content: [{ type: "text", text: "❌ ACCESS DENIED: Invalid path." }],
            isError: true
        };
    }
    // Ensure strictly inside data directory
    const fullPath = (0, path_1.resolve)(DATA_ROOT, file_path);
    if (!fullPath.startsWith((0, path_1.resolve)(DATA_ROOT))) {
        return {
            content: [{ type: "text", text: "❌ ACCESS DENIED: Path traversal detected." }],
            isError: true
        };
    }
    if (!(0, fs_1.existsSync)(fullPath)) {
        return {
            content: [{ type: "text", text: `❌ ERROR: File '${file_path}' not found.` }],
            isError: true
        };
    }
    const content = (0, fs_1.readFileSync)(fullPath, 'utf-8');
    return {
        content: [{ type: "text", text: content }]
    };
});
// --- SSE Transport ---
class HonoSSETransport {
    constructor(sessionId, writer) {
        this.sessionId = sessionId;
        this.writer = writer;
    }
    async start() { }
    async close() {
        this.onclose?.();
    }
    async send(message) {
        try {
            await this.writer(`event: message\ndata: ${JSON.stringify(message)}\n\n`);
        }
        catch (e) {
            this.onerror?.(e);
        }
    }
    handleMessage(message) {
        if (this.onmessage) {
            this.onmessage(message);
        }
    }
}
const transports = new Map();
// --- Routes ---
app.get('/sse', async (c) => {
    const sessionId = (0, crypto_1.randomUUID)();
    console.log(`[SSE] New Logic64 Builder session: ${sessionId}`);
    return (0, streaming_1.streamText)(c, async (stream) => {
        const transport = new HonoSSETransport(sessionId, async (data) => {
            await stream.write(data);
        });
        transports.set(sessionId, transport);
        await mcp.connect(transport);
        await stream.write(`event: endpoint\ndata: /messages?sessionId=${sessionId}\n\n`);
        const interval = setInterval(async () => {
            try {
                await stream.write(': keep-alive\n\n');
            }
            catch (e) {
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
(0, node_server_1.serve)({
    fetch: app.fetch,
    port
});
