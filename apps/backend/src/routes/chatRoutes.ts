import express from "express";
import { authenticate } from "../middleware.js";
import { db } from "db";
import { getRecentMessages } from "../services/memory.js";
import { generateAIResponse, planRagContext } from "../services/ai-service.js";
import { buildSystemPrompt, buildRagPlannerPrompt } from "../services/prompt.js";
import { generateChatTitle } from "../services/ai/generateTitle.js";

const router: express.Router = express.Router();

router.post('/chat/:chatRoomId', authenticate, async (req, res) => {
    const { content } = req.body;
    const { chatRoomId } = req.params;
    try {
        const chatRoom = await db.chatRoom.findUnique({
            where: { id: chatRoomId as string },
            select: { id: true, title: true }
        });

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat room not found' });
        }

        // Save user message
        await db.message.create({
            data: {
                chatRoomId: chatRoomId as string,
                role: "user",
                content: content,
                createdAt: new Date(),
            }
        });

        const recentMessages = await getRecentMessages(chatRoomId as string);

        // Reverse to get chronological order (oldest first)
        const chronologicalMessages = [...recentMessages].reverse();

        // Build context from recent messages for exam detection
        const messageHistory = chronologicalMessages.map(m => m.content);
        const userQuery = content;

        // ─── AGENTIC RAG STEP ────────────────────────────────────────────────
        // 1. Run the planner to extract relevant prior context from history
        let ragContext: string | undefined;
        if (chronologicalMessages.length >= 2) {
            try {
                const plannerPrompt = buildRagPlannerPrompt();
                const ragPlan = await planRagContext(
                    userQuery,
                    chronologicalMessages.map(m => ({
                        role: m.role as "user" | "assistant",
                        content: m.content,
                    })),
                    plannerPrompt,
                );

                if (ragPlan && ragPlan.relevant_context && ragPlan.relevant_context.trim().length > 10) {
                    // Build a rich context string from the plan
                    const keyTermsStr = ragPlan.key_terms && ragPlan.key_terms.length > 0
                        ? `\nKey terms already covered: ${ragPlan.key_terms.join(", ")}`
                        : "";
                    ragContext = `Topic context: ${ragPlan.topic}\nPrior discussion summary: ${ragPlan.relevant_context}${keyTermsStr}`;
                    console.log(`[RAG] Context retrieved for "${userQuery}": topic="${ragPlan.topic}"`);
                }
            } catch (ragError) {
                // RAG planning is non-critical — proceed without it
                console.warn("[RAG] Planning step skipped due to error:", ragError);
            }
        }
        // ────────────────────────────────────────────────────────────────────

        // 2. Build system prompt with RAG context injected
        const systemPrompt = buildSystemPrompt(userQuery, messageHistory, ragContext);

        // 3. Generate the main response (always structured JSON format)
        const stream = await generateAIResponse({
            messages: chronologicalMessages.map(message => ({
                role: message.role as "user" | "assistant",
                content: message.content,
            })),
            systemPrompt,
        });

        res.setHeader('Content-Type', 'text/event-stream');

        let fullText = '';
        for await (const chunk of stream.textStream) {
            res.write(`data: ${chunk}\n\n`);
            fullText += chunk;
        }

        res.end();

        // Save assistant message
        await db.message.create({
            data: {
                chatRoomId: chatRoomId as string,
                role: "assistant",
                content: fullText,
                createdAt: new Date(),
            }
        });

        // Update timestamp immediately
        await db.chatRoom.update({
            where: { id: chatRoomId as string },
            data: {} // Triggers @updatedAt
        });

        // Generate title asynchronously (don't await - let it run in background)
        (async () => {
            try {
                const allMessages = await db.message.findMany({
                    where: { chatRoomId: chatRoomId as string },
                    orderBy: { createdAt: 'asc' },
                    select: { role: true, content: true }
                });

                const messageCount = allMessages.length;

                const shouldGenerateTitle =
                    (!chatRoom.title || chatRoom.title.trim() === '') && messageCount >= 2 ||
                    (messageCount >= 4 && messageCount % 5 === 0);

                if (shouldGenerateTitle) {
                    const conversationMessages = allMessages.map(msg => ({
                        role: msg.role as "user" | "assistant",
                        content: msg.content
                    }));

                    const newTitle = await generateChatTitle(conversationMessages);

                    await db.chatRoom.update({
                        where: { id: chatRoomId as string },
                        data: { title: newTitle }
                    });
                }
            } catch (error) {
                console.error('Background title generation failed:', error);
            }
        })();

    } catch (error) {
        return res.status(500).json({ error: 'Failed to chat', message: error });
    }
});

router.get('/chat/:chatRoomId/messages', authenticate, async (req, res) => {
    const { chatRoomId } = req.params;
    try {
        const msg = await db.message.findMany({
            where: {
                chatRoomId: chatRoomId as string
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return res.status(200).json({ success: true, messages: msg });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get messages', message: error });
    }
});

export { router as chatRoutes };
