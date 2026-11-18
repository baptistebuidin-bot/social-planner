-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "platform" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IDEA',
    "plannedDate" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    "mediaNote" TEXT NOT NULL DEFAULT '',
    "metaPostId" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "metricsSyncedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Post_plannedDate_idx" ON "Post"("plannedDate");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");
