import { useState, useEffect } from "react";
import { api } from "@/services/api";
import type { Service, ServiceArea, FAQ } from "@/types";
import {
  Hero,
  HowItWorks,
  ServicesSection,
  ServiceAreasSection,
  FAQSection,
  CTASection,
} from "@/components/sections";

export function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/services").then((r) => setServices(r.services || [])),
      api.get("/areas").then((r) => setAreas(r.areas || [])),
      api.get("/faqs").then((r) => setFaqs(r.faqs || [])),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <ServicesSection
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          startingPrice: s.startingPrice,
          icon: TruckIcon,
        }))}
      />
      <ServiceAreasSection
        areas={areas.map((a) => ({
          name: a.name,
          address: a.address,
          operatingHours: a.operatingHours,
          contactPhone: a.contactPhone,
        }))}
      />
      <FAQSection faqs={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
      <CTASection />
    </>
  );
}

function TruckIcon() {
  return null;
}

export default Home;
