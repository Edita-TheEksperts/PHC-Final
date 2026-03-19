-- CreateTable
CREATE TABLE "HealthQuestion" (
    "id" TEXT NOT NULL,
    "allergies" TEXT,
    "specialRequests" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "HealthQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HealthQuestion" ADD CONSTRAINT "HealthQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
