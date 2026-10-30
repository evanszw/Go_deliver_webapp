import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/services/api";
import type { DeliveryRequest } from "@/types";
import { Search, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { BUSINESS } from "@/config/business";

export function Track() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const [reference, setReference] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRef) {
      lookupRequest(initialRef);
    }
  }, [initialRef]);

  async function lookupRequest(ref: string) {
    const trimmed = ref.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const res: any = await api.get(`/requests/${encodeURIComponent(trimmed)}`);
      if (res.success && res.request) {
        setRequest(res.request);
        setSearchParams({ ref: trimmed });
      } else {
        setRequest(null);
        setError("No delivery found with reference number " + trimmed + ". Please verify and try again.");
      }
    } catch (err: any) {
      setRequest(null);
      setError("No delivery found with reference number " + trimmed + ". Please check the format (e.g. GD-849201).");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    lookupRequest(reference);
  }

  const getStatusStep = (status?: string) => {
    switch (status) {
      case "NEW":
        return 1;
      case "ACCEPTED":
        return 2;
      case "IN_TRANSIT":
        return 3;
      case "COMPLETED":
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = getStatusStep(request?.status);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-1">
            Dispatch Operations
          </div>
          <h1 className="text-3xl font-extrabold text-brand-black tracking-tight">
            Track Delivery Request
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Enter your Go Deliver reference number to inspect live status and dispatch updates.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter reference (e.g., GD-849201)"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-transparent border-0 focus:ring-0 text-brand-black placeholder-slate-400 font-mono font-medium focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !reference.trim()}
            className="px-6 py-2.5 bg-brand-red hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0"
          >
            {loading ? "Searching..." : "Track Shipment"}
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Results Card */}
        {request && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top Bar */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reference Code
                </span>
                <div className="text-xl font-bold font-mono text-brand-black">
                  {request.referenceNumber}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Status:</span>
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-brand-black text-white">
                  {request.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="p-6 border-b border-slate-100">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
                Transit Milestones
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { step: 1, label: "Request Logged", desc: "Order recorded" },
                  { step: 2, label: "Accepted", desc: "Driver assigned" },
                  { step: 3, label: "In Transit", desc: "Out for delivery" },
                  { step: 4, label: "Completed", desc: "Signed & delivered" },
                ].map((item) => {
                  const done = currentStep >= item.step;
                  const active = currentStep === item.step;
                  return (
                    <div key={item.step} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 ${
                          done
                            ? "bg-brand-red text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {done ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                      </div>
                      <span className={`text-xs font-semibold ${active ? "text-brand-black" : "text-slate-600"}`}>
                        {item.label}
                      </span>
                      <span className="hidden sm:block text-[11px] text-slate-400 mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Specifications */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span>Pickup Location</span>
                  </div>
                  <p className="text-sm font-medium text-brand-black">
                    {request.pickupAddress}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Customer: {request.customerName} ({request.customerPhone})
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    <MapPin className="w-4 h-4 text-brand-red" />
                    <span>Destination</span>
                  </div>
                  <p className="text-sm font-medium text-brand-black">
                    {request.deliveryDestination}
                  </p>
                  {request.recipientName && (
                    <p className="text-xs text-slate-500 mt-1">
                      Recipient: {request.recipientName} {request.recipientPhone ? `(${request.recipientPhone})` : ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Package & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Service Type</span>
                  <span className="font-semibold text-brand-black">
                    {request.service?.name || "Standard Urban Courier"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Cargo Item</span>
                  <span className="font-medium text-slate-700">
                    {request.itemDescription || "General parcel"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Requested Time</span>
                  <span className="font-mono text-slate-700 text-xs">
                    {request.preferredDateTime
                      ? new Date(request.preferredDateTime).toLocaleString()
                      : "Immediate Dispatch"}
                  </span>
                </div>
              </div>

              {request.internalNotes && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                  <span className="font-bold">Dispatch Note: </span>
                  {request.internalNotes}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`https://wa.me/${BUSINESS.whatsappNumber}?text=Hello%20Go%20Deliver,%20checking%20status%20for%20reference%20${request.referenceNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE55] text-white font-semibold text-xs rounded-lg transition-colors w-full sm:w-auto"
              >
                <span>Chat Dispatch on WhatsApp</span>
              </a>
              <Link
                to="/booking"
                className="text-xs font-semibold text-brand-black hover:text-brand-red transition-colors inline-flex items-center gap-1"
              >
                <span>Book Another Delivery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Quick Help */}
        {!request && !loading && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-black text-base">Looking for your reference code?</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              When you book a delivery through Go Deliver, an immediate GD-XXXXXX reference number is generated on screen and sent to dispatch. If you need assistance finding your reference code, contact our support team.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-600">
              <span>Support phone: {BUSINESS.businessPhone || "+263 242 700 800"}</span>
              <span>·</span>
              <span>Email: {BUSINESS.businessEmail || "dispatch@go-deliver.local"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Track;
