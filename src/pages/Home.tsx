import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Star, Home, Building, Briefcase, Store, Warehouse } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import SubTabs, { SubTabsSection } from "@/components/SubTabs";

/**
 * Betwix — Главная Страница Лотов (MVP)
 * VERSION: last-working-saved-2026-01-20-final
 * DATE: 2026-01-18
 * NOTE: Restored full UI (header + regions + countries + filters + table)
 */

// -----------------------------
// Demo data (shared with ObjectPage)
// -----------------------------

import { DEMO_LISTINGS, type Listing } from "@/data/demoListings";

// -----------------------------
// Regions + Flags
// -----------------------------

type RegionKey = "Europe" | "USA" | "Asia" | "MiddleEast" | "CIS" | "LatAm";

const REGION_MAP: Record<RegionKey, string[]> = {
  Europe: [
    "Великобритания",
    "Португалия",
    "Испания",
    "Германия",
    "Нидерланды",
    "Австрия",
    "Швейцария",
    "Франция",
    "Польша",
  ],
  USA: ["США", "Канада"],
  Asia: [
    "Япония",
    "Южная Корея",
    "Сингапур",
    "Таиланд",
    "Индия",
    "Индонезия",
    "Вьетнам",
    "Малайзия",
  ],
  MiddleEast: ["ОАЭ"],
  CIS: ["Украина", "Казахстан", "Узбекистан", "Беларусь", "Россия"],
  LatAm: ["Мексика", "Бразилия", "Чили", "Колумбия"],
};

const FLAG_MAP: Record<string, string> = {
  Великобритания: "🇬🇧",
  Португалия: "🇵🇹",
  Испания: "🇪🇸",
  Германия: "🇩🇪",
  Нидерланды: "🇳🇱",
  Австрия: "🇦🇹",
  Швейцария: "🇨🇭",
  Франция: "🇫🇷",
  Польша: "🇵🇱",

  США: "🇺🇸",
  Канада: "🇨🇦",

  Япония: "🇯🇵",
  "Южная Корея": "🇰🇷",
  Сингапур: "🇸🇬",
  Таиланд: "🇹🇭",
  Индия: "🇮🇳",
  Индонезия: "🇮🇩",
  Вьетнам: "🇻🇳",
  Малайзия: "🇲🇾",

  ОАЭ: "🇦🇪",

  Украина: "🇺🇦",
  Казахстан: "🇰🇿",
  Узбекистан: "🇺🇿",
  Беларусь: "🇧🇾",
  Россия: "🇷🇺",

  Мексика: "🇲🇽",
  Бразилия: "🇧🇷",
  Чили: "🇨🇱",
  Колумбия: "🇨🇴",
};

// -----------------------------
// Helpers
// -----------------------------

function formatMoney(n: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(n);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function progressPct(collected: number, target: number) {
  if (target <= 0) return 0;
  return clamp((collected / target) * 100, 0, 100);
}

// -----------------------------
// Page
// -----------------------------



// -----------------------------
// Footer
// -----------------------------

const Footer = () => (
  <footer className="mt-12 border-t border-[#E5E7EB] bg-white">
    <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div>
        <img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 40'%3E%3Cg fill='%230F2A44'%3E%3Cpath d='M20 4L36 20L20 36L4 20Z'/%3E%3Cpath d='M36 4L52 20L36 36L20 20Z' opacity='0.85'/%3E%3Ctext x='70' y='28' font-family='Inter, system-ui, -apple-system' font-size='22' font-weight='700' letter-spacing='2'%3EBETWIX%3C/text%3E%3C/g%3E%3C/svg%3E" alt="Betwix" className="h-8 mb-2" />
        <div className="text-slate-500">Инвестиции в доходную недвижимость</div>
        <div className="mt-4 text-slate-400">© Betwix, 2026</div>
      </div>
      <div>
        <div className="font-semibold text-slate-900 mb-2">Продукт</div>
        <ul className="space-y-1 text-slate-500">
          <li>Объекты</li>
          <li>Инвестировать</li>
          <li>P2P рынок</li>
          <li>Калькулятор доходности</li>
          <li>Как это работает</li>
        </ul>
      </div>
      <div>
        <div className="font-semibold text-slate-900 mb-2">Компания</div>
        <ul className="space-y-1 text-slate-500">
          <li>О нас</li>
          <li>Как мы зарабатываем</li>
          <li>Методика рейтингов</li>
          <li>Риски</li>
          <li>Документы / Правила</li>
          <li>Политика конфиденциальности</li>
        </ul>
      </div>
      <div>
        <div className="font-semibold text-slate-900 mb-2">Поддержка</div>
        <ul className="space-y-1 text-slate-500">
          <li>FAQ</li>
          <li>Поддержка</li>
          <li>Контакты</li>
          <li>Для владельцев объектов</li>
          <li>Для инвесторов</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-[#E5E7EB] py-4 text-center text-xs text-slate-400">© 2026 Betwix. Все права защищены</div>
  </footer>
);


export default function BetwixMarketplacePage() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [sortKey, setSortKey] = useState<keyof Listing | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [compactView, setCompactView] = useState(true);

  const [regionFilter, setRegionFilter] = useState<RegionKey | "all">("all");
  const [dataSource, setDataSource] = useState<"aggregated" | "reit" | "rent">("aggregated");
  const [countryFilter, setCountryFilter] = useState<string | "all">("all");
  const [showAllCountries, setShowAllCountries] = useState(false);

  const topCountries = useMemo(() => {
    if (regionFilter === "all") return [];
    return (REGION_MAP[regionFilter] ?? []).slice(0, 5);
  }, [regionFilter]);

  const moreCountries = useMemo(() => {
    if (regionFilter === "all") return [];
    return (REGION_MAP[regionFilter] ?? []).slice(5);
  }, [regionFilter]);

  const listings = useMemo(() => {
    const q = "";
    let data = [...DEMO_LISTINGS];

    if (regionFilter !== "all") {
      const allowed = REGION_MAP[regionFilter] ?? [];
      data = data.filter((l) => allowed.includes(l.country));
    }

    if (countryFilter !== "all") {
      data = data.filter((l) => l.country === countryFilter);
    }

    data = data.filter((l) => {
                  
      if (q) {
        const hay = `${l.title} ${l.country} ${l.city} ${l.address} ${l.propertyType}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortKey) {
      data.sort((a: any, b: any) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av === bv) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;
        if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return data;
  }, [regionFilter, countryFilter, sortKey, sortDir]);

  const riskStats = useMemo(() => {
    const coeffs = DEMO_LISTINGS.map(l => 1 + l.salePercent / 100);
    const min = Math.min(...coeffs);
    const max = Math.max(...coeffs);
    const avg = coeffs.reduce((a, b) => a + b, 0) / coeffs.length;
    return { min, avg, max };
  }, []);

  const handleSort = (key: keyof Listing) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
      return;
    }
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  };

  const th = (label: string, hint?: string) => (
    <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
      <span>{label}</span>
      {hint && (
        <span className="relative group inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#D1D5DB] text-[11px] text-white leading-none cursor-help">ℹ
          <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 w-[180px] whitespace-normal -translate-x-1/2 rounded-md border border-[#E5E7EB] bg-white px-3 py-2 inline-block text-[12px] text-slate-500 shadow opacity-0 transition-opacity group-hover:opacity-100">
            {hint}
          </span>
        </span>
      )}
    </div>
  );

  const regionBtnClass = (active: boolean) =>
    "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
    (active ? "bg-slate-100 text-slate-700" : "text-slate-700 hover:bg-slate-50");

  const countryBtnClass = (active: boolean) =>
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors " +
    (active ? "bg-slate-100 text-slate-700" : "text-slate-600 hover:bg-slate-50");

  return (
    <div className="min-h-full">
      <PageContainer>
      {/* Sub tabs (spacing matches P2P exactly) */}
      <SubTabsSection>
        <SubTabs active={dataSource} onChange={(v) => setDataSource(v as "aggregated" | "reit" | "rent")} />
      </SubTabsSection>

      {/* Content */}
      <div className="pt-0 pb-6">
        {/* Market overview (dynamic by region) */}
        {(() => {
          const DASHBOARD: Record<"aggregated" | "reit" | "rent", Record<"all" | RegionKey, any>> = {
            aggregated: {
            all: {
              market: { value: "$1.9T / год", delta: "▲ 0.5%", note: "мировой объём рынка" },
              yield: { value: "4.8–7.9%", delta: "▲ 0.2%", note: "средний диапазон" },
              risk: { value: "Средний", coeff: "Kr 0.41", delta: "▲ 0.2%", note: "диверсификация рынков" },
              vacancy: { value: "6.0%", delta: "▼ 0.2%", note: "доля пустующих объектов" },
              infl: { value: "+2.6%", delta: "▲ 0.3%", note: "реальная доходность" },
            },
            Europe: {
              market: { value: "€1.3T", delta: "▲ 0.6%", note: "рынок Европы" },
              yield: { value: "4.5–7.8%", delta: "▲ 0.3%", note: "доходность" },
              risk: { value: "Низкий", coeff: "Kr 0.32", delta: "▼ 0.1%", note: "регулируемый рынок" },
              vacancy: { value: "4.2%", delta: "▼ 0.4%", note: "пустующие объекты" },
              infl: { value: "+2.1%", delta: "▲ 0.2%", note: "реальная доходность" },
            },
            USA: {
              market: { value: "$1.6T", delta: "▲ 0.4%", note: "рынок США" },
              yield: { value: "5.2–8.5%", delta: "▲ 0.2%", note: "доходность" },
              risk: { value: "Низкий", coeff: "Kr 0.28", delta: "▼ 0.1%", note: "зрелый рынок" },
              vacancy: { value: "6.1%", delta: "▼ 0.3%", note: "пустующие объекты" },
              infl: { value: "+3.4%", delta: "▲ 0.3%", note: "реальная доходность" },
            },
            Asia: {
              market: { value: "$0.9T", delta: "▲ 1.1%", note: "рынок Азии" },
              yield: { value: "4.9–9.2%", delta: "▲ 0.6%", note: "рост доходности" },
              risk: { value: "Средний", coeff: "Kr 0.49", delta: "▲ 0.3%", note: "неоднородный регион" },
              vacancy: { value: "5.4%", delta: "▼ 0.1%", note: "пустующие объекты" },
              infl: { value: "+2.9%", delta: "▲ 0.4%", note: "реальная доходность" },
            },
            MiddleEast: {
              market: { value: "$0.18T", delta: "▲ 1.8%", note: "рынок ОАЭ" },
              yield: { value: "6.5–10.5%", delta: "▲ 0.9%", note: "высокий спрос" },
              risk: { value: "Средний", coeff: "Kr 0.44", delta: "▲ 0.2%", note: "волатильность" },
              vacancy: { value: "7.2%", delta: "▲ 0.2%", note: "пустующие объекты" },
              infl: { value: "+4.1%", delta: "▲ 0.5%", note: "реальная доходность" },
            },
            CIS: {
              market: { value: "$0.22T", delta: "▼ 0.6%", note: "рынок СНГ" },
              yield: { value: "8.5–15.0%", delta: "▲ 0.7%", note: "премия за риск" },
              risk: { value: "Высокий", coeff: "Kr 0.79", delta: "▲ 0.6%", note: "геополитика" },
              vacancy: { value: "11.2%", delta: "▲ 0.9%", note: "пустующие объекты" },
              infl: { value: "−0.8%", delta: "▼", note: "реальная доходность" },
            },
            LatAm: {
              market: { value: "$0.35T", delta: "▼ 0.3%", note: "рынок LatAm" },
              yield: { value: "7.0–12.8%", delta: "▲ 0.4%", note: "премия за риск" },
              risk: { value: "Высокий", coeff: "Kr 0.71", delta: "▲ 0.4%", note: "валютные риски" },
              vacancy: { value: "9.8%", delta: "▲ 0.6%", note: "пустующие объекты" },
              infl: { value: "+1.0%", delta: "▲ 0.2%", note: "реальная доходность" },
            },
          },

          reit: {
            all: {
              market: { value: "FTSE EPRA", delta: "▲ 0.5%", note: "REIT индекс" },
              yield: { value: "3.9%", delta: "▲ 0.1%", note: "дивиденды REIT" },
              risk: { value: "Средний", coeff: "Kr 0.38", delta: "▲ 0.2%", note: "волатильность" },
              vacancy: { value: "5.8%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" },
              infl: { value: "—", delta: "", note: "не применяется" },
            },
            Europe: { market: { value: "EPRA EU", delta: "▲ 0.6%", note: "REIT Европа" }, yield: { value: "3.7%", delta: "▲ 0.1%", note: "дивиденды" }, risk: { value: "Низкий", coeff: "Kr 0.31", delta: "▼ 0.1%", note: "волатильность" }, vacancy: { value: "6.0%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" }, infl: { value: "—", delta: "", note: "" } },
            USA: { market: { value: "MSCI US REIT", delta: "▲ 0.4%", note: "REIT США" }, yield: { value: "4.2%", delta: "▲ 0.2%", note: "дивиденды" }, risk: { value: "Низкий", coeff: "Kr 0.28", delta: "▼ 0.1%", note: "волатильность" }, vacancy: { value: "6.0%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" }, infl: { value: "—", delta: "", note: "" } },
            Asia: { market: { value: "Asia REIT", delta: "▲ 1.1%", note: "REIT Азия" }, yield: { value: "4.8%", delta: "▲ 0.3%", note: "дивиденды" }, risk: { value: "Средний", coeff: "Kr 0.47", delta: "▲ 0.2%", note: "волатильность" }, vacancy: { value: "6.0%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" }, infl: { value: "—", delta: "", note: "" } },
            MiddleEast: { market: { value: "UAE REIT", delta: "▲ 1.8%", note: "REIT ОАЭ" }, yield: { value: "5.6%", delta: "▲ 0.4%", note: "дивиденды" }, risk: { value: "Средний", coeff: "Kr 0.44", delta: "▲ 0.2%", note: "волатильность" }, vacancy: { value: "6.0%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" }, infl: { value: "—", delta: "", note: "" } },
            CIS: { market: { value: "—", delta: "", note: "нет REIT" }, yield: { value: "—", delta: "", note: "" }, risk: { value: "Высокий", coeff: "Kr 0.75", delta: "▲ 0.4%", note: "волатильность" }, vacancy: { value: "6.0%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" }, infl: { value: "—", delta: "", note: "" } },
            LatAm: { market: { value: "LatAm REIT", delta: "▼ 0.3%", note: "REIT LatAm" }, yield: { value: "6.1%", delta: "▲ 0.3%", note: "дивиденды" }, risk: { value: "Высокий", coeff: "Kr 0.68", delta: "▲ 0.4%", note: "волатильность" }, vacancy: { value: "6.0%", delta: "▼ 0.1%", note: "оценка по REIT портфелю" }, infl: { value: "—", delta: "", note: "" } },
          },

          rent: {
            all: {
              market: { value: "Global Rent", delta: "▲ 0.7%", note: "индекс аренды" },
              yield: { value: "+3.4% YoY", delta: "▲ 0.4%", note: "рост аренды" },
              risk: { value: "Средний", coeff: "Kr 0.45", delta: "▲ 0.2%", note: "vacancy + rates" },
              vacancy: { value: "6.0%", delta: "▼ 0.2%", note: "пустующие объекты" },
              infl: { value: "—", delta: "", note: "" },
            },
            Europe: { market: { value: "EU Rent", delta: "▲ 0.6%", note: "индекс аренды" }, yield: { value: "+3.2% YoY", delta: "▲ 0.3%", note: "рост аренды" }, risk: { value: "Низкий", coeff: "Kr 0.33", delta: "▼ 0.1%", note: "vacancy" }, vacancy: { value: "4.2%", delta: "▼ 0.4%", note: "пустующие" }, infl: { value: "—", delta: "", note: "" } },
            USA: { market: { value: "US Rent", delta: "▲ 0.4%", note: "индекс аренды" }, yield: { value: "+4.1% YoY", delta: "▲ 0.2%", note: "рост аренды" }, risk: { value: "Низкий", coeff: "Kr 0.29", delta: "▼ 0.1%", note: "vacancy" }, vacancy: { value: "6.1%", delta: "▼ 0.3%", note: "пустующие" }, infl: { value: "—", delta: "", note: "" } },
            Asia: { market: { value: "Asia Rent", delta: "▲ 1.1%", note: "индекс аренды" }, yield: { value: "+5.6% YoY", delta: "▲ 0.6%", note: "рост аренды" }, risk: { value: "Средний", coeff: "Kr 0.49", delta: "▲ 0.3%", note: "vacancy" }, vacancy: { value: "5.4%", delta: "▼ 0.1%", note: "пустующие" }, infl: { value: "—", delta: "", note: "" } },
            MiddleEast: { market: { value: "UAE Rent", delta: "▲ 1.8%", note: "индекс аренды" }, yield: { value: "+6.8% YoY", delta: "▲ 0.9%", note: "рост аренды" }, risk: { value: "Средний", coeff: "Kr 0.46", delta: "▲ 0.2%", note: "vacancy" }, vacancy: { value: "7.2%", delta: "▲ 0.2%", note: "пустующие" }, infl: { value: "—", delta: "", note: "" } },
            CIS: { market: { value: "CIS Rent", delta: "▼ 0.6%", note: "индекс аренды" }, yield: { value: "+9.1% YoY", delta: "▲ 0.7%", note: "рост аренды" }, risk: { value: "Высокий", coeff: "Kr 0.82", delta: "▲ 0.6%", note: "vacancy" }, vacancy: { value: "11.2%", delta: "▲ 0.9%", note: "пустующие" }, infl: { value: "—", delta: "", note: "" } },
            LatAm: { market: { value: "LatAm Rent", delta: "▼ 0.3%", note: "индекс аренды" }, yield: { value: "+7.9% YoY", delta: "▲ 0.4%", note: "рост аренды" }, risk: { value: "Высокий", coeff: "Kr 0.71", delta: "▲ 0.4%", note: "vacancy" }, vacancy: { value: "9.8%", delta: "▲ 0.6%", note: "пустующие" }, infl: { value: "—", delta: "", note: "" } },
          },
          };

          const regionKey = regionFilter === "all" ? "all" : regionFilter;
          const base = DASHBOARD[dataSource][regionKey];

          const CPI: Record<string, number> = {
            all: 2.5,
            Europe: 2.3,
            USA: 3.1,
            Asia: 2.7,
            MiddleEast: 3.4,
            CIS: 7.8,
            LatAm: 5.6,
          };

          let infl = base.infl;

          if (dataSource === "reit" && base.yield?.value !== "—") {
            const y = parseFloat(base.yield.value);
            const real = y - CPI[regionKey];
            infl = {
              value: `${real >= 0 ? "+" : ""}${real.toFixed(1)}%`,
              delta: real >= 0 ? "▲" : "▼",
              note: "REIT доходность с учётом инфляции",
            };
          }

          if (dataSource === "rent" && base.yield?.value?.includes("YoY")) {
            const y = parseFloat(base.yield.value);
            const real = y - CPI[regionKey];
            infl = {
              value: `${real >= 0 ? "+" : ""}${real.toFixed(1)}%`,
              delta: real >= 0 ? "▲" : "▼",
              note: "Рост аренды сверх инфляции",
            };
          }

          const d = { ...base, infl };

          const deltaColor = (d: string) => d.includes("▼") ? "text-[#EF4444]" : d.includes("▲") ? "text-[#10B981]" : "text-[#6B7280]";

          const Block = ({ title, value, coeff, delta, note, tooltip }: any) => (
            <Card className="card-market-hover rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-1 text-sm text-[#6B7280]">
                  {title}
                  <span className="relative group inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#D1D5DB] text-[10px] text-white">?
                    <span className="pointer-events-none absolute top-full left-1/2 z-50 mt-2 w-[380px] whitespace-normal -translate-x-1/2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 inline-block text-[13px] text-slate-500 shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                      {tooltip}
                    </span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  {title === "Риск" ? (
                    <>
                      <span className="text-slate-900">{value}</span>
                      {coeff && <span className={`text-xs ${deltaColor(delta)}`}>{coeff}</span>}
                      <span className={`text-sm ${deltaColor(delta)}`}>{delta}</span>
                    </>
                  ) : (
                    <>
                      <span>{value}</span>
                      <span className={`text-sm ${deltaColor(delta)}`}>{delta}</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-slate-500">{note}</div>
              </CardContent>
            </Card>
          );

          return (
            <div className="grid gap-2 md:grid-cols-5">
              <Block title="Рынок аренды" {...d.market} tooltip="Общий размер рынка аренды недвижимости в выбранном регионе. Показывает масштаб рынка и его динамику." />
              <Block title="Доходность" {...d.yield} tooltip="Средний уровень дохода, который приносит аренда недвижимости. Это не гарантированная прибыль, а ориентир по рынку." />
              <Block title="Риск" {...d.risk} tooltip="Общая оценка рисков рынка: насколько стабилен спрос, арендаторы и экономика региона." />
              <Block title="Vacancy rate" {...d.vacancy} tooltip="Доля объектов, которые сейчас не сданы в аренду. Чем выше показатель, тем сложнее сдавать недвижимость." />
              <Block title="Inflation impact" {...d.infl} tooltip="Показывает, как доходность аренды выглядит с учётом инфляции: растут ли реальные доходы или нет." />
            </div>
          );
        })()}

        {/* News ticker */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
        <div className="mt-3 overflow-hidden rounded-xl border bg-slate-50">
          <div className="relative overflow-hidden py-2">
            <div className="whitespace-nowrap flex animate-marquee gap-12 px-4 text-sm text-[#374151]">
              <div className="flex gap-12">
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🇺🇸 США: vacancy rate снизился до 6.1%</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🇯🇵 Япония: спрос на офисы в Токио растёт</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🇦🇪 Дубай: коммерческая недвижимость +5.4%</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🌍 Global: real estate inflow $18B за квартал</span>
              </div>
              <div className="flex gap-12" aria-hidden="true">
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🇺🇸 США: vacancy rate снизился до 6.1%</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🇯🇵 Япония: спрос на офисы в Токио растёт</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🇦🇪 Дубай: коммерческая недвижимость +5.4%</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🌍 Global: real estate inflow $18B за квартал</span>
              </div>
            </div>
          </div>
        </div>

        {/* Region tabs */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex flex-wrap items-center gap-2">
            <button type="button" className={regionBtnClass(regionFilter === "all")} onClick={() => { setRegionFilter("all"); setCountryFilter("all"); setShowAllCountries(false); }}>Все регионы</button>
            <button type="button" className={regionBtnClass(regionFilter === "Europe")} onClick={() => { setRegionFilter("Europe"); setCountryFilter("all"); setShowAllCountries(false); }}>Европа</button>
            <button type="button" className={regionBtnClass(regionFilter === "USA")} onClick={() => { setRegionFilter("USA"); setCountryFilter("all"); setShowAllCountries(false); }}>США</button>
            <button type="button" className={regionBtnClass(regionFilter === "Asia")} onClick={() => { setRegionFilter("Asia"); setCountryFilter("all"); setShowAllCountries(false); }}>Азия</button>
            <button type="button" className={regionBtnClass(regionFilter === "MiddleEast")} onClick={() => { setRegionFilter("MiddleEast"); setCountryFilter("all"); setShowAllCountries(false); }}>Восток</button>
            <button type="button" className={regionBtnClass(regionFilter === "LatAm")} onClick={() => { setRegionFilter("LatAm"); setCountryFilter("all"); setShowAllCountries(false); }}>LatAm</button>
            <button type="button" className={regionBtnClass(regionFilter === "CIS")} onClick={() => { setRegionFilter("CIS"); setCountryFilter("all"); setShowAllCountries(false); }}>СНГ</button>
          </div>
          <button type="button" onClick={() => setCompactView(v => !v)} className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-medium text-[#374151] hover:border-[#D1D5DB] hover:bg-slate-50">
            <span>{compactView ? "Расширить" : "Свернуть"}</span>
            <span className="text-[#9CA3AF]">▾</span>
          </button>
        </div>

        {/* Countries row (only when region selected) */}
        {regionFilter !== "all" && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {topCountries.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCountryFilter((prev) => (prev === c ? "all" : c))}
                className={countryBtnClass(countryFilter === c)}
                title="Фильтровать лоты по стране"
              >
                <span className="text-base">{FLAG_MAP[c] ?? "🏳️"}</span>
                <span>{c}</span>
              </button>
            ))}

            {moreCountries.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAllCountries((v) => !v)}
                  className={countryBtnClass(showAllCountries)}
                >
                  <span>Больше</span>
                  <span className="text-slate-400">▾</span>
                </button>

                {showAllCountries && (
                  <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
                    <div className="flex flex-col gap-1">
                      {moreCountries.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setCountryFilter(c);
                            setShowAllCountries(false);
                          }}
                          className={
                            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors " +
                            (countryFilter === c
                              ? "bg-slate-100 text-slate-700"
                              : "text-slate-700 hover:bg-slate-50")
                          }
                        >
                          <span className="text-base">{FLAG_MAP[c] ?? "🏳️"}</span>
                          <span>{c}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {/* Table */}
        <div
          className={
            "mt-5 overflow-hidden rounded-xl border bg-white " +
            (compactView ? "[&>*]:overflow-x-hidden" : "[&>*]:overflow-x-auto")
          }
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="w-[36px]"></TableHead>
                <TableHead className="w-[36px]">#</TableHead>
                <TableHead className="w-[90px]">
                  <button type="button" onClick={() => handleSort("title")} className="text-slate-600 hover:text-slate-900">
                    Тип
                  </button>
                </TableHead>
                <TableHead className="w-[150px]">
                  <button type="button" onClick={() => handleSort("country")} className="text-slate-600 hover:text-slate-900">
                    Локация
                  </button>
                </TableHead>
                <TableHead className="w-[90px] text-center">
                  <button type="button" onClick={() => handleSort("rentYearly")} className="text-slate-600 hover:text-slate-900">
                    {th("Доходность", "Примерная годовая доходность от аренды по отношению к стоимости объекта")}
                  </button>
                </TableHead>
                <TableHead className="w-[70px] text-center">
                  <button type="button" onClick={() => handleSort("salePercent")} className="text-slate-600 hover:text-slate-900">
                    {th("Риск", "Оценка риска инвестиций: учитывает стабильность аренды и рыночные факторы")}
                  </button>
                </TableHead>
                <TableHead className="w-[140px]">
                  <button type="button" onClick={() => handleSort("businessValue")} className="text-slate-600 hover:text-slate-900">
                    {th("Стоимость", "Оценка полной стоимости объекта и его арендного бизнеса")}
                  </button>
                </TableHead>
                <TableHead className="w-[90px]">
                  <button type="button" onClick={() => handleSort("minTicket")} className="text-slate-600 hover:text-slate-900">
                    {th("Мин", "Минимальная сумма, с которой можно инвестировать в этот объект")}
                  </button>
                </TableHead>

                {!compactView && <TableHead className="w-[90px]">{th("Inflation", "Инфляция, заложенная в расчётах доходности для этого объекта")}</TableHead>}
                {!compactView && <TableHead className="w-[90px]">{th("Capex", "Ожидаемый рост стоимости объекта за счёт капитализации")}</TableHead>}
                {!compactView && <TableHead className="w-[70px]">{th("ROI", "Итоговая ожидаемая доходность инвестиций в процентах")}</TableHead>}
                {!compactView && <TableHead className="w-[70px]">{th("Доля", "Какую часть будущего арендного дохода владелец продаёт инвесторам")}</TableHead>}
                <TableHead>
                  <button type="button" onClick={() => handleSort("raiseCollected")} className="text-slate-600 hover:text-slate-900">
                    {th("Сбор", "Сколько средств уже собрано и сколько осталось до цели")}
                  </button>
                </TableHead>
                <TableHead>{th("Инвестировать", "Переход к выбору суммы и условиям инвестирования")}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={compactView ? 10 : 14} className="py-10 text-center text-slate-500">
                    Ничего не найдено
                  </TableCell>
                </TableRow>
              ) : (
                listings.slice(0, 50).map((l, index) => {
                  const pct = progressPct(l.raiseCollected, l.raiseTarget);
                  const yieldPct = ((l.rentYearly / l.businessValue) * 100).toFixed(1);
                  return (
                    <TableRow
                      key={l.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => navigate(`/object/${l.id}`, { state: { listing: l } })}
                    >
                      <TableCell className="w-[36px] py-1">
                        <button className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-slate-100">
                          <Star className="h-4 w-4 text-slate-500" />
                        </button>
                      </TableCell>
                      <TableCell className="w-[36px] py-1 text-sm font-normal text-slate-500">{index + 1}</TableCell>
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

                      

                      {/* Доходность */}
                      <TableCell className="w-[90px] py-1 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center leading-tight">
                          <span className="text-sm font-normal text-emerald-600">{yieldPct}%</span>
                          <span className="text-[11px] font-normal text-slate-400">годовых</span>
                        </div>
                      </TableCell>

                      {/* Риск */}
                      <TableCell className="w-[70px] py-1 text-center whitespace-nowrap">
                        {(() => {
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
                            <span className="inline-flex flex-col items-center leading-tight">
                              <span className="text-base font-medium text-slate-900">{Math.round((coeff / riskStats.max) * 100)}%</span>
                              <span className={`inline-flex items-center gap-1 text-xs font-normal ${color}`}>
                                <span>{arrow}</span>
                                <span>{coeff.toFixed(3).replace('.', ',')}</span>
                                <span className="text-slate-400">Kr</span>
                              </span>
                            </span>
                          );
                        })()}
                      </TableCell>

                      {/* Стоимость + аренда/мес */}
                      <TableCell className="w-[140px] py-1">
                        <div className="flex flex-col leading-tight">
                          <span className="text-sm font-normal text-slate-700">${formatMoney(l.businessValue)}</span>
                          <span className="mt-0.5 text-xs font-normal text-slate-500">${formatMoney(l.rentMonthly)} / мес</span>
                        </div>
                      </TableCell>

                      {/* Мин */}
                      <TableCell className="w-[90px] py-1 whitespace-nowrap text-sm font-normal text-slate-700">${formatMoney(l.minTicket)}</TableCell>

                      {!compactView && <TableCell className="w-[90px] py-1 text-sm font-normal text-slate-900">2.5%</TableCell>}
                      {!compactView && <TableCell className="w-[90px] py-1 text-sm font-normal text-slate-900">6.0%</TableCell>}
                      {!compactView && <TableCell className="w-[70px] py-1 text-sm font-normal text-slate-900">12%</TableCell>}
                      {!compactView && <TableCell className="w-[70px] py-1 text-sm font-normal text-slate-900">{45 + Math.floor(Math.random() * 41)}%</TableCell>}

                      {/* Сбор */}
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

                      {/* Покупка — только эта кнопка открывает регистрацию при !auth */}
                      <TableCell className="py-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="btn-invest h-6 rounded-full px-2 text-xs text-blue-500 border-blue-500 hover:bg-transparent hover:underline shadow-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isAuthenticated) openAuthModal();
                            else navigate(`/object/${l.id}`, { state: { listing: l } });
                          }}
                        >
                          Инвестировать
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      </PageContainer>
      <Footer />
    </div>
  );
}