/**
 * Logic64 v1.0 Architecture Rules
 * 
 * This file contains the canonical architectural constraints for building Logic64.
 * These rules are enforced by the MCP Server during development.
 */

export const LOGIC64_ARCHITECTURE = {
    project: {
        name: "Logic64",
        version: "1.0.0",
        description: "SaaS Platform for AI Code Governance via MCP over SSE"
    },

    stack: {
        required: ["Node.js", "Hono", "Next.js 14", "Supabase", "Tailwind", "TypeScript"],
        forbidden: ["Express", "Fastify", "Koa", "Python", "CSS Modules", "styled-components"]
    },

    architecture: {
        pattern: "Monorepo with Clean Separation",
        structure: {
            studio: "apps/studio - Next.js 14 Web Platform",
            kernel: "apps/kernel - Hono MCP Server",
            database: "apps/database - Supabase Schema"
        }
    },

    concepts: [
        {
            domain: "Backend Framework",
            triggers: ["server", "api", "route", "endpoint", "backend"],
            rules: [
                "MUST use Hono framework exclusively",
                "FORBIDDEN to use Express, Fastify, or any MVC framework",
                "All routes MUST be stateless",
                "MUST use @hono/node-server for serving"
            ]
        },
        {
            domain: "MCP Protocol",
            triggers: ["mcp", "tool", "transport", "protocol"],
            rules: [
                "MUST use @modelcontextprotocol/sdk",
                "Transport MUST be SSE (Server-Sent Events)",
                "FORBIDDEN to use stdio transport",
                "Tools MUST use Zod for input validation"
            ]
        },
        {
            domain: "Database",
            triggers: ["database", "query", "storage", "data", "sql"],
            rules: [
                "MUST use Supabase client (@supabase/supabase-js)",
                "FORBIDDEN to use raw SQL in application code",
                "All queries MUST respect RLS policies",
                "MUST use JSONB for architecture_rules storage"
            ]
        },
        {
            domain: "Frontend",
            triggers: ["ui", "component", "page", "frontend", "view"],
            rules: [
                "MUST use Next.js 14 with App Router",
                "MUST use Tailwind CSS for all styling",
                "FORBIDDEN to use CSS Modules or styled-components",
                "Components MUST be functional (no class components)",
                "MUST use 'use client' directive for client components"
            ]
        },
        {
            domain: "AI Integration",
            triggers: ["ai", "llm", "agent", "council"],
            rules: [
                "MUST use Vercel AI SDK (ai package)",
                "MUST use @ai-sdk/anthropic for Claude models",
                "MUST use @ai-sdk/openai for GPT models",
                "Council MUST have 3 agents: Builder, Skeptic, Moderator"
            ]
        },
        {
            domain: "Architecture Visualization",
            triggers: ["diagram", "visualization", "graph", "flow"],
            rules: [
                "MUST use ReactFlow for architecture diagrams",
                "FORBIDDEN to use Mermaid or other diagram libraries"
            ]
        }
    ],

    governance: {
        principle: "Stateless enforcement with embedded rules",
        enforcement: [
            "Every code change MUST be validated before acceptance",
            "LLM MUST consult architect before implementing features",
            "Violations MUST be rejected with clear explanations"
        ]
    }
};

export type ArchitectureRules = typeof LOGIC64_ARCHITECTURE;
