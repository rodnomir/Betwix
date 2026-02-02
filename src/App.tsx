import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Investor from "./pages/Investor";
import Owner from "./pages/Owner";
import ObjectPage from "./pages/ObjectPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col bg-[#FEFEFF]">
        <Header />
        <main className="pt-2 pb-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/p2p" element={<Marketplace />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/object/:id" element={<ObjectPage />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/owner" element={<Owner />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
