import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
import { Card, Input, Button } from "@/components/ui";
import { User, ShieldCheck, CheckCircle2, AlertCircle, KeyRound } from "lucide-react";

export function AdminSettings() {
  const { user } = useAuth();

  // Username / Name state
  const [name, setName] = useState(user?.name || "");
  const [updatingName, setUpdatingName] = useState(false);
  const [nameMessage, setNameMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameMessage(null);

    if (!name.trim()) {
      setNameMessage({ type: "error", text: "Name cannot be empty." });
      return;
    }

    setUpdatingName(true);
    try {
      const res: any = await api.patch("/auth/profile", { name: name.trim() });
      if (res.success) {
        setNameMessage({ type: "success", text: "Username / Display name updated successfully." });
        setTimeout(() => setNameMessage(null), 4000);
      } else {
        setNameMessage({ type: "error", text: res.error || "Failed to update username." });
      }
    } catch (err: any) {
      setNameMessage({ type: "error", text: err.error || err.message || "Failed to update username." });
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!newPassword) {
      setPasswordMessage({ type: "error", text: "Please enter a new password." });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: "New password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res: any = await api.patch("/auth/profile", {
        currentPassword: currentPassword || undefined,
        newPassword,
      });

      if (res.success) {
        setPasswordMessage({ type: "success", text: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordMessage(null), 5000);
      } else {
        setPasswordMessage({ type: "error", text: res.error || "Failed to change password." });
      }
    } catch (err: any) {
      setPasswordMessage({
        type: "error",
        text: err.error || err.message || "Failed to change password. Please check your current password.",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-brand-black tracking-tight">Admin Account Settings</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Update your administrator username, change your account password, and manage security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Change Username */}
          <Card className="bg-white border-slate-200">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-brand-red flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-brand-black">Change Username / Display Name</h2>
                  <p className="text-xs text-slate-500">This name appears on the dashboard header and dispatch logs.</p>
                </div>
              </div>

              {nameMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    nameMessage.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {nameMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{nameMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdateName} className="space-y-4">
                <Input
                  label="Display Name / Username"
                  placeholder="e.g. Tendai Chikore"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="sm" disabled={updatingName} className="text-xs">
                  {updatingName ? "Saving..." : "Update Username"}
                </Button>
              </form>
            </div>
          </Card>

          {/* Card 2: Change Password */}
          <Card className="bg-white border-slate-200">
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-brand-black">Change Account Password</h2>
                  <p className="text-xs text-slate-500">Ensure your account uses a secure password of 8+ characters.</p>
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                    passwordMessage.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {passwordMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  helperText="Required if your account already has a password set"
                />

                <Input
                  label="New Password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" size="sm" disabled={updatingPassword} className="text-xs">
                  {updatingPassword ? "Updating Password..." : "Change Password"}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Right Column: Account Info & Credentials Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-slate-50 border-slate-200">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Account Profile</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <span className="font-mono font-semibold text-slate-800 break-all">{user?.email || "admin@go-deliver.local"}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">System Role</span>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] mt-0.5">
                    {user?.role || "ADMIN"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Account ID</span>
                  <span className="font-mono text-slate-500 text-[10px] break-all">{user?.id || "admin-session-active"}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1.5">
                <p className="font-medium text-slate-700">Security Recommendation:</p>
                <p>Change your password periodically to protect administrative dispatch controls and private customer records.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
