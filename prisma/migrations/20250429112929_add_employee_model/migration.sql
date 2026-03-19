-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "residencePermit" TEXT,
    "experienceYears" INTEGER NOT NULL,
    "experienceWhere" TEXT,
    "hasLicense" BOOLEAN NOT NULL,
    "availabilityFrom" TIMESTAMP(3) NOT NULL,
    "availabilityDays" TEXT[],
    "servicesOffered" TEXT[],
    "howFarCanYouTravel" TEXT,
    "resumeUrl" TEXT NOT NULL,
    "photoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");
