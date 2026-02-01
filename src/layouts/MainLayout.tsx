import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      {/* HEADER / NAV */}
      <nav
        style={{
          padding: 20,
          display: "flex",
          gap: 16,
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/investor">Investor</Link>
        <Link to="/owner">Owner</Link>
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />
    </>
  );
}
