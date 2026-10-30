export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  startingPrice: number | null;
  isActive: boolean;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryRequest = {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryDestination: string;
  recipientName: string | null;
  recipientPhone: string | null;
  serviceId: string | null;
  service: Service | null;
  itemDescription: string | null;
  additionalInstructions: string | null;
  internalNotes?: string | null;
  preferredDateTime: string | null;
  status: string;
  whatsappSent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServiceArea = {
  id: string;
  name: string;
  address: string | null;
  operatingHours: string | null;
  contactPhone: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdditionalContactItem = {
  id: string;
  type: "whatsapp" | "phone" | "facebook" | "instagram" | "twitter" | "linkedin" | "telegram" | "email" | "other";
  label: string;
  value: string;
  note?: string;
  isActive?: boolean;
};

export type ContactInfo = Record<string, string>;

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  fields?: Record<string, string[]>;
};
