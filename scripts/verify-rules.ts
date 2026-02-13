// apps/kernel/scripts/verify-rules.ts

import { LOGIC64_ARCHITECTURE } from '../src/constants/architecture.js';

console.log("🛡️ Starting Logic64 Layer-A (Deterministic) Verification...");

function verify(code: string) {
    const violations: string[] = [];

    // 1. Stack Validation
    LOGIC64_ARCHITECTURE.stack.forbidden.forEach(forbidden => {
        const importPattern = new RegExp(`import.*['"]${forbidden.toLowerCase()}['"]`, 'i');
        if (importPattern.test(code)) {
            violations.push(`⛔ FORBIDDEN STACK: Import of '${forbidden}' detected.`);
        }
    });

    // 2. Style Validation
    if (code.includes('style={{')) {
        violations.push('⛔ FORBIDDEN PATTERN: Inline styles detected (Use Tailwind).');
    }

    if (code.includes('.module.css') || code.includes('.module.scss')) {
        violations.push('⛔ FORBIDDEN PATTERN: CSS Modules detected (Use Tailwind).');
    }

    // Return true if PASSED (0 violations), false if FAILED
    return violations;
}

const scenarios = [
    {
        name: "✅ Valid Hono Import",
        code: `import { Hono } from 'hono';`,
        expected: 0
    },
    {
        name: "❌ Forbidden Express Import",
        code: `import express from 'express';`,
        expected: 1
    },
    {
        name: "❌ Forbidden Inline Style",
        code: `<div style={{ color: 'red' }}>`,
        expected: 1
    },
    {
        name: "✅ Valid Tailwind Class",
        code: `<div className="bg-red-500">`,
        expected: 0
    }
];

let failed = false;

scenarios.forEach(s => {
    const violations = verify(s.code);
    if (violations.length === s.expected) {
        console.log(`${s.name}: PASSED`);
    } else {
        console.log(`${s.name}: FAILED (Expected ${s.expected}, Found ${violations.length})`);
        violations.forEach(v => console.log(`   -> ${v}`));
        failed = true;
    }
});

if (failed) {
    console.error("\n💥 Verification Failed! The rules are strictly enforced.");
    process.exit(1);
} else {
    console.log("\n✨ All Governance Rules Verified Successfully!");
}
