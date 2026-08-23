"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";

// Export context so child pages (like Settings) can access admin info
export const AdminContext = createContext(null);

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetForm, setResetForm] = useState({ email: "", masterResetKey: "", newPassword: "" });
  const [show, setShow] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.admin);
      } else {
        setError(data.error || "Incorrect email or password. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetForm),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setEmail(resetForm.email);
      setPassword("");
      setResetForm({ email: "", masterResetKey: "", newPassword: "" });
      setShowReset(false);
      setMessage("Password reset successfully. Please sign in with the new password.");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mono-plum flex items-center justify-center p-6 font-sans">
      <div className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl border-2 border-white/20">
        <div className="bg-vibrant-violet p-10 text-center">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Lock className="w-10 h-10 text-vibrant-violet" />
          </div>
          <h1 className="text-white font-futura text-2xl font-black uppercase tracking-widest">Admin Login</h1>
        </div>
        <form onSubmit={showReset ? handleReset : handle} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-mono-plum uppercase tracking-wider block">Email</label>
            <input
              type="email"
              className="w-full text-black bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl px-6 py-4 outline-none focus:border-vibrant-violet transition-all text-lg"
              value={showReset ? resetForm.email : email}
              onChange={(e) => {
                const value = e.target.value;
                if (showReset) setResetForm((prev) => ({ ...prev, email: value }));
                else setEmail(value);
              }}
              placeholder="admin@ppf.org"
              autoComplete="email"
              required
            />
          </div>

          {showReset && (
            <div className="space-y-2">
              <label className="text-sm text-mono-plum uppercase tracking-wider block">Master Reset Key</label>
              <input
                type="password"
                className="w-full text-black bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl px-6 py-4 outline-none focus:border-vibrant-violet transition-all text-lg"
                value={resetForm.masterResetKey}
                onChange={(e) => setResetForm((prev) => ({ ...prev, masterResetKey: e.target.value }))}
                placeholder="Enter reset key"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-mono-plum uppercase tracking-wider block">{showReset ? "New Password" : "Password"}</label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                className="w-full text-black bg-vibrant-offwhite border-2 border-vibrant-gray rounded-2xl px-6 py-4 outline-none focus:border-vibrant-violet transition-all text-lg"
                value={showReset ? resetForm.newPassword : password}
                onChange={(e) => {
                  const value = e.target.value;
                  if (showReset) setResetForm((prev) => ({ ...prev, newPassword: value }));
                  else setPassword(value);
                }}
                placeholder={showReset ? "Set new password" : "Enter password"}
                autoComplete={showReset ? "new-password" : "current-password"}
                minLength={showReset ? 8 : undefined}
                required
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-vibrant-charcoal/50 hover:text-vibrant-violet p-2">
                {show ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </div>
          {message && <p className="text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200">{message}</p>}
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-mono-plum text-white py-5 rounded-2xl font-black uppercase tracking-widest text-lg hover:bg-vibrant-violet transition-all active:scale-95 shadow-lg shadow-mono-plum/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Verifying...</>
            ) : (
              showReset ? "Reset Password" : "Unlock Dashboard"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowReset((prev) => !prev);
              setError("");
              setMessage("");
            }}
            className="w-full text-sm font-bold text-vibrant-violet hover:text-mono-plum transition-colors"
          >
            {showReset ? "Back to login" : "Forgot password?"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [admin, setAdmin] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin/verify", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setAdmin(data.admin || null);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData || null);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE", credentials: "include" }).catch(() => {});
    setAdmin(null);
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-mono-plum flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // Gatekeeper: if not authenticated, do not render children
  if (!isAuthenticated) return <LoginScreen onLogin={handleLogin} />;

  const TAB_LINK = (href) =>
    `px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm transition-all ${
      pathname.startsWith(href)
        ? "bg-mono-plum text-white shadow-md shadow-mono-plum/20"
        : "bg-white text-vibrant-charcoal/50 border-2 border-vibrant-gray hover:border-mono-plum"
    }`;

  return (
    <AdminContext.Provider value={admin}>
      <div className="min-h-screen bg-[#F1F3F6] font-sans text-vibrant-charcoal leading-relaxed">
        <AdminNavbar onLogout={handleLogout} />

        <main className="max-w-7xl mx-auto p-8 lg:p-12 space-y-10">
          {/* Tab navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/jkl/members" className={TAB_LINK("/jkl/members")}>Member Inbox</Link>
            <Link href="/jkl/authors" className={TAB_LINK("/jkl/authors")}>Manage Authors</Link>
            <Link href="/jkl/opinions" className={TAB_LINK("/jkl/opinions")}>Manage Opinions</Link>
            <Link href="/jkl/events" className={TAB_LINK("/jkl/events")}>Manage Events</Link>
            <Link href="/jkl/careers" className={TAB_LINK("/jkl/careers")}>Manage Careers</Link>
            <Link href="/jkl/publications" className={TAB_LINK("/jkl/publications")}>Manage Publications</Link>
            <Link href="/jkl/dialogues" className={TAB_LINK("/jkl/dialogues")}>Manage Dialogues</Link>
            <Link href="/jkl/media" className={TAB_LINK("/jkl/media")}>Manage Media</Link>
            <Link href="/jkl/newsletters" className={TAB_LINK("/jkl/newsletters")}>Newsletters</Link>
            <Link href="/jkl/settings" className={TAB_LINK("/jkl/settings")}>Settings</Link>
          </div>

          {children}
        </main>
      </div>
    </AdminContext.Provider>
  );
}
