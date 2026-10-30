import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { FAQ as FAQType } from "@/types";
import { Card } from "@/components/ui";
import { HelpCircle } from "lucide-react";

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ faqs: FAQType[] }>("/faqs")
      .then((r: any) => setFaqs(r.faqs || r.data?.faqs || []))
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-black">Frequently asked questions</h1>
        <p className="text-brand-grey mt-2">
          Common questions about our delivery service.
        </p>
      </div>
      {faqs.length === 0 ? (
        <div className="text-center py-20">
          <HelpCircle className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <p className="text-slate-500 text-sm">No FAQs available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id}>
              <div className="p-6">
                <h3 className="font-bold text-brand-black mb-2">{faq.question}</h3>
                <p className="text-brand-grey text-sm leading-relaxed">{faq.answer}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default FAQ;
