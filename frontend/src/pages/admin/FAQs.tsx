import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { FAQ } from "@/types";
import { Card, Badge, Input, Textarea, Button } from "@/components/ui";
import { AlertCircle, CheckCircle } from "lucide-react";

export function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    sortOrder: 0,
    isActive: true,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  async function loadFaqs() {
    try {
      const r: any = await api.get("/admin/faqs");
      setFaqs(r.faqs || r.data?.faqs || []);
    } catch {
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  }

  async function createFaq() {
    setMessage(null);
    if (!form.question || !form.answer) {
      setMessage({ type: "error", text: "Question and answer are required" });
      return;
    }
    try {
      await api.post("/admin/faqs", {
        question: form.question,
        answer: form.answer,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });
      setCreating(false);
      setForm({ question: "", answer: "", sortOrder: 0, isActive: true });
      await loadFaqs();
      setMessage({ type: "success", text: "FAQ created." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to create FAQ" });
    }
  }

  async function toggleFaq(id: string, isActive: boolean) {
    try {
      await api.patch(`/admin/faqs/${id}`, { isActive: !isActive });
      await loadFaqs();
    } catch {
      setMessage({ type: "error", text: "Failed to update FAQ" });
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
        <h1 className="text-2xl font-bold text-brand-black">FAQs</h1>
        <Button
          onClick={() => setCreating(!creating)}
          variant="primary"
          className="flex items-center gap-2"
        >
          {creating ? "Cancel" : "Add FAQ"}
        </Button>
      </div>

      {creating && (
        <Card>
          <div className="p-6">
            <h3 className="font-bold text-brand-black mb-4">Add new FAQ</h3>
            <form onSubmit={(e) => { e.preventDefault(); createFaq(); }} className="space-y-4">
              <Input
                label="Question"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                required
              />
              <Textarea
                label="Answer"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                required
                rows={3}
              />
              <Input
                label="Display sort order (numbers only)"
                type="number"
                numericOnly
                placeholder="0"
                helperText="Numbers only"
                value={form.sortOrder === 0 ? "" : String(form.sortOrder)}
                onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })}
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
                  Create FAQ
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
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Question</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Answer</th>
              <th className="px-4 py-3 text-left text-brand-grey font-medium">Status</th>
              <th className="px-4 py-3 text-right text-brand-grey font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((f) => (
              <tr key={f.id} className="border-b border-brand-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-brand-black">{f.question}</td>
                <td className="px-4 py-3 text-brand-grey text-sm line-clamp-1">{f.answer}</td>
                <td className="px-4 py-3">
                  <Badge variant={f.isActive ? "default" : "black"}>
                    {f.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFaq(f.id, f.isActive)}
                    className="text-xs"
                  >
                    {f.isActive ? "Disable" : "Enable"}
                  </Button>
                </td>
              </tr>
            ))}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-brand-grey">
                  No FAQs configured.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminFAQs;
