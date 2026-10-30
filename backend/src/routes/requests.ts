import { Router } from "express";
import { prisma } from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  deliveryRequestSchema,
  serviceSchema,
  serviceAreaSchema,
  faqSchema,
  contactInfoSchema,
} from "../validation/schemas";
import { AppError } from "../middleware/errorHandler";
import { z } from "zod";

const router = Router();

// ============ PUBLIC: Delivery Requests ============

// Submit a delivery request
router.post(
  "/requests",
  validate(deliveryRequestSchema),
  async (req, res, next) => {
    try {
      const data = req.body;

      // Generate a simple reference number
      const prefix = "GD";
      const random = Math.floor(100000 + Math.random() * 900000).toString();
      const referenceNumber = `${prefix}-${random}`;

      // Verify service exists if provided
      if (data.serviceId) {
        const service = await prisma.service.findUnique({
          where: { id: data.serviceId },
        });
        if (!service || !service.isActive) {
          return res.status(400).json({
            success: false,
            error: "Selected service is not available",
          });
        }
      }

      const request = await prisma.deliveryRequest.create({
        data: {
          referenceNumber,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          pickupAddress: data.pickupAddress,
          deliveryDestination: data.deliveryDestination,
          recipientName: data.recipientName || null,
          recipientPhone: data.recipientPhone || null,
          serviceId: data.serviceId || null,
          itemDescription: data.itemDescription || null,
          additionalInstructions: data.additionalInstructions || null,
          preferredDateTime: data.preferredDateTime
            ? new Date(data.preferredDateTime)
            : null,
          status: "NEW",
        },
        include: { service: true },
      });

      res.status(201).json({
        success: true,
        message: "Delivery request received",
        request: {
          id: request.id,
          referenceNumber: request.referenceNumber,
          status: request.status,
          createdAt: request.createdAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get a single delivery request (public - by reference number)
router.get("/requests/:referenceNumber", async (req, res, next) => {
  try {
    const request = await prisma.deliveryRequest.findUnique({
      where: { referenceNumber: req.params.referenceNumber },
      include: { service: true },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Request not found",
      });
    }

    res.json({ success: true, request });
  } catch (err) {
    next(err);
  }
});

// ============ ADMIN: Delivery Requests ============

// List all requests (with optional search/filter/status)
router.get(
  "/admin/requests",
  authenticate,
  authorize("ADMIN", "STAFF"),
  async (req, res, next) => {
    try {
      const { status, search, page = "1", limit = "20" } = req.query;
      const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
      const limitNum = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
      const skip = (pageNum - 1) * limitNum;

      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { referenceNumber: { contains: search as string } },
          { customerName: { contains: search as string } },
          { customerPhone: { contains: search as string } },
        ];
      }

      const [requests, total] = await prisma.$transaction([
        prisma.deliveryRequest.findMany({
          where,
          include: { service: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        prisma.deliveryRequest.count({ where }),
      ]);

      res.json({
        success: true,
        requests,
        pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get single request by ID (admin)
router.get(
  "/admin/requests/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  async (req, res, next) => {
    try {
      const request = await prisma.deliveryRequest.findUnique({
        where: { id: req.params.id },
        include: { service: true },
      });

      if (!request) {
        return res.status(404).json({ success: false, error: "Request not found" });
      }

      res.json({ success: true, request });
    } catch (err) {
      next(err);
    }
  }
);

// Update request status + internal notes
const updateRequestSchema = z.object({
  status: z.enum(["NEW", "REVIEWED", "ACCEPTED", "COMPLETED", "CANCELLED"]).optional(),
  internalNotes: z.string().optional(),
});

router.patch(
  "/admin/requests/:id",
  authenticate,
  authorize("ADMIN", "STAFF"),
  validate(updateRequestSchema),
  async (req, res, next) => {
    try {
      const request = await prisma.deliveryRequest.update({
        where: { id: req.params.id },
        data: {
          status: req.body.status,
          internalNotes: req.body.internalNotes ?? undefined,
        },
      });
      res.json({ success: true, request });
    } catch (err) {
      next(err);
    }
  }
);

// ============ ADMIN: Services ============

router.get("/admin/services", authenticate, authorize("ADMIN", "STAFF"), async (req, res) => {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ success: true, services });
});

router.post(
  "/admin/services",
  authenticate,
  authorize("ADMIN"),
  validate(serviceSchema),
  async (req, res, next) => {
    try {
      const service = await prisma.service.create({
        data: {
          name: req.body.name,
          description: req.body.description,
          startingPrice: req.body.startingPrice ?? null,
          isActive: req.body.isActive ?? true,
          imageUrl: req.body.imageUrl ?? null,
          sortOrder: req.body.sortOrder ?? 0,
        },
      });
      res.status(201).json({ success: true, service });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/admin/services/:id",
  authenticate,
  authorize("ADMIN"),
  validate(serviceSchema.partial()),
  async (req, res, next) => {
    try {
      const service = await prisma.service.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json({ success: true, service });
    } catch (err) {
      next(err);
    }
  }
);

// ============ ADMIN: Service Areas ============

router.get("/admin/areas", authenticate, authorize("ADMIN", "STAFF"), async (req, res) => {
  const areas = await prisma.serviceArea.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ success: true, areas });
});

router.post(
  "/admin/areas",
  authenticate,
  authorize("ADMIN"),
  validate(serviceAreaSchema),
  async (req, res, next) => {
    try {
      const area = await prisma.serviceArea.create({ data: req.body });
      res.status(201).json({ success: true, area });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/admin/areas/:id",
  authenticate,
  authorize("ADMIN"),
  validate(serviceAreaSchema.partial()),
  async (req, res, next) => {
    try {
      const area = await prisma.serviceArea.update({ where: { id: req.params.id }, data: req.body });
      res.json({ success: true, area });
    } catch (err) {
      next(err);
    }
  }
);

// ============ ADMIN: FAQs ============

router.get("/admin/faqs", authenticate, authorize("ADMIN", "STAFF"), async (req, res) => {
  const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } });
  res.json({ success: true, faqs });
});

router.post(
  "/admin/faqs",
  authenticate,
  authorize("ADMIN"),
  validate(faqSchema),
  async (req, res, next) => {
    try {
      const faq = await prisma.fAQ.create({ data: req.body });
      res.status(201).json({ success: true, faq });
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/admin/faqs/:id",
  authenticate,
  authorize("ADMIN"),
  validate(faqSchema.partial()),
  async (req, res, next) => {
    try {
      const faq = await prisma.fAQ.update({ where: { id: req.params.id }, data: req.body });
      res.json({ success: true, faq });
    } catch (err) {
      next(err);
    }
  }
);

// ============ ADMIN: Contact Info ============

router.get("/admin/contact", authenticate, authorize("ADMIN", "STAFF"), async (req, res) => {
  const contacts = await prisma.contactInfo.findMany();
  res.json({ success: true, contacts });
});

router.post(
  "/admin/contact",
  authenticate,
  authorize("ADMIN"),
  validate(contactInfoSchema),
  async (req, res, next) => {
    try {
      const contact = await prisma.contactInfo.upsert({
        where: { key: req.body.key },
        update: { value: req.body.value },
        create: req.body,
      });
      res.json({ success: true, contact });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/admin/contact/:key",
  authenticate,
  authorize("ADMIN"),
  async (req, res, next) => {
    try {
      await prisma.contactInfo.deleteMany({
        where: { key: req.params.key },
      });
      res.json({ success: true, message: "Contact key removed" });
    } catch (err) {
      next(err);
    }
  }
);

// ============ PUBLIC: Services, Areas, FAQs, Contact (read-only) ============

router.get("/services", async (req, res) => {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json({ success: true, services });
});

router.get("/areas", async (req, res) => {
  const areas = await prisma.serviceArea.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json({ success: true, areas });
});

router.get("/faqs", async (req, res) => {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  res.json({ success: true, faqs });
});

router.get("/contact", async (req, res) => {
  const contacts = await prisma.contactInfo.findMany();
  const obj: Record<string, string> = {};
  for (const c of contacts) obj[c.key] = c.value;
  res.json({ success: true, contact: obj });
});

// Public contact inquiry submission
router.post("/contact/message", async (req, res, next) => {
  try {
    const { name, email, message } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ success: false, error: "Name is required" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ success: false, error: "Valid email address is required" });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ success: false, error: "Message content is required" });
    }

    // In a production environment this sends an email or logs to dispatch queue
    console.log(`[Contact Message] Received from ${name} (${email}): ${message.slice(0, 100)}...`);

    res.status(200).json({
      success: true,
      message: "Thank you for reaching out. Our dispatch office will reply to your enquiry shortly.",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
