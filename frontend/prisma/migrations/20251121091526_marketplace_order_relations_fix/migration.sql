/*
  Warnings:

  - You are about to drop the column `parentId` on the `Tag` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GoJobStep" AS ENUM ('ARTISAN_EN_ROUTE', 'ARTISAN_ARRIVE', 'TRAVAIL_EN_COURS', 'TRAVAIL_TERMINE', 'EN_ATTENTE_VALIDATION_CLIENT');

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_parentId_fkey";

-- AlterTable
ALTER TABLE "GoJob" ADD COLUMN     "currentStep" "GoJobStep";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "GoJobProgress" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "step" "GoJobStep" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" INTEGER,

    CONSTRAINT "GoJobProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoJobProgress_jobId_createdAt_idx" ON "GoJobProgress"("jobId", "createdAt");

-- AddForeignKey
ALTER TABLE "GoJobProgress" ADD CONSTRAINT "GoJobProgress_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GoJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoJobProgress" ADD CONSTRAINT "GoJobProgress_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
