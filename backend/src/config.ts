import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().default("postgresql://localhost:5432/go_deliver"),
  JWT_SECRET: z.string().default("go-deliver-jwt-secret-key-change-in-production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  PORT: z.string().transform(Number).default("3000"),
  WHATSAPP_NUMBER: z.string().default("+263771234567"),
  BUSINESS_EMAIL: z.string().email().default("dispatch@godeliver.local"),
  NODE_ENV: z.string().default("development"),
});

const _env = envSchema.safeParse(process.env);
if (!_env.success) {
  console.error("[Go Deliver] Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
export const PORT = env.PORT;
export const JWT_SECRET = env.JWT_SECRET;
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
export const WHATSAPP_NUMBER = env.WHATSAPP_NUMBER;
export const BUSINESS_EMAIL = env.BUSINESS_EMAIL;
export const NODE_ENV = env.NODE_ENV;
export const IS_PRODUCTION = env.NODE_ENV === "production";
