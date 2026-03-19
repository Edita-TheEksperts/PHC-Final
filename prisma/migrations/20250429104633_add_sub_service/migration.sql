/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `HealthQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subService" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "HealthQuestion_userId_key" ON "HealthQuestion"("userId");
