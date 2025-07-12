import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/database/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
    },
  });

  return user;
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthenticatedUser(request);

    if (!user || !user.isActive) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, { ...context, user });
  };
}

export function requireRole(roles: string[]) {
  return function (handler: Function) {
    return async (request: NextRequest, context?: any) => {
      const user = await getAuthenticatedUser(request);

      if (!user || !user.isActive) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (!roles.includes(user.role)) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }

      return handler(request, { ...context, user });
    };
  };
}
