import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ServiceArea } from "@/types";
import { Card, Badge, Input, Button } from "@/components/ui";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AdminAreas() {
  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    operatingHours: "",
    contactPhone: "",
    isActive: true,
    sortOrder: 0,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadAreas();
  }, []);

  async function loadAreas() {
    try {
      const r: any = await api.get("/admin/areas");
      setAreas(r.areas || r.data?.areas || []);
    } catch {
      setAreas([]);
    } finally {
      setLoading(false);
    }
  }

  async function createArea() {
    setMessage(null);
    if (!form.name) {
      setMessage({ type: "error", text: "Area name is required" });
      return;
    }
    try {
      await api.post("/admin/areas", {
        name: form.name,
        address: form.address || undefined,
        operatingHours: form.operatingHours || undefined,
        contactPhone: form.contactPhone || undefined,
        isActive: form.isActive,
        sortOrder: form.sortOrder,
      });
      setCreating(false);
      setForm({ name: "", address: "", operatingHours: "", contactPhone: "", isActive: true, sortOrder: 0 });
      await loadAreas();
      setMessage({ type: "success", text: "Service area created." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to create area" });
    }
  }

  async function toggleArea(id: string, isActive: boolean) {
    try {
      await api.patch(`/admin/areas/${id}`, { isActive: !isActive });
      await loadAreas();
    } catch {
      setMessage({ type: "error", text: "Failed to update area" });
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-black">Service areas</h1>
        <Button
          onClick={() => setCreating(!creating)}
          variant="primary"
          className="flex items-center gap-2"
        >
          {creating ? "Cancel" : "Add area"}
        </Button>
      </div>

      {creating && (
        <Card>
          <div className="p-6">
            <h3 className="font-bold text-brand-black mb-4">Add new service area</h3>
            <form onSubmit={(e) => { e.preventDefault(); createArea(); }} className="space-y-4">
              <Input
                label="Area / branch name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Address (optional)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <Input
                label="Operating hours (optional)"
                value={form.operatingHours}
                onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
              />
              <Input
                label="Contact phone (optional)"
                type="tel"
                phoneOnly
                placeholder="e.g. +263771234567"
                helperText="Numbers only, no letters allowed"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-brand-black text-brand-red focus:ring-brand-red"
                />
                <label className="text-sm text-brand-black">Active</label>
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  Create area
                </Button>
                <Button type="button" variant="outline" onClick={() => setCreating(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </Card>
      )}

      {message && (
        <div className={`p-4 rounded-md ${
          message.type === "success" ? "bg-green-50 border border-green-100 text-green-700" : "bg-red-50 border border-red-100 text-red-700"
        }`}>
          {message.type === "success" ? <CheckCircle className="w-4 h-4 mr-2 inline" /> : <AlertCircle className="w-4 h-4 mr-2 inline" />}
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-brand-black/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-black/10 bg-brand-light-bg">
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Area</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Address</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Status</th>
              <th className="px-4 py-3 text-right text-brand-grey font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-brand-black">{a.name}</td>
                <td className="px-4 py-3 text-brand-grey text-sm">{a.address || "—"}</td>
                <td className="px-4 py-3">
                  <Badge variant={a.isActive ? "default" : "black"}>
                    {a.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleArea(a.id, a.isActive)}
                    className="text-xs"
                  >
                    {a.isActive ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
            {areas.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-grey">
                  No service areas configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAreas;
