import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { randomUUID } from 'crypto';

export const maxDuration = 60;

// Initialize Supabase (Server-side)
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
    try {
        const { prompt, projectId } = await req.json();

        // 1. The Builder (Claude 3.5 Sonnet)
        const { text: builderResponse } = await generateText({
            model: anthropic('claude-3-5-sonnet-20240620'),
            system: 'You are The Builder. Role: Senior Software Architect. Goal: Propose the fastest and most modern technical solutions. Focus on Logic64 architecture.',
            prompt: `User Request: ${prompt}`,
        });

        // 2. The Skeptic (GPT-4o)
        const { text: skepticResponse } = await generateText({
            model: openai('gpt-4o'),
            system: 'You are The Skeptic. Role: Security & Scalability Lead. Goal: Critique the Builder\'s suggestions, find loopholes, enforce strict standards.',
            prompt: `Builder's Proposal: ${builderResponse}\n\nCritique this proposal strictly.`,
        });

        // 3. The Moderator (Claude 3 Haiku)
        const { text: moderatorResponse } = await generateText({
            model: anthropic('claude-3-haiku-20240307'),
            system: 'You are The Moderator. Role: Technical Project Manager. Goal: Summarize the debate, extract final decisions, and convert them to the strict "logic64.json" format. Output ONLY JSON.',
            prompt: `Builder Proposal: ${builderResponse}\n\nSkeptic Critique: ${skepticResponse}\n\nTask: Synthesize the final architecture rules into a JSON object with 'stack', 'concepts' (domain, triggers, rules). Return ONLY valid JSON.`,
        });

        // Extract JSON from Moderator
        let rulesJson = {};
        try {
            // Attempt to parse standard JSON, handling potential markdown code blocks
            const jsonMatch = moderatorResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                rulesJson = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error("Failed to parse JSON from Moderator", e);
        }

        // 4. Store in Supabase (Output Phase)
        // If projectId is provided, update; otherwise create new project mock.
        const apiKey = `lk_${randomUUID().replace(/-/g, '')}`; // Generate a new API Key for the user

        // In a real flow, we would have a logged-in user. We'll simulate User ID.
        const mockUserId = '00000000-0000-0000-0000-000000000000'; // Placeholder

        // Insert into Projects table
        const { data: project, error: dbError } = await supabase
            .from('projects')
            .insert({
                user_id: mockUserId,
                name: `Project: ${prompt.substring(0, 20)}...`,
                architecture_rules: rulesJson,
                api_key: apiKey
            })
            .select()
            .single();

        if (dbError) {
            console.error("Supabase Error:", dbError);
        }

        return Response.json({
            builder: builderResponse,
            skeptic: skepticResponse,
            moderator: moderatorResponse,
            generatedAPIKey: apiKey, // Return this so the user can use it in Cursor
            projectId: project?.id
        });
    } catch (error) {
        console.error(error);
        return Response.json({ error: 'Failed to run council' }, { status: 500 });
    }
}
