import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { Service } from "@/types";
import { Card, Badge, Input, Textarea, Button } from "@/components/ui";
import { AlertCircle, CheckCircle, Plus } from "lucide-react";

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startingPrice: "",
    isActive: true,
    sortOrder: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const r: any = await api.get("/admin/services");
      setServices(r.services || r.data?.services || []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function createService() {
    setErrors({});
    setMessage(null);
    if (!form.name || !form.description) {
      setErrors({ _form: "Name and description are required" });
      return;
    }
    try {
      await api.post("/admin/services", {
        name: form.name,
        description: form.description,
        startingPrice: form.startingPrice ? parseInt(form.startingPrice, 10) : null,
        isActive: form.isActive,
        sortOrder: form.sortOrder,
      });
      setCreating(false);
      setForm({ name: "", description: "", startingPrice: "", isActive: true, sortOrder: 0 });
      await loadServices();
      setMessage({ type: "success", text: "Service created." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to create service" });
    }
  }

  async function toggleService(id: string, isActive: boolean) {
    try {
      await api.patch(`/admin/services/${id}`, { isActive: !isActive });
      await loadServices();
    } catch {
      setMessage({ type: "error", text: "Failed to update service" });
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
        <h1 className="text-2xl font-bold text-brand-black">Service catalogue</h1>
        <Button
          onClick={() => setCreating(!creating)}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {creating ? "Cancel" : "Add service"}
        </Button>
      </div>

      {creating && (
        <Card>
          <div className="p-6">
            <h3 className="font-bold text-brand-black mb-4">Add new service</h3>
            <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); createService(); }} className="space-y-4">
              <Input
                label="Service name"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                required
              />
              <Textarea
                label="Description"
                value={form.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
                error={errors.description}
                required
                rows={3}
              />
              <Input
                label="Starting price (numbers only, no currency or letters)"
                type="number"
                numericOnly
                placeholder="e.g. 15"
                helperText="Numbers only, no letters or symbols allowed"
                value={form.startingPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, startingPrice: e.target.value })}
              />
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-brand-black text-brand-red focus:ring-brand-red"
                />
                <label className="text-sm text-brand-black">Active</label>
              </div>
              {errors._form && (
                <p className="text-sm text-red-600">{errors._form}</p>
              )}
              <div className="flex gap-3 mt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  Create service
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
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Service</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Price</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Status</th>
              <th className="px-4 py-3 text-right text-brand-grey font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-medium text-brand-black">{s.name}</div>
                  <div className="text-xs text-brand-grey">{s.description}</div>
                </td>
                <td className="px-4 py-3">
                  {s.startingPrice !== null ? `From ${s.startingPrice}` : "Contact for quote"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={s.isActive ? "default" : "black"}>
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleService(s.id, s.isActive)}
                    className="text-xs"
                  >
                    {s.isActive ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-grey">
                  No services configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminServices;
