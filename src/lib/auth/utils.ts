import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";
import { AuthContext } from "@/types/auth";
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
    // DEMO: If token is a 24-char string (Mongo/Prisma id) and not a JWT, accept as userId
    if (token && token.length >= 16 && !token.includes('.')) {
      return { userId: token, email: '', role: 'ADMIN' };
    }
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  console.log('DEBUG AUTH HEADER', authHeader);
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    console.log('DEBUG: No token found in Authorization header');
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    console.log('DEBUG: Token verification failed for', token);
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

  if (!user) {
    console.log('DEBUG: No user found for userId', payload.userId);
  }

  return user;
}

export function requireAuth(
  handler: (request: NextRequest, context: AuthContext) => Promise<Response>
) {
  return async (request: NextRequest, context?: AuthContext) => {
    const user = await getAuthenticatedUser(request);

    if (!user || !user.isActive) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    return handler(request, { ...context, user });
  };
}

export function requireRole(roles: string[]) {
  return function (
    handler: (request: NextRequest, context: AuthContext) => Promise<Response>
  ) {
    return async (request: NextRequest, context?: AuthContext) => {
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
