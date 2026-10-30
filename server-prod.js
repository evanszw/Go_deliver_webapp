const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = 3000;

app.set("trust proxy", 1);

// Security middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// In-memory data store
const store = {
  users: [
    {
      id: "u-admin-1",
      email: "admin@go-deliver.local",
      name: "Administrator",
      passwordHash: "$2a$10$WTCuix2U3lKVvqwwR5EBHelwYRmiIdG32AXwXA3/RLKUbuHElpwQi",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  services: [
    { id: "srv-1", name: "Express Courier & Documents", description: "Direct point-to-point courier for urgent legal files, contracts, tender documents, and time-critical packets.", startingPrice: 15, isActive: true, sortOrder: 1, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
    { id: "srv-2", name: "Scheduled Business Logistics", description: "Daily or weekly scheduled fulfillment for retail shops, regional depots, spare parts distributors, and e-commerce orders.", startingPrice: 25, isActive: true, sortOrder: 2, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
    { id: "srv-3", name: "Secure Fragile & Parcel Freight", description: "Careful climate and shock-resistant transport for delicate electronics, laboratory samples, and temperature-sensitive goods.", startingPrice: 35, isActive: true, sortOrder: 3, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
    { id: "srv-4", name: "Same-Day Urban Priority", description: "Rapid citywide turnaround under 3 hours with dedicated rider dispatch.", startingPrice: 20, isActive: true, sortOrder: 4, imageUrl: null, createdAt: new Date(), updatedAt: new Date() },
  ],
  areas: [
    { id: "area-1", name: "Central Business District & Commercial Core", address: "First St & Samora Machel Ave Corridor", operatingHours: "07:00 - 19:00 Mon-Sat", contactPhone: "+263 77 123 4567", isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
    { id: "area-2", name: "Heavy Industrial & Freight Transit Zone", address: "Graniteside & Workington Depots", operatingHours: "06:00 - 20:00 Daily", contactPhone: "+263 77 234 5678", isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: "area-3", name: "Northern Suburbs & Tech Corridor", address: "Borrowdale, Avondale & Mt Pleasant", operatingHours: "08:00 - 18:00 Mon-Sun", contactPhone: "+263 77 345 6789", isActive: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
    { id: "area-4", name: "Airport & Special Logistics Corridor", address: "R.G. Mugabe International Airport Transit Hub", operatingHours: "24/7 By Appointment", contactPhone: "+263 77 456 7890", isActive: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() },
  ],
  faqs: [
    { id: "faq-1", question: "How do I request a delivery pickup?", answer: "Fill out the online booking form with your pickup and destination details, select your service category, and submit.", sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "faq-2", question: "What items can be delivered?", answer: "We deliver legal and commercial documents, parcels, boxed merchandise, medical supplies, electronics, and e-commerce goods.", sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "faq-3", question: "Which urban zones and corridors do you cover?", answer: "We cover all major commercial districts, industrial corridors, and residential zones.", sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "faq-4", question: "How are delivery rates calculated?", answer: "Base rates start from the service starting price and scale based on vehicle requirement and total distance. All quotes are confirmed before dispatch.", sortOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: "faq-5", question: "Can I coordinate urgent requests over WhatsApp?", answer: "Yes! Once you generate your booking or reference code, you can click the WhatsApp button to chat directly with active urban dispatchers.", sortOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ],
  contacts: [
    { id: "c-1", key: "whatsapp_number", value: "+263 77 123 4567" },
    { id: "c-2", key: "business_email", value: "dispatch@go-deliver.local" },
    { id: "c-3", key: "business_phone", value: "+263 242 700 800" },
    { id: "c-4", key: "operating_hours", value: "Mon - Sat: 07:00 - 19:00" },
    { id: "c-5", key: "physical_address", value: "48 Samora Machel Avenue, Harare, Zimbabwe" },
  ],
  requests: [],
};

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "go-deliver-backend" });
});

// Services
app.get("/api/services", (_req, res) => {
  res.json({ success: true, services: store.services });
});

// Areas
app.get("/api/areas", (_req, res) => {
  res.json({ success: true, areas: store.areas });
});

// FAQs
app.get("/api/faqs", (_req, res) => {
  res.json({ success: true, faqs: store.faqs });
});

// Contact
app.get("/api/contact", (_req, res) => {
  const obj = {};
  for (const c of store.contacts) obj[c.key] = c.value;
  res.json({ success: true, contact: obj });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = store.users.find((u) => u.email === email);
  if (!user || password !== "ChangeMe123!") {
    return res.status(401).json({ success: false, error: "Invalid email or password" });
  }
  res.cookie("token", "demo-session", { httpOnly: true, path: "/", maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Logout
app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true, message: "Logged out" });
});

// Get user
app.get("/api/auth/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const user = store.users[0];
  res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Submit booking request
app.post("/api/requests", (req, res) => {
  const { customerName, customerPhone, pickupAddress, deliveryDestination, serviceId, itemDescription, additionalInstructions, preferredDateTime, recipientName, recipientPhone } = req.body;
  const referenceNumber = "GD-" + Math.floor(100000 + Math.random() * 900000);
  const request = {
    id: "req-" + Date.now(),
    referenceNumber,
    customerName,
    customerPhone,
    pickupAddress,
    deliveryDestination,
    recipientName: recipientName || null,
    recipientPhone: recipientPhone || null,
    serviceId: serviceId || null,
    service: store.services.find((s) => s.id === serviceId) || null,
    itemDescription: itemDescription || null,
    additionalInstructions: additionalInstructions || null,
    preferredDateTime: preferredDateTime ? new Date(preferredDateTime) : null,
    status: "NEW",
    whatsappSent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.requests.unshift(request);
  res.status(201).json({ success: true, message: "Delivery request received", request: { id: request.id, referenceNumber: request.referenceNumber, status: request.status, createdAt: request.createdAt } });
});

// Get request by reference
app.get("/api/requests/:referenceNumber", (req, res) => {
  const request = store.requests.find((r) => r.referenceNumber === req.params.referenceNumber);
  if (!request) return res.status(404).json({ success: false, error: "Request not found" });
  res.json({ success: true, request });
});

// Admin requests
app.get("/api/admin/requests", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  res.json({ success: true, requests: store.requests, pagination: { page: 1, limit: 20, total: store.requests.length, pages: 1 } });
});

// Admin get request detail
app.get("/api/admin/requests/:id", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const request = store.requests.find((r) => r.id === req.params.id);
  if (!request) return res.status(404).json({ success: false, error: "Request not found" });
  res.json({ success: true, request });
});

// Admin update request
app.patch("/api/admin/requests/:id", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const idx = store.requests.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Request not found" });
  store.requests[idx] = { ...store.requests[idx], ...req.body, updatedAt: new Date() };
  res.json({ success: true, request: store.requests[idx] });
});

// Admin services
app.get("/api/admin/services", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  res.json({ success: true, services: store.services });
});

app.post("/api/admin/services", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const item = { id: "srv-" + Date.now(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
  store.services.push(item);
  res.status(201).json({ success: true, service: item });
});

app.patch("/api/admin/services/:id", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const idx = store.services.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: "Service not found" });
  store.services[idx] = { ...store.services[idx], ...req.body, updatedAt: new Date() };
  res.json({ success: true, service: store.services[idx] });
});

// Admin areas
app.get("/api/admin/areas", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  res.json({ success: true, areas: store.areas });
});

app.post("/api/admin/areas", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const item = { id: "area-" + Date.now(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
  store.areas.push(item);
  res.status(201).json({ success: true, area: item });
});

// Admin FAQs
app.get("/api/admin/faqs", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  res.json({ success: true, faqs: store.faqs });
});

app.post("/api/admin/faqs", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const item = { id: "faq-" + Date.now(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
  store.faqs.push(item);
  res.status(201).json({ success: true, faq: item });
});

// Admin contact
app.get("/api/admin/contact", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  res.json({ success: true, contacts: store.contacts });
});

app.post("/api/admin/contact", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ success: false, error: "Authentication required" });
  const idx = store.contacts.findIndex((c) => c.key === req.body.key);
  if (idx !== -1) {
    store.contacts[idx] = { ...store.contacts[idx], value: req.body.value };
    return res.json({ success: true, contact: store.contacts[idx] });
  }
  const created = { id: "c-" + Date.now(), key: req.body.key, value: req.body.value };
  store.contacts.push(created);
  res.json({ success: true, contact: created });
});

// Serve frontend static files
const distPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Go Deliver live at http://0.0.0.0:${PORT}`);
});
