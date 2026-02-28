import { streamText, generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export interface GenerateAIResponseOptions {
    messages: { role: "user" | "assistant", content: string }[];
    systemPrompt: string;
    temperature?: number;
}

export interface RagPlanResult {
    topic: string;
    relevant_context: string;
    key_terms: string[];
}

/**
 * Generates AI response with streaming support.
 * Always returns structured notion_page JSON format.
 */
export async function generateAIResponse({
    messages,
    systemPrompt,
    temperature = 0.6,
}: GenerateAIResponseOptions): Promise<ReturnType<typeof streamText>> {
    return streamText({
        model: groq("llama-3.3-70b-versatile"),
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
        temperature,
        topP: 0.9,
    });
}

/**
 * Agentic RAG planning step — non-streaming.
 * Given the user query + recent messages, the model identifies the relevant
 * prior context so it can be injected into the main generation prompt.
 */
export async function planRagContext(
    userQuery: string,
    recentMessages: { role: "user" | "assistant", content: string }[],
    plannerSystemPrompt: string,
): Promise<RagPlanResult | null> {
    if (recentMessages.length < 2) {
        // Not enough history to retrieve context from
        return null;
    }

    try {
        // Build a condensed history snapshot (last 6 messages to avoid token bloat)
        const historySnapshot = recentMessages
            .slice(-6)
            .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content.substring(0, 400)}${m.content.length > 400 ? "..." : ""}`)
            .join("\n\n");

        const result = await generateText({
            model: groq("llama-3.3-70b-versatile"),
            messages: [
                { role: "system", content: plannerSystemPrompt },
                {
                    role: "user",
                    content: `Current user query: "${userQuery}"\n\nRecent conversation history:\n${historySnapshot}\n\nIdentify the relevant context and key terms.`
                }
            ],
            temperature: 0.2,
        });

        const text = result.text.trim();

        // Extract JSON from the planner response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;

        const parsed = JSON.parse(jsonMatch[0]) as RagPlanResult;

        // Validate the structure
        if (typeof parsed.topic !== "string" || typeof parsed.relevant_context !== "string") {
            return null;
        }

        return parsed;
    } catch (error) {
        console.error("[RAG] Planning step failed:", error);
        return null;
    }
}