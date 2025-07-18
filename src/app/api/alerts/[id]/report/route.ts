// src/app/api/alerts/[id]/report/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alertId = params.id;
    const { reportType, includeEvidence, customNotes } = await request.json();

    // Fetch alert details with related data
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        transaction: true,
        investigation: {
          include: {
            evidence: true,
            notes: true,
            investigator: true,
          },
        },
        assignedUser: true,
      },
    });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    // Generate report based on type
    const report = await generateReport(alert, {
      type: reportType,
      includeEvidence,
      customNotes,
      generatedBy: session.user.id,
      generatedAt: new Date(),
    });

    // Save report to database
    const savedReport = await prisma.report.create({
      data: {
        alertId,
        type: reportType,
        content: report.content,
        metadata: report.metadata,
        generatedBy: session.user.id,
        generatedAt: new Date(),
      },
    });

    // Log the report generation
    await logAuditAction({
      userId: session.user.id,
      action: "REPORT_GENERATED",
      resourceId: alertId,
      details: { reportId: savedReport.id, reportType },
    });

    return NextResponse.json({
      success: true,
      data: {
        reportId: savedReport.id,
        downloadUrl: `/api/reports/${savedReport.id}/download`,
        report: report.content,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function generateReport(alert: any, options: any) {
  const reportContent = {
    header: {
      title: `Fraud Investigation Report - ${alert.alertId}`,
      generatedAt: options.generatedAt,
      generatedBy: options.generatedBy,
      alertId: alert.id,
      caseNumber: alert.investigation?.caseNumber || "N/A",
    },
    executive_summary: {
      alertType: alert.alertType,
      severity: alert.severity,
      riskScore: alert.riskScore,
      status: alert.status,
      detectedAt: alert.detectedAt,
      resolvedAt: alert.resolvedAt,
    },
    transaction_details: {
      transactionId: alert.transaction.transactionId,
      amount: alert.transaction.amount,
      currency: alert.transaction.currency,
      fromAccount: alert.transaction.fromAccount,
      toAccount: alert.transaction.toAccount,
      timestamp: alert.transaction.timestamp,
      location: alert.transaction.location,
    },
    risk_analysis: {
      riskFactors: alert.riskFactors || [],
      riskScore: alert.riskScore,
      mlPrediction: alert.mlPrediction || {},
      anomalyIndicators: alert.anomalyIndicators || [],
    },
    investigation_timeline:
      alert.investigation?.notes?.map((note: any) => ({
        timestamp: note.createdAt,
        action: note.action,
        description: note.content,
        investigator: note.investigator?.name,
      })) || [],
    evidence: options.includeEvidence
      ? alert.investigation?.evidence || []
      : [],
    findings: alert.investigation?.findings || "Investigation pending",
    recommendations: generateRecommendations(alert),
    custom_notes: options.customNotes || "",
  };

  return {
    content: reportContent,
    metadata: {
      format: "JSON",
      version: "1.0",
      pages: calculatePages(reportContent),
      wordCount: calculateWordCount(reportContent),
    },
  };
}

function generateRecommendations(alert: any) {
  const recommendations = [];

  if (alert.riskScore > 0.8) {
    recommendations.push("IMMEDIATE: Block transaction and freeze accounts");
    recommendations.push("URGENT: Initiate law enforcement contact");
  } else if (alert.riskScore > 0.6) {
    recommendations.push("HIGH: Enhanced monitoring required");
    recommendations.push("MEDIUM: Customer verification recommended");
  } else {
    recommendations.push("LOW: Continue standard monitoring");
  }

  return recommendations;
}

function calculatePages(content: any): number {
  return Math.ceil(JSON.stringify(content).length / 2000);
}

function calculateWordCount(content: any): number {
  return JSON.stringify(content).split(/\s+/).length;
}

async function logAuditAction(action: any) {
  console.log("Audit log:", action);
}
