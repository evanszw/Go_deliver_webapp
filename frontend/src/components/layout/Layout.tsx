import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingContactActions from "@/components/layout/FloatingContactActions";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      {/* Floating Call Us and WhatsApp buttons side-by-side at bottom right */}
      <FloatingContactActions />
    </div>
  );
}

export default Layout;
