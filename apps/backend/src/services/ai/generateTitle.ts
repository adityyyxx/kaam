import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { detectExamType } from "../prompt.js";

/**
 * Generates a concise, descriptive title for a chat conversation
 * Detects exam context if present to make titles more meaningful
 */
export async function generateChatTitle(messages: { role: "user" | "assistant", content: string }[]): Promise<string> {
    // Take the first few messages to generate a title (first 3-4 exchanges)
    const contextMessages = messages.slice(0, Math.min(6, messages.length));
    
    // Detect exam context from conversation
    const allContent = contextMessages.map(m => m.content).join(" ");
    const examContext = detectExamType(allContent);
    
    // Build context-aware title prompt
    let contextHint = "";
    if (examContext.examType !== "GENERAL") {
        const examNames: Record<string, string> = {
            "JEE_MAIN": "JEE Main",
            "JEE_ADVANCED": "JEE Advanced",
            "BOARD_10": "Class 10 Board",
            "BOARD_12": "Class 12 Board",
            "NEET": "NEET",
        };
        contextHint = `\n\nNote: This conversation is related to ${examNames[examContext.examType]}${examContext.subject ? ` - ${examContext.subject}` : ""}. Include this context in the title if relevant.`;
    }
    
    const titlePrompt = `Based on the following conversation, generate a concise, descriptive title (maximum 60 characters). The title should capture the main topic, subject, or exam context of this conversation.${contextHint}

Return ONLY the title, nothing else, no quotes, no explanation.

Conversation:
${contextMessages.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`).join('\n\n')}

Title:`;

    try {
        const result = await generateText({
            model: groq("openai/gpt-oss-20b"),
            messages: [
                { 
                    role: "system", 
                    content: "You are a helpful assistant that generates concise, descriptive titles for educational conversations and study note chats. Titles should be clear, informative, and include exam/subject context when relevant." 
                },
                { role: "user", content: titlePrompt }
            ],
            temperature: 0.3, // Lower temperature for more consistent titles
        });

        let title = result.text.trim();
        
        // Remove quotes if present
        title = title.replace(/^["']|["']$/g, '');
        
        // Remove common prefixes like "Title:" if the model adds them
        title = title.replace(/^(Title|title):\s*/i, '').trim();
        
        // Ensure it's not too long
        if (title.length > 60) {
            title = title.substring(0, 57) + '...';
        }
        
        return title || "New Chat";
    } catch (error) {
        console.error('Error generating title:', error);
        // Fallback to simple extraction with exam context
        const firstUserMessage = messages.find(m => m.role === 'user')?.content || '';
        let fallbackTitle = firstUserMessage.substring(0, 50) || "New Chat";
        
        // Add exam context to fallback if detected
        if (examContext.examType !== "GENERAL" && examContext.subject) {
            const examNames: Record<string, string> = {
                "JEE_MAIN": "JEE Main",
                "JEE_ADVANCED": "JEE Advanced",
                "BOARD_10": "Class 10",
                "BOARD_12": "Class 12",
                "NEET": "NEET",
            };
            fallbackTitle = `${examNames[examContext.examType]} - ${examContext.subject.charAt(0).toUpperCase() + examContext.subject.slice(1)}`;
        }
        
        return fallbackTitle;
    }
}