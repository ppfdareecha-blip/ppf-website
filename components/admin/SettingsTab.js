"use client";

import { useState } from "react";
import { KeyRound, Save } from "lucide-react";

export default function SettingsTab({ admin }) {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Unable to change password.");
        return;
      }

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-vibrant-violet mb-2">Settings</p>
        <h2 className="font-futura text-3xl font-black uppercase text-mono-plum">Admin Security</h2>
        <p className="text-vibrant-charcoal/60 mt-2">{admin?.email || "Signed-in admin"}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-vibrant-gray rounded-3xl p-8 max-w-2xl space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-vibrant-gray">
          <div className="w-11 h-11 bg-vibrant-violet/10 rounded-2xl flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-vibrant-violet" />
          </div>
          <div>
            <h3 className="font-black text-mono-plum uppercase tracking-wider">Change Password</h3>
            <p className="text-sm text-vibrant-charcoal/60">Use your current password before setting a new one.</p>
          </div>
        </div>

        {[
          ["currentPassword", "Current Password"],
          ["newPassword", "New Password"],
          ["confirmPassword", "Confirm New Password"],
        ].map(([field, label]) => (
          <label key={field} className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-vibrant-charcoal/60">{label}</span>
            <input
              type="password"
              value={form[field]}
              onChange={(e) => updateField(field, e.target.value)}
              className="w-full text-black bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl px-5 py-4 outline-none focus:border-vibrant-violet transition-all"
              required
              minLength={field === "currentPassword" ? undefined : 8}
            />
          </label>
        ))}

        {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
        {message && <p className="text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200">{message}</p>}

        <button
          disabled={loading}
          className="inline-flex items-center gap-2 bg-mono-plum text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-vibrant-violet transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Password"}
        </button>
      </form>
    </section>
  );
}
