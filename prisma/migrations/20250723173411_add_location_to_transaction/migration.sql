-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "location" TEXT;

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
    "detected" BOOLEAN NOT NULL DEFAULT false,
    "responseTime" REAL,
    "transactionId" TEXT,
    "assignedToId" TEXT,
    CONSTRAINT "alerts_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "alerts_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_alerts" ("assignedToId", "category", "createdAt", "description", "id", "metadata", "riskScore", "severity", "status", "title", "transactionId", "updatedAt") SELECT "assignedToId", "category", "createdAt", "description", "id", "metadata", "riskScore", "severity", "status", "title", "transactionId", "updatedAt" FROM "alerts";
DROP TABLE "alerts";
ALTER TABLE "new_alerts" RENAME TO "alerts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
