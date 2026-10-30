import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { BUSINESS } from "@/config/business";

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

export function Hero() {
  const [quickRef, setQuickRef] = useState("");
  const navigate = useNavigate();

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      navigate(`/track?ref=${encodeURIComponent(quickRef.trim())}`);
    }
  };

  return (
    <section className="relative bg-[#0F1115] text-white overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Proposition and Core Action */}
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500">
              <span>Urban Logistics &amp; Courier Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Point-to-point urban courier. Rapid citywide dispatch.
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Go Deliver connects businesses, merchants, and individuals with professional urban courier dispatch. From urgent legal documents and vital spare parts to parcel freight and scheduled retail fulfillment.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-red hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <span>Book a Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${BUSINESS.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#1EBE55] text-white font-semibold text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm"
              >
                <WhatsAppIcon />
                <span>Chat Dispatch on WhatsApp</span>
              </a>
            </div>

            {/* Quick Track Input Bar */}
            <div className="pt-2 max-w-lg">
              <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Track Existing Delivery
              </div>
              <form onSubmit={handleQuickTrack} className="flex gap-2 p-1.5 bg-slate-900 border border-slate-700/80 rounded-lg">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter reference (e.g. GD-849201)"
                    value={quickRef}
                    onChange={(e) => setQuickRef(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 bg-transparent text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!quickRef.trim()}
                  className="px-4 py-2 bg-white text-brand-black hover:bg-slate-200 text-xs font-semibold rounded transition-colors disabled:opacity-40 disabled:pointer-events-none shrink-0"
                >
                  Track
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Fleet Photograph & Verified Specifications */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
              <img
                src="/images/courier-motorcycle.jpg"
                alt="Go Deliver urban motorcycle courier on commercial dispatch"
                className="w-full h-80 sm:h-96 object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
