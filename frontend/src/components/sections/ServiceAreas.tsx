import { MapPin, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";

type AreaItem = {
  name: string;
  address?: string | null;
  operatingHours?: string | null;
  contactPhone?: string | null;
};

export function ServiceAreasSection({ areas }: { areas: AreaItem[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0F1115] text-white relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-2">
              Urban Coverage &amp; Depots
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Service areas &amp; regional hubs
            </h2>
          </div>
          <Link
            to="/service-areas"
            className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4"
          >
            View all coverage details &amp; depots ›
          </Link>
        </div>

        {/* Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <div
              key={area.name || index}
              className="bg-slate-900/80 hover:bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 text-brand-red flex items-center justify-center border border-red-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Active Hub
                  </span>
                </div>

                <h3 className="font-bold text-white text-lg mb-2">{area.name}</h3>

                {area.address ? (
                  <p className="text-slate-400 text-xs mb-3 line-clamp-2">{area.address}</p>
                ) : (
                  <p className="text-slate-400 text-xs mb-3">Daily courier dispatch &amp; pickups</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
                {area.operatingHours && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{area.operatingHours}</span>
                  </div>
                )}
                {area.contactPhone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{area.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {areas.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-slate-400 text-sm">Service areas are currently being updated.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ServiceAreasSection;
