import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/database/prisma";

async function handleLogout(request: NextRequest, { user }: any) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
      // Delete the session
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          token,
        },
      });
    }

    return Response.json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const POST = requireAuth(handleLogout);
