import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export interface GenerateAIResponseOptions {
    messages: { role: "user" | "assistant", content: string }[];
    systemPrompt: string;
    temperature?: number;
}

/**
 * Generates AI response with streaming support
 * Optimized for exam-specific note generation with structured output
 */
export async function generateAIResponse({
    messages,
    systemPrompt,
    temperature = 0.7,
}: GenerateAIResponseOptions): Promise<ReturnType<typeof streamText>> {
    return streamText({
        model: groq("openai/gpt-oss-20b"),
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
        temperature,
        // Additional parameters for better structured output
        topP: 0.9, // Nucleus sampling for more focused responses
    });
}