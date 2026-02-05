import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Investor from "./pages/Investor";
import Owner from "./pages/Owner";
import OwnerObjectPage from "./pages/OwnerObjectPage";
import OwnerHowItWorks from "./pages/OwnerHowItWorks";
import ObjectPage from "./pages/ObjectPage";

function AppContent() {
  const { isModalOpen, openAuthModal, closeAuthModal } = useAuth();

  return (
    <>
      <div className="flex flex-col bg-[#FEFEFF]">
        <Header onLoginClick={openAuthModal} />
        <main className="pt-2 pb-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/p2p" element={<Marketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/object/:id" element={<ObjectPage />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/owner" element={<Owner />} />
            <Route path="/owner/how-it-works" element={<OwnerHowItWorks />} />
            <Route path="/owner/object/:id" element={<OwnerObjectPage />} />
          </Routes>
        </main>
      </div>
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
