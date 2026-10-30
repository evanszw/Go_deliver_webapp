import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { Button, Input, Textarea, Select } from "@/components/ui";
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Search } from "lucide-react";
import type { Service } from "@/types";
import { BUSINESS } from "@/config/business";

type FormData = {
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryDestination: string;
  recipientName: string;
  recipientPhone: string;
  serviceId: string;
  itemDescription: string;
  additionalInstructions: string;
  preferredDateTime: string;
};

const STEPS = [
  { id: "details", label: "01. Sender Details" },
  { id: "delivery", label: "02. Delivery Route" },
  { id: "review", label: "03. Review & Submit" },
];

export function Booking() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<FormData>({
    customerName: "",
    customerPhone: "",
    pickupAddress: "",
    deliveryDestination: "",
    recipientName: "",
    recipientPhone: "",
    serviceId: "",
    itemDescription: "",
    additionalInstructions: "",
    preferredDateTime: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [reference, setReference] = useState("");

  useEffect(() => {
    api
      .get<{ services: Service[] }>("/services")
      .then((r: any) => setServices(r.services || []))
      .catch(() => {});
  }, []);

  const activeService = services.find((s) => s.id === form.serviceId);

  const setField = (k: keyof FormData, v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.customerName.trim()) e.customerName = "Name is required";
      if (!form.customerPhone.trim()) {
        e.customerPhone = "Phone number is required";
      } else if (!/^\+?[0-9]{5,20}$/.test(form.customerPhone.trim())) {
        e.customerPhone = "Phone number must contain only numbers (digits and optional leading +)";
      }
    }
    if (s === 1) {
      if (!form.pickupAddress.trim()) e.pickupAddress = "Pickup location is required";
      if (!form.deliveryDestination.trim()) e.deliveryDestination = "Delivery destination is required";
      if (!form.serviceId) e.serviceId = "Please select a delivery service";
      if (!form.itemDescription.trim()) e.itemDescription = "Please describe the cargo or document";
      if (form.recipientPhone.trim() && !/^\+?[0-9]{5,20}$/.test(form.recipientPhone.trim())) {
        e.recipientPhone = "Recipient phone must contain only numbers";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const goPrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(0) || !validateStep(1)) {
      setStep(0);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const res: any = await api.post("/requests", {
        customerName: form.customerName.trim(),
        customerPhone: form.customerPhone.trim(),
        pickupAddress: form.pickupAddress.trim(),
        deliveryDestination: form.deliveryDestination.trim(),
        recipientName: form.recipientName.trim() || undefined,
        recipientPhone: form.recipientPhone.trim() || undefined,
        serviceId: form.serviceId || undefined,
        itemDescription: form.itemDescription.trim() || undefined,
        additionalInstructions: form.additionalInstructions.trim() || undefined,
        preferredDateTime: form.preferredDateTime || undefined,
      });

      const genRef = res.request?.referenceNumber || res.data?.request?.referenceNumber || res.referenceNumber;
      if (genRef) {
        setReference(genRef);
        setSubmitStatus("success");
      } else {
        throw new Error("No reference returned from server");
      }
    } catch (err: any) {
      setSubmitStatus("error");
      const msg = err.error || err.message || "Failed to submit request. Please try again.";
      setErrors({ _submit: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {submitStatus === "success" ? (
          <SuccessScreen reference={reference} form={form} serviceName={activeService?.name} />
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-1">
                Booking Portal
              </div>
              <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">
                Book a Delivery
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                Enter your pickup and destination details. A dispatch reference number will be generated immediately.
              </p>
            </div>

            {/* Clean Progress Indicator (No pills, quiet editorial dividers) */}
            <div className="grid grid-cols-3 gap-2 border-b border-slate-200 pb-4">
              {STEPS.map((s, i) => {
                const isActive = i === step;
                const isPast = i < step;
                return (
                  <div
                    key={s.id}
                    className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                      isActive
                        ? "border-brand-red text-brand-black"
                        : isPast
                        ? "border-slate-800 text-slate-800"
                        : "border-transparent text-slate-400"
                    }`}
                  >
                    {s.label}
                  </div>
                );
              })}
            </div>

            {/* Step Card Form */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              {step === 0 && (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    goNext();
                  }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-brand-black text-lg">Sender Contact Details</h2>
                  <Input
                    label="Full Name or Business Name"
                    placeholder="e.g. Tendai Chikore"
                    value={form.customerName}
                    onChange={(e) => setField("customerName", e.target.value)}
                    error={errors.customerName}
                    required
                  />
                  <Input
                    label="Direct Phone Number"
                    type="tel"
                    phoneOnly
                    placeholder="e.g. +263771234567"
                    helperText="Numbers only (no letters or symbols)"
                    value={form.customerPhone}
                    onChange={(e) => setField("customerPhone", e.target.value)}
                    error={errors.customerPhone}
                    required
                  />
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" variant="primary" className="w-full sm:w-auto">
                      <span>Continue to Route Details</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </form>
              )}

              {step === 1 && (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    goNext();
                  }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-brand-black text-lg">Delivery details &amp; cargo route</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Pickup Address"
                      placeholder="e.g. 14 George Silundika Ave, CBD"
                      value={form.pickupAddress}
                      onChange={(e) => setField("pickupAddress", e.target.value)}
                      error={errors.pickupAddress}
                      required
                    />
                    <Input
                      label="Delivery Destination"
                      placeholder="e.g. Borrowdale Village, Stand 4"
                      value={form.deliveryDestination}
                      onChange={(e) => setField("deliveryDestination", e.target.value)}
                      error={errors.deliveryDestination}
                      required
                    />
                  </div>

                  <Select
                    label="Service Tier"
                    value={form.serviceId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setField("serviceId", e.target.value)}
                    error={errors.serviceId}
                    required
                  >
                    <option value="">Select a service category</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.startingPrice ? `(from $${s.startingPrice} USD)` : ""}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="Cargo Description"
                    placeholder="e.g. Sealed tender contract envelope (0.5 kg)"
                    value={form.itemDescription}
                    onChange={(e) => setField("itemDescription", e.target.value)}
                    error={errors.itemDescription}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Recipient Name (Optional)"
                      placeholder="e.g. Memory Sithole"
                      value={form.recipientName}
                      onChange={(e) => setField("recipientName", e.target.value)}
                    />
                    <Input
                      label="Recipient Phone (Optional)"
                      type="tel"
                      phoneOnly
                      placeholder="e.g. +263712345678"
                      helperText="Numbers only"
                      value={form.recipientPhone}
                      onChange={(e) => setField("recipientPhone", e.target.value)}
                      error={errors.recipientPhone}
                    />
                  </div>

                  <Textarea
                    label="Handling Instructions (Optional)"
                    placeholder="e.g. Hand directly to front reception desk on 3rd floor."
                    value={form.additionalInstructions}
                    onChange={(e) => setField("additionalInstructions", e.target.value)}
                  />

                  <Input
                    label="Preferred Date / Time (Optional)"
                    type="datetime-local"
                    value={form.preferredDateTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("preferredDateTime", e.target.value)}
                  />

                  <div className="pt-4 flex items-center justify-between gap-3">
                    <Button type="button" variant="outline" onClick={goPrev}>
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back</span>
                    </Button>
                    <Button type="submit" variant="primary">
                      <span>Review Details</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-bold text-brand-black text-lg">Review Dispatch Summary</h2>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-sm">
                    <ReviewRow label="Sender Name" value={form.customerName} />
                    <ReviewRow label="Sender Phone" value={form.customerPhone} />
                    <ReviewRow label="Service Selected" value={activeService?.name || "Standard Courier"} />
                    <ReviewRow label="Pickup Address" value={form.pickupAddress} />
                    <ReviewRow label="Destination" value={form.deliveryDestination} />
                    {form.recipientName && <ReviewRow label="Recipient" value={form.recipientName} />}
                    {form.recipientPhone && <ReviewRow label="Recipient Phone" value={form.recipientPhone} />}
                    <ReviewRow label="Item Description" value={form.itemDescription} />
                    {form.additionalInstructions && (
                      <ReviewRow label="Instructions" value={form.additionalInstructions} />
                    )}
                    {form.preferredDateTime && (
                      <ReviewRow label="Requested Time" value={new Date(form.preferredDateTime).toLocaleString()} />
                    )}
                  </div>

                  <div className="p-4 bg-slate-100/70 rounded-xl text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800">Dispatch Terms: </span>
                    <span>Submission logs your request directly into the urban dispatcher system. You will receive an immediate GD-XXXXXX reference number. Final rates and vehicle assignment are confirmed before dispatch.</span>
                  </div>

                  {errors._submit && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors._submit}</span>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Button type="button" variant="outline" onClick={goPrev} className="sm:w-1/3">
                      <ArrowLeft className="w-4 h-4 mr-1.5" />
                      <span>Back</span>
                    </Button>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      variant="primary"
                      disabled={submitting}
                      className="sm:w-2/3"
                    >
                      {submitting ? "Submitting Dispatch..." : "Confirm & Submit Request"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-1.5 border-b border-slate-200/60 last:border-0">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-xs font-semibold text-brand-black text-right">{value}</span>
    </div>
  );
}

function SuccessScreen({
  reference,
  form,
  serviceName,
}: {
  reference: string;
  form: FormData;
  serviceName?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-brand-black">Delivery Request Received</h2>
        <p className="text-slate-600 text-sm mt-1">
          Thank you, {form.customerName}. Your booking has been dispatched to our operations queue.
        </p>
      </div>

      {/* Prominent Reference Box */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
          Your Reference Code
        </span>
        <div className="text-2xl font-black font-mono tracking-tight text-brand-black">
          {reference}
        </div>
        <span className="text-[11px] text-slate-400 mt-1 block">
          Quote this code with dispatch or in tracking
        </span>
      </div>

      {/* Summary details */}
      <div className="text-left text-xs text-slate-600 bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 max-w-md mx-auto space-y-2">
        <div><span className="font-semibold text-slate-800">Route: </span>{form.pickupAddress} → {form.deliveryDestination}</div>
        <div><span className="font-semibold text-slate-800">Service: </span>{serviceName || "Standard Courier"}</div>
        <div><span className="font-semibold text-slate-800">Cargo: </span>{form.itemDescription}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to={`/track?ref=${encodeURIComponent(reference)}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-brand-black text-white hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Track Live Status</span>
        </Link>

        <a
          href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hello%20Go%20Deliver,%20confirming%20my%20delivery%20booking%20reference%20${reference}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#25D366] hover:bg-[#1EBE55] text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <span>Chat Dispatch on WhatsApp</span>
        </a>
      </div>

      <div className="pt-2">
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-slate-500 hover:text-brand-red font-medium transition-colors"
        >
          Submit another request
        </button>
      </div>
    </div>
  );
}

export default Booking;
