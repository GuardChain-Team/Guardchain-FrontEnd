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

    // Check if user has permission to generate reports
    const userPermissions =
      session.user.role === "ADMIN" ||
      session.user.role === "INVESTIGATOR" ||
      session.user.role === "ANALYST";

    if (!userPermissions) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      investigationId,
      reportType = "comprehensive",
      format: reportFormat = "json",
      includeEvidence = true,
      includeLogs = true,
      includeRecommendations = true,
    } = body;

    // Fetch investigation data
    const investigation = await prisma.investigation.findUnique({
      where: { id: investigationId },
      include: {
        alert: {
          include: {
            transaction: true,
            evidence: true,
          },
        },
        investigator: true,
        documentation: true,
        logs: {
          include: {
            user: true,
          },
          orderBy: { timestamp: "asc" },
        },
      },
    });

    if (!investigation) {
      return NextResponse.json(
        { error: "Investigation not found" },
        { status: 404 }
      );
    }

    // Generate comprehensive report data
    const reportData = {
      // Header Information
      reportHeader: {
        title: `Investigation Report - ${investigation.title}`,
        investigationId: investigation.id,
        generatedBy: session.user.email || session.user.username,
        generatedAt: new Date().toISOString(),
        reportType,
        confidentialityLevel: "CONFIDENTIAL",
      },

      // Executive Summary
      executiveSummary: {
        caseId: investigation.id,
        alertId: investigation.alert?.alertId,
        status: investigation.status,
        priority: investigation.priority,
        investigator: {
          name:
            investigation.investigator.firstName +
            " " +
            investigation.investigator.lastName,
          email: investigation.investigator.email,
        },
        createdAt: investigation.createdAt,
        updatedAt: investigation.updatedAt,
        findings: investigation.findings,
        conclusion: investigation.conclusion,
      },

      // Alert Details
      alertDetails: investigation.alert
        ? {
            alertId: investigation.alert.alertId,
            title: investigation.alert.title,
            description: investigation.alert.description,
            alertType: investigation.alert.alertType,
            severity: investigation.alert.severity,
            riskScore: investigation.alert.riskScore,
            detectedAt: investigation.alert.detectedAt,
            status: investigation.alert.status,
          }
        : null,

      // Transaction Details
      transactionDetails: investigation.alert?.transaction
        ? {
            transactionId: investigation.alert.transaction.transactionId,
            amount: investigation.alert.transaction.amount,
            currency: investigation.alert.transaction.currency,
            fromAccount: investigation.alert.transaction.fromAccount,
            toAccount: investigation.alert.transaction.toAccount,
            status: investigation.alert.transaction.status,
            description: investigation.alert.transaction.description,
            createdAt: investigation.alert.transaction.createdAt,
            metadata: investigation.alert.transaction.metadata,
          }
        : null,
    };

    // Add evidence if requested
    if (includeEvidence && investigation.alert?.evidence) {
      reportData.evidence = investigation.alert.evidence.map((evidence) => ({
        id: evidence.id,
        fileName: evidence.fileName,
        fileType: evidence.fileType,
        description: evidence.description,
        uploadedBy: evidence.uploadedBy,
        uploadedAt: evidence.createdAt,
        tags: evidence.tags,
      }));
    }

    // Add investigation logs if requested
    if (includeLogs && investigation.logs) {
      reportData.investigationLogs = investigation.logs.map((log) => ({
        id: log.id,
        action: log.action,
        description: log.description,
        performedBy: log.user.firstName + " " + log.user.lastName,
        timestamp: log.timestamp,
        metadata: log.metadata,
      }));
    }

    // Add documentation
    if (investigation.documentation) {
      reportData.documentation = investigation.documentation.map((doc) => ({
        id: doc.id,
        title: doc.title,
        type: doc.type,
        content: doc.content,
        createdAt: doc.createdAt,
        version: doc.version,
        isPublic: doc.isPublic,
      }));
    }

    // Add recommendations if requested
    if (includeRecommendations) {
      reportData.recommendations = generateRecommendations(investigation);
    }

    // Add risk assessment
    reportData.riskAssessment = {
      overallRisk: investigation.alert?.riskScore || 0,
      riskFactors: investigation.alert?.riskFactors
        ? JSON.parse(investigation.alert.riskFactors)
        : [],
      mitigationSteps: generateMitigationSteps(investigation),
    };

    // Generate different formats
    if (reportFormat === "html") {
      const htmlReport = generateHTMLReport(reportData);
      return new NextResponse(htmlReport, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="investigation_report_${
            investigation.id
          }_${format(new Date(), "yyyy-MM-dd")}.html"`,
        },
      });
    }

    if (reportFormat === "markdown") {
      const markdownReport = generateMarkdownReport(reportData);
      return new NextResponse(markdownReport, {
        headers: {
          "Content-Type": "text/markdown",
          "Content-Disposition": `attachment; filename="investigation_report_${
            investigation.id
          }_${format(new Date(), "yyyy-MM-dd")}.md"`,
        },
      });
    }

    // Log report generation
    await prisma.investigationLog.create({
      data: {
        investigationId: investigation.id,
        alertId: investigation.alert?.id,
        action: "REPORT_GENERATED",
        description: `Investigation report generated by ${session.user.email}`,
        performedBy: session.user.id,
        metadata: JSON.stringify({
          reportType,
          format: reportFormat,
          includeEvidence,
          includeLogs,
          includeRecommendations,
        }),
      },
    });

    // Default JSON response
    return NextResponse.json(reportData, {
      headers:
        reportFormat === "json"
          ? {
              "Content-Disposition": `attachment; filename="investigation_report_${
                investigation.id
              }_${format(new Date(), "yyyy-MM-dd")}.json"`,
            }
          : {},
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate investigation report",
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(investigation: any) {
  const recommendations = [];

  if (investigation.alert?.severity === "CRITICAL") {
    recommendations.push({
      priority: "HIGH",
      category: "IMMEDIATE_ACTION",
      description:
        "Immediate escalation required due to critical alert severity",
      action:
        "Escalate to senior management and implement immediate containment measures",
    });
  }

  if (investigation.status === "OPEN") {
    recommendations.push({
      priority: "MEDIUM",
      category: "INVESTIGATION",
      description: "Continue active investigation",
      action:
        "Assign additional resources and set clear timeline for resolution",
    });
  }

  if (investigation.alert?.riskScore > 0.8) {
    recommendations.push({
      priority: "HIGH",
      category: "RISK_MITIGATION",
      description: "High risk score detected",
      action: "Implement enhanced monitoring and consider account restrictions",
    });
  }

  return recommendations;
}

function generateMitigationSteps(investigation: any) {
  const steps = [];

  steps.push("Review and validate all transaction details");
  steps.push("Verify customer identity and authorization");
  steps.push("Check for similar patterns in historical data");

  if (investigation.alert?.alertType === "AMOUNT_ANOMALY") {
    steps.push("Implement temporary transaction limits");
    steps.push("Require additional verification for large amounts");
  }

  if (investigation.alert?.alertType === "PATTERN_MATCH") {
    steps.push("Update fraud detection rules");
    steps.push("Enhance pattern recognition algorithms");
  }

  return steps;
}

function generateHTMLReport(data: any) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>${data.reportHeader.title}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #333; border-bottom: 1px solid #ccc; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .confidential { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.reportHeader.title}</h1>
        <p class="confidential">CONFIDENTIAL</p>
        <p>Generated: ${format(
          new Date(data.reportHeader.generatedAt),
          "yyyy-MM-dd HH:mm:ss"
        )}</p>
        <p>By: ${data.reportHeader.generatedBy}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <table>
            <tr><td><strong>Case ID</strong></td><td>${
              data.executiveSummary.caseId
            }</td></tr>
            <tr><td><strong>Status</strong></td><td>${
              data.executiveSummary.status
            }</td></tr>
            <tr><td><strong>Priority</strong></td><td>${
              data.executiveSummary.priority
            }</td></tr>
            <tr><td><strong>Investigator</strong></td><td>${
              data.executiveSummary.investigator.name
            }</td></tr>
        </table>
    </div>

    ${
      data.alertDetails
        ? `
    <div class="section">
        <h2>Alert Details</h2>
        <table>
            <tr><td><strong>Alert ID</strong></td><td>${data.alertDetails.alertId}</td></tr>
            <tr><td><strong>Type</strong></td><td>${data.alertDetails.alertType}</td></tr>
            <tr><td><strong>Severity</strong></td><td>${data.alertDetails.severity}</td></tr>
            <tr><td><strong>Risk Score</strong></td><td>${data.alertDetails.riskScore}</td></tr>
        </table>
    </div>
    `
        : ""
    }

    ${
      data.recommendations
        ? `
    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            ${data.recommendations
              .map(
                (rec: any) =>
                  `<li><strong>${rec.priority}</strong>: ${rec.description} - ${rec.action}</li>`
              )
              .join("")}
        </ul>
    </div>
    `
        : ""
    }
</body>
</html>
  `;
}

function generateMarkdownReport(data: any) {
  return `
# ${data.reportHeader.title}

**CONFIDENTIAL**

Generated: ${format(
    new Date(data.reportHeader.generatedAt),
    "yyyy-MM-dd HH:mm:ss"
  )}  
By: ${data.reportHeader.generatedBy}

## Executive Summary

- **Case ID**: ${data.executiveSummary.caseId}
- **Status**: ${data.executiveSummary.status}
- **Priority**: ${data.executiveSummary.priority}
- **Investigator**: ${data.executiveSummary.investigator.name}

${
  data.alertDetails
    ? `
## Alert Details

- **Alert ID**: ${data.alertDetails.alertId}
- **Type**: ${data.alertDetails.alertType}
- **Severity**: ${data.alertDetails.severity}
- **Risk Score**: ${data.alertDetails.riskScore}
`
    : ""
}

${
  data.recommendations
    ? `
## Recommendations

${data.recommendations
  .map(
    (rec: any) => `- **${rec.priority}**: ${rec.description} - ${rec.action}`
  )
  .join("\n")}
`
    : ""
}
  `;
}

export async function GET() {
  return NextResponse.json({
    message: "Investigation Report Generation API",
    supportedReportTypes: ["comprehensive", "summary", "technical"],
    supportedFormats: ["json", "html", "markdown"],
    requiredPermissions: ["ADMIN", "INVESTIGATOR", "ANALYST"],
  });
}
