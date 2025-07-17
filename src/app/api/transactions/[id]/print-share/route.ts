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
      transactionId,
      action = "print", // 'print' or 'share'
      shareOptions = {},
      includeMetadata = true,
      includeAlerts = true,
    } = body;

    // Fetch transaction details
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        alerts: true,
        investigations: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Prepare transaction data for printing/sharing
    const transactionData = {
      id: transaction.id,
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      fromAccount: transaction.fromAccount,
      toAccount: transaction.toAccount,
      description: transaction.description,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    // Add metadata if requested
    let additionalData: any = {};
    if (includeMetadata && transaction.metadata) {
      try {
        additionalData.metadata = JSON.parse(transaction.metadata);
      } catch (e) {
        additionalData.metadata = transaction.metadata;
      }
    }

    // Add alerts if requested
    if (includeAlerts && transaction.alerts.length > 0) {
      additionalData.alerts = transaction.alerts.map((alert) => ({
        alertId: alert.alertId,
        title: alert.title,
        severity: alert.severity,
        status: alert.status,
        riskScore: alert.riskScore,
        createdAt: alert.createdAt,
      }));
    }

    // Add investigations
    if (transaction.investigations.length > 0) {
      additionalData.investigations = transaction.investigations.map((inv) => ({
        id: inv.id,
        title: inv.title,
        status: inv.status,
        priority: inv.priority,
        createdAt: inv.createdAt,
      }));
    }

    if (action === "print") {
      // Generate printable HTML format
      const printableHTML = generatePrintableHTML(
        transactionData,
        additionalData,
        session.user
      );

      return new NextResponse(printableHTML, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    if (action === "share") {
      // Generate shareable link or data
      const shareData: any = {
        transactionSummary: {
          id: transaction.transactionId,
          amount: `${
            transaction.currency
          } ${transaction.amount.toLocaleString()}`,
          date: format(new Date(transaction.createdAt), "yyyy-MM-dd HH:mm"),
          status: transaction.status,
          description: transaction.description,
        },
        sharedBy: {
          user: session.user.email || "Unknown User",
          timestamp: new Date().toISOString(),
        },
        accessLevel: shareOptions.accessLevel || "RESTRICTED",
        expiresAt:
          shareOptions.expiresAt ||
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };

      // If specific sharing options are provided
      if (shareOptions.recipients) {
        shareData.recipients = shareOptions.recipients;
      }

      // Create a sharing record for audit purposes
      await prisma.auditLog.create({
        data: {
          action: "TRANSACTION_SHARED",
          entityType: "TRANSACTION",
          entityId: transaction.id,
          userId: session.user.id,
          details: JSON.stringify({
            sharedWith: shareOptions.recipients || "External",
            accessLevel: shareOptions.accessLevel,
            includeMetadata,
            includeAlerts,
          }),
        },
      });

      return NextResponse.json({
        shareLink: `${process.env.NEXTAUTH_URL}/shared/transaction/${
          transaction.id
        }?token=${generateShareToken()}`,
        shareData,
        expiresAt: shareData.expiresAt,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Transaction print/share error:", error);
    return NextResponse.json(
      {
        error: "Failed to process transaction print/share request",
      },
      { status: 500 }
    );
  }
}

function generatePrintableHTML(
  transaction: any,
  additionalData: any,
  user: any
) {
  const printDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Transaction Details - ${transaction.transactionId}</title>
    <style>
        @media print {
            .no-print { display: none; }
        }
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
        }
        .header { 
            border-bottom: 2px solid #333; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #333;
        }
        .section { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
        }
        .section h2 { 
            color: #333; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 5px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 10px 0; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        th { 
            background-color: #f2f2f2; 
            font-weight: bold;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
            text-align: center;
            padding: 20px;
            border: 2px solid #2563eb;
            border-radius: 8px;
            margin: 20px 0;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-completed { background-color: #dcfce7; color: #166534; }
        .status-pending { background-color: #fef3c7; color: #92400e; }
        .status-failed { background-color: #fecaca; color: #991b1b; }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 12px;
            color: #666;
        }
        .no-print {
            margin: 20px 0;
        }
        .print-btn {
            background-color: #2563eb;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        .confidential {
            color: red;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="print-btn" onclick="window.print()">🖨️ Print</button>
        <button class="print-btn" onclick="window.close()" style="background-color: #6b7280;">✖️ Close</button>
    </div>

    <div class="header">
        <div class="logo">GuardChain - Transaction Report</div>
        <p class="confidential">CONFIDENTIAL DOCUMENT</p>
    </div>

    <div class="amount">
        ${transaction.currency} ${transaction.amount.toLocaleString()}
    </div>

    <div class="section">
        <h2>Transaction Details</h2>
        <table>
            <tr>
                <th style="width: 30%;">Field</th>
                <th>Value</th>
            </tr>
            <tr>
                <td><strong>Transaction ID</strong></td>
                <td>${transaction.transactionId}</td>
            </tr>
            <tr>
                <td><strong>Amount</strong></td>
                <td>${
                  transaction.currency
                } ${transaction.amount.toLocaleString()}</td>
            </tr>
            <tr>
                <td><strong>Status</strong></td>
                <td>
                    <span class="status-badge status-${transaction.status.toLowerCase()}">
                        ${transaction.status}
                    </span>
                </td>
            </tr>
            <tr>
                <td><strong>From Account</strong></td>
                <td>${transaction.fromAccount}</td>
            </tr>
            <tr>
                <td><strong>To Account</strong></td>
                <td>${transaction.toAccount}</td>
            </tr>
            <tr>
                <td><strong>Description</strong></td>
                <td>${transaction.description || "N/A"}</td>
            </tr>
            <tr>
                <td><strong>Created</strong></td>
                <td>${format(
                  new Date(transaction.createdAt),
                  "yyyy-MM-dd HH:mm:ss"
                )}</td>
            </tr>
            <tr>
                <td><strong>Last Updated</strong></td>
                <td>${format(
                  new Date(transaction.updatedAt),
                  "yyyy-MM-dd HH:mm:ss"
                )}</td>
            </tr>
        </table>
    </div>

    ${
      additionalData.alerts && additionalData.alerts.length > 0
        ? `
    <div class="section">
        <h2>Associated Alerts</h2>
        <table>
            <tr>
                <th>Alert ID</th>
                <th>Title</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>Created</th>
            </tr>
            ${additionalData.alerts
              .map(
                (alert: any) => `
            <tr>
                <td>${alert.alertId}</td>
                <td>${alert.title}</td>
                <td><span class="status-badge">${alert.severity}</span></td>
                <td>${alert.status}</td>
                <td>${alert.riskScore}</td>
                <td>${format(
                  new Date(alert.createdAt),
                  "yyyy-MM-dd HH:mm"
                )}</td>
            </tr>
            `
              )
              .join("")}
        </table>
    </div>
    `
        : ""
    }

    ${
      additionalData.investigations && additionalData.investigations.length > 0
        ? `
    <div class="section">
        <h2>Investigations</h2>
        <table>
            <tr>
                <th>Investigation ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
            </tr>
            ${additionalData.investigations
              .map(
                (inv: any) => `
            <tr>
                <td>${inv.id}</td>
                <td>${inv.title}</td>
                <td>${inv.status}</td>
                <td>${inv.priority}</td>
                <td>${format(new Date(inv.createdAt), "yyyy-MM-dd HH:mm")}</td>
            </tr>
            `
              )
              .join("")}
        </table>
    </div>
    `
        : ""
    }

    <div class="footer">
        <p><strong>Generated by:</strong> ${user.email || "Unknown User"}</p>
        <p><strong>Generated on:</strong> ${printDate}</p>
        <p><strong>System:</strong> GuardChain Fraud Detection System</p>
        <p style="margin-top: 20px; font-style: italic;">
            This document contains confidential information. Distribution is restricted to authorized personnel only.
        </p>
    </div>

    <script>
        // Auto-focus for immediate printing
        window.addEventListener('load', function() {
            // Optional: Auto-print when page loads
            // window.print();
        });
    </script>
</body>
</html>
  `;
}

function generateShareToken() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export async function GET() {
  return NextResponse.json({
    message: "Transaction Print/Share API",
    supportedActions: ["print", "share"],
    printFormats: ["html"],
    shareOptions: ["expiresAt", "accessLevel", "recipients"],
  });
}
