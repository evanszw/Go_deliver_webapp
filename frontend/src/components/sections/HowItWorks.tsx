import { FileText, MapPin, CheckCircle2, Send, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    step: "01",
    title: "Select your service",
    description: "Choose between express legal couriers, scheduled shop logistics, fragile parcels, or same-day priority.",
    icon: FileText,
  },
  {
    step: "02",
    title: "Provide route & cargo details",
    description: "Input the pickup address, destination depot or residence, recipient phone, and cargo notes.",
    icon: MapPin,
  },
  {
    step: "03",
    title: "Instant GD Reference Code",
    description: "Submit online to generate an instant GD-XXXXXX booking reference code logged directly in dispatch.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "Live driver confirmation",
    description: "Dispatch confirms the route, assigns the nearest motorcycle or van unit, and completes delivery.",
    icon: Send,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-2">
            Seamless Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight mb-4">
            How Go Deliver works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From booking to doorstep signature in four simple, transparent steps.
          </p>
        </div>

        {/* Step cards with interactive hover and responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-slate-50/70 hover:bg-white rounded-2xl p-7 border border-slate-200/80 hover:border-brand-red/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-red-50 text-brand-black group-hover:text-brand-red flex items-center justify-center border border-slate-200/70 shadow-sm transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black font-mono text-slate-300 group-hover:text-brand-red/60 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-brand-black text-lg mb-2.5 group-hover:text-brand-red transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center text-xs font-semibold text-brand-red gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Step {index + 1} of 4</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA helper */}
        <div className="mt-12 text-center">
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-black hover:text-brand-red transition-colors"
          >
            <span>Have an urgent shipment right now?</span>
            <span className="underline underline-offset-4 text-brand-red">Create booking form ›</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
