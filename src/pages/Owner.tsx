// Betwix — Owner Cabinet (UI per approved TZ)
// Style aligned with main marketplace & investor cabinet (blue, minimal)

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle,
  Loader2,
  MapPin,
  Plus,
  Receipt,
  Wallet,
} from "lucide-react";

// shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ------------------------------------------------------------------
   Types
------------------------------------------------------------------ */

type Period = "month" | "quarter" | "year" | "all";

type Section =
  | "dashboard"
  | "management"
  | "notifications"
  | "documents"
  | "settings";

type ManagementCo = {
  id: string;
  name: string;
  verified?: boolean;
};

export type OwnerObject = {
  id: string;
  title: string;
  country: string;
  city: string;
  type: "Жилая" | "Коммерческая" | "Офис" | "Торговая" | "Склад";
  status: "Активен" | "Сбор завершён" | "На проверке";
  mgmt: ManagementCo;
  occupancyPct: number;
  tenants: number;
  rentMonthly: number;
  distributedToInvestors: number;
  ownerNet: number;
  mgmtFee: number;
  platformFee: number;
  arrears: number;
  yieldPct: number;
  riskPct: number;
  riskDelta: number;
  riskDeltaPositive: boolean;
  objectValue: number;
  minInvestment: number;
  fundingPct: number;
  fundingLeft: number;
  fundingDays: number;
  liquidity?: "Низкая" | "Средняя" | "Высокая";
};

type TxType =
  | "rent_in"
  | "mgmt_fee"
  | "platform_fee"
  | "investor_distribution"
  | "owner_payout"
  | "adjustment";

type TransactionStatus = "completed" | "pending" | "failed";

type Transaction = {
  id: string;
  date: string;
  objectId?: string;
  objectLabel?: string;
  mgmtLabel?: string;
  type: TxType;
  amount: number; // + incoming, - outgoing
  status: TransactionStatus;
  receiptId?: string;
  balanceAfter: number;
};

type EventTone = "danger" | "warning" | "info";

type EventItem = {
  tone: EventTone;
  title: string;
  text: string;
  to: Section;
  cta: string;
  date?: string;
  source?: string;
};

type NewsItem = {
  id: string;
  title: string;
  date: string;
  description?: string;
  source?: string;
};

type MgmtReportStatus = "ok" | "pending";

type MgmtItem = {
  id: string;
  name: string;
  verified?: boolean;
  objects: number;
  rentCollected: number;
  feeTotal: number;
  reportsStatus: MgmtReportStatus;
};

type NotificationItem = {
  id: string;
  type: EventTone;
  title: string;
  text: string;
  date: string;
};

type DocItem = {
  id: string;
  title: string;
  category: string;
  object: string;
  date: string;
};

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------ */

const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function formatDateDisplay(s: string) {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s;
  const monthIdx = parseInt(m[2], 10) - 1;
  return `${m[3]} ${MONTHS_SHORT[monthIdx]} ${m[1]}`;
}

function money(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

function txLabel(t: TxType) {
  switch (t) {
    case "rent_in":
      return "Зачисление аренды";
    case "mgmt_fee":
      return "Комиссия УК";
    case "platform_fee":
      return "Комиссия платформы";
    case "investor_distribution":
      return "Распределение инвесторам";
    case "owner_payout":
      return "Вывод владельцу";
    case "adjustment":
      return "Корректировка";
    default:
      return t;
  }
}

function statusBadge(s: TransactionStatus) {
  if (s === "completed")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
        Completed
      </Badge>
    );
  if (s === "pending")
    return (
      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">
        Pending
      </Badge>
    );
  return <Badge variant="destructive">Failed</Badge>;
}

function pill(text: string) {
  return (
    <span className="inline-flex items-center rounded-full border border-blue-100 bg-white px-2.5 py-1 text-xs text-slate-600">
      {text}
    </span>
  );
}

function NewsEventsSidebar({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const [tab, setTab] = useState<"news" | "events">("news");
  const newsCount = MOCK_NEWS.length;
  const eventsCount = MOCK_EVENTS.length;

  return (
    <SoftCard>
      <div className="p-4">
        <div className="flex gap-4 border-b border-slate-100 pb-1.5">
          <button
            type="button"
            onClick={() => setTab("news")}
            className={
              "group relative block pb-1 text-sm font-medium transition-colors " +
              (tab === "news" ? "text-blue-600" : "text-slate-500 hover:text-blue-600")
            }
          >
            Новости
            <span className="ml-1 text-xs font-normal text-slate-400">({newsCount})</span>
            {tab === "news" && (
              <span className="absolute left-0 right-0 -bottom-1.5 h-0.5 rounded-full bg-blue-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab("events")}
            className={
              "group relative block pb-1 text-sm font-medium transition-colors " +
              (tab === "events" ? "text-blue-600" : "text-slate-500 hover:text-blue-600")
            }
          >
            События
            <span className="ml-1 text-xs font-normal text-slate-400">({eventsCount})</span>
            {tab === "events" && (
              <span className="absolute left-0 right-0 -bottom-1.5 h-0.5 rounded-full bg-blue-500" />
            )}
          </button>
        </div>

        <div className="max-h-[240px] overflow-y-auto space-y-2 pt-2">
          {tab === "news" &&
            MOCK_NEWS.map((n) => (
              <div key={n.id} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <div className="text-sm font-semibold text-slate-900">{n.title}</div>
                {n.description ? (
                  <div className="mt-0.5 text-xs text-slate-500 line-clamp-2">{n.description}</div>
                ) : null}
                <div className="mt-0.5 text-xs text-slate-500">
                  {formatDateDisplay(n.date)}
                  {n.source ? ` · ${n.source}` : ""}
                </div>
              </div>
            ))}
          {tab === "events" &&
            MOCK_EVENTS.map((e, i) => (
              <div key={i} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                <div className="text-sm font-semibold text-slate-900">{e.title}</div>
                <div className="mt-0.5 text-xs text-slate-500 line-clamp-2">{e.text}</div>
                <div className="mt-0.5 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    {e.date ? formatDateDisplay(e.date) : "—"} · {e.source ?? "УК"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-0 text-xs text-blue-600 hover:text-blue-700"
                    onClick={() => onNavigate(e.to)}
                  >
                    {e.cta}
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </SoftCard>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-slate-200/70 shadow-sm ${className}`}>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

function SectionShell({
  title,
  subtitle,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  const hasHeader = title || right;
  return (
    <div className="space-y-4">
      {hasHeader && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {title ? (
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              ) : null}
            </div>
          ) : null}
          {right ? <div className="flex flex-1 min-w-0 items-center gap-2">{right}</div> : null}
        </div>
      )}
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   Mock data
------------------------------------------------------------------ */

const MOCK_ACCOUNT = {
  balance: 12450,
  available: 8200,
  rentDelta: 320,
};

type SummaryData = {
  grossRent: number;
  investors: number;
  mgmtFee: number;
  platformFee: number;
  ownerNet: number;
  tenants: number;
  arrears: number;
  annualIncome: number;
  monthlyIncome: number;
  growthPct: number;
  potentialVsFact: number;
};

/** Single source: period-based aggregates. Values for each period. */
const PERIOD_SUMMARIES: Record<Period, SummaryData> = {
  month: {
    grossRent: 96000,
    investors: 53500,
    mgmtFee: 6050,
    platformFee: 3400,
    ownerNet: 29300,
    tenants: 7,
    arrears: 1800,
    annualIncome: 1152000,
    monthlyIncome: 96000,
    growthPct: 2.4,
    potentialVsFact: 12400,
  },
  quarter: {
    grossRent: 278000,
    investors: 158000,
    mgmtFee: 17800,
    platformFee: 9900,
    ownerNet: 85100,
    tenants: 7,
    arrears: 2400,
    annualIncome: 1112000,
    monthlyIncome: 92700,
    growthPct: 1.8,
    potentialVsFact: 35800,
  },
  year: {
    grossRent: 1120000,
    investors: 624000,
    mgmtFee: 71400,
    platformFee: 39600,
    ownerNet: 348000,
    tenants: 7,
    arrears: 5600,
    annualIncome: 1120000,
    monthlyIncome: 93300,
    growthPct: 3.1,
    potentialVsFact: 142000,
  },
  all: {
    grossRent: 2480000,
    investors: 1380000,
    mgmtFee: 158000,
    platformFee: 88000,
    ownerNet: 768000,
    tenants: 7,
    arrears: 9200,
    annualIncome: 1240000,
    monthlyIncome: 103300,
    growthPct: 2.9,
    potentialVsFact: 312000,
  },
};

const MOCK_EVENTS: EventItem[] = [
  {
    tone: "danger",
    title: "Просрочка аренды",
    text: "RE-OF-03 · Canary Wharf · $1,800",
    to: "dashboard",
    cta: "Открыть объект",
    date: "2026-02-05",
    source: "УК CityLine",
  },
  {
    tone: "warning",
    title: "Отчёт УК за месяц",
    text: "Один отчёт ещё не загружен — проверьте раздел Документы",
    to: "documents",
    cta: "Перейти в документы",
    date: "2026-02-04",
    source: "Платформа Betwix",
  },
  {
    tone: "info",
    title: "Ожидает вывод",
    text: "Есть ожидающая выплата владельцу (Pending)",
    to: "dashboard",
    cta: "Открыть транзакции",
    date: "2026-02-03",
    source: "Платформа Betwix",
  },
];

const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "GreenStone обновила прогноз по объекту RE-APT-12",
    date: "2026-01-18",
    description: "Обновление финансовых показателей и прогноза доходности",
    source: "УК GreenStone",
  },
  {
    id: "n2",
    title: "Переоценка NAV по объекту RE-OF-03",
    date: "2026-01-12",
    description: "Квартальная переоценка стоимости объекта",
    source: "УК CityLine",
  },
  {
    id: "n3",
    title: "Платформа: обновление методики комиссий для новых объектов",
    date: "2026-01-08",
    description: "Изменения вступили в силу для объектов, добавленных после 1 января",
    source: "Платформа Betwix",
  },
];

const OWNER_FLAG_MAP: Record<string, string> = {
  Великобритания: "🇬🇧",
  США: "🇺🇸",
  Испания: "🇪🇸",
  Португалия: "🇵🇹",
  Германия: "🇩🇪",
  Франция: "🇫🇷",
};

const MOCK_OBJECTS: OwnerObject[] = [
  {
    id: "RE-APT-12",
    title: "Квартира в центре Лондона",
    country: "Великобритания",
    city: "London",
    type: "Жилая",
    status: "Активен",
    mgmt: { id: "mc1", name: "GreenStone Management", verified: true },
    occupancyPct: 78,
    tenants: 1,
    rentMonthly: 3000,
    distributedToInvestors: 14500,
    ownerNet: 7200,
    mgmtFee: 1400,
    platformFee: 900,
    arrears: 0,
    yieldPct: 7.6,
    riskPct: 85,
    riskDelta: 1.52,
    riskDeltaPositive: false,
    objectValue: 473680,
    minInvestment: 5000,
    fundingPct: 10,
    fundingLeft: 417859,
    fundingDays: 24,
    liquidity: "Средняя",
  },
  {
    id: "RE-OF-03",
    title: "Офисный блок · Canary Wharf",
    country: "Великобритания",
    city: "London",
    type: "Офис",
    status: "Активен",
    mgmt: { id: "mc2", name: "CityLine УК", verified: true },
    occupancyPct: 92,
    tenants: 4,
    rentMonthly: 52000,
    distributedToInvestors: 21000,
    ownerNet: 12300,
    mgmtFee: 2600,
    platformFee: 1300,
    arrears: 1800,
    yieldPct: 6.2,
    riskPct: 72,
    riskDelta: -0.89,
    riskDeltaPositive: true,
    objectValue: 773062,
    minInvestment: 10000,
    fundingPct: 94,
    fundingLeft: 42100,
    fundingDays: 8,
    liquidity: "Высокая",
  },
  {
    id: "RE-COM-07",
    title: "Торговое помещение · Soho",
    country: "Великобритания",
    city: "London",
    type: "Торговая",
    status: "Сбор завершён",
    mgmt: { id: "mc1", name: "GreenStone Management", verified: true },
    occupancyPct: 100,
    tenants: 2,
    rentMonthly: 41000,
    distributedToInvestors: 18000,
    ownerNet: 9800,
    mgmtFee: 2050,
    platformFee: 1200,
    arrears: 0,
    yieldPct: 8.1,
    riskPct: 68,
    riskDelta: -1.2,
    riskDeltaPositive: true,
    objectValue: 512000,
    minInvestment: 5000,
    fundingPct: 100,
    fundingLeft: 0,
    fundingDays: 0,
    liquidity: "Высокая",
  },
  {
    id: "RE-WH-09",
    title: "Склад · Birmingham Hub",
    country: "Великобритания",
    city: "Birmingham",
    type: "Склад",
    status: "На проверке",
    mgmt: { id: "mc3", name: "NorthBridge УК", verified: false },
    occupancyPct: 64,
    tenants: 1,
    rentMonthly: 14500,
    distributedToInvestors: 6200,
    ownerNet: 3600,
    mgmtFee: 900,
    platformFee: 450,
    arrears: 0,
    yieldPct: 5.8,
    riskPct: 91,
    riskDelta: 2.15,
    riskDeltaPositive: false,
    objectValue: 298000,
    minInvestment: 3000,
    fundingPct: 22,
    fundingLeft: 228000,
    fundingDays: 45,
    liquidity: "Низкая",
  },
];

const MOCK_TX: Transaction[] = [
  {
    id: "tx-1",
    date: "2026-01-05",
    objectLabel: "RE-OF-03",
    mgmtLabel: "CityLine УК",
    type: "rent_in",
    amount: 52000,
    status: "completed",
    receiptId: "RCPT-88121",
    balanceAfter: 178400,
  },
  {
    id: "tx-2",
    date: "2026-01-06",
    objectLabel: "RE-OF-03",
    mgmtLabel: "CityLine УК",
    type: "mgmt_fee",
    amount: -2600,
    status: "completed",
    receiptId: "INV-MC-12091",
    balanceAfter: 175800,
  },
  {
    id: "tx-3",
    date: "2026-01-06",
    objectLabel: "RE-OF-03",
    mgmtLabel: "Betwix",
    type: "platform_fee",
    amount: -1300,
    status: "completed",
    receiptId: "INV-BX-44012",
    balanceAfter: 174500,
  },
  {
    id: "tx-4",
    date: "2026-01-07",
    objectLabel: "RE-OF-03",
    mgmtLabel: "Betwix",
    type: "investor_distribution",
    amount: -21000,
    status: "completed",
    receiptId: "DIST-99007",
    balanceAfter: 153500,
  },
  {
    id: "tx-5",
    date: "2026-01-09",
    type: "owner_payout",
    amount: -15000,
    status: "pending",
    receiptId: "PAYOUT-11209",
    balanceAfter: 138500,
  },
];

export function getOwnerObjectById(id: string | undefined): OwnerObject | null {
  if (!id) return null;
  return MOCK_OBJECTS.find((o) => o.id === id) ?? null;
}

const MOCK_MGMT: MgmtItem[] = [
  {
    id: "mc1",
    name: "GreenStone",
    verified: true,
    objects: 3,
    rentCollected: 128400,
    feeTotal: 12400,
    reportsStatus: "pending",
  },
  {
    id: "mc2",
    name: "CityLine УК",
    verified: true,
    objects: 1,
    rentCollected: 41000,
    feeTotal: 2050,
    reportsStatus: "ok",
  },
];

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "a1",
    type: "danger",
    title: "Просрочка аренды",
    text: "RE-OF-03 · Canary Wharf · $1,800",
    date: "2026-01-20",
  },
  {
    id: "a2",
    type: "warning",
    title: "Отчёт УК не загружен",
    text: "GreenStone · Январь 2026",
    date: "2026-01-18",
  },
  {
    id: "a3",
    type: "info",
    title: "Ожидает вывод владельцу",
    text: "Выплата $15,000 · Pending",
    date: "2026-01-15",
  },
];

const MOCK_DOCS: DocItem[] = [
  {
    id: "doc-1",
    title: "Отчёт УК · Январь 2026",
    category: "Отчёт УК",
    object: "RE-OF-03",
    date: "2026-02-05",
  },
  {
    id: "doc-2",
    title: "Договор управления · GreenStone",
    category: "Договор",
    object: "Все объекты",
    date: "2025-11-12",
  },
  {
    id: "doc-3",
    title: "Акт распределения дохода · Январь",
    category: "Финансы",
    object: "RE-COM-07",
    date: "2026-02-07",
  },
];

function SubNav({
  section,
  setSection,
  right,
}: {
  section: Section;
  setSection: (s: Section) => void;
  right?: React.ReactNode;
}) {
  const items: Array<{ id: Section; label: string }> = [
    { id: "dashboard", label: "Обзор" },
    { id: "management", label: "УК" },
    { id: "notifications", label: "Уведомления" },
    { id: "documents", label: "Документы" },
    { id: "settings", label: "Настройки" },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6">
      <div className="flex flex-nowrap items-end justify-between gap-4 py-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-1 min-w-0">
          {items.map((it) => {
            const active = section === it.id;
            return (
              <button
                key={it.id}
                onClick={() => setSection(it.id)}
                className={
                  "relative px-4 py-2 text-sm font-medium transition shrink-0 " +
                  (active
                    ? "text-blue-600 border-b-2 border-blue-600 -mb-px"
                    : "text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded")
                }
              >
                {it.label}
              </button>
            );
          })}
        </div>
        {right ? <div className="flex items-center gap-3 shrink-0">{right}</div> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------ */

export default function OwnerDashboard() {
  const location = useLocation();
  const [section, setSection] = useState<Section>("dashboard");
  const [period, setPeriod] = useState<Period>("month");

  useEffect(() => {
    const state = location.state as { openSection?: Section } | null;
    if (state?.openSection && ["dashboard", "management", "notifications", "documents", "settings"].includes(state.openSection)) {
      setSection(state.openSection);
    }
  }, [location.state]);

  const topBarRight =
    section === "dashboard" ? (
      <div className="flex flex-nowrap items-center gap-3">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="month">Месяц</TabsTrigger>
            <TabsTrigger value="quarter">Квартал</TabsTrigger>
            <TabsTrigger value="year">Год</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          className="rounded-full bg-blue-600 px-4 hover:bg-blue-700 shrink-0"
          onClick={() => setSection("dashboard")}
        >
          <Plus className="mr-2 h-4 w-4" /> Добавить объект
        </Button>
      </div>
    ) : undefined;

  return (
    <div className="min-h-screen">
      <SubNav section={section} setSection={setSection} right={topBarRight} />

      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        {section === "dashboard" && <DashboardSection onNavigate={setSection} period={period} />}
        {section === "management" && <ManagementSection />}
        {section === "notifications" && <NotificationsSection />}
        {section === "documents" && <DocumentsSection />}
        {section === "settings" && <SettingsSection />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Sections
------------------------------------------------------------------ */

type DashboardSectionProps = {
  onNavigate: (s: Section) => void;
  period: Period;
};

const CHART_YEARS = [2022, 2023, 2024];
const CHART_INCOME_USD = [890000, 1020000, 1120000];
const CHART_YIELD_PCT = [5.2, 6.1, 6.5];

function DashboardSection({ onNavigate, period }: DashboardSectionProps) {
  const navigate = useNavigate();
  const [previewTab, setPreviewTab] = useState<"objects" | "operations">("objects");
  const [chartMode, setChartMode] = useState<"usd" | "pct">("usd");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData>(PERIOD_SUMMARIES[period]);

  const periodLabel = useMemo(() => {
    if (period === "month") return "месяц";
    if (period === "quarter") return "квартал";
    if (period === "year") return "год";
    return "всё время";
  }, [period]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setSummary(PERIOD_SUMMARIES[period]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [period]);

  const w = {
    gross: 100,
    mgmt: (summary.mgmtFee / summary.grossRent) * 100,
    plat: (summary.platformFee / summary.grossRent) * 100,
    inv: (summary.investors / summary.grossRent) * 100,
    owner: (summary.ownerNet / summary.grossRent) * 100,
  };

  const WaterRow = ({ label, amount, widthPct, muted }: { label: string; amount: number; widthPct: number; muted?: boolean }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className={muted ? "text-slate-500" : "text-slate-800"}>{label}</div>
        <div className={muted ? "text-slate-600 font-medium" : "text-slate-900 font-semibold"}>{money(amount)}</div>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full bg-blue-600" style={{ width: `${Math.max(3, Math.min(100, widthPct))}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionShell>
        {/* KPI tiles (4 cards, same layout as Investor cabinet) */}
        <div className={"relative grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 transition-opacity " + (loading ? "opacity-60 pointer-events-none" : "")}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          )}
          <OwnerMetricCard title="Годовой доход" value={money(summary.annualIncome)} hint={`за ${periodLabel}`} />
          <OwnerMetricCard title="Доход в месяц" value={money(summary.monthlyIncome)} hint="в среднем" />
          <OwnerMetricCard
            title="Рост доходности"
            value={`${summary.growthPct >= 0 ? "+" : ""}${summary.growthPct}%`}
            hint="YoY"
            hintDanger={summary.growthPct < 0}
          />
          <OwnerMetricCard
            title="Потенциал vs факт"
            value={money(summary.potentialVsFact)}
            hint="дельта в $"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">Итоги за выбранный период</p>

        {/* Main column + Right sidebar */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Objects & Operations (tabbed) — above Distribution */}
            <SoftCard>
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-1">
                  <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewTab("objects")}
                  className={
                    "relative pb-1.5 text-sm font-medium transition " +
                    (previewTab === "objects" ? "text-blue-600 border-b-2 border-blue-600 -mb-px" : "text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded px-2 py-1")
                  }
                >
                  Мои объекты
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("operations")}
                  className={
                    "relative pb-1.5 text-sm font-medium transition " +
                    (previewTab === "operations" ? "text-blue-600 border-b-2 border-blue-600 -mb-px" : "text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded px-2 py-1")
                  }
                >
                  Операции
                </button>
                  </div>
                  <Button
                    variant="secondary"
                    className="rounded-full"
                    onClick={() => onNavigate("dashboard")}
                  >
                    {previewTab === "objects" ? "Все объекты" : "Все операции"}{" "}
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {previewTab === "objects" && (
                  <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr className="text-left">
                          <th className="p-3">Локация</th>
                          <th className="p-3">Доходность</th>
                          <th className="p-3">Риск</th>
                          <th className="p-3">Стоимость</th>
                          <th className="p-3">Мин</th>
                          <th className="p-3">Сбор</th>
                        </tr>
                      </thead>
                      <tbody>
                    {MOCK_OBJECTS.slice(0, 4).map((o) => (
                      <tr
                        key={o.id}
                        className="border-t border-slate-100 hover:bg-slate-50/60 transition cursor-pointer"
                        onClick={() => navigate(`/owner/object/${o.id}`)}
                      >
                        <td className="p-3">
                              <div className="flex flex-col leading-tight">
                                <div className="flex items-center gap-1 text-slate-800">
                                  <span>{OWNER_FLAG_MAP[o.country] ?? "🏳️"}</span>
                                  <span>{o.country}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500">
                                  <MapPin className="h-3 w-3 shrink-0" />
                                  <span>{o.city}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col leading-tight">
                                <span className="text-emerald-600 font-medium">{o.yieldPct}%</span>
                                <span className="text-xs text-slate-500">годовых</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col leading-tight">
                                <span className="text-slate-900 font-medium">{o.riskPct}%</span>
                                <span
                                  className={
                                    "text-xs " +
                                    (o.riskDeltaPositive ? "text-emerald-600" : "text-rose-600")
                                  }
                                >
                                  {o.riskDeltaPositive ? "▲" : "▼"}{" "}
                                  {Math.abs(o.riskDelta).toFixed(2).replace(".", ",")} Kr
                                </span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col leading-tight">
                                <span className="text-slate-700">{money(o.objectValue)}</span>
                                <span className="text-xs text-slate-500">{money(o.rentMonthly)} / мес</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-slate-700">{money(o.minInvestment)}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col leading-tight min-w-[100px]">
                                <span className="text-xs text-slate-600">{Math.round(o.fundingPct)}%</span>
                                <div className="mt-0.5 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className="h-1 rounded-full bg-blue-600"
                                    style={{ width: `${Math.min(100, o.fundingPct)}%` }}
                                  />
                                </div>
                                <div className="mt-1 flex justify-between text-xs text-slate-500">
                                  <span>{o.fundingDays > 0 ? `${o.fundingDays} дней` : "—"}</span>
                                  {o.fundingLeft > 0 ? (
                                    <span>осталось {o.fundingLeft.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {previewTab === "operations" && (
                  <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr className="text-left">
                          <th className="p-3">Дата</th>
                          <th className="p-3">Тип</th>
                          <th className="p-3">Объект</th>
                          <th className="p-3">УК</th>
                          <th className="p-3">Сумма</th>
                          <th className="p-3">Статус</th>
                          <th className="p-3">Чек</th>
                          <th className="p-3">Баланс</th>
                        </tr>
                      </thead>
                      <tbody>
                        {MOCK_TX.slice(0, 5).map((t) => (
                          <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition">
                            <td className="p-3">{t.date}</td>
                            <td className="p-3 font-medium text-slate-900">{txLabel(t.type)}</td>
                            <td className="p-3">{t.objectLabel || "—"}</td>
                            <td className="p-3">{t.mgmtLabel || "—"}</td>
                            <td className={"p-3 " + (t.amount > 0 ? "text-emerald-700" : "text-red-700")}>
                              {money(t.amount)}
                            </td>
                            <td className="p-3">{statusBadge(t.status)}</td>
                            <td className="p-3">
                              {t.receiptId ? (
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  <Receipt className="mr-2 h-4 w-4" /> {t.receiptId}
                                </Button>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="p-3">{money(t.balanceAfter)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </SoftCard>

            {/* Доход объекта во времени (Income Chart) */}
            <SoftCard>
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="text-lg font-semibold text-slate-900">Доход объекта во времени</div>
                  <div className="flex rounded-lg border border-slate-200 p-0.5">
                    <button
                      type="button"
                      onClick={() => setChartMode("usd")}
                      className={
                        "px-3 py-1.5 text-sm font-medium rounded-md transition " +
                        (chartMode === "usd" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100")
                      }
                    >
                      $ дохода
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartMode("pct")}
                      className={
                        "px-3 py-1.5 text-sm font-medium rounded-md transition " +
                        (chartMode === "pct" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100")
                      }
                    >
                      % доходности
                    </button>
                  </div>
                </div>
                <div className="flex items-end gap-4 pt-2">
                  {CHART_YEARS.map((y, i) => {
                    const val = chartMode === "usd" ? CHART_INCOME_USD[i] : CHART_YIELD_PCT[i];
                    const max = chartMode === "usd" ? Math.max(...CHART_INCOME_USD) : Math.max(...CHART_YIELD_PCT);
                    const pct = max > 0 ? (val / max) * 100 : 0;
                    return (
                      <div key={y} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full h-32 rounded-t bg-slate-100 overflow-hidden flex flex-col justify-end">
                          <div
                            className="w-full bg-blue-600 transition-all"
                            style={{ height: `${Math.max(8, pct)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {chartMode === "usd" ? money(val) : `${val}%`}
                        </span>
                        <span className="text-xs text-slate-400">{y}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SoftCard>

            {/* Распределение аренды (Distribution) */}
            <SoftCard>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">Распределение аренды</div>
                    <div className="text-sm text-slate-500">Собрано → удержания → инвесторам → владельцу</div>
                  </div>
                  {pill("Средний дисконт/премия P2P: -3.2%")}
                </div>

                <div className="space-y-4">
                  <WaterRow label="Собрано аренды" amount={summary.grossRent} widthPct={w.gross} />
                  <WaterRow label="Комиссия УК" amount={-summary.mgmtFee} widthPct={w.mgmt} muted />
                  <WaterRow label="Комиссия платформы" amount={-summary.platformFee} widthPct={w.plat} muted />
                  <WaterRow label="Инвесторам" amount={-summary.investors} widthPct={w.inv} muted />
                  <WaterRow label="Остаётся владельцу" amount={summary.ownerNet} widthPct={w.owner} />
                </div>

                <div className="text-xs text-slate-500">Подсказка: удержания и распределения считаются от фактически собранной аренды.</div>
              </div>
            </SoftCard>
          </div>

          <div className="space-y-4">
            {/* Account sidebar */}
            <SoftCard>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Wallet className="h-4 w-4 text-slate-500" /> Лицевой счёт
                  </div>
                  <Badge className="bg-slate-100 text-slate-700">USD</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Баланс</div>
                    <div className="mt-1 text-lg font-semibold">{money(MOCK_ACCOUNT.balance)}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="text-xs text-slate-500">Доступно</div>
                    <div className="mt-1 text-lg font-semibold">{money(MOCK_ACCOUNT.available)}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-xs text-slate-500">Начислено с аренды</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-700">+{money(MOCK_ACCOUNT.rentDelta)}</div>
                  <div className="mt-1 text-xs text-slate-500">RE-APT · №12 · 24 Jan 2026</div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700">Пополнить</Button>
                  <Button variant="outline" className="flex-1 rounded-full">Вывести</Button>
                </div>
              </div>
            </SoftCard>

            {/* Liquidity */}
            <SoftCard>
              <div className="p-5 space-y-2">
                <div
                  className="text-sm font-semibold text-slate-900"
                  title="Влияет на скорость продаж долей инвесторами"
                >
                  Ликвидность
                </div>
                <div className="text-base font-medium text-slate-700">
                  {(() => {
                    const liq = MOCK_OBJECTS.filter((o) => o.liquidity).map((o) => o.liquidity!);
                    const high = liq.filter((l) => l === "Высокая").length;
                    const low = liq.filter((l) => l === "Низкая").length;
                    if (high >= 2) return "Высокая";
                    if (low >= 2) return "Низкая";
                    return "Средняя";
                  })()}
                </div>
                <p className="text-xs text-slate-500" title="Влияет на скорость продаж долей инвесторами">
                  Влияет на скорость продаж долей инвесторами
                </p>
              </div>
            </SoftCard>

            {/* Risks — только факты */}
            <SoftCard>
              <div className="p-5 space-y-3">
                <div className="text-sm font-semibold text-slate-900">Риски</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vacancy rate</span>
                    <span className="font-medium text-slate-900">
                      {(
                        100 -
                        MOCK_OBJECTS.reduce((s, o) => s + o.occupancyPct, 0) / MOCK_OBJECTS.length
                      ).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Свободная площадь</span>
                    <span className="font-medium text-slate-900">120 м²</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Потерянный доход</span>
                    <span className="font-medium text-rose-600">{money(12400)}</span>
                  </div>
                </div>
              </div>
            </SoftCard>

            {/* УК */}
            <SoftCard>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">УК:</span>
                  <span className="text-sm font-medium text-slate-700">
                    {MOCK_MGMT[0]?.name ?? "GreenStone"}
                  </span>
                  {(MOCK_MGMT[0]?.verified ?? true) && (
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("documents")}
                  className="text-sm text-blue-600 hover:underline text-left"
                >
                  Перейти к отчётам УК
                </button>
              </div>
            </SoftCard>

            {/* News / Events (compact sidebar) */}
            <NewsEventsSidebar onNavigate={onNavigate} />

          </div>
        </div>
      </SectionShell>
    </div>
  );
}

function OwnerMetricCard({
  title,
  value,
  hint,
  hintDanger = false,
}: {
  title: string;
  value: string;
  hint: string;
  hintDanger?: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      <div className={"mt-1 text-xs " + (hintDanger ? "text-rose-600" : "text-slate-500")}>{hint}</div>
    </div>
  );
}

function ManagementSection() {
  return (
    <SectionShell title="Управляющие компании" subtitle="Контроль УК, отчётности и комиссий">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MOCK_MGMT.map((c) => (
          <SoftCard key={c.id}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  <div className="font-semibold text-slate-900">{c.name}</div>
                  {c.verified ? (
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">Verified</Badge>
                  ) : null}
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  Подробнее
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Объектов</div>
                  <div className="font-semibold text-slate-900">{c.objects}</div>
                </div>
                <div>
                  <div className="text-slate-500">Собрано аренды</div>
                  <div className="font-semibold text-slate-900">{money(c.rentCollected)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Комиссия УК</div>
                  <div className="font-semibold text-slate-900">{money(c.feeTotal)}</div>
                </div>
                <div>
                  <div className="text-slate-500">Отчётность</div>
                  <div className={c.reportsStatus === "ok" ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>
                    {c.reportsStatus === "ok" ? "Вовремя" : "Просрочка"}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full" size="sm">
                  Объекты
                </Button>
                <Button variant="outline" className="rounded-full" size="sm">
                  Отчёты
                </Button>
                <Button variant="outline" className="rounded-full" size="sm">
                  Договор
                </Button>
              </div>
            </div>
          </SoftCard>
        ))}
      </div>
    </SectionShell>
  );
}

function NotificationsSection() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const news = MOCK_NEWS;
  const notifications = MOCK_NOTIFICATIONS;

  const allDates = Array.from(
    new Set([...notifications.map((n) => n.date), ...news.map((n) => n.date)])
  ).sort((a, b) => (a < b ? 1 : -1));

  const filteredNotifications = selectedDate
    ? notifications.filter((n) => n.date === selectedDate)
    : notifications;

  const filteredNews = selectedDate ? news.filter((n) => n.date === selectedDate) : news;

  return (
    <SectionShell
      title="Уведомления"
      subtitle="Единый центр событий и новостей с фильтрацией по датам"
    >
      <SoftCard>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            <div className="text-sm font-semibold text-slate-900">Календарь</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className={
                "rounded-full " +
                (!selectedDate
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50")
              }
              onClick={() => setSelectedDate(null)}
            >
              Все даты
            </Button>
            {allDates.map((d) => (
              <Button
                key={d}
                size="sm"
                className={
                  "rounded-full " +
                  (selectedDate === d
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50")
                }
                onClick={() => setSelectedDate(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>
      </SoftCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-900">Важные события</div>
              <div className="text-xs text-slate-500">{selectedDate ? selectedDate : "Все"}</div>
            </div>
            {filteredNotifications.length === 0 ? (
              <div className="text-sm text-slate-500">Нет событий на выбранную дату</div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    className={
                      "rounded-xl border p-3 bg-white " +
                      (n.type === "danger"
                        ? "border-red-200"
                        : n.type === "warning"
                        ? "border-amber-200"
                        : "border-slate-200")
                    }
                  >
                    <div className="font-semibold text-slate-900">{n.title}</div>
                    <div className="text-sm text-slate-500">{n.text}</div>
                    <div className="mt-1 text-xs text-slate-400">{n.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SoftCard>

        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="text-lg font-semibold text-slate-900">Новости</div>
            {filteredNews.length === 0 ? (
              <div className="text-sm text-slate-500">Нет новостей на выбранную дату</div>
            ) : (
              <div className="space-y-2">
                {filteredNews.map((n) => (
                  <div key={n.id} className="flex justify-between border-b border-slate-100 pb-2 text-sm">
                    <span className="text-slate-800">{n.title}</span>
                    <span className="text-slate-500">{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SoftCard>
      </div>
    </SectionShell>
  );
}

function DocumentsSection() {
  return (
    <SectionShell
      title="Документы"
      subtitle="Юридические и финансовые документы по объектам"
    >
      <SoftCard>
        <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr className="text-left">
                <th className="p-3">Документ</th>
                <th className="p-3">Категория</th>
                <th className="p-3">Объект</th>
                <th className="p-3">Дата</th>
                <th className="p-3">Действие</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_DOCS.map((d) => (
                <tr key={d.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition">
                  <td className="p-3 font-medium text-slate-900">{d.title}</td>
                  <td className="p-3">{d.category}</td>
                  <td className="p-3">{d.object}</td>
                  <td className="p-3">{d.date}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Скачать
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SoftCard>
    </SectionShell>
  );
}

function SettingsSection() {
  return (
    <SectionShell
      title="Настройки"
      subtitle="Профиль владельца, реквизиты и уведомления"
    >
      <div className="grid grid-cols-1 gap-4">
        <SoftCard className="max-w-3xl">
          <div className="p-6 space-y-4">
            <div className="text-lg font-semibold text-slate-900">Профиль владельца</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input className="h-10 bg-white border-slate-200" placeholder="Имя / Компания" defaultValue="John Doe Holdings" />
              <Input className="h-10 bg-white border-slate-200" placeholder="Email" defaultValue="owner@betwix.io" />
              <Input className="h-10 bg-white border-slate-200" placeholder="Телефон" defaultValue="+44 7700 900123" />
              <Input className="h-10 bg-white border-slate-200" placeholder="Страна" defaultValue="United Kingdom" />
            </div>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">Сохранить профиль</Button>
          </div>
        </SoftCard>

        <SoftCard className="max-w-3xl">
          <div className="p-6 space-y-4">
            <div className="text-lg font-semibold text-slate-900">Реквизиты для выплат</div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input className="h-10 bg-white border-slate-200" placeholder="Банк" defaultValue="Barclays" />
              <Input className="h-10 bg-white border-slate-200" placeholder="IBAN / Account" defaultValue="GB29NWBK60161331926819" />
              <Input className="h-10 bg-white border-slate-200" placeholder="SWIFT / BIC" defaultValue="NWBKGB2L" />
              <Input className="h-10 bg-white border-slate-200" placeholder="Валюта" defaultValue="USD" />
            </div>
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700">Обновить реквизиты</Button>
          </div>
        </SoftCard>

        <SoftCard className="max-w-3xl">
          <div className="p-6 space-y-4">
            <div className="text-lg font-semibold text-slate-900">Уведомления</div>
            <div className="space-y-2 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Зачисление аренды
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Просрочки платежей
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked /> Отчёты УК
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Маркетинговые обновления
              </label>
            </div>
            <Button variant="secondary" className="rounded-full">
              Сохранить настройки
            </Button>
          </div>
        </SoftCard>
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------
   Unused icons in this file are intentionally kept imported for quick UI tweaks
   (SlidersHorizontal, ChevronDown) — matches your existing UI kit.
------------------------------------------------------------------ */