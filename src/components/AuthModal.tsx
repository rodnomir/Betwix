import { useState } from "react";
import { User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

type Step = "email" | "role";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const { setRole } = useAuth();

  if (!open) return null;

  const handleContinue = () => {
    setStep("role");
  };

  const handleRoleSelect = (role: "investor" | "owner") => {
    setRole(role);
    setStep("email");
    setEmail("");
    onClose();
  };

  const handleBack = () => {
    setStep("email");
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
      setStep("email");
      setEmail("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === "email" && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Вход</h2>
            <p className="mt-1 text-sm text-slate-500">Введите email для продолжения</p>
            <div className="mt-4">
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Отмена
              </Button>
              <Button onClick={handleContinue} className="flex-1">
                Продолжить
              </Button>
            </div>
          </>
        )}

        {step === "role" && (
          <>
            <button
              type="button"
              onClick={handleBack}
              className="mb-4 text-sm text-slate-500 hover:text-slate-700"
            >
              ← Назад
            </button>
            <h2 className="text-lg font-semibold text-slate-900">Выберите роль</h2>
            <p className="mt-1 text-sm text-slate-500">Кем вы хотите войти?</p>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleRoleSelect("investor")}
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Я инвестор</div>
                  <div className="text-sm text-slate-500">Инвестирую в доли объектов</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("owner")}
                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50/50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Я владелец объекта</div>
                  <div className="text-sm text-slate-500">Управляю объектами недвижимости</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
