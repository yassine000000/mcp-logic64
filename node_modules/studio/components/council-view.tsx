'use client';
import { useState } from 'react';

import ArchitectureGraph from "@/components/architecture-graph";

export default function CouncilView() {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    async function runCouncil() {
        if (!prompt) return;
        setLoading(true);
        try {
            const res = await fetch('/api/council', {
                method: 'POST',
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col gap-4 text-center">
                <h1 className="text-4xl font-bold tracking-tight">The Design Studio</h1>
                <p className="text-gray-500">Summon the Council to architect your next system.</p>
            </div>

            <div className="flex gap-4">
                <input
                    className="border border-gray-300 p-4 flex-1 rounded-lg shadow-sm focus:ring-2 focus:ring-black outline-none"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    placeholder="Describe your feature (e.g., 'A secure authentication system using Supabase')..."
                    onKeyDown={e => e.key === 'Enter' && runCouncil()}
                />
                <button
                    className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-all"
                    onClick={runCouncil}
                    disabled={loading}
                >
                    {loading ? 'Debating...' : 'Consult Architect'}
                </button>
            </div>

            {loading && (
                <div className="text-center py-20 animate-pulse text-gray-400">
                    The Council is deliberating...
                </div>
            )}

            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Builder */}
                    <div className="border border-blue-200 p-6 rounded-xl bg-blue-50/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-2xl">👷</div>
                            <h3 className="font-bold text-blue-900 text-lg">The Builder</h3>
                        </div>
                        <div className="whitespace-pre-wrap text-sm text-blue-900/80 leading-relaxed font-mono">
                            {result.builder}
                        </div>
                    </div>

                    {/* Skeptic */}
                    <div className="border border-red-200 p-6 rounded-xl bg-red-50/50 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-2xl">🛡️</div>
                            <h3 className="font-bold text-red-900 text-lg">The Skeptic</h3>
                        </div>
                        <div className="whitespace-pre-wrap text-sm text-red-900/80 leading-relaxed font-mono">
                            {result.skeptic}
                        </div>
                    </div>

                    {/* Moderator */}
                    <div className="md:col-span-2 border border-purple-200 p-6 rounded-xl bg-purple-50/50 shadow-md ring-1 ring-purple-200">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-2xl">⚖️</div>
                            <h3 className="font-bold text-purple-900 text-lg">The Moderator (Final Verdict)</h3>
                        </div>
                        <div className="whitespace-pre-wrap text-sm text-purple-900/80 leading-relaxed font-mono">
                            {result.moderator}
                        </div>
                    </div>

                    {/* API Key Display */}
                    {result.generatedAPIKey && (
                        <div className="md:col-span-2 bg-black text-white p-6 rounded-xl">
                            <h3 className="font-bold text-lg mb-2">🚀 Project Initialized</h3>
                            <p className="text-gray-400 text-sm mb-4">Add this URL to Cursor as an MCP Server:</p>
                            <code className="bg-gray-800 p-3 rounded block font-mono text-green-400">
                                https://api.logic64.com/sse?apiKey={result.generatedAPIKey}
                            </code>
                        </div>
                    )}

                    {/* Diagrams: ReactFlow */}
                    <div className="md:col-span-2 mt-8">
                        <h3 className="font-bold text-lg mb-4">Architecture Visualization</h3>
                        <ArchitectureGraph />
                    </div>
                </div>
            )}
        </div>
    );
}
