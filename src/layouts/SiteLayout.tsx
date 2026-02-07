import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SiteLayout() {
  const { openAuthModal } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEFF]">
      <Header onLoginClick={openAuthModal} />
      <main className="flex-1 pt-2 pb-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
