"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load environment variables
dotenv_1.default.config();
// --- Constants & Config ---
const PORT = parseInt(process.env.PORT || '3000', 10);
const SERVER_NAME = process.env.MCP_SERVER_NAME || 'logic64-mcp';
const GOVERNANCE_MODE = process.env.GOVERNANCE_MODE || 'strict';
// --- Server Initialization ---
const fastify = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        stream: process.stderr,
    },
});
// --- MCP Server Initialization ---
const mcp = new mcp_js_1.McpServer({
    name: SERVER_NAME,
    version: '1.0.0',
});
// --- Governance Loading (The "Law" Reader) ---
// This function reads the CONTEXT_MAP.md to verify governance is present.
function loadGovernanceContext() {
    try {
        const coreContextPath = path_1.default.resolve(__dirname, '../MCP-Core/docs/CONTEXT_MAP.md');
        const decisionContextPath = path_1.default.resolve(__dirname, '../MCP-Decision-System/docs/CONTEXT_MAP.md');
        const governanceContractPath = path_1.default.resolve(__dirname, '../MCP-Core/knowledge/governance_contract_template.md');
        if (!fs_1.default.existsSync(coreContextPath) || !fs_1.default.existsSync(decisionContextPath) || !fs_1.default.existsSync(governanceContractPath)) {
            console.warn('WARNING: Governance Artifacts missing. System running in UNGOVERNED mode.');
            if (GOVERNANCE_MODE === 'strict') {
                throw new Error('CRITICAL: Strict Governance Mode enabled but Context Maps not found.');
            }
        }
        else {
            console.error('SUCCESS: Governance Context Maps loaded. logic64 is GOVERNED.');
        }
        // --- MCP Resource: Governance Contract ---
        // Expose the contract as a readable resource for the Client
        mcp.resource("governance-contract", "resource://logic64/governance-contract", async (uri) => {
            const contractContent = fs_1.default.readFileSync(governanceContractPath, 'utf-8');
            return {
                contents: [{
                        uri: uri.href,
                        text: contractContent,
                        mimeType: "text/markdown"
                    }]
            };
        });
    }
    catch (error) {
        console.error('Governance Load Error:', error);
        process.exit(1);
    }
}
// --- Basic Health Check ---
fastify.get('/health', async (request, reply) => {
    return { status: 'ok', server: SERVER_NAME, governance: GOVERNANCE_MODE };
});
// --- Main Start Function ---
const start = async () => {
    try {
        // 1. Verify Governance
        loadGovernanceContext();
        // 2. Start MCP Server (Stdio Transport for now)
        const transport = new stdio_js_1.StdioServerTransport();
        await mcp.connect(transport);
        console.error(`MCP Server '${SERVER_NAME}' connected on stdio`);
        // 3. Start Fastify (HTTP Transport)
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.error(`HTTP Server listening on port ${PORT}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
