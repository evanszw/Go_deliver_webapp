import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BUSINESS } from "@/config/business";
import { api } from "@/services/api";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-4 h-4"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(BUSINESS.whatsappNumber);
  const location = useLocation();

  useEffect(() => {
    api
      .get("/contact")
      .then((r: any) => {
        const c = r.contact || r.data?.contact || {};
        if (c.whatsapp_number) {
          setWhatsappNumber(c.whatsapp_number.replace(/\D/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/how-it-works", label: "How It Works" },
    { to: "/service-areas", label: "Service Areas" },
    { to: "/track", label: "Track" },
    { to: "/faq", label: "FAQs" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark & Genuine Logo Image */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/logo.jpg"
              alt="Go Deliver Logo"
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <span className="font-bold text-xl text-brand-black tracking-tight group-hover:text-brand-red transition-colors">
              Go Deliver
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium relative py-1 transition-colors ${
                    active ? "text-brand-red font-semibold" : "text-brand-black hover:text-brand-red"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#1EBE55] rounded-lg transition-colors shadow-xs"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </a>
            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-red hover:bg-red-700 rounded-lg transition-colors shadow-xs"
            >
              <span>Book Delivery</span>
            </Link>
          </div>

          {/* Mobile Actions & Animated Hamburger Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/booking"
              className="sm:hidden px-3 py-1.5 text-xs font-semibold text-white bg-brand-red rounded-md shadow-xs"
            >
              Book
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-brand-black hover:bg-slate-100 transition-colors focus-visible-ring"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              <span
                className={`w-5 h-0.5 bg-brand-black rounded-full transition-all duration-300 ease-in-out ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-brand-black rounded-full transition-all duration-200 ease-in-out ${
                  open ? "opacity-0 scale-x-0" : "opacity-100"
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-brand-black rounded-full transition-all duration-300 ease-in-out ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Smoothly Animated Mobile Menu Dropdown */}
      <div
        className={`lg:hidden bg-white border-t border-slate-200 shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-[500px] opacity-100 py-5" : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="px-5 space-y-1.5">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-red-50 text-brand-red font-semibold"
                    : "text-brand-black hover:bg-slate-50 hover:text-brand-red"
                }`}
              >
                <span>{link.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />}
              </Link>
            );
          })}
          <div className="pt-4 space-y-2.5">
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-brand-red text-white font-semibold text-sm rounded-xl hover:bg-red-700 transition-colors shadow-xs"
            >
              <span>Book a Delivery Now</span>
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE55] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs"
            >
              <WhatsAppIcon />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
