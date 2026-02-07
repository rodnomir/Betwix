import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthModal from "./components/AuthModal";
import SiteLayout from "./layouts/SiteLayout";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Investor from "./pages/Investor";
import Owner from "./pages/Owner";
import OwnerObjectPage from "./pages/OwnerObjectPage";
import ObjectPage from "./pages/ObjectPage";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import HowWeEarn from "./pages/HowWeEarn";
import RatingMethodology from "./pages/RatingMethodology";
import Risks from "./pages/Risks";
import Documents from "./pages/Documents";
import Faq from "./pages/Faq";
import Contacts from "./pages/Contacts";
import Support from "./pages/Support";
import ForManagementCompanies from "./pages/ForManagementCompanies";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";

function AppContent() {
  const { isModalOpen, closeAuthModal } = useAuth();

  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lots" element={<Home />} />
            <Route path="/p2p" element={<Marketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-we-earn" element={<HowWeEarn />} />
            <Route path="/rating-methodology" element={<RatingMethodology />} />
            <Route path="/risks" element={<Risks />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/support" element={<Support />} />
            <Route path="/for-management-companies" element={<ForManagementCompanies />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/object/:id" element={<ObjectPage />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="/owner/how-it-works" element={<HowItWorks />} />
            <Route path="/owner/object/:id" element={<OwnerObjectPage />} />
        </Route>
      </Routes>
      <AuthModal open={isModalOpen} onClose={closeAuthModal} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
