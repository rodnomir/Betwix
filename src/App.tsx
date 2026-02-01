import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Investor from "./pages/Investor";
import Owner from "./pages/Owner";
import ObjectPage from "./pages/ObjectPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        {/* NAVIGATION — ВСЕГДА ВИДНА */}
        <header
          style={{
            borderBottom: "1px solid #E5E7EB",
            padding: "12px 24px",
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <strong>Betwix</strong>

          <NavLink to="/">Home</NavLink>
          <NavLink to="/marketplace">P2P</NavLink>
          <NavLink to="/object">Object</NavLink>
          <NavLink to="/investor">Investor</NavLink>
          <NavLink to="/owner">Owner</NavLink>
        </header>

        {/* PAGES */}
        <main style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/object" element={<ObjectPage />} />
            <Route path="/investor" element={<Investor />} />
            <Route path="/owner" element={<Owner />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
