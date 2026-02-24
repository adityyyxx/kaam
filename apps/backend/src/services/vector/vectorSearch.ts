// import { db } from "db";

// export async function similaritySearch({
//   // embedding,
//   // userId,
//   // chatRoomId,
//   limit = 5
// }) {
//   return db.$queryRaw`
//     SELECT
//       de.chunk,
//       de.document_id,
//       1 - (de.embedding <=> ${embedding}) AS score
//     FROM "DocumentEmbedding" de
//     JOIN "Document" d ON d.id = de.document_id
//     WHERE d.user_id = ${userId}
//       AND (${chatRoomId}::uuid IS NULL OR d.chat_room_id = ${chatRoomId})
//     ORDER BY de.embedding <=> ${embedding}
//     LIMIT ${limit};
//   `;
// }
