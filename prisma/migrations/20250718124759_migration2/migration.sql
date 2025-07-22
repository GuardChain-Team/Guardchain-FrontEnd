/*
  Warnings:

  - You are about to drop the `alert_assignment_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documentation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `investigation_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `alertId` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `alertType` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `anomalyIndicators` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTo` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `detectedAt` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `mlPrediction` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `resolvedAt` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `riskFactors` on the `alerts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "alert_assignment_history";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "documentation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "evidence";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "investigation_logs";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "notifications";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "riskScore" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "transactionId" TEXT,
    "assignedToId" TEXT,
    CONSTRAINT "alerts_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "alerts_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_alerts" ("category", "createdAt", "description", "id", "metadata", "riskScore", "severity", "status", "title", "transactionId", "updatedAt") SELECT "category", "createdAt", "description", "id", "metadata", "riskScore", "severity", "status", "title", "transactionId", "updatedAt" FROM "alerts";
DROP TABLE "alerts";
ALTER TABLE "new_alerts" RENAME TO "alerts";
CREATE TABLE "new_audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "details" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_audit_logs" ("action", "details", "entityId", "entityType", "id", "timestamp", "userId") SELECT "action", "details", "entityId", "entityType", "id", "timestamp", "userId" FROM "audit_logs";
DROP TABLE "audit_logs";
ALTER TABLE "new_audit_logs" RENAME TO "audit_logs";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'ANALYST',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "firstName", "id", "isActive", "lastName", "password", "role", "updatedAt", "username") SELECT "createdAt", "email", "firstName", "id", "isActive", "lastName", "password", "role", "updatedAt", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
