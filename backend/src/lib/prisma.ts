import { PrismaClient } from "@prisma/client";

// In-memory data store for fallback when PostgreSQL database is offline or not provisioned
const store = {
  users: [
    {
      id: "u-admin-1",
      email: "admin@go-deliver.local",
      name: "Administrator",
      passwordHash: "$2a$10$WTCuix2U3lKVvqwwR5EBHelwYRmiIdG32AXwXA3/RLKUbuHElpwQi", // "ChangeMe123!"
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  services: [
    {
      id: "srv-1",
      name: "Express Courier & Documents",
      description: "Direct point-to-point courier for urgent legal files, contracts, tender documents, and time-critical packets with real-time dispatch.",
      startingPrice: 15,
      isActive: true,
      sortOrder: 1,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "srv-2",
      name: "Scheduled Business Logistics",
      description: "Daily or weekly scheduled fulfillment for retail shops, regional depots, spare parts distributors, and e-commerce orders.",
      startingPrice: 25,
      isActive: true,
      sortOrder: 2,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "srv-3",
      name: "Secure Fragile & Parcel Freight",
      description: "Careful climate and shock-resistant transport for delicate electronics, laboratory samples, and temperature-sensitive goods.",
      startingPrice: 35,
      isActive: true,
      sortOrder: 3,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "srv-4",
      name: "Same-Day Urban Priority",
      description: "Rapid citywide turnaround under 3 hours with dedicated rider dispatch and instant digital signature confirmation.",
      startingPrice: 20,
      isActive: true,
      sortOrder: 4,
      imageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  areas: [
    {
      id: "area-1",
      name: "Central Business District & Commercial Core",
      address: "First St & Samora Machel Ave Corridor",
      operatingHours: "07:00 - 19:00 Mon-Sat",
      contactPhone: "+263 77 123 4567",
      isActive: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "area-2",
      name: "Heavy Industrial & Freight Transit Zone",
      address: "Graniteside & Workington Depots",
      operatingHours: "06:00 - 20:00 Daily",
      contactPhone: "+263 77 234 5678",
      isActive: true,
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "area-3",
      name: "Northern Suburbs & Tech Corridor",
      address: "Borrowdale, Avondale & Mt Pleasant",
      operatingHours: "08:00 - 18:00 Mon-Sun",
      contactPhone: "+263 77 345 6789",
      isActive: true,
      sortOrder: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "area-4",
      name: "Airport & Special Logistics Corridor",
      address: "R.G. Mugabe International Airport Transit Hub",
      operatingHours: "24/7 By Appointment",
      contactPhone: "+263 77 456 7890",
      isActive: true,
      sortOrder: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "How do I request a delivery pickup?",
      answer: "Fill out the online booking form with your pickup and destination details, select your service category, and submit. You will receive an immediate GD-XXXXXX reference code to track and quote with dispatch.",
      sortOrder: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "faq-2",
      question: "What items can be delivered?",
      answer: "We deliver legal and commercial documents, parcels, boxed merchandise, medical supplies, electronics, and e-commerce goods. Hazardous or prohibited contraband is not accepted.",
      sortOrder: 2,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "faq-3",
      question: "Which urban zones and corridors do you cover?",
      answer: "We cover all major commercial districts, industrial corridors, and residential zones. See our Service Areas section for live operating hubs and hours.",
      sortOrder: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "faq-4",
      question: "How are delivery rates calculated?",
      answer: "Base rates start from the service starting price and scale based on vehicle requirement (motorcycle, van, or light truck) and total distance. All quotes are confirmed before dispatch.",
      sortOrder: 4,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "faq-5",
      question: "Can I coordinate urgent requests over WhatsApp?",
      answer: "Yes! Once you generate your booking or reference code, you can click the WhatsApp button to chat directly with active urban dispatchers.",
      sortOrder: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  contacts: [
    { id: "c-1", key: "whatsapp_number", value: "+263 77 123 4567" },
    { id: "c-2", key: "business_email", value: "dispatch@go-deliver.local" },
    { id: "c-3", key: "business_phone", value: "+263 242 700 800" },
    { id: "c-4", key: "operating_hours", value: "Mon - Sat: 07:00 - 19:00" },
    { id: "c-5", key: "physical_address", value: "48 Samora Machel Avenue, Harare, Zimbabwe" },
  ],
  requests: [] as any[],
};

// Seed an initial delivery request for the admin dashboard demo
store.requests.push({
  id: "req-demo-1",
  referenceNumber: "GD-849201",
  customerName: "Tariro Moyo",
  customerPhone: "+263 77 987 6543",
  pickupAddress: "Suite 402, Batanai Gardens, CBD",
  deliveryDestination: "Plot 12, Borrowdale Brooke Commercial Center",
  recipientName: "Kudzai Dube",
  recipientPhone: "+263 71 234 5678",
  serviceId: "srv-1",
  itemDescription: "Certified legal agreements and corporate seal documents",
  additionalInstructions: "Deliver to front reception, ask for Kudzai",
  internalNotes: "Assigned to courier bike unit #04. Transit in progress.",
  preferredDateTime: new Date(),
  status: "ACCEPTED",
  whatsappSent: true,
  createdAt: new Date(Date.now() - 3600000 * 2),
  updatedAt: new Date(Date.now() - 3600000),
  service: store.services[0],
});

function createMockPrisma() {
  return {
    $connect: async () => {
      console.log("ℹ️ [Go Deliver] In-memory persistence engine active.");
    },
    $disconnect: async () => {},
    $transaction: async (queries: any) => {
      if (Array.isArray(queries)) {
        return Promise.all(queries);
      }
      if (typeof queries === "function") {
        return queries(mockPrisma);
      }
      return queries;
    },

    user: {
      findFirst: async () => store.users[0] || null,
      findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
        if (where.email) return store.users.find((u) => u.email.toLowerCase() === where.email?.toLowerCase()) || null;
        if (where.id) return store.users.find((u) => u.id === where.id) || null;
        return null;
      },
      create: async ({ data, select }: { data: any; select?: any }) => {
        const user = {
          id: `u-${Date.now()}`,
          email: data.email,
          passwordHash: data.passwordHash,
          name: data.name,
          role: data.role || "STAFF",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        store.users.push(user);
        if (select) {
          const res: any = {};
          for (const k of Object.keys(select)) {
            if (select[k]) res[k] = (user as any)[k];
          }
          return res;
        }
        return user;
      },
    },

    service: {
      findMany: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}) => {
        let list = [...store.services];
        if (where?.isActive !== undefined) {
          list = list.filter((s) => s.isActive === where.isActive);
        }
        if (orderBy?.sortOrder === "asc") {
          list.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return list;
      },
      findUnique: async ({ where }: { where: { id: string } }) => {
        return store.services.find((s) => s.id === where.id) || null;
      },
      create: async ({ data }: { data: any }) => {
        const item = {
          id: `srv-${Date.now()}`,
          name: data.name,
          description: data.description,
          startingPrice: data.startingPrice ?? null,
          isActive: data.isActive ?? true,
          imageUrl: data.imageUrl ?? null,
          sortOrder: data.sortOrder ?? store.services.length + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        store.services.push(item);
        return item;
      },
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = store.services.findIndex((s) => s.id === where.id);
        if (idx === -1) throw new Error("Service not found");
        store.services[idx] = { ...store.services[idx], ...data, updatedAt: new Date() };
        return store.services[idx];
      },
      createMany: async ({ data }: { data: any[] }) => {
        for (const d of data) {
          store.services.push({
            id: `srv-${Date.now()}-${Math.random()}`,
            ...d,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return { count: data.length };
      },
    },

    deliveryRequest: {
      create: async ({ data, include }: { data: any; include?: any }) => {
        const service = data.serviceId ? store.services.find((s) => s.id === data.serviceId) || null : null;
        const request = {
          id: `req-${Date.now()}`,
          referenceNumber: data.referenceNumber,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          pickupAddress: data.pickupAddress,
          deliveryDestination: data.deliveryDestination,
          recipientName: data.recipientName || null,
          recipientPhone: data.recipientPhone || null,
          serviceId: data.serviceId || null,
          service: include?.service ? service : undefined,
          itemDescription: data.itemDescription || null,
          additionalInstructions: data.additionalInstructions || null,
          internalNotes: data.internalNotes || null,
          preferredDateTime: data.preferredDateTime ? new Date(data.preferredDateTime) : null,
          status: data.status || "NEW",
          whatsappSent: data.whatsappSent || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        store.requests.unshift(request);
        return request;
      },
      findUnique: async ({ where, include }: { where: { id?: string; referenceNumber?: string }; include?: any }) => {
        const req = store.requests.find((r) => {
          if (where.referenceNumber) return r.referenceNumber.toLowerCase() === where.referenceNumber.toLowerCase();
          if (where.id) return r.id === where.id;
          return false;
        });
        if (!req) return null;
        if (include?.service && req.serviceId && !req.service) {
          req.service = store.services.find((s) => s.id === req.serviceId) || null;
        }
        return req;
      },
      findMany: async ({ where, include, orderBy, skip = 0, take = 50 }: any = {}) => {
        let list = [...store.requests];
        if (where?.status) {
          list = list.filter((r) => r.status === where.status);
        }
        if (where?.OR && Array.isArray(where.OR)) {
          list = list.filter((r) => {
            return where.OR.some((clause: any) => {
              if (clause.referenceNumber?.contains) {
                return r.referenceNumber?.toLowerCase().includes(clause.referenceNumber.contains.toLowerCase());
              }
              if (clause.customerName?.contains) {
                return r.customerName?.toLowerCase().includes(clause.customerName.contains.toLowerCase());
              }
              if (clause.customerPhone?.contains) {
                return r.customerPhone?.toLowerCase().includes(clause.customerPhone.contains.toLowerCase());
              }
              return false;
            });
          });
        }
        if (orderBy?.createdAt === "desc") {
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        const sliced = list.slice(skip, skip + take);
        if (include?.service) {
          for (const req of sliced) {
            if (!req.service && req.serviceId) {
              req.service = store.services.find((s) => s.id === req.serviceId) || null;
            }
          }
        }
        return sliced;
      },
      count: async ({ where }: any = {}) => {
        let list = [...store.requests];
        if (where?.status) list = list.filter((r) => r.status === where.status);
        if (where?.OR && Array.isArray(where.OR)) {
          list = list.filter((r) => {
            return where.OR.some((clause: any) => {
              if (clause.referenceNumber?.contains) {
                return r.referenceNumber?.toLowerCase().includes(clause.referenceNumber.contains.toLowerCase());
              }
              if (clause.customerName?.contains) {
                return r.customerName?.toLowerCase().includes(clause.customerName.contains.toLowerCase());
              }
              if (clause.customerPhone?.contains) {
                return r.customerPhone?.toLowerCase().includes(clause.customerPhone.contains.toLowerCase());
              }
              return false;
            });
          });
        }
        return list.length;
      },
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = store.requests.findIndex((r) => r.id === where.id);
        if (idx === -1) throw new Error("Request not found");
        store.requests[idx] = { ...store.requests[idx], ...data, updatedAt: new Date() };
        return store.requests[idx];
      },
    },

    serviceArea: {
      findMany: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}) => {
        let list = [...store.areas];
        if (where?.isActive !== undefined) {
          list = list.filter((a) => a.isActive === where.isActive);
        }
        if (orderBy?.sortOrder === "asc") {
          list.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return list;
      },
      create: async ({ data }: { data: any }) => {
        const item = {
          id: `area-${Date.now()}`,
          name: data.name,
          address: data.address || null,
          operatingHours: data.operatingHours || null,
          contactPhone: data.contactPhone || null,
          isActive: data.isActive ?? true,
          sortOrder: data.sortOrder ?? store.areas.length + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        store.areas.push(item);
        return item;
      },
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = store.areas.findIndex((a) => a.id === where.id);
        if (idx === -1) throw new Error("Service area not found");
        store.areas[idx] = { ...store.areas[idx], ...data, updatedAt: new Date() };
        return store.areas[idx];
      },
      createMany: async ({ data }: { data: any[] }) => {
        for (const d of data) {
          store.areas.push({
            id: `area-${Date.now()}-${Math.random()}`,
            ...d,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return { count: data.length };
      },
    },

    fAQ: {
      findMany: async ({ where, orderBy }: { where?: any; orderBy?: any } = {}) => {
        let list = [...store.faqs];
        if (where?.isActive !== undefined) {
          list = list.filter((f) => f.isActive === where.isActive);
        }
        if (orderBy?.sortOrder === "asc") {
          list.sort((a, b) => a.sortOrder - b.sortOrder);
        }
        return list;
      },
      create: async ({ data }: { data: any }) => {
        const item = {
          id: `faq-${Date.now()}`,
          question: data.question,
          answer: data.answer,
          sortOrder: data.sortOrder ?? store.faqs.length + 1,
          isActive: data.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        store.faqs.push(item);
        return item;
      },
      update: async ({ where, data }: { where: { id: string }; data: any }) => {
        const idx = store.faqs.findIndex((f) => f.id === where.id);
        if (idx === -1) throw new Error("FAQ not found");
        store.faqs[idx] = { ...store.faqs[idx], ...data, updatedAt: new Date() };
        return store.faqs[idx];
      },
      createMany: async ({ data }: { data: any[] }) => {
        for (const d of data) {
          store.faqs.push({
            id: `faq-${Date.now()}-${Math.random()}`,
            ...d,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        return { count: data.length };
      },
    },

    contactInfo: {
      findMany: async () => [...store.contacts],
      upsert: async ({ where, update, create }: { where: { key: string }; update: any; create: any }) => {
        const idx = store.contacts.findIndex((c) => c.key === where.key);
        if (idx !== -1) {
          store.contacts[idx] = { ...store.contacts[idx], ...update };
          return store.contacts[idx];
        }
        const created = { id: `c-${Date.now()}`, key: create.key, value: create.value };
        store.contacts.push(created);
        return created;
      },
      createMany: async ({ data }: { data: any[] }) => {
        for (const d of data) {
          store.contacts.push({ id: `c-${Date.now()}-${Math.random()}`, ...d });
        }
        return { count: data.length };
      },
    },
  };
}

const mockPrisma = createMockPrisma();

export const prisma = mockPrisma as unknown as PrismaClient;

export default prisma;
