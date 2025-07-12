import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth/utils";

async function handleMe(request: NextRequest, { user }: any) {
  return Response.json({
    user,
  });
}

export const GET = requireAuth(handleMe);
