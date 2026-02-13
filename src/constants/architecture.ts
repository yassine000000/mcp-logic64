// This file acts as the Layer A (Deterministic) Filter for the Cortex Engine.
export const LOGIC64_ARCHITECTURE = {
    // 1. Stack Validation
    stack: {
        required: ["Next.js", "Hono", "Supabase", "Tailwind"],
        forbidden: ["Express", "MongoDB", "Redux", "Bootstrap", "Prisma", "Python", "PHP"]
    },

    // 2. Domain Concepts (Auto-Context Injection)
    concepts: [
        {
            domain: "UI_Design",
            triggers: ["button", "card", "layout", "css", "style", "component"],
            rules: [
                "USE: Tailwind CSS for all styling.",
                "USE: Shadcn/UI components from @/components/ui.",
                "FORBIDDEN: CSS Modules or Styled Components."
            ]
        },
        {
            domain: "Database",
            triggers: ["table", "schema", "column", "sql", "migration", "store", "save"],
            rules: [
                "USE: Supabase JS Client for queries.",
                "MANDATORY: Row Level Security (RLS) on all tables.",
                "FORBIDDEN: ORMs like Prisma or TypeORM."
            ]
        },
        {
            domain: "Backend_API",
            triggers: ["api", "route", "fetch", "endpoint", "server", "cors"],
            rules: [
                "USE: Hono for API routes (Edge Runtime).",
                "USE: Server Actions for mutations (POST/PUT/DELETE).",
                "FORBIDDEN: Traditional Express/Node.js patterns."
            ]
        }
    ]
};
