/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subService` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timeWindow` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
DROP COLUMN "service",
DROP COLUMN "subService",
DROP COLUMN "timeWindow",
ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "cvc" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "expiryDate" TEXT,
ADD COLUMN     "firstDate" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "languages" TEXT,
ADD COLUMN     "pets" TEXT,
ADD COLUMN     "serviceId" TEXT,
ADD COLUMN     "subServiceId" TEXT,
ALTER COLUMN "address" DROP DEFAULT,
ALTER COLUMN "frequency" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubService_name_key" ON "SubService"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subServiceId_fkey" FOREIGN KEY ("subServiceId") REFERENCES "SubService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
