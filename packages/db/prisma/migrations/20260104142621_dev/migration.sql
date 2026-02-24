/*
  Warnings:

  - You are about to drop the column `embedding` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `index` on the `DocumentEmbedding` table. All the data in the column will be lost.
  - You are about to drop the `Translation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chunkIndex` to the `DocumentEmbedding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Translation" DROP CONSTRAINT "Translation_documentId_fkey";

-- DropIndex
DROP INDEX "DocumentEmbedding_index_idx";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "embedding",
ALTER COLUMN "topic" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DocumentEmbedding" DROP COLUMN "index",
ADD COLUMN     "chunkIndex" INTEGER NOT NULL,
ADD COLUMN     "pageNumber" INTEGER,
ADD COLUMN     "section" TEXT,
ADD COLUMN     "tokenCount" INTEGER,
ALTER COLUMN "embedding" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Translation";

-- CreateIndex
CREATE INDEX "DocumentEmbedding_chunkIndex_idx" ON "DocumentEmbedding"("chunkIndex");
