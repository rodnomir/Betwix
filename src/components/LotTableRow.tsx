import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Home, Building, Briefcase, Store, Warehouse } from "lucide-react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/data/demoListings";

const FLAG_MAP: Record<string, string> = {
  Великобритания: "🇬🇧", США: "🇺🇸", Испания: "🇪🇸", Португалия: "🇵🇹", Германия: "🇩🇪",
  Франция: "🇫🇷", Италия: "🇮🇹", Нидерланды: "🇳🇱", ОАЭ: "🇦🇪", Япония: "🇯🇵",
  Россия: "🇷🇺", Казахстан: "🇰🇿", Украина: "🇺🇦", Польша: "🇵🇱", Мексика: "🇲🇽",
  Бразилия: "🇧🇷", Чили: "🇨🇱", Сингапур: "🇸🇬", Таиланд: "🇹🇭", Индия: "🇮🇳",
};

function formatMoney(n: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

function progressPct(collected: number, target: number) {
  if (target <= 0) return 0;
  return Math.max(0, Math.min(100, (collected / target) * 100));
}

type RiskStats = { min: number; avg: number; max: number };

export type LotTableRowProps = {
  listing: Listing;
  index: number;
  riskStats: RiskStats;
  showMinInvestment?: boolean;
  showType?: boolean;
  showStar?: boolean;
  showIndex?: boolean;
  showInvestButton?: boolean;
  compactView?: boolean;
  compactYieldColumn?: boolean;
};

export function LotTableRow({
  listing: l,
  index,
  riskStats,
  showMinInvestment = true,
  showType = true,
  showStar = true,
  showIndex = true,
  showInvestButton = true,
  compactView = true,
  compactYieldColumn = false,
}: LotTableRowProps) {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const pct = progressPct(l.raiseCollected, l.raiseTarget);

  const handleInvestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      navigate(`/object/${l.id}`, { state: { listing: l } });
    }
  };
  const yieldPct = ((l.rentYearly / l.businessValue) * 100).toFixed(1);
  const coeff = 1 + l.salePercent / 100;
  let arrow = "▼";
  let color = "text-emerald-600";
  if (coeff >= riskStats.max * 0.9) {
    arrow = "▲";
    color = "text-rose-600";
  } else if (coeff > riskStats.avg) {
    arrow = "▲";
    color = "text-yellow-500";
  } else {
    arrow = "▼";
    color = "text-emerald-600";
  }

  return (
    <TableRow
      className="cursor-pointer hover:bg-slate-50"
      onClick={() => navigate(`/object/${l.id}`, { state: { listing: l } })}
    >
      {showStar && (
        <TableCell className="w-[36px] py-1">
          <button className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-100">
            <Star className="h-4 w-4 text-slate-500" />
          </button>
        </TableCell>
      )}
      {showIndex && (
        <TableCell className="w-[36px] py-1 text-sm font-normal text-slate-500">{index + 1}</TableCell>
      )}
      {showType && (
        <TableCell className="w-[90px] py-1">
          <div className="flex items-center gap-1">
            {l.title === "Жилая" && <Home className="h-4 w-4 text-slate-500 shrink-0" />}
            {l.title === "Коммерческая" && <Building className="h-4 w-4 text-slate-500 shrink-0" />}
            {l.title === "Офисная" && <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />}
            {l.title === "Торговая" && <Store className="h-4 w-4 text-slate-500 shrink-0" />}
            {l.title === "Склады" && <Warehouse className="h-4 w-4 text-slate-500 shrink-0" />}
            {l.title === "Бизнес" && <Building className="h-4 w-4 text-slate-500 shrink-0" />}
            <span className="text-sm font-normal text-slate-700">{l.title}</span>
          </div>
        </TableCell>
      )}
      <TableCell className="w-[150px] py-1">
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1 text-sm font-normal text-slate-800">
            <span>{FLAG_MAP[l.country] ?? "🏳️"}</span>
            <span>{l.country}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-normal text-slate-500">
            <span>📍</span>
            <span>{l.city}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className={`py-1 text-center whitespace-nowrap ${compactYieldColumn ? "w-[72px]" : "w-[90px]"}`}>
        <div className="flex flex-col items-center leading-tight">
          <span className="text-sm font-normal text-emerald-600">{yieldPct}%</span>
          <span className="text-[11px] font-normal text-slate-400">годовых</span>
        </div>
      </TableCell>
      <TableCell className="w-[70px] py-1 text-center whitespace-nowrap">
        <span className="inline-flex flex-col items-center leading-tight">
          <span className="text-base font-medium text-slate-900">{Math.round((coeff / riskStats.max) * 100)}%</span>
          <span className={`inline-flex items-center gap-1 text-xs font-normal ${color}`}>
            <span>{arrow}</span>
            <span>{coeff.toFixed(3).replace(".", ",")}</span>
            <span className="text-slate-400">Kr</span>
          </span>
        </span>
      </TableCell>
      <TableCell className="w-[140px] py-1">
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-normal text-slate-700">${formatMoney(l.businessValue)}</span>
          <span className="mt-0.5 text-xs font-normal text-slate-500">${formatMoney(l.rentMonthly)} / мес</span>
        </div>
      </TableCell>
      {showMinInvestment && (
        <TableCell className="w-[90px] py-1 whitespace-nowrap text-sm font-normal text-slate-700">${formatMoney(l.minTicket)}</TableCell>
      )}
      {!compactView && <TableCell className="w-[90px] py-1 text-sm font-normal text-slate-900">2.5%</TableCell>}
      {!compactView && <TableCell className="w-[90px] py-1 text-sm font-normal text-slate-900">6.0%</TableCell>}
      {!compactView && <TableCell className="w-[70px] py-1 text-sm font-normal text-slate-900">12%</TableCell>}
      {!compactView && <TableCell className="w-[70px] py-1 text-sm font-normal text-slate-900">{45 + Math.floor(Math.random() * 41)}%</TableCell>}
      <TableCell className="py-1">
        <div className="min-w-[160px]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-normal text-slate-600">{Math.round(pct)}%</span>
            <span className="font-normal text-slate-400">осталось {formatMoney(l.raiseTarget - l.raiseCollected)}</span>
          </div>
          <div className="mt-0.5 h-1.5 w-full rounded-full bg-slate-100">
            <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1 text-xs font-normal text-slate-400">{l.daysLeft} дней</div>
        </div>
      </TableCell>
      {showInvestButton && (
        <TableCell className="py-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            className="btn-invest h-6 rounded-full px-2 text-xs text-blue-500 border-blue-500 hover:bg-transparent hover:underline shadow-none"
            onClick={handleInvestClick}
          >
            Инвестировать
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
}
