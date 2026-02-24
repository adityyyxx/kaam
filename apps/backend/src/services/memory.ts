import { db } from "db";

/**
 * Retrieves recent messages from a chat room for context
 * Returns messages in descending order (newest first)
 * For chronological order, reverse the array in the calling code
 */
export async function getRecentMessages(
  conversationId: string,
  limit: number = 15 // Increased from 10 to 15 for better context
): Promise<Awaited<ReturnType<typeof db.message.findMany>>> {
  return db.message.findMany({
    where: {
      chatRoomId: conversationId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: {
      id: true,
      role: true,
      content: true,
      createdAt: true,
      chatRoomId: true,
      meta: true,
    },
  });
}

export async function saveMessage(
  data: Parameters<typeof db.message.create>[0]
): Promise<Awaited<ReturnType<typeof db.message.create>>> {
  return db.message.create(data);
}
