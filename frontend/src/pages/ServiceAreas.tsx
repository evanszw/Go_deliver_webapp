import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import type { ServiceArea } from "@/types";
import { CoverageMap } from "@/components/CoverageMap";
import { Badge } from "@/components/ui";
import { MapPin, Clock, Phone, ArrowRight, Navigation, ShieldCheck } from "lucide-react";
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

export function ServiceAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/areas")
      .then((r: any) => {
        const fetched = r.areas || r.data?.areas || [];
        setAreas(fetched);
        if (fetched.length > 0) {
          setSelectedAreaId(fetched[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-2">
            Metropolitan Dispatch Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight">
            Service areas &amp; coverage map
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl text-sm sm:text-base">
            Explore our active urban dispatch hubs, operating corridors, and guaranteed delivery zones.
            Select any region to focus the map and see local hub hours.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
          >
            <span>Book Delivery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hi%20Go%20Deliver,%20I%20want%20to%20confirm%20coverage%20for%20my%20area.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE55] text-white font-semibold text-xs rounded-xl transition-colors"
          >
            <WhatsAppIcon />
            <span>Check Area</span>
          </a>
        </div>
      </div>

      {/* Main Visual Map & Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Interactive Leaflet Map (Left Column) */}
        <div className="lg:col-span-7">
          <CoverageMap
            areas={areas}
            selectedAreaId={selectedAreaId}
            onSelectArea={(id) => setSelectedAreaId(id)}
          />

          {/* Quick Metrics Bar below map */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-500 block">Avg Response</span>
              <span className="text-sm font-bold font-mono text-brand-black">15–25 Mins</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-500 block">Fleet Type</span>
              <span className="text-sm font-bold text-brand-black">Bikes &amp; Vans</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-500 block">Dispatch Mode</span>
              <span className="text-sm font-bold text-emerald-600">Live 6 Days/Wk</span>
            </div>
          </div>
        </div>

        {/* Region List & Detail Cards (Right Column) */}
        <div className="lg:col-span-5 space-y-3.5 max-h-[630px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 px-1 mb-1">
            <span>Operating Hubs ({areas.length})</span>
            <span>Click to locate</span>
          </div>

          {areas.map((area, idx) => {
            const isSelected = selectedAreaId === area.id;
            return (
              <div
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 ${
                  isSelected
                    ? "bg-white border-brand-red shadow-md ring-2 ring-brand-red/15"
                    : "bg-white hover:bg-slate-50 border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-brand-red text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-black text-base leading-snug">
                        {area.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">Hub Z0{idx + 1}</span>
                    </div>
                  </div>
                  <Badge variant={area.isActive ? "default" : "black"}>
                    {area.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {area.address && (
                  <p className="text-slate-600 text-xs mb-3 pl-11">{area.address}</p>
                )}

                <div className="pt-3 border-t border-slate-100 pl-11 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                  {area.operatingHours && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{area.operatingHours}</span>
                    </div>
                  )}
                  {area.contactPhone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{area.contactPhone}</span>
                    </div>
                  )}
                </div>

                <div className="pl-11 flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAreaId(area.id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Focus on map</span>
                  </button>

                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-brand-black"
                  >
                    <span>Book pickup ›</span>
                  </Link>
                </div>
              </div>
            );
          })}

          {areas.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No service areas configured yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Out-of-area enquiry banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red">
            <ShieldCheck className="w-4 h-4" />
            <span>Special Transit Available</span>
          </div>
          <h3 className="text-xl font-bold text-white">Need delivery outside these core zones?</h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            We provide custom scheduled courier runs to provincial centers, mining sites, farms, and regional depots upon request.
          </p>
        </div>

        <a
          href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hi%20Go%20Deliver,%20I%20have%20a%20delivery%20destination%20outside%20the%20standard%20hub%20zones.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1EBE55] text-white font-semibold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap shrink-0"
        >
          <WhatsAppIcon />
          <span>Enquire for Custom Route</span>
        </a>
      </div>
    </div>
  );
}

export default ServiceAreas;
