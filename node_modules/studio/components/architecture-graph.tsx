'use client';

import React from 'react';
import ReactFlow, {
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'User Request' },
        position: { x: 250, y: 0 },
        style: { background: '#fff', border: '1px solid #000', borderRadius: '8px' }
    },
    {
        id: '2',
        data: { label: 'The Council (Builder, Skeptic, Moderator)' },
        position: { x: 250, y: 100 },
        style: { background: '#f0f9ff', border: '1px solid #0284c7', width: 200 }
    },
    {
        id: '3',
        data: { label: 'logic64.json (Supabase)' },
        position: { x: 250, y: 220 },
        style: { background: '#f0fdf4', border: '1px solid #16a34a' }
    },
    {
        id: '4',
        data: { label: 'Cloud Kernel (Hono + MCP)' },
        position: { x: 250, y: 320 },
        style: { background: '#000', color: '#fff', border: '1px solid #000' }
    },
    {
        id: '5',
        type: 'output',
        data: { label: 'Cursor / Claude' },
        position: { x: 250, y: 420 },
        style: { background: '#fff', border: '1px solid #000' }
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
    { id: 'e3-4', source: '3', target: '4', label: 'Feeds Rules' },
    { id: 'e4-5', source: '4', target: '5', animated: true, label: 'SSE Stream' },
];

export default function ArchitectureGraph() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    return (
        <div style={{ height: '500px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
            >
                <Background color="#ccc" gap={20} />
                <Controls />
            </ReactFlow>
        </div>
    );
}
