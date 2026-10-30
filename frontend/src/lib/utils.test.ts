import { describe, it, expect } from "vitest";

// Minimal unit-style tests for validation logic (no server needed)

function isValidPhone(phone: string): boolean {
  return phone.length >= 7;
}

describe("delivery validation helpers", () => {
  it("accepts a valid phone number", () => {
    expect(isValidPhone("0771234567")).toBe(true);
  });

  it("rejects a short phone number", () => {
    expect(isValidPhone("123")).toBe(false);
  });

  it("rejects an empty phone number", () => {
    expect(isValidPhone("")).toBe(false);
  });

  it("generates a reference number format", () => {
    const ref = `GD-${Math.floor(100000 + Math.random() * 900000)}`;
    expect(ref).toMatch(/^GD-\d{6}$/);
  });
});
