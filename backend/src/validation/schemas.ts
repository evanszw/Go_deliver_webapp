import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const deliveryRequestSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d+\s-]{3,25}$/, "Phone number must contain only numbers"),
  pickupAddress: z.string().min(1, "Pickup address is required"),
  deliveryDestination: z.string().min(1, "Delivery destination is required"),
  recipientName: z.string().optional(),
  recipientPhone: z
    .string()
    .regex(/^[\d+\s-]{3,25}$/, "Recipient phone must contain only numbers")
    .optional()
    .or(z.literal("")),
  serviceId: z.string().optional(),
  itemDescription: z.string().optional(),
  additionalInstructions: z.string().optional(),
  preferredDateTime: z.string().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  startingPrice: z.number().int().nonnegative().optional().nullable(),
  isActive: z.boolean().optional(),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export const serviceAreaSchema = z.object({
  name: z.string().min(1, "Area name is required"),
  address: z.string().optional().nullable(),
  operatingHours: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const contactInfoSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string(),
});
