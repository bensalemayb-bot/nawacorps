-- CreateTable
CREATE TABLE "RateLimit" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RateLimit_ipHash_action_createdAt_idx" ON "RateLimit"("ipHash", "action", "createdAt");
