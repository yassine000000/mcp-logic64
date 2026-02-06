
import { LOGIC64_ARCHITECTURE } from '../src/logic64-rules';

console.log("Starting Logic64 Rule Verification...");

// mock function to simulate verify_compliance tool logic
function verify(code: string, file: string) {
    const violations: string[] = [];

    // Check for forbidden imports
    LOGIC64_ARCHITECTURE.stack.forbidden.forEach(forbidden => {
        const importPattern = new RegExp(`import.*['"]${forbidden.toLowerCase()}['"]`, 'i');
        if (importPattern.test(code)) {
            violations.push(`FORBIDDEN: Import of '${forbidden}' detected.`);
        }
    });

    // Check for inline styles
    if (code.includes('style={{')) {
        violations.push('FORBIDDEN: Inline styles detected.');
    }

    // Check for CSS Modules
    if (code.includes('.module.css') || code.includes('.module.scss')) {
        violations.push('FORBIDDEN: CSS Modules detected.');
    }

    return violations;
}

const scenarios = [
    {
        name: "Valid Hono Import",
        code: `import { Hono } from 'hono';`,
        expected: 0
    },
    {
        name: "Forbidden Express Import",
        code: `import express from 'express';`,
        expected: 1
    },
    {
        name: "Forbidden Inline Style",
        code: `<div style={{ result: 'red' }}>`,
        expected: 1
    },
    {
        name: "Valid Tailwind Class",
        code: `<div className="bg-red-500">`,
        expected: 0
    }
];

let failed = false;

scenarios.forEach(s => {
    const violations = verify(s.code, "test.tsx");
    if (violations.length === s.expected) {
        console.log(`✅ ${s.name}: Passed (Found ${violations.length} violations)`);
    } else {
        console.log(`❌ ${s.name}: Failed (Expected ${s.expected}, Found ${violations.length})`);
        violations.forEach(v => console.log(`   - ${v}`));
        failed = true;
    }
});

if (failed) {
    console.error("\nVerification Failed!");
    process.exit(1);
} else {
    console.log("\nAll Architecture Rules Verified Successfully!");
}
