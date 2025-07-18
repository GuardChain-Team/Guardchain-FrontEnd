// src/app/api/alerts/[id]/evidence/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/database/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alertId = params.id;

    // Get all evidence for this alert
    const evidence = await prisma.evidence.findMany({
      where: { alertId },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get investigation logs
    const investigationLogs = await prisma.investigationLog.findMany({
      where: { alertId },
      include: {
        investigator: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    // Get related transaction logs
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: { transaction: true },
    });

    const transactionLogs = alert?.transaction
      ? await prisma.transactionLog.findMany({
          where: { transactionId: alert.transaction.id },
          orderBy: { timestamp: "desc" },
        })
      : [];

    // Get documentation files
    const documentation = await prisma.documentation.findMany({
      where: { alertId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: {
        evidence,
        investigationLogs,
        transactionLogs,
        documentation,
        summary: {
          totalEvidence: evidence.length,
          totalLogs: investigationLogs.length + transactionLogs.length,
          totalDocuments: documentation.length,
          lastUpdated:
            evidence[0]?.createdAt || investigationLogs[0]?.timestamp,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json(
      { error: "Failed to fetch evidence" },
      { status: 500 }
    );
  }
}

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
    const formData = await request.formData();

    const file = formData.get("file") as File;
    const evidenceType = formData.get("evidenceType") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type and size
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain",
      "application/json",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large (max 10MB)" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", "evidence");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const filepath = join(uploadsDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Save evidence record to database
    const evidence = await prisma.evidence.create({
      data: {
        alertId,
        type: evidenceType || "FILE",
        category: category || "GENERAL",
        filename: file.name,
        filepath: `/uploads/evidence/${filename}`,
        fileSize: file.size,
        mimeType: file.type,
        description: description || "",
        uploadedBy: session.user.id,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date(),
          checksum: await generateFileChecksum(bytes),
        },
        createdAt: new Date(),
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Log the evidence upload
    await logAuditAction({
      userId: session.user.id,
      action: "EVIDENCE_UPLOADED",
      resourceId: alertId,
      details: {
        evidenceId: evidence.id,
        filename: file.name,
        fileSize: file.size,
        type: evidenceType,
        category,
      },
    });

    return NextResponse.json({
      success: true,
      data: evidence,
    });
  } catch (error) {
    console.error("Error uploading evidence:", error);
    return NextResponse.json(
      { error: "Failed to upload evidence" },
      { status: 500 }
    );
  }
}

async function generateFileChecksum(buffer: ArrayBuffer): Promise<string> {
  const crypto = require("crypto");
  const hash = crypto.createHash("sha256");
  hash.update(Buffer.from(buffer));
  return hash.digest("hex");
}

async function logAuditAction(action: any) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: action.userId,
        action: action.action,
        resourceType: "EVIDENCE",
        resourceId: action.resourceId,
        details: action.details,
        timestamp: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "GuardChain-Frontend",
      },
    });
  } catch (error) {
    console.error("Error logging audit action:", error);
  }
}
