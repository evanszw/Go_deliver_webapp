import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input, Card } from "@/components/ui";
import { AlertCircle, ArrowLeft } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "admin@go-deliver.local", password: "ChangeMe123!" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err?.error || err?.response?.data?.error || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light-bg px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-black transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
            <span className="text-[11px] font-mono font-medium text-slate-400">Portal</span>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <img
              src="/logo.jpg"
              alt="Go Deliver Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-xs border border-slate-200"
            />
            <span className="font-bold text-xl text-brand-black tracking-tight">Go Deliver</span>
          </div>

          <h2 className="text-2xl font-bold text-brand-black mb-1">Staff sign in</h2>
          <p className="text-brand-grey text-sm mb-6">Admin dashboard and courier dispatch access</p>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="admin@go-deliver.local"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <Button type="submit" variant="primary" disabled={submitting} className="w-full py-3">
              {submitting ? "Signing in..." : "Sign in to Dashboard"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Default Staff Credentials (Demo / Preview):</p>
            <p className="font-mono text-[11px] text-slate-600">Email: admin@go-deliver.local</p>
            <p className="font-mono text-[11px] text-slate-600">Password: ChangeMe123!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Login;
