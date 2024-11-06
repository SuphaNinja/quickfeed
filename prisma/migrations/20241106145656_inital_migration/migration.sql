-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stripe_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "payment_time" TEXT NOT NULL,
    "payment_date" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customer_details" TEXT NOT NULL,
    "payment_intent" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscription_id" TEXT NOT NULL,
    "stripe_userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT,
    "plan_id" TEXT NOT NULL,
    "default_payment_method_id" TEXT,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions_plans" (
    "id" SERIAL NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "interval" TEXT NOT NULL,

    CONSTRAINT "subscriptions_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoice_id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "amount_paid" TEXT NOT NULL,
    "amount_due" TEXT,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "userId" TEXT NOT NULL,
    "subscription" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRoom" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "inviteUrl" TEXT,
    "visitor" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRoomUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "projectRoomId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectRoomUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "priority" TEXT NOT NULL,
    "assigneeId" TEXT NOT NULL,
    "assignorId" TEXT NOT NULL,
    "projectRoomId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "projectRoomId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "name" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "createdBy" TEXT NOT NULL,
    "projectRoomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingDistribution" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "fiveStarCount" INTEGER NOT NULL,
    "fiveStarPercentage" DOUBLE PRECISION NOT NULL,
    "fiveStarKeywords" TEXT[],
    "fourStarCount" INTEGER NOT NULL,
    "fourStarPercentage" DOUBLE PRECISION NOT NULL,
    "fourStarKeywords" TEXT[],
    "threeStarCount" INTEGER NOT NULL,
    "threeStarPercentage" DOUBLE PRECISION NOT NULL,
    "threeStarKeywords" TEXT[],
    "twoStarCount" INTEGER NOT NULL,
    "twoStarPercentage" DOUBLE PRECISION NOT NULL,
    "twoStarKeywords" TEXT[],
    "oneStarCount" INTEGER NOT NULL,
    "oneStarPercentage" DOUBLE PRECISION NOT NULL,
    "oneStarKeywords" TEXT[],

    CONSTRAINT "RatingDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentimentBreakdown" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "positiveCount" INTEGER NOT NULL,
    "positivePercentage" DOUBLE PRECISION NOT NULL,
    "neutralCount" INTEGER NOT NULL,
    "neutralPercentage" DOUBLE PRECISION NOT NULL,
    "negativeCount" INTEGER NOT NULL,
    "negativePercentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SentimentBreakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopIssue" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TopIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RatingTrend" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "RatingTrend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordAnalysis" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "sentiment" TEXT NOT NULL,
    "associatedRatings" INTEGER[],

    CONSTRAINT "KeywordAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectRoomUser_userId_projectRoomId_key" ON "ProjectRoomUser"("userId", "projectRoomId");

-- CreateIndex
CREATE INDEX "Feedback_projectRoomId_idx" ON "Feedback"("projectRoomId");

-- CreateIndex
CREATE INDEX "Analysis_projectRoomId_idx" ON "Analysis"("projectRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "RatingDistribution_analysisId_key" ON "RatingDistribution"("analysisId");

-- CreateIndex
CREATE UNIQUE INDEX "SentimentBreakdown_analysisId_key" ON "SentimentBreakdown"("analysisId");

-- AddForeignKey
ALTER TABLE "ProjectRoomUser" ADD CONSTRAINT "ProjectRoomUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRoomUser" ADD CONSTRAINT "ProjectRoomUser_projectRoomId_fkey" FOREIGN KEY ("projectRoomId") REFERENCES "ProjectRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "ProjectRoomUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignorId_fkey" FOREIGN KEY ("assignorId") REFERENCES "ProjectRoomUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectRoomId_fkey" FOREIGN KEY ("projectRoomId") REFERENCES "ProjectRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_projectRoomId_fkey" FOREIGN KEY ("projectRoomId") REFERENCES "ProjectRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_projectRoomId_fkey" FOREIGN KEY ("projectRoomId") REFERENCES "ProjectRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingDistribution" ADD CONSTRAINT "RatingDistribution_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentimentBreakdown" ADD CONSTRAINT "SentimentBreakdown_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopIssue" ADD CONSTRAINT "TopIssue_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RatingTrend" ADD CONSTRAINT "RatingTrend_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordAnalysis" ADD CONSTRAINT "KeywordAnalysis_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "Analysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
