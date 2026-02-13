// apps/kernel/scripts/verify-kernel.ts

import * as fs from 'fs';
import * as path from 'path';

async function verifyKernelIntegrity() {
    console.log("🧠 Verifying Logic64 Cortex Kernel Integrity...");

    const indexPath = path.join(process.cwd(), 'src/index.ts');

    if (!fs.existsSync(indexPath)) {
        console.error("❌ Critical: src/index.ts not found!");
        process.exit(1);
    }

    const indexContent = fs.readFileSync(indexPath, 'utf-8');

    const requiredSignatures = [
        { key: 'ask_cortex', label: "Cortex Engine Tool" },
        { key: 'get_initial_context', label: "Handshake Protocol" },
        { key: 'consult_documentation', label: "Documentation Tool" },
        { key: 'LOGIC64_ARCHITECTURE', label: "Architecture Constants" },
        { key: 'cortex_engine.md', label: "Hybrid Logic Loader" }
    ];

    let missing = false;

    requiredSignatures.forEach(sig => {
        if (indexContent.includes(sig.key)) {
            console.log(`✅ [FOUND] ${sig.label}`);
        } else {
            console.error(`❌ [MISSING] ${sig.label} - The kernel is incomplete!`);
            missing = true;
        }
    });

    if (missing) {
        console.error("\n🚨 Kernel Verification Failed. Please update src/index.ts to v3.0 standards.");
        process.exit(1);
    }

    console.log("\n🚀 Kernel Integrity Verified. Ready to launch Cortex v3.0.");
}

verifyKernelIntegrity().catch(console.error);
