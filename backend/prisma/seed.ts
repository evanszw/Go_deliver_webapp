import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.FIRST_ADMIN_EMAIL || "admin@go-deliver.local";
  const password = process.env.FIRST_ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.FIRST_ADMIN_NAME || "Administrator";

  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log("Admin user already exists. Skipping seed.");
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, name, role: "ADMIN" },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log("✅ First admin created:", user.email);

  // Seed default services
  await prisma.service.createMany({
    data: [
      {
        name: "Parcel & Document Delivery",
        description: "Fast delivery of parcels and documents across the city.",
        startingPrice: null,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Business Deliveries",
        description: "Regular delivery solutions for local businesses and shops.",
        startingPrice: null,
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Food & Retail Deliveries",
        description: "Timely delivery of food orders and retail purchases.",
        startingPrice: null,
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Same-Day Delivery",
        description: "Urgent deliveries completed within the same day.",
        startingPrice: null,
        isActive: true,
        sortOrder: 4,
      },
    ],
  });

  // Seed default service areas
  await prisma.serviceArea.createMany({
    data: [
      { name: "City Centre", isActive: true, sortOrder: 1 },
      { name: "Industrial Area", isActive: true, sortOrder: 2 },
      { name: "Residential Estates", isActive: true, sortOrder: 3 },
    ],
  });

  // Seed default FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: "How do I request a delivery?",
        answer: "Fill out the booking form with your pickup and destination details, then submit. We will confirm receipt of your request.",
        sortOrder: 1,
        isActive: true,
      },
      {
        question: "What information is required?",
        answer: "Your name, phone number, pickup address, delivery destination, and a description of the item.",
        sortOrder: 2,
        isActive: true,
      },
      {
        question: "Which areas do you cover?",
        answer: "See our Service Areas page for the current list of supported areas and branches.",
        sortOrder: 3,
        isActive: true,
      },
      {
        question: "How are delivery prices determined?",
        answer: "Pricing depends on the service type and distance. Contact us for a delivery quote.",
        sortOrder: 4,
        isActive: true,
      },
      {
        question: "How can I contact Go Deliver?",
        answer: "Use the Contact page or the WhatsApp button to send us a message.",
        sortOrder: 5,
        isActive: true,
      },
      {
        question: "What happens after I submit a request?",
        answer: "Your request is saved and reviewed by our team. You will receive a reference number to use when contacting us.",
        sortOrder: 6,
        isActive: true,
      },
    ],
  });

  // Seed default contact info
  await prisma.contactInfo.createMany({
    data: [
      { key: "whatsapp_number", value: "" },
      { key: "business_email", value: "" },
      { key: "business_phone", value: "" },
      { key: "facebook_url", value: "" },
      { key: "twitter_url", value: "" },
      { key: "instagram_url", value: "" },
    ],
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
