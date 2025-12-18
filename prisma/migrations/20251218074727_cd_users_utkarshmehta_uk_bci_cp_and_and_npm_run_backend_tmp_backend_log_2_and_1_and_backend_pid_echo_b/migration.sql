-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active',
    "totalTrials" INTEGER NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Trial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "trialNumber" INTEGER NOT NULL,
    "targetType" TEXT NOT NULL,
    "stimulusTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTime" INTEGER NOT NULL,
    "accuracy" BOOLEAN NOT NULL,
    CONSTRAINT "Trial_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trialId" TEXT NOT NULL,
    "prediction" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Prediction_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CalibrationState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "flashSpeed" REAL NOT NULL DEFAULT 1.0,
    "objectCount" INTEGER NOT NULL DEFAULT 3,
    "recentAccuracy" REAL NOT NULL DEFAULT 0.5,
    "confidenceThreshold" REAL NOT NULL DEFAULT 0.5,
    "trialInterval" INTEGER NOT NULL DEFAULT 2000,
    "lastTrialTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CalibrationState_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Trial_sessionId_idx" ON "Trial"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Trial_sessionId_trialNumber_key" ON "Trial"("sessionId", "trialNumber");

-- CreateIndex
CREATE INDEX "Prediction_trialId_idx" ON "Prediction"("trialId");

-- CreateIndex
CREATE UNIQUE INDEX "CalibrationState_sessionId_key" ON "CalibrationState"("sessionId");

-- CreateIndex
CREATE INDEX "CalibrationState_sessionId_idx" ON "CalibrationState"("sessionId");
