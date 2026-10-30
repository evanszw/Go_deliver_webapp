import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, IS_PRODUCTION } from "../config";

export function signToken(payload: object): string {
  return (jwt.sign as any)(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): any {
  return (jwt.verify as any)(token, JWT_SECRET);
}

export function cookieOptions(): Record<string, any> {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: IS_PRODUCTION ? "lax" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}
