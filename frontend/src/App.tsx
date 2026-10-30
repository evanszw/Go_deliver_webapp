import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdminAuthLayout from "@/components/layout/AdminAuthLayout";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import HowItWorksPage from "@/pages/HowItWorks";
import ServiceAreas from "@/pages/ServiceAreas";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Booking from "@/pages/Booking";
import Track from "@/pages/Track";
import Login from "@/pages/Login";
import {
  Dashboard,
  Requests,
  RequestDetail,
  Services as AdminServices,
  Areas as AdminAreas,
  FAQs as AdminFAQs,
  Contact as AdminContact,
  Settings as AdminSettings,
} from "@/pages/admin";
import { AuthProvider } from "@/hooks/useAuth";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="service-areas" element={<ServiceAreas />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="booking" element={<Booking />} />
            <Route path="track" element={<Track />} />
          </Route>

          {/* Auth */}
          <Route path="login" element={<Login />} />

          {/* Admin */}
          <Route path="admin" element={<AdminAuthLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="requests" element={<Requests />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="areas" element={<AdminAreas />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
