interface ImportMetaEnv {
  VITE_API_BASE?: string;
  VITE_WHATSAPP_NUMBER?: string;
  VITE_BUSINESS_EMAIL?: string;
  VITE_BUSINESS_PHONE?: string;
  VITE_FACEBOOK_URL?: string;
  VITE_TWITTER_URL?: string;
  VITE_INSTAGRAM_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
