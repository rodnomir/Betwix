import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { navItemUnderlineStyles } from "@/components/NavItemUnderline";

type HeaderProps = {
  onLoginClick?: () => void;
};

function getCabinetLabel(role: "investor" | "owner" | null): string {
  if (role === "investor") return "Кабинет инвестора";
  if (role === "owner") return "Кабинет владельца";
  return "Кабинет";
}

function getCabinetPath(role: "investor" | "owner" | null): string {
  if (role === "owner") return "/owner";
  return "/investor";
}

function formatMoney(value: number, currency: "USD" | "EUR"): string {
  const symbol = currency === "USD" ? "$" : "€";
  return `${symbol}${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const { role, isAuthenticated, balance, available, currency, setCurrency, setRole } = useAuth();
  const cabinetLabel = getCabinetLabel(role);
  const cabinetPath = getCabinetPath(role);
  const navLinkClass = ({
    isActive,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) => navItemUnderlineStyles.container + navItemUnderlineStyles.text(isActive);

  const underlineClass = (isActive: boolean) => navItemUnderlineStyles.line(isActive);

  const handleLogout = () => {
    setRole(null);
  };

  const isOwner = role === "owner";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        {/* Left block: logo + nav */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center shrink-0">
            <img
              src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 40'%3E%3Cpath d='M20 4L36 20L20 36L4 20Z' fill='%231A2C42'/%3E%3Cpath d='M36 4L52 20L36 36L20 20Z' fill='%234A6B8F'/%3E%3Ctext x='60' y='28' font-family='Inter, system-ui, sans-serif' font-size='20' font-weight='600' letter-spacing='0.05em' fill='%231A2C42'%3EBETWIX%3C/text%3E%3C/svg%3E"
              alt="Betwix"
              className="h-8"
            />
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  Лоты
                  <span className={underlineClass(isActive)} />
                </>
              )}
            </NavLink>
            <NavLink to="/p2p" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  P2P рынок
                  <span className={underlineClass(isActive)} />
                </>
              )}
            </NavLink>
            {isAuthenticated && (
              <NavLink to={cabinetPath} className={navLinkClass}>
                {({ isActive }) => (
                  <>
                    {cabinetLabel}
                    <span className={underlineClass(isActive)} />
                  </>
                )}
              </NavLink>
            )}
          </nav>
        </div>

        {/* Right block: Лицевой счёт/Доступно только при auth, иначе только Вход */}
        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="text-xs text-slate-500">Лицевой счёт</div>
              <div className="flex items-baseline gap-2">
                <div className="text-sm font-medium text-slate-900">{formatMoney(balance, currency)}</div>
                {!isOwner && role === "investor" && (
                  <div className="text-xs text-[#10B981]">+{currency === "EUR" ? "€290" : "$320"} rent</div>
                )}
              </div>
              <div className="h-6 w-px bg-slate-200" aria-hidden />
              <div className="text-xs text-slate-500">Доступно</div>
              <div className="text-sm font-medium text-slate-900">{formatMoney(available, currency)}</div>
              {isOwner && (
                <>
                  <div className="h-6 w-px bg-slate-200" aria-hidden />
                  <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setCurrency("EUR")}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                        currency === "EUR"
                          ? "bg-slate-100 text-slate-700"
                          : "text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      EUR
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                        currency === "USD"
                          ? "bg-slate-100 text-slate-700"
                          : "text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={isAuthenticated ? handleLogout : onLoginClick}
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {isAuthenticated ? "Выход" : "Вход"}
          </button>
        </div>
      </div>
    </header>
  );
}
