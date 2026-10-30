import { describe, it, expect, vi, beforeEach } from "vitest";
import { hashPassword, comparePassword } from "../lib/password";

describe("password utilities", () => {
  it("hashes and compares a password correctly", async () => {
    const hash = await hashPassword("securePassword123");
    expect(hash).not.toBe("securePassword123");
    expect(await comparePassword("securePassword123", hash)).toBe(true);
    expect(await comparePassword("wrongPassword", hash)).toBe(false);
  });
});
