// src/lib/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  // App Configuration
  NEXT_PUBLIC_APP_NAME: z.string().default("GuardChain"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
  NEXT_PUBLIC_ENVIRONMENT: z
    .enum(["development", "staging", "production"])
    .default("development"),

  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_WEBSOCKET_URL: z.string().default("ws://localhost:8000/ws"),

  // Authentication
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_JWT_SECRET: z.string().min(1),

  // External Services
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),

  // Database (if needed for API routes)
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  NEXT_PUBLIC_ENABLE_NOTIFICATIONS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  NEXT_PUBLIC_ENABLE_REALTIME: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
}

export const env = getEnv();

// Helper functions
export const isProduction = env.NEXT_PUBLIC_ENVIRONMENT === "production";
export const isDevelopment = env.NEXT_PUBLIC_ENVIRONMENT === "development";
export const isStaging = env.NEXT_PUBLIC_ENVIRONMENT === "staging";
