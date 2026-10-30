import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { ContactInfo, AdditionalContactItem } from "@/types";
import { Input, Button } from "@/components/ui";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Share2,
  ExternalLink,
} from "lucide-react";
import { BUSINESS } from "@/config/business";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-4 h-4 shrink-0"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Contact() {
  const [contact, setContact] = useState<ContactInfo>({});
  const [additional, setAdditional] = useState<AdditionalContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    api
      .get<{ contact: ContactInfo }>("/contact")
      .then((r: any) => {
        const c = r.contact || r.data?.contact || {};
        setContact(c);
        if (c.additional_contacts) {
          try {
            const parsed = JSON.parse(c.additional_contacts);
            if (Array.isArray(parsed)) {
              setAdditional(parsed.filter((item: AdditionalContactItem) => item.isActive !== false));
            }
          } catch {
            setAdditional([]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      setFeedback("Please fill out all required fields.");
      return;
    }
    if (formData.phone.trim() && !/^\+?[0-9]{5,20}$/.test(formData.phone.trim())) {
      setStatus("error");
      setFeedback("Invalid phone number: only numbers and optional leading + are allowed.");
      return;
    }

    setStatus("submitting");
    setFeedback("");
    try {
      const res: any = await api.post("/contact/message", formData);
      setStatus("success");
      setFeedback(res.message || "Thank you. Your message has been sent to dispatch.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setFeedback(err.error || err.message || "Failed to send message. Please try WhatsApp for immediate assistance.");
    }
  };

  const primaryPhone = contact.business_phone || BUSINESS.businessPhone || "+263 242 700 800";
  const primaryEmail = contact.business_email || BUSINESS.businessEmail || "dispatch@go-deliver.local";
  const primaryWhatsApp = contact.whatsapp_number || BUSINESS.whatsappNumber || "+263771234567";

  // Additional phones & whatsapps
  const extraPhones = additional.filter((i) => i.type === "phone");
  const extraWhatsApps = additional.filter((i) => i.type === "whatsapp");
  const extraEmails = additional.filter((i) => i.type === "email");
  const socialChannels = [
    ...(contact.facebook_url ? [{ label: "Facebook", value: contact.facebook_url, type: "facebook" }] : []),
    ...(contact.twitter_url ? [{ label: "Twitter / X", value: contact.twitter_url, type: "twitter" }] : []),
    ...(contact.instagram_url ? [{ label: "Instagram", value: contact.instagram_url, type: "instagram" }] : []),
    ...additional.filter((i) => ["facebook", "instagram", "twitter", "linkedin", "telegram", "other"].includes(i.type)),
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-1">
            Dispatch Support
          </div>
          <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">
            Contact Go Deliver
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Direct metropolitan dispatch desk, telephone hotlines, multiple WhatsApp lines, and support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Dispatch Channel Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary & Additional Phones */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-brand-black flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-red" />
                <span>Telephone Hotlines</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-semibold text-brand-black block">Primary Office Line</span>
                    <span className="text-slate-600 font-mono">{primaryPhone}</span>
                  </div>
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                    className="px-3 py-1.5 bg-brand-black text-white hover:bg-slate-800 text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    Call Now
                  </a>
                </div>

                {extraPhones.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="font-semibold text-brand-black block">{p.label}</span>
                      <span className="text-slate-600 font-mono">{p.value}</span>
                      {p.note && <span className="text-[10px] text-slate-400 block">{p.note}</span>}
                    </div>
                    <a
                      href={`tel:${p.value.replace(/\s+/g, "")}`}
                      className="px-3 py-1.5 bg-brand-black text-white hover:bg-slate-800 text-[11px] font-semibold rounded-lg transition-colors"
                    >
                      Call Now
                    </a>
                  </div>
                ))}
              </div>

              {/* WhatsApp Channels */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <WhatsAppIcon />
                  <span>WhatsApp Dispatch Desks</span>
                </h3>

                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${primaryWhatsApp.replace(/\D/g, "")}?text=Hello%20Go%20Deliver,%20I%20would%20like%20to%20book%20a%20delivery.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-3 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl text-emerald-950 transition-colors group"
                  >
                    <div>
                      <span className="font-bold text-xs block group-hover:text-emerald-800">
                        Primary WhatsApp Dispatch
                      </span>
                      <span className="text-[11px] text-emerald-700 font-mono">
                        {primaryWhatsApp}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] text-white text-[11px] font-semibold rounded-lg shadow-2xs">
                      <WhatsAppIcon />
                      <span>Chat</span>
                    </span>
                  </a>

                  {extraWhatsApps.map((w) => (
                    <a
                      key={w.id}
                      href={`https://wa.me/${w.value.replace(/\D/g, "")}?text=Hello%20Go%20Deliver,%20enquiring%20with%20${encodeURIComponent(w.label)}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-between p-3 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-xl text-emerald-950 transition-colors group"
                    >
                      <div>
                        <span className="font-bold text-xs block group-hover:text-emerald-800">
                          {w.label}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-mono">
                          {w.value}
                        </span>
                        {w.note && <span className="text-[10px] text-slate-500 block">{w.note}</span>}
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] text-white text-[11px] font-semibold rounded-lg shadow-2xs">
                        <WhatsAppIcon />
                        <span>Chat</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Physical Location & Hours */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 mt-0.5 text-brand-red shrink-0" />
                  <div>
                    <span className="font-semibold text-brand-black block">Email Desk</span>
                    <span className="text-slate-600">{primaryEmail}</span>
                    {extraEmails.map((em) => (
                      <span key={em.id} className="text-slate-600 block mt-0.5">
                        {em.label}: {em.value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-brand-red shrink-0" />
                  <div>
                    <span className="font-semibold text-brand-black block">Central Hub Address</span>
                    <span className="text-slate-600">{contact.physical_address || "48 Samora Machel Avenue, Harare, Zimbabwe"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-brand-red shrink-0" />
                  <div>
                    <span className="font-semibold text-brand-black block">Operating Hours</span>
                    <span className="text-slate-600">{contact.operating_hours || "Monday - Saturday: 07:00 - 19:00"}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels & Online Hubs */}
              {socialChannels.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Follow &amp; Connect Online
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {socialChannels.map((s, idx) => (
                      <a
                        key={idx}
                        href={s.value.startsWith("http") ? s.value : `https://${s.value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>{s.label}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-brand-black">Send a Message</h2>
                <p className="text-slate-600 text-xs mt-1">
                  Leave your details and dispatch notes below. We reply during active operating hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name or Company"
                  placeholder="e.g. Farai Mandaza"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. farai@company.co.zw"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />

                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    phoneOnly
                    placeholder="e.g. +263771234567"
                    helperText="Numbers only"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Enquiry Details
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your delivery requirements, estimated frequency, or route enquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-brand-black text-sm placeholder-slate-400 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all shadow-sm"
                    required
                  />
                </div>

                {status === "error" && feedback && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{feedback}</span>
                  </div>
                )}

                {status === "success" && feedback && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{feedback}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto"
                >
                  {status === "submitting" ? "Sending Enquiry..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
