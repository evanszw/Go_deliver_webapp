import { Link } from "react-router-dom";
import { BUSINESS } from "@/config/business";
import { ArrowRight } from "lucide-react";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-4 h-4"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl bg-[#0F1115] p-8 sm:p-12 md:p-14 text-white text-center border border-slate-800 shadow-xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-red-500">
              Immediate Urban Dispatch
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
              Need cargo or documents dispatched today?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Submit your booking online to generate an instant GD-XXXXXX reference code, or coordinate directly with our active city dispatch desk on WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                to="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-red hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Book a Delivery Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${BUSINESS.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#1EBE55] text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <WhatsAppIcon />
                <span>Chat Dispatch on WhatsApp</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
              <span>Average pickup: 25–40 mins</span>
              <span>·</span>
              <span>Phone: {BUSINESS.businessPhone || "+263 242 700 800"}</span>
              <span>·</span>
              <span>Mon - Sat: 07:00 - 19:00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
