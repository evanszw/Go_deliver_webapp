import { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  FileText,
  Truck,
  MapPin,
  HelpCircle,
  PhoneCall,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
} from "lucide-react";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/requests", label: "Delivery Requests", icon: FileText },
    { to: "/admin/services", label: "Service Catalogue", icon: Truck },
    { to: "/admin/areas", label: "Service Areas", icon: MapPin },
    { to: "/admin/faqs", label: "FAQs Management", icon: HelpCircle },
    { to: "/admin/contact", label: "Contact Channels", icon: PhoneCall },
    { to: "/admin/settings", label: "Account Settings", icon: Settings },
  ];

  const isNavActive = (to: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-brand-black">
      {/* ============================================================ */}
      {/* 1. DESKTOP SIDEBAR (Visible lg and up)                       */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-brand-black text-white border-r border-white/10 select-none">
        {/* Brand Header with Genuine Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.jpg"
              alt="Go Deliver Logo"
              className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-xs"
            />
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-tight group-hover:text-red-400 transition-colors">
                Go Deliver
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Dispatch Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
            Operations
          </div>
          {navItems.map((item) => {
            const active = isNavActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
              Website
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </span>
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/30 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-xs text-white block truncate">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10px] text-slate-400 block truncate font-mono">
                {user?.email || "admin@go-deliver.local"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600/30 transition-colors border border-red-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. MOBILE TOP NAVIGATION & SLIDE-OUT DRAWER                 */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-brand-black text-white border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md">
        <Link to="/admin" className="flex items-center gap-2.5">
          <img
            src="/logo.jpg"
            alt="Go Deliver Logo"
            className="w-8 h-8 rounded-lg object-cover border border-white/20"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white leading-tight">Go Deliver</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">Admin Console</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors focus-visible-ring"
          aria-label="Toggle admin navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative w-72 max-w-[80vw] bg-brand-black text-white h-full flex flex-col border-r border-white/10 z-10 shadow-2xl animate-fade-in">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.jpg"
                  alt="Go Deliver Logo"
                  className="w-8 h-8 rounded-lg object-cover border border-white/20"
                />
                <span className="font-bold text-sm text-white">Go Deliver Admin</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-3 mb-2">
                Operations
              </div>
              {navItems.map((item) => {
                const active = isNavActive(item.to, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-brand-red text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Public Website</span>
                </Link>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-xs text-white block truncate">{user?.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate font-mono">{user?.email}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600/30 transition-colors border border-red-500/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. MAIN CONTENT CONTAINER (Responsive & non-clipping)        */}
      {/* ============================================================ */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden bg-slate-50 pt-14 lg:pt-0">
        {/* Top Header inside main area */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Administration
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-brand-black">
              {navItems.find((n) => isNavActive(n.to, n.exact))?.label || "Console"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Settings</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-brand-black">{user?.name || "Staff"}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                {user?.role || "ADMIN"}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Main Outlet */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-w-0">
          <div className="max-w-7xl mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
