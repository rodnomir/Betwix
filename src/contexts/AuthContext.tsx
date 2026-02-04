import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "betwix_user_role";

export type UserRole = "investor" | "owner" | null;

type AuthContextValue = {
  role: UserRole;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const setRole = useCallback(
    (r: UserRole) => {
      setRoleState(r);
      if (r) {
        localStorage.setItem(STORAGE_KEY, r);
        navigate(r === "investor" ? "/investor" : "/owner");
        setIsModalOpen(false);
      }
    },
    [navigate]
  );

  const openAuthModal = useCallback(() => setIsModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ role, isModalOpen, openAuthModal, closeAuthModal, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
