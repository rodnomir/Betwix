import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Search,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Receipt,
  Newspaper,
  BarChart3,
  Wallet,
  Info,
  Flame,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ================= utils =================
const money = (v: number, currency: "USD" | "EUR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(v);

const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

// ================= types =================
type CabinetTab = "portfolio" | "activity" | "events" | "reports" | "documents";

type Region = "Все регионы" | "Европа" | "США" | "Азия" | "Восток" | "LatAm" | "СНГ";

type AssetType =
  | "Все типы"
  | "Коммерческая"
  | "Офисная"
  | "Торговая"
  | "Склады"
  | "Бизнес"
  | "Жилая";

type Liquidity = "Высокая" | "Средняя" | "Низкая";

type HoldingRow = {
  id: number;
  starred?: boolean;
  code: string;
  type: AssetType;
  country: string;
  city: string;
  region: Exclude<Region, "Все регионы">;
  mySharePct: number;
  myShareAgeMo: number;
  price: number;
  yieldPct: number;
  discountToNavPct: number; // negative = discount
  nav: number;
  liquidity: Liquidity;
  status: "Активна" | "Риск" | "Простой";
};

type ActivityRow = {
  id: number;
  date: string;
  type: "Покупка доли" | "Продажа P2P" | "Начисление аренды" | "Пополнение" | "Вывод";
  object?: string;
  amount: number;
  status: "Успешно" | "В обработке" | "Отклонено";
};

type EventRow = {
  id: number;
  when: string;
  object: string;
  tag: "Аренда" | "Ремонт" | "Риск" | "Отчёт";
  title: string;
  hint?: string;
  severity: "ok" | "warn" | "info";
};

type ReportRow = {
  id: number;
  object: string;
  period: string;
  income: number;
  expenses: number;
  net: number;
  myPayout: number;
  status: "Опубликован" | "Скоро";
};

type DocRow = {
  id: number;
  title: string;
  date: string;
  kind: "Договор" | "Отчёт" | "Подтверждение";
};

// ================= mock data =================
const ACCOUNT = {
  balanceUsd: 12450,
  balanceEur: 11320,
  availableUsd: 8200,
  availableEur: 7460,
  rentAccruedUsd: 320,
  rentAccruedEur: 290,
} as const;

const HOLDINGS: HoldingRow[] = [
  {
    id: 1,
    starred: true,
    code: "RE-APT · №12",
    type: "Коммерческая",
    country: "Великобритания",
    city: "Лондон",
    region: "Европа",
    mySharePct: 1.8,
    myShareAgeMo: 14,
    price: 12450,
    yieldPct: 9.8,
    discountToNavPct: -4.6,
    nav: 13050,
    liquidity: "Высокая",
    status: "Активна",
  },
  {
    id: 2,
    code: "RE-APT · №07",
    type: "Офисная",
    country: "Великобритания",
    city: "Манчестер",
    region: "Европа",
    mySharePct: 2.5,
    myShareAgeMo: 7,
    price: 18900,
    yieldPct: 10.6,
    discountToNavPct: 2.7,
    nav: 18400,
    liquidity: "Средняя",
    status: "Риск",
  },
  {
    id: 3,
    code: "RE-APT · №19",
    type: "Торговая",
    country: "Португалия",
    city: "Лиссабон",
    region: "Европа",
    mySharePct: 1.2,
    myShareAgeMo: 22,
    price: 8200,
    yieldPct: 8.7,
    discountToNavPct: -8.9,
    nav: 9000,
    liquidity: "Высокая",
    status: "Активна",
  },
  {
    id: 4,
    code: "RE-APT · №03",
    type: "Склады",
    country: "США",
    city: "Остин",
    region: "США",
    mySharePct: 3.0,
    myShareAgeMo: 5,
    price: 27500,
    yieldPct: 11.2,
    discountToNavPct: -5.2,
    nav: 29000,
    liquidity: "Средняя",
    status: "Простой",
  },
  {
    id: 5,
    code: "RE-APT · №21",
    type: "Жилая",
    country: "Испания",
    city: "Валенсия",
    region: "Европа",
    mySharePct: 0.9,
    myShareAgeMo: 18,
    price: 6400,
    yieldPct: 7.9,
    discountToNavPct: 2.4,
    nav: 6250,
    liquidity: "Низкая",
    status: "Активна",
  },
  {
    id: 6,
    code: "RE-APT · №15",
    type: "Бизнес",
    country: "ОАЭ",
    city: "Дубай",
    region: "Восток",
    mySharePct: 1.6,
    myShareAgeMo: 11,
    price: 16200,
    yieldPct: 12.1,
    discountToNavPct: -7.7,
    nav: 17550,
    liquidity: "Высокая",
    status: "Активна",
  },
];

const ACTIVITY: ActivityRow[] = [
  {
    id: 1,
    date: "2026-01-24",
    type: "Начисление аренды",
    object: "RE-APT · №12",
    amount: 38,
    status: "Успешно",
  },
  {
    id: 2,
    date: "2026-01-21",
    type: "Продажа P2P",
    object: "RE-APT · №03",
    amount: 5200,
    status: "В обработке",
  },
  {
    id: 3,
    date: "2026-01-18",
    type: "Пополнение",
    amount: 5000,
    status: "Успешно",
  },
  {
    id: 4,
    date: "2026-01-14",
    type: "Покупка доли",
    object: "RE-APT · №07",
    amount: -1200,
    status: "Успешно",
  },
  {
    id: 5,
    date: "2026-01-10",
    type: "Вывод",
    amount: -600,
    status: "Отклонено",
  },
];

const EVENTS: EventRow[] = [
  {
    id: 1,
    when: "Сегодня",
    object: "RE-APT · №12 · Лондон",
    tag: "Аренда",
    title: "Новый арендатор · договор на 3 года",
    hint: "Ставка выше на 4%",
    severity: "ok",
  },
  {
    id: 2,
    when: "3 дня назад",
    object: "RE-APT · №07 · Манчестер",
    tag: "Риск",
    title: "Арендатор подал уведомление о выезде (30 дней)",
    hint: "Оценка риска повышена",
    severity: "warn",
  },
  {
    id: 3,
    when: "Неделя назад",
    object: "RE-APT · №19 · Лиссабон",
    tag: "Ремонт",
    title: "Начат косметический ремонт (2 недели)",
    hint: "Возможен простой 7–10 дней",
    severity: "info",
  },
  {
    id: 4,
    when: "2 недели назад",
    object: "RE-APT · №03 · Остин",
    tag: "Отчёт",
    title: "Отчёт УК опубликован · Q4 2025",
    hint: "Net cashflow +$2,140",
    severity: "info",
  },
];

const REPORTS: ReportRow[] = [
  {
    id: 1,
    object: "RE-APT · №12",
    period: "Q4 2025",
    income: 18200,
    expenses: 4100,
    net: 14100,
    myPayout: 252,
    status: "Опубликован",
  },
  {
    id: 2,
    object: "RE-APT · №07",
    period: "Q4 2025",
    income: 24600,
    expenses: 7600,
    net: 17000,
    myPayout: 425,
    status: "Опубликован",
  },
  {
    id: 3,
    object: "RE-APT · №19",
    period: "Q1 2026",
    income: 0,
    expenses: 0,
    net: 0,
    myPayout: 0,
    status: "Скоро",
  },
];

const DOCS: DocRow[] = [
  { id: 1, title: "Договор доли · RE-APT · №12", date: "2025-11-05", kind: "Договор" },
  { id: 2, title: "Подтверждение сделки · P2P · RE-APT · №03", date: "2026-01-21", kind: "Подтверждение" },
  { id: 3, title: "Отчёт УК · Q4 2025 · RE-APT · №07", date: "2026-01-10", kind: "Отчёт" },
  { id: 4, title: "Договор доли · RE-APT · №19", date: "2025-09-19", kind: "Договор" },
];

// ================= small UI =================
function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-sm transition ${
        active ? "bg-[#0b0f14] text-white" : "bg-white text-black/70 hover:bg-black/5"
      }`}
    >
      {children}
    </button>
  );
}

function MetricCard({ title, value, delta, hint }: { title: string; value: string; delta?: number; hint: string }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-black/70">{title}</div>
        {typeof delta === "number" && (
          <div className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-600" : "text-rose-600"}`}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {pct(delta)}
          </div>
        )}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-black/45">{hint}</div>
    </div>
  );
}

function StatusPill({ v }: { v: HoldingRow["status"] }) {
  const cls =
    v === "Активна"
      ? "bg-emerald-50 text-emerald-700"
      : v === "Риск"
        ? "bg-amber-50 text-amber-800"
        : "bg-slate-100 text-slate-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{v}</span>;
}

function LiquidityPill({ v }: { v: Liquidity }) {
  const cls =
    v === "Высокая"
      ? "bg-emerald-50 text-emerald-700"
      : v === "Средняя"
        ? "bg-slate-100 text-slate-700"
        : "bg-slate-50 text-slate-600";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{v}</span>;
}

function DiscountCell({ v, nav, currency }: { v: number; nav: number; currency: "USD" | "EUR" }) {
  const cls = v <= 0 ? "text-emerald-600" : "text-rose-600";
  const sign = v <= 0 ? "" : "+";
  return (
    <div className="leading-tight">
      <div className={`font-medium ${cls}`}>{sign}{v.toFixed(1)}%</div>
      <div className="text-xs text-black/45">NAV {money(nav, currency)}</div>
    </div>
  );
}

function ActivityStatus({ v }: { v: ActivityRow["status"] }) {
  const cls = v === "Успешно" ? "text-emerald-700" : v === "В обработке" ? "text-amber-800" : "text-rose-700";
  return <span className={`text-xs font-medium ${cls}`}>{v}</span>;
}

function EventTag({ v }: { v: EventRow["tag"] }) {
  const cls =
    v === "Аренда"
      ? "bg-emerald-50 text-emerald-700"
      : v === "Риск"
        ? "bg-amber-50 text-amber-800"
        : v === "Ремонт"
          ? "bg-slate-100 text-slate-700"
          : "bg-slate-50 text-slate-600";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{v}</span>;
}

function EventSeverityDot({ v }: { v: EventRow["severity"] }) {
  const cls = v === "ok" ? "bg-emerald-500" : v === "warn" ? "bg-amber-500" : "bg-slate-400";
  return <span className={`mt-1.5 h-2 w-2 rounded-full ${cls}`} />;
}

function DocKindBadge({ kind }: { kind: DocRow["kind"] }) {
  const cls = kind === "Договор" ? "bg-slate-100 text-slate-700" : kind === "Отчёт" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{kind}</span>;
}

function ReportStatusPill({ v }: { v: ReportRow["status"] }) {
  const cls = v === "Опубликован" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{v}</span>;
}

// ================= main =================
export default function InvestorCabinetPreview() {
  const { currency, setCurrency, setUserFinancials } = useAuth();
  const [cabinetTab, setCabinetTab] = useState<CabinetTab>("portfolio");
  const [openAsset, setOpenAsset] = useState<HoldingRow | null>(null);

  const [region, setRegion] = useState<Region>("Все регионы");
  const [type] = useState<AssetType>("Все типы");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [hiLiq, setHiLiq] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setUserFinancials({
      balanceUsd: ACCOUNT.balanceUsd,
      availableUsd: ACCOUNT.availableUsd,
      balanceEur: ACCOUNT.balanceEur,
      availableEur: ACCOUNT.availableEur,
    });
  }, [setUserFinancials]);

  const fx = useMemo(() => ACCOUNT.balanceEur / ACCOUNT.balanceUsd, []);

  const account = useMemo(() => {
    const balance = currency === "USD" ? ACCOUNT.balanceUsd : ACCOUNT.balanceEur;
    const available = currency === "USD" ? ACCOUNT.availableUsd : ACCOUNT.availableEur;
    const rent = currency === "USD" ? ACCOUNT.rentAccruedUsd : ACCOUNT.rentAccruedEur;
    return { balance, available, rent };
  }, [currency]);

  const holdings = useMemo(() => {
    let rows = [...HOLDINGS];
    if (region !== "Все регионы") rows = rows.filter((r) => r.region === region);
    if (type !== "Все типы") rows = rows.filter((r) => r.type === type);
    if (onlyDiscount) rows = rows.filter((r) => r.discountToNavPct < 0);
    if (hiLiq) rows = rows.filter((r) => r.liquidity === "Высокая");
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      rows = rows.filter((r) => `${r.code} ${r.country} ${r.city} ${r.type}`.toLowerCase().includes(s));
    }

    if (currency === "EUR") {
      rows = rows.map((r) => ({
        ...r,
        price: Math.round(r.price * fx),
        nav: Math.round(r.nav * fx),
      }));
    }

    return rows;
  }, [region, type, onlyDiscount, hiLiq, q, currency, fx]);

  const metrics = useMemo(() => {
    const total = holdings.reduce((acc, r) => acc + r.price, 0);
    const avgDisc = holdings.length ? holdings.reduce((a, r) => a + r.discountToNavPct, 0) / holdings.length : 0;
    const hi = holdings.filter((r) => r.liquidity === "Высокая").length;
    const liqScore = holdings.length ? Math.round((hi / holdings.length) * 100) : 0;
    const spread = 2.1; // mock
    return { total, avgDisc, liqScore, spread };
  }, [holdings]);

  const activityRows = useMemo(() => {
    if (currency === "USD") return ACTIVITY;
    return ACTIVITY.map((a) => ({ ...a, amount: Math.round(a.amount * fx) }));
  }, [currency, fx]);

  const reportRows = useMemo(() => {
    if (currency === "USD") return REPORTS;
    return REPORTS.map((r) => ({
      ...r,
      income: Math.round(r.income * fx),
      expenses: Math.round(r.expenses * fx),
      net: Math.round(r.net * fx),
      myPayout: Math.round(r.myPayout * fx),
    }));
  }, [currency, fx]);

  const docsRows = useMemo(() => {
    return DOCS;
  }, []);

  const rightSummary = useMemo(() => {
    const atRisk = holdings.filter((h) => h.status === "Риск").length;
    const idle = holdings.filter((h) => h.status === "Простой").length;
    const hi = holdings.filter((h) => h.liquidity === "Высокая").length;
    return { atRisk, idle, hi };
  }, [holdings]);

  return (
    <div className="min-h-screen text-[#0b0f14]">
      {/* ================= PAGE ================= */}
      <div className="mx-auto max-w-[1500px] px-6 py-6">
        {/* Section tabs + controls (single row) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Chip active={cabinetTab === "portfolio"} onClick={() => setCabinetTab("portfolio")}>Мои доли</Chip>
            <Chip active={cabinetTab === "activity"} onClick={() => setCabinetTab("activity")}>Операции</Chip>
            <Chip active={cabinetTab === "events"} onClick={() => setCabinetTab("events")}>События</Chip>
            <Chip active={cabinetTab === "reports"} onClick={() => setCabinetTab("reports")}>Отчёты</Chip>
            <Chip active={cabinetTab === "documents"} onClick={() => setCabinetTab("documents")}>Документы</Chip>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full border bg-white p-1">
              <button
                onClick={() => setCurrency("USD")}
                className={`rounded-full px-3 py-1 text-sm ${currency === "USD" ? "bg-[#0b0f14] text-white" : "text-black/70 hover:bg-black/5"}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency("EUR")}
                className={`rounded-full px-3 py-1 text-sm ${currency === "EUR" ? "bg-[#0b0f14] text-white" : "text-black/70 hover:bg-black/5"}`}
              >
                EUR
              </button>
            </div>
            <Button variant="outline" className="rounded-full">Пополнить</Button>
            <Button variant="outline" className="rounded-full">Вывести</Button>
          </div>
        </div>

        {/* Metrics row (like top KPI cards on Home/P2P) */}
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Стоимость портфеля" value={money(metrics.total, currency)} delta={0.5} hint="оценка долей по рынку" />
          <MetricCard title="Средний дисконт" value={`${metrics.avgDisc.toFixed(1)}%`} delta={0.2} hint="относительно NAV" />
          <MetricCard
            title="Liquidity score"
            value={metrics.liqScore >= 70 ? "Высокая" : metrics.liqScore >= 40 ? "Средняя" : "Низкая"}
            delta={0.0}
            hint="обобщённый рейтинг"
          />
          <MetricCard title="Bid-Ask spread" value={`${metrics.spread.toFixed(1)}%`} delta={-0.1} hint="разница спрос/предложение" />
        </div>

        {/* Main content layout */}
        <div className="mt-5 grid grid-cols-12 gap-6">
          {/* CORE */}
          <div className="col-span-12 xl:col-span-9">
            {/* ================= PORTFOLIO ================= */}
            {cabinetTab === "portfolio" && (
              <div className="rounded-2xl border bg-white shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
                {/* Filters header */}
                <div className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {(["Все регионы", "Европа", "США", "Азия", "Восток", "LatAm", "СНГ"] as Region[]).map((r) => (
                        <Chip key={r} active={region === r} onClick={() => setRegion(r)}>
                          {r}
                        </Chip>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/35" />
                        <Input
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                          placeholder="Поиск: объект, город, страна"
                          className="h-10 w-[280px] rounded-full pl-9"
                        />
                      </div>
                      <Button variant="outline" className="rounded-full">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        Расширить
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm">
                      <span className="text-black/60">Тип:</span>
                      <button className="flex items-center gap-1 font-medium">
                        {type}
                        <ChevronDown className="h-4 w-4 text-black/40" />
                      </button>
                    </div>

                    <button
                      onClick={() => setOnlyDiscount((v) => !v)}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        onlyDiscount ? "bg-[#0b0f14] text-white border-[#0b0f14]" : "bg-white text-black/70 hover:bg-black/5"
                      }`}
                    >
                      Только со скидкой
                    </button>

                    <button
                      onClick={() => setHiLiq((v) => !v)}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        hiLiq ? "bg-[#0b0f14] text-white border-[#0b0f14]" : "bg-white text-black/70 hover:bg-black/5"
                      }`}
                    >
                      Высокая ликвидность
                    </button>

                    <div className="ml-auto text-sm text-black/45">Найдено: {holdings.length}</div>
                  </div>
                </div>

                <Separator />

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f6f7f9] text-xs text-black/50">
                      <tr>
                        <th className="w-[44px] px-4 py-3 text-left"></th>
                        <th className="px-4 py-3 text-left">Объект</th>
                        <th className="px-4 py-3 text-left">Локация</th>
                        <th className="px-4 py-3 text-left">Моя доля</th>
                        <th className="px-4 py-3 text-left">Цена</th>
                        <th className="px-4 py-3 text-left">Дисконт / NAV</th>
                        <th className="px-4 py-3 text-left">Ликвидность</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((r) => (
                        <tr key={r.id} onClick={() => setOpenAsset(r)} className="border-t cursor-pointer hover:bg-[#f6f7f9]/60">
                          <td className="px-4 py-4">
                            <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5">
                              <Star className={`h-4 w-4 ${r.starred ? "text-[#2563eb]" : "text-black/20"}`} />
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{r.code}</div>
                            <div className="text-xs text-black/45">{r.type}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{r.country}</div>
                            <div className="text-xs text-black/45">{r.city}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{r.mySharePct.toFixed(1)}%</div>
                            <div className="text-xs text-black/45">{r.myShareAgeMo} мес</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium">{money(r.price, currency)}</div>
                            <div className="text-xs text-black/45">доходн. {r.yieldPct.toFixed(1)}%</div>
                          </td>
                          <td className="px-4 py-4">
                            <DiscountCell v={r.discountToNavPct} nav={r.nav} currency={currency} />
                          </td>
                          <td className="px-4 py-4">
                            <LiquidityPill v={r.liquidity} />
                          </td>
                          <td className="px-4 py-4">
                            <StatusPill v={r.status} />
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {openAsset && (
                    <div className="fixed inset-0 z-[60] flex">
                      <div className="absolute inset-0 bg-black/30" onClick={() => setOpenAsset(null)} />
                      <div className="relative z-10 ml-auto h-full w-full max-w-[420px] bg-white border-l shadow-xl overflow-y-auto">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
                          <div>
                            <div className="text-xs text-black/45">P2P заявка</div>
                            <div className="text-lg font-semibold">{openAsset.code}</div>
                          </div>
                          <button onClick={() => setOpenAsset(null)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5">✕</button>
                        </div>
                        <div className="p-4 space-y-4 bg-white">
                          <div className="rounded-xl border p-3">
                            <div className="text-xs text-black/45">Тип / Локация</div>
                            <div className="mt-1 font-medium">{openAsset.type}</div>
                            <div className="text-sm text-black/60">{openAsset.country}, {openAsset.city}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border p-3"><div className="text-xs text-black/45">Моя доля</div><div className="mt-1 font-semibold">{openAsset.mySharePct.toFixed(1)}%</div></div>
                            <div className="rounded-xl border p-3"><div className="text-xs text-black/45">Цена доли</div><div className="mt-1 font-semibold">{money(openAsset.price, currency)}</div></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border p-3"><div className="text-xs text-black/45">NAV</div><div className="mt-1 font-semibold">{money(openAsset.nav, currency)}</div></div>
                            <div className="rounded-xl border p-3"><div className="text-xs text-black/45">Дисконт / премия</div><div className={`mt-1 font-semibold ${openAsset.discountToNavPct < 0 ? "text-emerald-700" : "text-rose-700"}`}>{openAsset.discountToNavPct.toFixed(1)}%</div></div>
                          </div>
                          <div className="rounded-xl border p-3 space-y-1">
                            <div className="flex justify-between text-sm"><span className="text-black/60">Доходность</span><span className="font-semibold">{openAsset.yieldPct.toFixed(1)}%</span></div>
                            <div className="flex justify-between text-sm"><span className="text-black/60">Срок владения</span><span className="font-semibold">{openAsset.myShareAgeMo} мес</span></div>
                            <div className="flex justify-between text-sm"><span className="text-black/60">Ликвидность</span><LiquidityPill v={openAsset.liquidity} /></div>
                          </div>
                          <div className="rounded-xl border p-3"><div className="text-xs text-black/45">Причина продажи</div><div className="mt-1 font-medium">Перераспределение по регионам</div></div>
                          <div className="rounded-xl border p-3"><div className="text-xs text-black/45">Сделка защищена</div><div className="mt-1 text-sm text-black/70">Escrow · автопереход прав · выплаты с момента сделки</div></div>
                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1 rounded-full bg-[#0b0f14] text-white hover:bg-[#0b0f14]/90">Продать сейчас</Button>
                            <Button variant="outline" className="flex-1 rounded-full">Докупить</Button>
                          </div>
                          <div className="text-xs text-black/45">Цена может быть ниже или выше NAV доли</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-black/45">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Доли защищены: escrow · автопереход прав · выплаты с момента сделки
                  </div>
                  <div>Цена может быть ниже/выше NAV</div>
                </div>
              </div>
            )}

            {/* ================= ACTIVITY ================= */}
            {cabinetTab === "activity" && (
              <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-black/60" />
                    <div className="text-sm font-semibold">Движение средств</div>
                  </div>
                  <Button variant="outline" className="rounded-full">Экспорт</Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f6f7f9] text-xs text-black/50">
                      <tr>
                        <th className="px-4 py-3 text-left">Дата</th>
                        <th className="px-4 py-3 text-left">Тип</th>
                        <th className="px-4 py-3 text-left">Объект</th>
                        <th className="px-4 py-3 text-left">Сумма</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityRows.map((a) => (
                        <tr key={a.id} className="border-t hover:bg-[#f6f7f9]/60">
                          <td className="px-4 py-4">{a.date}</td>
                          <td className="px-4 py-4 font-medium">{a.type}</td>
                          <td className="px-4 py-4 text-black/70">{a.object || "—"}</td>
                          <td className={`px-4 py-4 font-semibold ${a.amount >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                            {a.amount >= 0 ? "+" : "−"}{money(Math.abs(a.amount), currency)}
                          </td>
                          <td className="px-4 py-4"><ActivityStatus v={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= EVENTS ================= */}
            {cabinetTab === "events" && (
              <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-black/60" />
                    <div className="text-sm font-semibold">Лента событий по объектам</div>
                  </div>
                  <Button variant="outline" className="rounded-full">Фильтр</Button>
                </div>

                <div className="mt-4 space-y-3">
                  {EVENTS.map((e) => (
                    <div key={e.id} className="rounded-2xl border p-4 hover:bg-[#f6f7f9]/60">
                      <div className="flex items-start gap-3">
                        <EventSeverityDot v={e.severity} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs text-black/45">{e.when} · {e.object}</div>
                              <div className="mt-1 font-medium">{e.title}</div>
                            </div>
                            <EventTag v={e.tag} />
                          </div>
                          {e.hint && <div className="mt-2 text-sm text-black/65">{e.hint}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= REPORTS ================= */}
            {cabinetTab === "reports" && (
              <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-black/60" />
                    <div className="text-sm font-semibold">Отчётность УК (по объектам)</div>
                  </div>
                  <Button variant="outline" className="rounded-full">Скачать все</Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f6f7f9] text-xs text-black/50">
                      <tr>
                        <th className="px-4 py-3 text-left">Объект</th>
                        <th className="px-4 py-3 text-left">Период</th>
                        <th className="px-4 py-3 text-left">Доход</th>
                        <th className="px-4 py-3 text-left">Расход</th>
                        <th className="px-4 py-3 text-left">Net</th>
                        <th className="px-4 py-3 text-left">Моя выплата</th>
                        <th className="px-4 py-3 text-left">Статус</th>
                        <th className="px-4 py-3 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportRows.map((r) => (
                        <tr key={r.id} className="border-t hover:bg-[#f6f7f9]/60">
                          <td className="px-4 py-4 font-medium">{r.object}</td>
                          <td className="px-4 py-4 text-black/70">{r.period}</td>
                          <td className="px-4 py-4">{money(r.income, currency)}</td>
                          <td className="px-4 py-4">{money(r.expenses, currency)}</td>
                          <td className={`px-4 py-4 font-semibold ${r.net >= 0 ? "text-emerald-700" : "text-rose-700"}`}>{money(r.net, currency)}</td>
                          <td className="px-4 py-4 font-semibold">{money(r.myPayout, currency)}</td>
                          <td className="px-4 py-4"><ReportStatusPill v={r.status} /></td>
                          <td className="px-4 py-4 text-right">
                            <Button variant="outline" className="rounded-full" disabled={r.status !== "Опубликован"}>
                              Открыть
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-black/45">
                  <Info className="h-4 w-4" />
                  Отчёты публикуются УК раз в квартал. Цифры отражают операционный cashflow объекта.
                </div>
              </div>
            )}

            {/* ================= DOCUMENTS ================= */}
            {cabinetTab === "documents" && (
              <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-black/60" />
                    <div className="text-sm font-semibold">Документы</div>
                  </div>
                  <Button variant="outline" className="rounded-full">Загрузить</Button>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f6f7f9] text-xs text-black/50">
                      <tr>
                        <th className="px-4 py-3 text-left">Название</th>
                        <th className="px-4 py-3 text-left">Тип</th>
                        <th className="px-4 py-3 text-left">Дата</th>
                        <th className="px-4 py-3 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docsRows.map((d) => (
                        <tr key={d.id} className="border-t hover:bg-[#f6f7f9]/60">
                          <td className="px-4 py-4 font-medium">{d.title}</td>
                          <td className="px-4 py-4"><DocKindBadge kind={d.kind} /></td>
                          <td className="px-4 py-4 text-black/70">{d.date}</td>
                          <td className="px-4 py-4 text-right">
                            <Button variant="outline" className="rounded-full">Открыть</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT RAIL */}
          <aside className="col-span-12 xl:col-span-3 space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-black/60" />
                  <div className="text-sm font-semibold">Лицевой счёт</div>
                </div>
                <Badge variant="secondary">{currency}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-black/45">Баланс</div>
                  <div className="mt-1 font-semibold">{money(account.balance, currency)}</div>
                </div>
                <div className="rounded-xl border p-3">
                  <div className="text-xs text-black/45">Доступно</div>
                  <div className="mt-1 font-semibold">{money(account.available, currency)}</div>
                </div>
                <div className="col-span-2 rounded-xl border p-3">
  <div className="flex items-center justify-between">
    <div>
      <div className="text-xs text-black/45">Начислено с аренды</div>
      <div className="mt-1 font-semibold text-emerald-700">+{money(account.rent, currency)}</div>
      <div className="mt-0.5 text-xs text-black/50">RE-APT · №12 · 24 Jan 2026</div>
    </div>
    <button
      onClick={() => setCabinetTab("activity")}
      className="flex items-center gap-1 text-xs font-medium text-[#2563eb] hover:underline"
    >
      Подробнее
    </button>
  </div>
</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button className="flex-1 rounded-full bg-[#0b0f14] text-white hover:bg-[#0b0f14]/90">Пополнить</Button>
                <Button variant="outline" className="flex-1 rounded-full">Вывести</Button>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Сводка портфеля</div>
                <Badge variant="secondary">{holdings.length} объектов</Badge>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Высокая ликвидность</span>
                  <span className="font-semibold">{rightSummary.hi}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">В риске</span>
                  <span className="font-semibold">{rightSummary.atRisk}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-black/60">Простой</span>
                  <span className="font-semibold">{rightSummary.idle}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-black/45">Используй фильтры «Высокая ликвидность» и «Только со скидкой» для быстрых действий.</div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-black/60" />
                  <div className="text-sm font-semibold">Market activity</div>
                </div>
                <div className="text-xs text-black/45">последние события</div>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3 rounded-xl border p-3">
                  <div>
                    <div className="font-medium">RE-APT · №19</div>
                    <div className="text-xs text-black/45">Скидка -7.4% · высокая ликвидность</div>
                  </div>
                  <span className="text-emerald-700 font-semibold">-7.4%</span>
                </div>
                <div className="flex items-start justify-between gap-3 rounded-xl border p-3">
                  <div>
                    <div className="font-medium">RE-APT · №07</div>
                    <div className="text-xs text-black/45">Риск ↑ · возможный выезд</div>
                  </div>
                  <span className="text-amber-800 font-semibold">Risk</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-black/45">Подсказка: дисконт/премия считается относительно NAV доли.</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}