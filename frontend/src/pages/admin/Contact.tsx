import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { ContactInfo, AdditionalContactItem } from "@/types";
import { Card, Input, Button } from "@/components/ui";
import {
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Phone,
  Mail,
  Share2,
  MessageCircle,
  Globe,
  X,
} from "lucide-react";

const standardFields = [
  {
    key: "whatsapp_number",
    label: "Primary WhatsApp Number",
    hint: "Default WhatsApp dispatch number (numbers only)",
    isPhone: true,
  },
  {
    key: "business_phone",
    label: "Primary Business Phone",
    hint: "Default office or hotline telephone (numbers only)",
    isPhone: true,
  },
  {
    key: "business_email",
    label: "Primary Business Email",
    hint: "General dispatch inquiries inbox",
    isPhone: false,
  },
  {
    key: "physical_address",
    label: "Central Hub Address",
    hint: "Main depot or headquarters street address",
    isPhone: false,
  },
  {
    key: "operating_hours",
    label: "Operating Hours",
    hint: "e.g. Monday - Saturday: 07:00 - 19:00",
    isPhone: false,
  },
  {
    key: "facebook_url",
    label: "Facebook Page URL",
    hint: "Primary official Facebook page",
    isPhone: false,
  },
  {
    key: "twitter_url",
    label: "Twitter / X Profile URL",
    hint: "Primary official Twitter / X profile",
    isPhone: false,
  },
  {
    key: "instagram_url",
    label: "Instagram Profile URL",
    hint: "Official Instagram account",
    isPhone: false,
  },
];

const channelTypes = [
  { value: "whatsapp", label: "WhatsApp Number", isPhone: true, icon: MessageCircle },
  { value: "phone", label: "Telephone / Hotline", isPhone: true, icon: Phone },
  { value: "facebook", label: "Facebook Page / Group", isPhone: false, icon: Share2 },
  { value: "instagram", label: "Instagram", isPhone: false, icon: Share2 },
  { value: "twitter", label: "Twitter / X", isPhone: false, icon: Share2 },
  { value: "telegram", label: "Telegram Channel / Group", isPhone: false, icon: MessageCircle },
  { value: "linkedin", label: "LinkedIn Company", isPhone: false, icon: Globe },
  { value: "email", label: "Additional Email Inbox", isPhone: false, icon: Mail },
  { value: "other", label: "Other Link / Service", isPhone: false, icon: Globe },
];

export function AdminContact() {
  const [contacts, setContacts] = useState<ContactInfo>({});
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Additional Contacts (multiple WhatsApps, Facebooks, Phone numbers, etc.)
  const [additionalContacts, setAdditionalContacts] = useState<AdditionalContactItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdditionalContactItem | null>(null);

  const [modalForm, setModalForm] = useState<{
    type: AdditionalContactItem["type"];
    label: string;
    value: string;
    note: string;
  }>({
    type: "whatsapp",
    label: "",
    value: "",
    note: "",
  });
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const r: any = await api.get("/admin/contact");
      const obj: Record<string, string> = {};
      (r.contacts || r.data?.contacts || []).forEach((c: { key: string; value: string }) => {
        obj[c.key] = c.value;
      });
      setContacts(obj);
      setFormValues(obj);

      // Parse additional_contacts JSON
      if (obj.additional_contacts) {
        try {
          const parsed = JSON.parse(obj.additional_contacts);
          if (Array.isArray(parsed)) {
            setAdditionalContacts(parsed);
          }
        } catch {
          setAdditionalContacts([]);
        }
      } else {
        setAdditionalContacts([]);
      }
    } catch {
      setContacts({});
      setAdditionalContacts([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveStandardField(key: string) {
    setMessage(null);
    try {
      await api.post("/admin/contact", { key, value: formValues[key] || "" });
      setEditingKey(null);
      await loadContacts();
      setMessage({ type: "success", text: `Updated ${key.replace(/_/g, " ")} successfully.` });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to update field" });
    }
  }

  async function saveAdditionalContactsList(updatedList: AdditionalContactItem[]) {
    setMessage(null);
    try {
      await api.post("/admin/contact", {
        key: "additional_contacts",
        value: JSON.stringify(updatedList),
      });
      setAdditionalContacts(updatedList);
      setMessage({ type: "success", text: "Contact channels saved and published to the website." });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to save contact channels" });
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setModalForm({
      type: "whatsapp",
      label: "",
      value: "",
      note: "",
    });
    setModalError("");
    setShowAddModal(true);
  }

  function openEditModal(item: AdditionalContactItem) {
    setEditingItem(item);
    setModalForm({
      type: item.type,
      label: item.label,
      value: item.value,
      note: item.note || "",
    });
    setModalError("");
    setShowAddModal(true);
  }

  function handleSaveAdditionalContact(e: React.FormEvent) {
    e.preventDefault();
    setModalError("");

    if (!modalForm.label.trim()) {
      setModalError("Please enter a descriptive label (e.g. 'Emergency WhatsApp' or 'Harare Support')");
      return;
    }
    if (!modalForm.value.trim()) {
      setModalError("Please enter the contact number, address, or URL");
      return;
    }

    const isPhoneType = modalForm.type === "phone" || modalForm.type === "whatsapp";
    if (isPhoneType) {
      // Validate that only numbers and optional leading + are present
      if (!/^\+?[0-9]{5,20}$/.test(modalForm.value.trim())) {
        setModalError("Invalid phone number: only numbers and optional leading + are allowed (no letters or other characters)");
        return;
      }
    }

    let updated: AdditionalContactItem[];
    if (editingItem) {
      updated = additionalContacts.map((c) =>
        c.id === editingItem.id
          ? {
              ...c,
              type: modalForm.type,
              label: modalForm.label.trim(),
              value: modalForm.value.trim(),
              note: modalForm.note.trim() || undefined,
            }
          : c
      );
    } else {
      const newItem: AdditionalContactItem = {
        id: "ac_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        type: modalForm.type,
        label: modalForm.label.trim(),
        value: modalForm.value.trim(),
        note: modalForm.note.trim() || undefined,
        isActive: true,
      };
      updated = [...additionalContacts, newItem];
    }

    setShowAddModal(false);
    saveAdditionalContactsList(updated);
  }

  function handleDeleteAdditionalContact(id: string) {
    if (!window.confirm("Are you sure you want to remove this contact channel?")) return;
    const updated = additionalContacts.filter((c) => c.id !== id);
    saveAdditionalContactsList(updated);
  }

  function handleToggleActive(id: string) {
    const updated = additionalContacts.map((c) =>
      c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c
    );
    saveAdditionalContactsList(updated);
  }

  const selectedTypeConfig = channelTypes.find((t) => t.value === modalForm.type);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red mb-4"></div>
        <span className="text-xs text-slate-500">Loading contact settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-brand-black tracking-tight">Contact Information &amp; Channels</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Configure public telephone lines, WhatsApp dispatch desks, social channels, and floating actions displayed across the website.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 shadow-xs ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* SECTION 1: Multiple Additional Contact Channels */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-0.5">
              Multi-Channel Dispatch
            </div>
            <h2 className="text-lg font-bold text-brand-black">Additional Contact Numbers &amp; Social Links</h2>
            <p className="text-xs text-slate-500">
              Add extra WhatsApp numbers, secondary telephone hotlines, branch numbers, or social media pages.
            </p>
          </div>
          <Button
            onClick={openCreateModal}
            variant="primary"
            className="inline-flex items-center gap-1.5 self-start sm:self-auto text-xs py-2 px-3.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add More Contact Info</span>
          </Button>
        </div>

        {additionalContacts.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">No additional contact info added yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-0.5">
                Have more than one WhatsApp number, a second hotline phone, or multiple Facebook pages? Click below to add them.
              </p>
            </div>
            <Button onClick={openCreateModal} variant="outline" size="sm" className="text-xs">
              + Add First Extra Channel
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalContacts.map((item) => {
              const typeCfg = channelTypes.find((t) => t.value === item.type) || channelTypes[0];
              const IconComp = typeCfg.icon;
              const isActive = item.isActive !== false;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive
                      ? "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                      : "bg-slate-50/80 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          item.type === "whatsapp"
                            ? "bg-[#25D366]/10 text-[#25D366]"
                            : item.type === "phone"
                            ? "bg-blue-50 text-blue-600"
                            : item.type === "facebook"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-xs text-brand-black block truncate max-w-[150px]">
                          {item.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                          {typeCfg.label}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                      title="Click to toggle display on website"
                    >
                      {isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg font-mono text-xs text-slate-800 break-all mb-2">
                    {item.value}
                  </div>

                  {item.note && (
                    <p className="text-[11px] text-slate-500 mb-3 italic">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-500 hover:text-brand-black rounded hover:bg-slate-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAdditionalContact(item.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: Standard Primary Contact Fields */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-brand-black">Primary Dispatch Details</h2>
          <p className="text-xs text-slate-500">
            Main direct channels used in header navigation, footer, and automated WhatsApp booking links.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {standardFields.map((field) => {
            const value = contacts[field.key] || "";
            const isEditing = editingKey === field.key;

            return (
              <Card key={field.key} className="bg-white">
                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <label className="block text-xs font-bold text-brand-black mb-1">
                      {field.label}
                    </label>
                    <p className="text-[11px] text-slate-400 mb-3">{field.hint}</p>

                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          type={field.isPhone ? "tel" : "text"}
                          phoneOnly={field.isPhone}
                          value={formValues[field.key] || ""}
                          placeholder={field.isPhone ? "e.g. +263771234567" : ""}
                          helperText={field.isPhone ? "Numbers only (no letters)" : undefined}
                          onChange={(e) =>
                            setFormValues({ ...formValues, [field.key]: e.target.value })
                          }
                          autoFocus
                        />
                        <div className="flex gap-2 pt-1">
                          <Button
                            onClick={() => saveStandardField(field.key)}
                            variant="primary"
                            size="sm"
                            className="flex-1 text-xs py-1.5"
                          >
                            Save
                          </Button>
                          <Button
                            onClick={() => {
                              setFormValues({ ...formValues, [field.key]: value });
                              setEditingKey(null);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs py-1.5"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="font-mono text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 break-all min-h-[36px] flex items-center">
                          {value || <span className="text-slate-400 italic">Not configured</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <Button
                      onClick={() => setEditingKey(field.key)}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs py-1.5 mt-2"
                    >
                      Edit Field
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* MODAL: Add / Edit Additional Contact */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-brand-black">
                  {editingItem ? "Edit Contact Channel" : "Add More Contact Info"}
                </h3>
                <p className="text-xs text-slate-500">
                  Visible across the website and in the floating action buttons.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-brand-black rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdditionalContact} className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Channel Type
                </label>
                <select
                  value={modalForm.type}
                  onChange={(e) =>
                    setModalForm({
                      ...modalForm,
                      type: e.target.value as AdditionalContactItem["type"],
                    })
                  }
                  className="block w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-brand-black text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red shadow-sm"
                >
                  {channelTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Display Label"
                placeholder="e.g. Harare Sales WhatsApp, Secondary Hotline, Facebook Group"
                value={modalForm.label}
                onChange={(e) => setModalForm({ ...modalForm, label: e.target.value })}
                required
              />

              <Input
                label={
                  selectedTypeConfig?.isPhone
                    ? "Phone / WhatsApp Number (Numbers only)"
                    : "URL / Email / Account Handle"
                }
                type={selectedTypeConfig?.isPhone ? "tel" : "text"}
                phoneOnly={selectedTypeConfig?.isPhone}
                placeholder={
                  selectedTypeConfig?.isPhone
                    ? "e.g. +263779876543 (numbers only)"
                    : "e.g. https://facebook.com/godeliverhq"
                }
                helperText={
                  selectedTypeConfig?.isPhone
                    ? "Strictly numbers only (e.g. +263779876543 or 0779876543)"
                    : undefined
                }
                value={modalForm.value}
                onChange={(e) => setModalForm({ ...modalForm, value: e.target.value })}
                required
              />

              <Input
                label="Optional Availability / Note"
                placeholder="e.g. Available 24/7, Mon-Fri 8am-5pm, Bulawayo Hub"
                value={modalForm.note}
                onChange={(e) => setModalForm({ ...modalForm, note: e.target.value })}
              />

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {editingItem ? "Save Changes" : "Add Channel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContact;
