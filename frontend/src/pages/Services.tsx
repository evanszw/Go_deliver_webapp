import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import type { Service } from "@/types";
import { Card, Badge } from "@/components/ui";
import { ArrowRight, Truck, Package, ShoppingBag, Factory, FileText } from "lucide-react";

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

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/services")
      .then((r) => setServices(r.services || []))
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-2">
          Fleet &amp; Service Portfolio
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight">
          Delivery services
        </h1>
        <p className="text-slate-600 mt-2 max-w-xl text-sm sm:text-base">
          Choose the delivery service that fits your cargo and timeline. All prices and assignments are confirmed before dispatch.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500">No services available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = serviceIcons[service.name] || Package;
            return (
              <Card
                key={service.id}
                padded={false}
                className="hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-slate-200/80"
              >
                <div className="p-6 sm:p-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-red-50 text-brand-red flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant={service.isActive ? "default" : "black"}>
                        {service.isActive ? "Active " : "Inactive"}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-brand-black text-xl mb-2">{service.name}</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <div className="pt-4 border-t border-slate-100 mb-6 flex items-baseline justify-between">
                      <span className="text-xs font-medium text-slate-500">Starting rate</span>
                      {service.startingPrice !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-slate-500">From</span>
                          <span className="text-brand-black font-extrabold text-2xl font-mono tabular-nums">
                            ${service.startingPrice}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">USD</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Custom quote</span>
                      )}
                    </div>

                    <div className="flex gap-2.5">
                      <Link
                        to="/booking"
                        className="flex-1 py-2.5 px-4 bg-brand-red text-white rounded-lg font-semibold text-xs text-center hover:bg-red-700 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
                      >
                        <span>Book now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hello,%20I%20would%20like%20to%20enquire%20about%20${encodeURIComponent(
                          service.name
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE55] text-white rounded-lg font-semibold text-xs text-center transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <WhatsAppIcon />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Services;
