import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import type { DeliveryRequest } from "@/types";
import { Card, Textarea, Button } from "@/components/ui";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AdminRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<DeliveryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/admin/requests/${id}`)
      .then((r: any) => {
        const req = r.request || r.data?.request;
        if (req) {
          setRequest(req);
          setStatus(req.status);
          setNotes(req.internalNotes || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.patch(`/admin/requests/${id}`, { status, internalNotes: notes || undefined });
      setRequest((prev) => (prev ? { ...prev, status, internalNotes: notes } : prev));
      setMessage({ type: "success", text: "Request updated successfully." });
      setTimeout(() => setMessage(null), 4000);
    } catch {
      setMessage({ type: "error", text: "Failed to update request." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-10 h-10 mx-auto mb-3 text-brand-red" />
        <h2 className="font-bold text-brand-black">Request not found</h2>
        <Button onClick={() => navigate("/admin/requests")} variant="outline" className="mt-4">
          Back to requests
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/admin/requests" className="text-brand-grey text-sm hover:text-brand-black">&larr; Back to requests</Link>
        <span className="text-xs font-medium bg-brand-light-bg text-brand-black px-3 py-1 rounded-full border border-brand-black/10">
          {request.referenceNumber}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="font-bold text-brand-black text-lg mb-4">Customer details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Name</span>
                <span className="text-brand-black">{request.customerName}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Phone</span>
                <span className="text-brand-black">{request.customerPhone}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Service</span>
                <span className="text-brand-black">{request.service?.name || "Not selected"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Recipient</span>
                <span className="text-brand-black">{request.recipientName || "—"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Recipient phone</span>
                <span className="text-brand-black">{request.recipientPhone || "—"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="font-bold text-brand-black text-lg mb-4">Delivery details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Pickup</span>
                <span className="text-brand-black">{request.pickupAddress}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Destination</span>
                <span className="text-brand-black">{request.deliveryDestination}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Item</span>
                <span className="text-brand-black">{request.itemDescription || "—"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Instructions</span>
                <span className="text-brand-black">{request.additionalInstructions || "—"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-grey text-sm w-20">Preferred time</span>
                <span className="text-brand-black">{request.preferredDateTime || "—"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="font-bold text-brand-black text-lg mb-4">Manage request</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-brand-black/20 rounded-md bg-white text-brand-black focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="NEW">New</option>
                  <option value="REVIEWED">Reviewed</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Internal notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="primary"
                className="w-full"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === "success" ? "bg-green-50 border border-green-100 text-green-700" : "bg-red-50 border border-red-100 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-4 h-4 mr-2 inline" /> : <AlertCircle className="w-4 h-4 mr-2 inline" />}
          {message.text}
        </div>
      )}
    </div>
  );
}

export default AdminRequestDetail;
