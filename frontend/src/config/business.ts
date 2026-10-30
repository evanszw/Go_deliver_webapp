export const BUSINESS = {
  name: "Go Deliver",
  tagline: "Fast, reliable urban delivery.",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "",
  businessEmail: import.meta.env.VITE_BUSINESS_EMAIL || "",
  businessPhone: import.meta.env.VITE_BUSINESS_PHONE || "",
  facebookUrl: import.meta.env.VITE_FACEBOOK_URL || "",
  twitterUrl: import.meta.env.VITE_TWITTER_URL || "",
  instagramUrl: import.meta.env.VITE_INSTAGRAM_URL || "",
};

export const API_BASE = import.meta.env.VITE_API_BASE || "/api";
