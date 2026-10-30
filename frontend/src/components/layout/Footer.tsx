import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Clock, Phone, ExternalLink } from "lucide-react";
import { BUSINESS } from "@/config/business";
import { api } from "@/services/api";
import type { ContactInfo, AdditionalContactItem } from "@/types";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-4 h-4 shrink-0 text-[#25D366]"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Footer() {
  const year = new Date().getFullYear();
  const [contacts, setContacts] = useState<ContactInfo>({});
  const [additional, setAdditional] = useState<AdditionalContactItem[]>([]);

  useEffect(() => {
    api
      .get("/contact")
      .then((r: any) => {
        const c = r.contact || r.data?.contact || {};
        setContacts(c);
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
      .catch(() => {});
  }, []);

  const phone = contacts.business_phone || BUSINESS.businessPhone || "+263 242 700 800";
  const email = contacts.business_email || BUSINESS.businessEmail || "dispatch@go-deliver.local";
  const address = contacts.physical_address || "48 Samora Machel Avenue, Harare";
  const hours = contacts.operating_hours || "Mon - Sat: 07:00 - 19:00";
  const whatsapp = contacts.whatsapp_number || BUSINESS.whatsappNumber || "+263771234567";

  const extraPhones = additional.filter((i) => i.type === "phone");
  const extraWhatsApps = additional.filter((i) => i.type === "whatsapp");
  const socialItems = [
    ...(contacts.facebook_url ? [{ label: "Facebook", url: contacts.facebook_url }] : []),
    ...(contacts.twitter_url ? [{ label: "Twitter / X", url: contacts.twitter_url }] : []),
    ...(contacts.instagram_url ? [{ label: "Instagram", url: contacts.instagram_url }] : []),
    ...additional
      .filter((i) => ["facebook", "instagram", "twitter", "linkedin", "telegram"].includes(i.type))
      .map((i) => ({ label: i.label, url: i.value })),
  ];

  return (
    <footer className="bg-[#0F1115] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Wordmark & Summary */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Go Deliver logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-bold text-xl text-white tracking-tight">
                Go Deliver
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Professional urban courier and commercial freight logistics. Point-to-point dispatch across central business hubs and provincial corridors.
            </p>

            {socialItems.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Social Dispatch Desks
                </span>
                <div className="flex flex-wrap gap-2">
                  {socialItems.map((s, idx) => (
                    <a
                      key={idx}
                      href={s.url.startsWith("http") ? s.url : `https://${s.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] transition-colors"
                    >
                      <span>{s.label}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  Delivery Services &amp; Fleet
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/service-areas" className="hover:text-white transition-colors">
                  Metropolitan Service Areas
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">
                  Track Delivery Request
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-red-400 hover:text-red-300 transition-colors font-medium">
                  Book a Delivery Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Information */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Support &amp; FAQ</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Dispatch Desk
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Carriage
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Staff / Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact details */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Dispatch Desk</h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <div>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors text-slate-300">
                    {phone}
                  </a>
                  {extraPhones.map((p) => (
                    <div key={p.id} className="text-slate-400 text-[11px] mt-0.5">
                      {p.label}: <a href={`tel:${p.value.replace(/\s+/g, "")}`} className="hover:text-white font-mono">{p.value}</a>
                    </div>
                  ))}
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <WhatsAppIcon />
                <div>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#25D366] transition-colors text-slate-300 font-medium"
                  >
                    WhatsApp: {whatsapp}
                  </a>
                  {extraWhatsApps.map((w) => (
                    <div key={w.id} className="text-slate-400 text-[11px] mt-0.5">
                      {w.label}: <a href={`https://wa.me/${w.value.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] font-mono">{w.value}</a>
                    </div>
                  ))}
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <a href={`mailto:${email}`} className="text-slate-300 hover:text-white transition-colors">
                  {email}
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span className="text-slate-300">{address}</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span className="text-slate-300">{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>&copy; {year} Go Deliver. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <span>·</span>
            <Link to="/track" className="hover:text-slate-300 transition-colors">Shipment Tracker</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
