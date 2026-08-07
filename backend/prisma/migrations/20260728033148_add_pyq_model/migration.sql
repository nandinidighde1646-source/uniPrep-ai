-- CreateTable
CREATE TABLE "PYQ" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "branch" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PYQ_pkey" PRIMARY KEY ("id")
);
