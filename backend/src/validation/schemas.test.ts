import { describe, it, expect } from "vitest";
import { z } from "zod";

const deliveryRequestSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  deliveryDestination: z.string().min(1, "Delivery destination is required"),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  serviceId: z.string().optional(),
  itemDescription: z.string().optional(),
  additionalInstructions: z.string().optional(),
  preferredDateTime: z.string().optional(),
});

describe("delivery request validation schema", () => {
  it("accepts a valid request", () => {
    const result = deliveryRequestSchema.safeParse({
      customerName: "John Doe",
      customerPhone: "0771234567",
      pickupAddress: "123 Main St",
      deliveryDestination: "456 Oak Ave",
      itemDescription: "Documents",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const result = deliveryRequestSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes("customerName"))).toBe(true);
      expect(result.error.errors.some((e) => e.path.includes("customerPhone"))).toBe(true);
    }
  });

  it("accepts optional fields being absent", () => {
    const result = deliveryRequestSchema.safeParse({
      customerName: "John",
      customerPhone: "0771234567",
      pickupAddress: "123 Main St",
      deliveryDestination: "456 Oak Ave",
    });
    expect(result.success).toBe(true);
  });
});
