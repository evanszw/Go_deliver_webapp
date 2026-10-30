import { useState, useEffect, useRef } from "react";
import { Phone, X, ChevronUp } from "lucide-react";
import { api } from "@/services/api";
import { BUSINESS } from "@/config/business";
import type { ContactInfo, AdditionalContactItem } from "@/types";

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

export function FloatingContactActions() {
  const [contacts, setContacts] = useState<ContactInfo>({});
  const [additional, setAdditional] = useState<AdditionalContactItem[]>([]);
  const [openCallMenu, setOpenCallMenu] = useState(false);
  const [openWhatsAppMenu, setOpenWhatsAppMenu] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenCallMenu(false);
        setOpenWhatsAppMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Collect all active phone numbers (primary + additional)
  const primaryPhone = contacts.business_phone || BUSINESS.businessPhone || "+263242700800";
  const extraPhones = additional.filter((item) => item.type === "phone");
  const allPhones = [
    { label: "Dispatch Telephone", value: primaryPhone, note: "Main office line" },
    ...extraPhones.map((p) => ({ label: p.label, value: p.value, note: p.note })),
  ];

  // Collect all active WhatsApp numbers (primary + additional)
  const primaryWhatsApp = contacts.whatsapp_number || BUSINESS.whatsappNumber || "263771234567";
  const cleanWhatsAppNumber = (num: string) => num.replace(/\D/g, "");
  const extraWhatsApps = additional.filter((item) => item.type === "whatsapp");
  const allWhatsApps = [
    { label: "Primary Dispatch Desk", value: primaryWhatsApp, note: "Instant quote & booking" },
    ...extraWhatsApps.map((w) => ({ label: w.label, value: w.value, note: w.note })),
  ];

  const handleCallClick = () => {
    if (allPhones.length === 1) {
      window.location.href = `tel:${allPhones[0].value.replace(/\s+/g, "")}`;
    } else {
      setOpenCallMenu(!openCallMenu);
      setOpenWhatsAppMenu(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (allWhatsApps.length === 1) {
      const clean = cleanWhatsAppNumber(allWhatsApps[0].value);
      window.open(`https://wa.me/${clean}?text=Hello%20Go%20Deliver,%20I'd%20like%20to%20enquire%20about%20a%20delivery.`, "_blank");
    } else {
      setOpenWhatsAppMenu(!openWhatsAppMenu);
      setOpenCallMenu(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 sm:gap-3"
      aria-label="Quick contact actions"
    >
      {/* Call Us Popover (if multiple phone lines) */}
      {openCallMenu && (
        <div className="absolute bottom-16 right-20 sm:right-28 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 space-y-2 animate-fade-in z-50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="font-bold text-xs text-brand-black block">Telephone Lines</span>
              <span className="text-[10px] text-slate-400">Select a dispatch line to call</span>
            </div>
            <button
              onClick={() => setOpenCallMenu(false)}
              className="text-slate-400 hover:text-brand-black p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {allPhones.map((p, idx) => (
              <a
                key={idx}
                href={`tel:${p.value.replace(/\s+/g, "")}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 group"
              >
                <div>
                  <span className="font-semibold text-xs text-brand-black block group-hover:text-brand-red transition-colors">
                    {p.label}
                  </span>
                  <span className="font-mono text-[11px] text-slate-600 font-medium">
                    {p.value}
                  </span>
                  {p.note && <span className="text-[10px] text-slate-400 block">{p.note}</span>}
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-brand-red group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0">
                  <Phone className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Popover (if multiple WhatsApp lines) */}
      {openWhatsAppMenu && (
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 space-y-2 animate-fade-in z-50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="font-bold text-xs text-brand-black block">WhatsApp Desks</span>
              <span className="text-[10px] text-slate-400">Choose a channel to start chat</span>
            </div>
            <button
              onClick={() => setOpenWhatsAppMenu(false)}
              className="text-slate-400 hover:text-brand-black p-1 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {allWhatsApps.map((w, idx) => {
              const clean = cleanWhatsAppNumber(w.value);
              return (
                <a
                  key={idx}
                  href={`https://wa.me/${clean}?text=Hello%20Go%20Deliver,%20I%20am%20enquiring%20about%20a%20delivery.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/60 transition-colors border border-transparent hover:border-emerald-200 group"
                >
                  <div>
                    <span className="font-semibold text-xs text-brand-black block group-hover:text-emerald-700 transition-colors">
                      {w.label}
                    </span>
                    <span className="font-mono text-[11px] text-slate-600 font-medium">
                      {w.value}
                    </span>
                    {w.note && <span className="text-[10px] text-slate-400 block">{w.note}</span>}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 group-hover:bg-[#25D366] group-hover:text-white flex items-center justify-center text-emerald-700 transition-colors shrink-0">
                    <WhatsAppIcon />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Button 1: Call Us */}
      <button
        type="button"
        onClick={handleCallClick}
        className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#0F1115] hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 border border-slate-700/80 cursor-pointer"
        title="Call Go Deliver dispatch desk"
      >
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">Call Us</span>
        {allPhones.length > 1 && (
          <ChevronUp className={`w-3 h-3 text-slate-400 transition-transform ${openCallMenu ? "rotate-180" : ""}`} />
        )}
      </button>

      {/* Button 2: Floating WhatsApp Button (Next to Call Us) */}
      <button
        type="button"
        onClick={handleWhatsAppClick}
        className="group inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#1EBE55] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        title="Chat with Go Deliver on WhatsApp"
      >
        <WhatsAppIcon />
        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">WhatsApp</span>
        {allWhatsApps.length > 1 && (
          <ChevronUp className={`w-3 h-3 text-white/80 transition-transform ${openWhatsAppMenu ? "rotate-180" : ""}`} />
        )}
      </button>
    </div>
  );
}

export default FloatingContactActions;
