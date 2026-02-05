import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "betwix_user_role";

export type UserRole = "investor" | "owner" | null;

/** Единое глобальное состояние пользователя (user store) */
export type UserFinancials = {
  balanceUsd: number;
  availableUsd: number;
  balanceEur: number;
  availableEur: number;
};

const INITIAL_FINANCIALS: UserFinancials = {
  balanceUsd: 0,
  availableUsd: 0,
  balanceEur: 0,
  availableEur: 0,
};

// Начальные значения при входе (чтобы header не был пустым до загрузки кабинета)
const MOCK_FINANCIALS_INVESTOR: UserFinancials = {
  balanceUsd: 12450,
  availableUsd: 8200,
  balanceEur: 11320,
  availableEur: 7460,
};
/** Owner always starts with zero; Owner dashboard syncs when object list is known. */
const OWNER_INITIAL_FINANCIALS: UserFinancials = {
  balanceUsd: 0,
  availableUsd: 0,
  balanceEur: 0,
  availableEur: 0,
};

type AuthContextValue = {
  role: UserRole;
  isAuthenticated: boolean;
  balance: number;
  available: number;
  currency: "USD" | "EUR";
  setCurrency: (c: "USD" | "EUR") => void;
  setUserFinancials: (data: Partial<UserFinancials>) => void;
  isModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    return s === "investor" || s === "owner" ? s : null;
  });
  const [financials, setFinancialsState] = useState<UserFinancials>(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === "investor") return MOCK_FINANCIALS_INVESTOR;
    if (s === "owner") return OWNER_INITIAL_FINANCIALS;
    return INITIAL_FINANCIALS;
  });
  const [currency, setCurrencyState] = useState<"USD" | "EUR">("USD");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const setRole = useCallback(
    (r: UserRole) => {
      setRoleState(r);
      if (r) {
        localStorage.setItem(STORAGE_KEY, r);
        setFinancialsState(r === "investor" ? MOCK_FINANCIALS_INVESTOR : OWNER_INITIAL_FINANCIALS);
        navigate(r === "investor" ? "/investor" : "/owner");
        setIsModalOpen(false);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setFinancialsState(INITIAL_FINANCIALS);
        navigate("/");
      }
    },
    [navigate]
  );

  const setUserFinancials = useCallback((data: Partial<UserFinancials>) => {
    setFinancialsState((prev) => ({ ...prev, ...data }));
  }, []);

  const setCurrency = useCallback((c: "USD" | "EUR") => {
    setCurrencyState(c);
  }, []);

  const isAuthenticated = role !== null;
  const balance = currency === "USD" ? financials.balanceUsd : financials.balanceEur;
  const available = currency === "USD" ? financials.availableUsd : financials.availableEur;

  const value = useMemo(
    () => ({
      role,
      isAuthenticated,
      balance,
      available,
      currency,
      setCurrency,
      setUserFinancials,
      isModalOpen,
      openAuthModal: () => setIsModalOpen(true),
      closeAuthModal: () => setIsModalOpen(false),
      setRole,
    }),
    [role, isAuthenticated, balance, available, currency, setCurrency, setUserFinancials, isModalOpen, setRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
