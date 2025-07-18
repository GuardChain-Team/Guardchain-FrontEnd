import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import { format } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      format: exportFormat = "csv",
      filters = {},
      dateRange,
      includeFields = [],
      exportType = "filtered",
    } = body;

    // Build query based on filters
    let where: any = {};

    if (filters.status && filters.status !== "ALL") {
      where.status = filters.status;
    }

    if (dateRange) {
      where.createdAt = {
        gte: new Date(dateRange.from),
        lte: new Date(dateRange.to),
      };
    }

    if (filters.amountRange) {
      where.amount = {
        gte: filters.amountRange.min || 0,
        lte: filters.amountRange.max || Number.MAX_SAFE_INTEGER,
      };
    }

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        alerts: true,
        investigations: true,
      },
      orderBy: { createdAt: "desc" },
      take: exportType === "all" ? undefined : 1000, // Limit for filtered exports
    });

    // Prepare data for export
    const exportData = transactions.map((transaction) => {
      const baseData: Record<string, any> = {
        "Transaction ID": transaction.transactionId,
        Amount: transaction.amount,
        Currency: transaction.currency,
        Status: transaction.status,
        "From Account": transaction.fromAccount,
        "To Account": transaction.toAccount,
        Description: transaction.description || "",
        "Created At": format(
          new Date(transaction.createdAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
        "Updated At": format(
          new Date(transaction.updatedAt),
          "yyyy-MM-dd HH:mm:ss"
        ),
      };

      // Add optional fields based on includeFields
      if (includeFields.includes("metadata") && transaction.metadata) {
        try {
          const metadata = JSON.parse(transaction.metadata);
          Object.keys(metadata).forEach((key) => {
            baseData[`Metadata: ${key}`] = metadata[key];
          });
        } catch (e) {
          baseData["Metadata"] = transaction.metadata;
        }
      }

      if (includeFields.includes("alerts")) {
        baseData["Alert Count"] = transaction.alerts.length;
        baseData["Has Critical Alert"] = transaction.alerts.some(
          (alert) => alert.severity === "CRITICAL"
        )
          ? "Yes"
          : "No";
      }

      if (includeFields.includes("investigations")) {
        baseData["Investigation Count"] = transaction.investigations.length;
        baseData["Investigation Status"] =
          transaction.investigations.length > 0
            ? transaction.investigations[0].status
            : "None";
      }

      return baseData;
    });

    if (exportFormat === "csv") {
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => {
              const val = row[header];
              return typeof val === "string" && val.includes(",")
                ? `"${val}"`
                : val;
            })
            .join(",")
        ),
      ].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="transactions_export_${format(
            new Date(),
            "yyyy-MM-dd_HH-mm"
          )}.csv"`,
        },
      });
    }

    if (exportFormat === "json") {
      const jsonData = {
        metadata: {
          exportDate: new Date().toISOString(),
          exportedBy: session.user.email,
          totalRecords: transactions.length,
          filters: filters,
        },
        data: exportData,
      };

      return NextResponse.json(jsonData, {
        headers: {
          "Content-Disposition": `attachment; filename="transactions_export_${format(
            new Date(),
            "yyyy-MM-dd_HH-mm"
          )}.json"`,
        },
      });
    }

    return NextResponse.json(
      { error: "Unsupported export format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Transaction export error:", error);
    return NextResponse.json(
      {
        error: "Failed to export transactions",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Transaction Export API",
    supportedFormats: ["csv", "json"],
    supportedFilters: ["status", "dateRange", "amountRange"],
    optionalFields: ["metadata", "alerts", "investigations"],
  });
}
