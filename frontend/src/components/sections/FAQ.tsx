import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { BUSINESS } from "@/config/business";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  // Allow toggling accordions; default open first one
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [faqs[0]?.id || ""]: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-brand-red mb-2">
            Questions &amp; Support
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-black tracking-tight mb-3">
            Frequently asked questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about dispatch timelines, quotes, item limits, and tracking.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {faqs.length > 0 ? (
            faqs.map((faq) => {
              const isOpen = openIds[faq.id] ?? false;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-slate-300"
                >
                  <button
                    onClick={() => toggle(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible-ring"
                    aria-expanded={isOpen}
                  >
                    <span className="font-bold text-brand-black text-base sm:text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-red-50 text-brand-red" : "text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <HelpCircle className="w-8 h-8 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-500 text-sm">No FAQs available at the moment.</p>
            </div>
          )}
        </div>

        {/* WhatsApp Help prompt */}
        <div className="mt-10 text-center p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-brand-black text-sm">Have a question not listed here?</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Our  team responds promptly on WhatsApp during operating hours.
            </p>
          </div>
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hi,%20I%20have%20a%20question%20about%20Go%20Deliver.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#1EBE55] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-4 h-4"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Ask Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
