import { Link } from "react-router-dom";
import { Truck, Package, ShoppingBag, Factory, FileText, ArrowRight } from "lucide-react";

type ServiceCard = {
  id: string;
  name: string;
  description: string;
  startingPrice: number | null;
};

const serviceIcons: Record<string, React.ElementType> = {
  "Express Courier & Documents": FileText,
  "Parcel & Document Delivery": Truck,
  "Business Deliveries": Factory,
  "Scheduled Business Logistics": Factory,
  "Food & Retail Deliveries": ShoppingBag,
  "Same-Day Delivery": Package,
  "Same-Day Urban Priority": Package,
  "Secure Fragile & Parcel Freight": Truck,
};

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

export function ServicesSection({ services }: { services: ServiceCard[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-2">
              Capabilities &amp; Fleet
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight">
              Our delivery services
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base">
            Choose the delivery service tuned for your cargo. Every booking receives direct driver dispatch and quote confirmation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.name] || Package;
            return (
              <div
                key={service.id}
                className="group bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-red/30 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  {/* Icon & Index */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-red-50 text-slate-800 group-hover:text-brand-red flex items-center justify-center transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-400 group-hover:text-brand-red transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="font-bold text-brand-black text-lg mb-2 group-hover:text-brand-red transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div>
                  {/* Pricing */}
                  <div className="pt-4 border-t border-slate-100 mb-5 flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-500">Starting rate</span>
                    {service.startingPrice !== null ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-medium text-slate-500">From</span>
                        <span className="text-brand-black font-extrabold text-xl font-mono tabular-nums">
                          ${service.startingPrice}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">USD</span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-500 italic">Quote on request</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/booking"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-red hover:bg-red-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <a
                      href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ""}?text=Hello%20Go%20Deliver,%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(
                        service.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE55] text-white rounded-lg font-semibold text-xs transition-colors"
                    >
                      <WhatsAppIcon />
                      <span>Chat</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">Services are currently loading or updating.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicesSection;
