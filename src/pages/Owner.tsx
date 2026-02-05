// Betwix — Owner Cabinet (UI per approved TZ)
// Style aligned with main marketplace & investor cabinet (blue, minimal)

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle,
  DollarSign,
  FileText,
  Key,
  Loader2,
  MapPin,
  Plus,
  Receipt,
  Scale,
  Search,
  Shield,
  TrendingUp,
  Users,
  Wallet,
  X,
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

type MgmtStatusLabel = "Verified" | "Under review" | "Risk";

type MgmtItem = {
  id: string;
  name: string;
  verified?: boolean;
  objects: number;
  rentCollected: number;
  feeTotal: number;
  reportsStatus: MgmtReportStatus;
  lastReportDate?: string;
  incidentsCount?: number;
};

type OtherMgmtItem = {
  id: string;
  name: string;
  status: "verified" | "in_review";
  specialization?: string;
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
const MONTHS_FULL = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

function formatDateDisplay(s: string) {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s;
  const monthIdx = parseInt(m[2], 10) - 1;
  return `${m[3]} ${MONTHS_SHORT[monthIdx]} ${m[1]}`;
}

/** Для группировки ленты: "Сегодня" | "Вчера" | "18 января 2026" */
function feedDateGroupLabel(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return "Сегодня";
  const d = new Date(dateStr);
  const t = new Date(todayStr);
  d.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);
  const diffDays = Math.round((t.getTime() - d.getTime()) / 86400000);
  if (diffDays === 1) return "Вчера";
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dateStr;
  const monthIdx = parseInt(m[2], 10) - 1;
  return `${parseInt(m[3], 10)} ${MONTHS_FULL[monthIdx]} ${m[1]}`;
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

/** Owner balances in base currency (EUR). When object list is empty, use zero. */
const MOCK_ACCOUNT_EUR = {
  balance: 12450,
  available: 8200,
  rentDelta: 320,
};

/** @deprecated Use MOCK_ACCOUNT_EUR for owner balance logic. Kept for non-balance usage. */
const MOCK_ACCOUNT = MOCK_ACCOUNT_EUR;

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
    lastReportDate: "2026-01-15",
    incidentsCount: 1,
  },
  {
    id: "mc2",
    name: "CityLine УК",
    verified: true,
    objects: 1,
    rentCollected: 41000,
    feeTotal: 2050,
    reportsStatus: "ok",
    lastReportDate: "2026-01-20",
    incidentsCount: 0,
  },
];

// Другие УК (для выбора при добавлении объекта / заявка на подключение)
const MOCK_OTHER_MGMT: OtherMgmtItem[] = [
  { id: "om1", name: "Prime Property Care", status: "verified", specialization: "Жилая недвижимость" },
  { id: "om2", name: "Metro Estates УК", status: "verified", specialization: "Коммерческая" },
  { id: "om3", name: "Regional Partners", status: "in_review", specialization: "Мультикласс" },
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

// Единая лента для раздела Уведомления (business news feed)
type FeedItemType = "event" | "news" | "personal";
type FeedImportance = "Critical" | "Warning" | "Info";

type FeedItem = {
  id: string;
  type: FeedItemType;
  importance: FeedImportance;
  title: string;
  description: string;
  object?: string;
  mgmt?: string;
  amount?: number;
  date: string; // YYYY-MM-DD
  actions: { label: string }[];
};

const MOCK_FEED: FeedItem[] = [
  {
    id: "f1",
    type: "event",
    importance: "Critical",
    title: "Просрочка аренды по объекту Canary Wharf",
    description:
      "Арендный платёж не поступил в установленный срок. УК уведомлена, статус будет обновлён после получения комментария.",
    object: "RE-OF-03 · Canary Wharf",
    mgmt: "CityLine УК",
    amount: 1800,
    date: "2026-01-20",
    actions: [{ label: "Перейти к объекту" }, { label: "Напомнить УК" }],
  },
  {
    id: "f2",
    type: "event",
    importance: "Warning",
    title: "Отчёт УК не загружен",
    description:
      "Отчёт GreenStone за январь 2026 ещё не получен. Расчёт выплат инвесторам будет выполнен после загрузки отчётности.",
    object: "RE-APT-12",
    mgmt: "GreenStone",
    date: "2026-01-18",
    actions: [{ label: "Посмотреть отчёт" }, { label: "Напомнить УК" }],
  },
  {
    id: "f3",
    type: "news",
    importance: "Info",
    title: "GreenStone обновила прогноз по объекту RE-APT-12",
    description: "Обновление финансовых показателей и прогноза доходности. Изменения отразятся в следующем отчёте.",
    object: "RE-APT-12",
    mgmt: "УК GreenStone",
    date: "2026-01-18",
    actions: [{ label: "К объекту" }],
  },
  {
    id: "f4",
    type: "event",
    importance: "Info",
    title: "Ожидает вывод владельцу",
    description:
      "Выплата вашей доли дохода ожидает подтверждения. После подтверждения средства поступят на лицевой счёт в течение 1–2 рабочих дней.",
    amount: 15000,
    date: "2026-01-15",
    actions: [{ label: "Подтвердить" }, { label: "Перейти в Управление" }],
  },
  {
    id: "f5",
    type: "news",
    importance: "Info",
    title: "Переоценка NAV по объекту RE-OF-03",
    description: "Квартальная переоценка стоимости объекта. Текущая оценка учтена в расчёте долей.",
    object: "RE-OF-03",
    mgmt: "УК CityLine",
    date: "2026-01-12",
    actions: [{ label: "Подробнее" }],
  },
  {
    id: "f6",
    type: "news",
    importance: "Info",
    title: "Платформа: обновление методики комиссий",
    description: "Изменения вступили в силу для объектов, добавленных после 1 января 2026.",
    mgmt: "Платформа Betwix",
    date: "2026-01-08",
    actions: [],
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

/* ------------------------------------------------------------------
   OwnerSubNavItem — 1:1 поведение с main navigation (Header).
   Тот же hover/active: текст blue-600, линия из центра (w-0 → w-full),
   duration-200 ease-out, лёгкий серый фон при hover.
------------------------------------------------------------------ */
function OwnerSubNavItem({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "group relative block shrink-0 rounded-md px-4 py-2 pb-1.5 font-medium transition-colors " +
        (active ? "text-blue-600" : "text-slate-800 hover:text-blue-600 hover:bg-slate-100")
      }
    >
      {label}
      {/* Линия как в main nav: из центра, 200ms ease-out, bg-blue-500 */}
      <span
        className={
          "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
          (active ? "w-full" : "w-0 group-hover:w-full")
        }
        aria-hidden
      />
    </button>
  );
}

/* ------------------------------------------------------------------
   AddObjectPilotModal — финальная точка воронки владельца, сбор интереса.
   Лёгкий MVP/финтех стиль: воздух, галочки, спокойная типографика.
------------------------------------------------------------------ */
const PILOT_MODAL_ITEMS = [
  "Вы в списке владельцев, заинтересованных в запуске",
  "Мы свяжемся с вами перед стартом пилота",
  "Никаких обязательств на этом этапе",
];

function AddObjectPilotModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-8 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-medium text-slate-900">Проект в тестовом запуске</h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-5 text-sm text-slate-700 leading-relaxed">
          Betwix сейчас находится на стадии тестирования. Мы собираем интерес владельцев, чтобы запустить пилот
          с управляющей компанией и первыми объектами.
        </p>
        <p className="mt-3 text-sm text-slate-700 leading-relaxed">
          Спасибо за ваш интерес — мы уведомим вас, когда добавление объектов станет доступно.
        </p>
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-900 mb-3">Что это значит</p>
          <ul className="space-y-2.5">
            {PILOT_MODAL_ITEMS.map((text, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 leading-relaxed">
                <CheckCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" aria-hidden />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-5 text-xs text-slate-500 leading-relaxed">
          Добавление объектов и юридические условия будут доступны после запуска пилота.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            variant="primary"
            className="rounded-full"
            onClick={onClose}
          >
            Понятно, жду уведомление
          </Button>
          <Button variant="secondary" className="rounded-full text-slate-700 hover:bg-slate-100" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
}

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
          {items.map((it) => (
            <OwnerSubNavItem
              key={it.id}
              active={section === it.id}
              onClick={() => setSection(it.id)}
              label={it.label}
            />
          ))}
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
  const { setUserFinancials } = useAuth();
  const [section, setSection] = useState<Section>("dashboard");
  const [period, setPeriod] = useState<Period>("month");
  const [addObjectModalOpen, setAddObjectModalOpen] = useState(false);

  // Zero balance when no objects; store in EUR, sync both EUR and USD for display
  const objectCount = MOCK_OBJECTS.length;
  useEffect(() => {
    if (objectCount === 0) {
      setUserFinancials({
        balanceUsd: 0,
        availableUsd: 0,
        balanceEur: 0,
        availableEur: 0,
      });
      return;
    }
    const totalEur = MOCK_ACCOUNT_EUR.balance;
    const availableEur = MOCK_ACCOUNT_EUR.available;
    const rateUsd = 1.08;
    setUserFinancials({
      balanceEur: totalEur,
      availableEur,
      balanceUsd: Math.round(totalEur * rateUsd * 100) / 100,
      availableUsd: Math.round(availableEur * rateUsd * 100) / 100,
    });
  }, [setUserFinancials, objectCount]);

  useEffect(() => {
    const state = location.state as { openSection?: Section } | null;
    if (state?.openSection && ["dashboard", "management", "notifications", "documents", "settings"].includes(state.openSection)) {
      setSection(state.openSection);
    }
  }, [location.state]);

  const handleAddObject = () => {
    setAddObjectModalOpen(true);
  };

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
          variant="outline"
          className="rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 shrink-0"
          onClick={handleAddObject}
        >
          <Plus className="mr-2 h-4 w-4" /> Добавить объект
        </Button>
      </div>
    ) : undefined;

  return (
    <div className="min-h-screen">
      <SubNav section={section} setSection={setSection} right={topBarRight} />

      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        {section === "dashboard" && <DashboardSection onNavigate={setSection} period={period} onAddObject={handleAddObject} />}
        {section === "management" && <ManagementSection onAddObject={handleAddObject} />}
        {section === "notifications" && <NotificationsSection />}
        {section === "documents" && <DocumentsSection onAddObject={handleAddObject} />}
        {section === "settings" && <SettingsSection />}
      </div>
      <AddObjectPilotModal open={addObjectModalOpen} onClose={() => setAddObjectModalOpen(false)} />
    </div>
  );
}

/* ------------------------------------------------------------------
   Sections
------------------------------------------------------------------ */

type DashboardSectionProps = {
  onNavigate: (s: Section) => void;
  period: Period;
  onAddObject: () => void;
};

const CHART_YEARS = [2022, 2023, 2024];
const CHART_INCOME_USD = [890000, 1020000, 1120000];
const CHART_YIELD_PCT = [5.2, 6.1, 6.5];

// Temporary flag for empty state demo
const demoEmptyOwner = true; // Set to false to show normal dashboard

function DashboardSection({ onNavigate, period, onAddObject }: DashboardSectionProps) {
  const navigate = useNavigate();
  const [previewTab, setPreviewTab] = useState<"objects" | "operations">("objects");
  const [chartMode, setChartMode] = useState<"usd" | "pct">("usd");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData>(PERIOD_SUMMARIES[period]);
  
  const hasObjects = !demoEmptyOwner && MOCK_OBJECTS.length > 0;

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
      <div className="h-2 rounded-full bg-slate-50 overflow-hidden">
        <div className="h-full bg-blue-600" style={{ width: `${Math.max(3, Math.min(100, widthPct))}%` }} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Hero block for empty state */}
      {!hasObjects && (
        <SoftCard>
          <div className="p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                Добавьте объект — управляющая компания подготовит расчёт
              </h2>
              <p className="text-base text-slate-600">
                Мы помогаем подготовить объект к запуску и инвестированию — от расчётов до выхода на платформу
              </p>
            </div>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
                <span className="text-sm font-medium text-slate-700">УК-партнёр:</span>
                <span className="text-sm font-semibold text-slate-900">GreenStone</span>
                <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs">Verified</Badge>
              </div>
              <Button
                onClick={onAddObject}
                className="!bg-blue-600 !text-white rounded-full px-4 py-2 text-sm font-medium transition-colors hover:!bg-blue-700 shrink-0 w-fit sm:ml-0"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Добавить объект
              </Button>
            </div>
            
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
              {/* Left column — сравнение (основное внимание) */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Кредит на новый объект</h4>
                    <ul className="space-y-1.5 text-sm text-slate-600">
                      <li className="flex items-center gap-2">
                        <span className="text-slate-400">×</span>
                        Банк и проверки
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-slate-400">×</span>
                        Много документов
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-slate-400">×</span>
                        Проценты и долг
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-slate-400">×</span>
                        Вся аренда уходит на выплаты
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-slate-400">×</span>
                        Частые отказы
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-slate-400">×</span>
                        Медленно и рискованно
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">Модель Betwix</h4>
                    <ul className="space-y-1.5 text-sm text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">✓</span>
                        Без кредита
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">✓</span>
                        Без продажи собственности
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">✓</span>
                        Продаётся только часть будущего дохода
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">✓</span>
                        Инвесторы вместо банка
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">✓</span>
                        Покупка следующего объекта через УК
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-blue-500">✓</span>
                        У вас 2 объекта вместо 1
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                  <p className="text-sm font-medium text-slate-800">
                    Вы масштабируете арендный бизнес, не беря долг и не теряя объект.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/owner/how-it-works")}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 hover:underline shrink-0"
                  >
                    Как это работает
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Right column — компактный блок */}
              <div className="shrink-0 flex flex-col gap-4 lg:w-72 lg:pl-6 lg:border-l lg:border-slate-200">
                <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700">После добавления объекта вы получите</h4>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <TrendingUp className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      Расчёт доходности и рисков
                    </li>
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      Доступ к инвесторам платформы
                    </li>
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      Юридическую и финансовую структуру
                    </li>
                    <li className="flex items-start gap-2 text-xs text-slate-600">
                      <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      Сопровождение до запуска объекта
                    </li>
                  </ul>
                  <div className="text-xs text-slate-500 pt-1">120+ объектов · €340M под управлением</div>
                </div>
              </div>
            </div>
            
            {/* 3-step timeline */}
            <div id="how-it-works" className="pt-6 border-t border-slate-100">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">Заполните данные объекта</div>
                    <div className="text-xs text-slate-500">3–5 мин</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center flex-shrink-0 px-2 text-slate-400" aria-hidden>
                  <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} />
                </div>
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">УК сделает расчёт доходности и рисков</div>
                    <div className="text-xs text-slate-500">Автоматически</div>
                  </div>
                </div>
                <div className="hidden md:flex items-center flex-shrink-0 px-2 text-slate-400" aria-hidden>
                  <ArrowRight className="h-5 w-5 shrink-0" strokeWidth={2} />
                </div>
                <div className="flex gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-slate-900">Мы свяжемся с вами и запустим объект</div>
                    <div className="text-xs text-slate-500">В течение 24 часов</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SoftCard>
      )}
      
      <SectionShell>
        {/* KPI tiles (4 cards, same layout as Investor cabinet) - hidden in empty state */}
        {hasObjects && (
          <>
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
          </>
        )}

        {/* Main column - full width */}
        <div className="flex flex-col gap-4">
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
                  {hasObjects && (
                    <Button
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => onNavigate("dashboard")}
                    >
                      {previewTab === "objects" ? "Все объекты" : "Все операции"}{" "}
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </Button>
                  )}
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
                    {!hasObjects ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-slate-500">Пока нет объектов</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={onAddObject}
                              className="rounded-full border-slate-300 text-slate-600 hover:bg-slate-50"
                            >
                              <Plus className="mr-1.5 h-3.5 w-3.5" /> Добавить объект
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      MOCK_OBJECTS.slice(0, 4).map((o) => (
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
                        ))
                      )}
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
                        {!hasObjects ? (
                          <tr>
                            <td colSpan={8} className="p-12 text-center">
                              <p className="text-sm text-slate-500">Появится после запуска объекта</p>
                            </td>
                          </tr>
                        ) : (
                          MOCK_TX.slice(0, 5).map((t) => (
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
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </SoftCard>

            {/* Доход объекта во времени (Income Chart) - hidden in empty state */}
            {hasObjects && (
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
                    const isLastYear = i === CHART_YEARS.length - 1;
                    return (
                      <div key={y} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full h-32 rounded-t bg-slate-100 overflow-hidden flex flex-col justify-end">
                          <div
                            className={`w-full transition-all ${
                              isLastYear ? "bg-blue-600" : "bg-blue-400"
                            }`}
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
                {/* KPI row under chart */}
                <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">Годовой доход</div>
                    <div className="mt-0.5 text-sm font-semibold text-slate-900">{money(summary.annualIncome)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">Δ YoY</div>
                    <div
                      className={`mt-0.5 text-sm font-semibold ${
                        summary.growthPct >= 0 ? "text-blue-600" : "text-amber-700"
                      }`}
                    >
                      {summary.growthPct >= 0 ? "+" : ""}
                      {summary.growthPct}%
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500">Кол-во инвесторов</div>
                    <div className="mt-0.5 text-sm font-semibold text-slate-900">
                      {summary.investors.toLocaleString("ru-RU")}
                    </div>
                  </div>
                </div>
              </div>
            </SoftCard>
            )}

            {/* Распределение аренды (Distribution) - hidden in empty state */}
            {hasObjects && (
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
            )}
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

// Вывод статуса УК для карточки: Verified / Under review / Risk + подсказка
function getMgmtStatus(c: MgmtItem): { label: MgmtStatusLabel; tooltip: string } {
  const hasRisk = c.reportsStatus === "pending" && (c.incidentsCount ?? 0) > 0;
  if (hasRisk) return { label: "Risk", tooltip: "Есть просрочки отчётности или инциденты. Рекомендуется обратить внимание." };
  if (c.verified && c.reportsStatus === "ok")
    return { label: "Verified", tooltip: "УК проверена платформой, отчётность в срок." };
  if (c.verified)
    return { label: "Under review", tooltip: "УК проверена. Ожидается отчёт или идёт проверка данных." };
  return { label: "Under review", tooltip: "УК на проверке платформой." };
}

/* ------------------------------------------------------------------
   Management — панель контроля качества управления объектами.
   Не справочник УК: доверие, контроль, дисциплина, выбор другой УК, empty state.
------------------------------------------------------------------ */

function ManagementSection({ onAddObject }: { onAddObject: () => void }) {
  const navigate = useNavigate();
  const connectedUk = MOCK_MGMT;
  const otherUk = MOCK_OTHER_MGMT;
  const hasUk = connectedUk.length > 0;

  return (
    <SectionShell
      title="Управляющие компании"
      subtitle="Контроль управления, отчётности и дисциплины по вашим объектам"
    >
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Основные УК (подключённые) — KPI-блоки */}
        {hasUk && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Подключённые УК</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {connectedUk.map((c) => {
                const status = getMgmtStatus(c);
                return (
                  <SoftCard key={c.id}>
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Building2 className="h-5 w-5 text-slate-500 shrink-0" aria-hidden />
                          <span className="font-semibold text-slate-900">{c.name}</span>
                          <Badge
                            title={status.tooltip}
                            className={
                              "shrink-0 " +
                              (status.label === "Verified"
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                : status.label === "Risk"
                                ? "bg-rose-50 text-rose-700 hover:bg-rose-50"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-100")
                            }
                          >
                            {status.label}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full text-blue-600 hover:text-blue-700 shrink-0"
                          onClick={() => navigate("/owner")}
                        >
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
                          <div
                            className={
                              c.reportsStatus === "ok"
                                ? "text-emerald-700 font-semibold"
                                : "text-rose-600 font-semibold"
                            }
                          >
                            {c.reportsStatus === "ok" ? "Вовремя" : "Просрочка"}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 space-y-1 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>Последний отчёт</span>
                          <span className="text-slate-900">{c.lastReportDate ?? "—"}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Инциденты (простой / задержки)</span>
                          <span className="text-slate-900">{c.incidentsCount ?? 0}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="rounded-full"
                          size="sm"
                          onClick={() => navigate("/owner")}
                        >
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
                );
              })}
            </div>
          </div>
        )}

        {/* Инфо-блок: почему УК обязательна */}
        <SoftCard className="border-blue-100 bg-blue-50/40">
          <div className="p-6 flex gap-4">
            <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Почему управление через УК обязательно</h3>
              <p className="text-sm text-slate-700 mb-2">
                Управляющая компания обеспечивает: прозрачность доходов, контроль простоя и расходов,
                корректную отчётность для инвесторов. Это защищает владельца, инвесторов и платформу
                и является обязательной частью модели Betwix.
              </p>
            </div>
          </div>
        </SoftCard>

        {/* Другие УК — выбор для новых объектов / заявка */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-1">Другие управляющие компании</h2>
          <p className="text-sm text-slate-600 mb-4">
            Вы можете выбрать другую УК для новых объектов или подать заявку на подключение своей.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {otherUk.map((uk) => (
              <SoftCard key={uk.id} className="flex flex-col">
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900">{uk.name}</span>
                    <Badge
                      className={
                        uk.status === "verified"
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-100"
                      }
                    >
                      {uk.status === "verified" ? "Verified" : "In review"}
                    </Badge>
                  </div>
                  {uk.specialization && (
                    <p className="text-xs text-slate-500">{uk.specialization}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full text-sm"
                      onClick={() => navigate("/owner")}
                    >
                      Выбрать для объекта
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-sm text-slate-600"
                      onClick={() => {}}
                    >
                      Подать заявку
                    </Button>
                  </div>
                </div>
              </SoftCard>
            ))}
          </div>
        </div>

        {/* CTA-блок — только когда уже есть УК (масштабирование) */}
        {hasUk && (
          <SoftCard>
            <div className="p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">Масштабирование</p>
                <p className="text-sm text-slate-600 mt-0.5">Добавьте объект и выберите УК для него.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={onAddObject}
                >
                  <Plus className="h-4 w-4 mr-1.5" aria-hidden />
                  Добавить объект и выбрать УК
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => navigate("/owner/how-it-works")}
                >
                  Подать заявку на подключение своей УК
                </Button>
              </div>
            </div>
          </SoftCard>
        )}

        {/* Empty state: когда у пользователя ещё нет УК */}
        {!hasUk && (
          <SoftCard>
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Building2 className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Управляющая компания подключается после добавления объекта</h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  УК отвечает за аренду, отчётность и операционное управление. Вы контролируете показатели в этом разделе.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={onAddObject}
                >
                  <Plus className="h-4 w-4 mr-1.5" aria-hidden />
                  Добавить объект
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => navigate("/owner/how-it-works")}
                >
                  Как работает управление через УК
                </Button>
              </div>
            </div>
          </SoftCard>
        )}
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------
   Notifications — хроника событий арендного бизнеса (business news feed).
   Не inbox и не alert-list: поиск, фильтры по датам/типу/важности/объекту/УК,
   лента с группировкой по датам, одна запись = маркер + заголовок + мета + описание + действия.
------------------------------------------------------------------ */

const FEED_TODAY_REF = "2026-01-20"; // опорная «сегодня» для группировки

type DateRangeKey = "today" | "7d" | "30d" | "custom";

function NotificationsSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [filterType, setFilterType] = useState<FeedItemType | "">("");
  const [filterImportance, setFilterImportance] = useState<FeedImportance | "">("");
  const [filterObject, setFilterObject] = useState("");
  const [filterMgmt, setFilterMgmt] = useState("");

  // Бизнес-логика: один список записей, фильтрация по поиску, дате, типу, важности, объекту, УК
  const allItems = MOCK_FEED;
  const uniqueObjects = useMemo(() => Array.from(new Set(allItems.map((i) => i.object).filter(Boolean))) as string[], [allItems]);
  const uniqueMgmt = useMemo(() => Array.from(new Set(allItems.map((i) => i.mgmt).filter(Boolean))) as string[], [allItems]);

  const filtered = useMemo(() => {
    let list = [...allItems];
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.object?.toLowerCase().includes(q)) ||
          (i.mgmt?.toLowerCase().includes(q)) ||
          (i.amount != null && String(i.amount).includes(q))
      );
    }
    const now = new Date(FEED_TODAY_REF);
    const todayStr = now.toISOString().slice(0, 10);
    const past = (days: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() - days);
      return d.toISOString().slice(0, 10);
    };
    let from = todayStr;
    let to = todayStr;
    if (dateRange === "today") {
      from = to = todayStr;
    } else if (dateRange === "7d") {
      from = past(7);
      to = todayStr;
    } else if (dateRange === "30d") {
      from = past(30);
      to = todayStr;
    } else if (dateRange === "custom" && customFrom && customTo) {
      from = customFrom;
      to = customTo;
    }
    list = list.filter((i) => i.date >= from && i.date <= to);
    if (filterType) list = list.filter((i) => i.type === filterType);
    if (filterImportance) list = list.filter((i) => i.importance === filterImportance);
    if (filterObject) list = list.filter((i) => i.object === filterObject);
    if (filterMgmt) list = list.filter((i) => i.mgmt === filterMgmt);
    return list.sort((a, b) => (b.date < a.date ? -1 : b.date > a.date ? 1 : 0));
  }, [allItems, searchQuery, dateRange, customFrom, customTo, filterType, filterImportance, filterObject, filterMgmt]);

  const groupedByDate = useMemo(() => {
    const groups: { label: string; items: FeedItem[] }[] = [];
    let currentLabel = "";
    for (const item of filtered) {
      const label = feedDateGroupLabel(item.date, FEED_TODAY_REF);
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, items: [] });
      }
      groups[groups.length - 1].items.push(item);
    }
    return groups;
  }, [filtered]);

  return (
    <SectionShell
      title="Уведомления"
      subtitle="Хроника событий, новостей и сигналов по вашему арендному бизнесу"
    >
      <div className="space-y-4 max-w-4xl">
        {/* Панель управления лентой */}
        <SoftCard>
          <div className="p-4 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
                <Input
                  type="search"
                  placeholder="Поиск по объекту, УК, сумме, событию"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-white border-slate-200 rounded-lg"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500 shrink-0">Период:</span>
                {(["today", "7d", "30d"] as const).map((key) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={dateRange === key ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setDateRange(key)}
                  >
                    {key === "today" ? "Сегодня" : key === "7d" ? "7 дней" : "30 дней"}
                  </Button>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-36 h-9 text-sm rounded-lg border-slate-200"
                  />
                  <span className="text-slate-400">—</span>
                  <Input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-36 h-9 text-sm rounded-lg border-slate-200"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setDateRange("custom")}
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <span className="text-sm text-slate-500">Тип:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType((e.target.value || "") as FeedItemType | "")}
                className="rounded-lg border border-slate-200 text-sm text-slate-700 bg-white h-9 px-2"
              >
                <option value="">Все</option>
                <option value="event">События</option>
                <option value="news">Новости</option>
                <option value="personal">Персональные</option>
              </select>
              <span className="text-sm text-slate-500 ml-2">Важность:</span>
              <select
                value={filterImportance}
                onChange={(e) => setFilterImportance((e.target.value || "") as FeedImportance | "")}
                className="rounded-lg border border-slate-200 text-sm text-slate-700 bg-white h-9 px-2"
              >
                <option value="">Все</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
              {uniqueObjects.length > 0 && (
                <>
                  <span className="text-sm text-slate-500 ml-2">Объект:</span>
                  <select
                    value={filterObject}
                    onChange={(e) => setFilterObject(e.target.value)}
                    className="rounded-lg border border-slate-200 text-sm text-slate-700 bg-white h-9 px-2 min-w-[120px]"
                  >
                    <option value="">Все</option>
                    {uniqueObjects.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </>
              )}
              {uniqueMgmt.length > 0 && (
                <>
                  <span className="text-sm text-slate-500 ml-2">УК:</span>
                  <select
                    value={filterMgmt}
                    onChange={(e) => setFilterMgmt(e.target.value)}
                    className="rounded-lg border border-slate-200 text-sm text-slate-700 bg-white h-9 px-2 min-w-[120px]"
                  >
                    <option value="">Все</option>
                    {uniqueMgmt.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>
        </SoftCard>

        {/* Лента: группировка по датам, формат записи с маркером и действиями */}
        {filtered.length === 0 ? (
          <SoftCard>
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700">
                Здесь будет отображаться история событий, новостей и сигналов по вашему арендному бизнесу.
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Это нормально, лента заполняется по мере работы бизнеса.
              </p>
            </div>
          </SoftCard>
        ) : (
          <div className="space-y-6">
            {groupedByDate.map(({ label, items }) => (
              <div key={label}>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{label}</h3>
                <div className="space-y-0 border-l border-slate-200 pl-0">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-4 py-4 border-b border-slate-100 last:border-b-0"
                    >
                      <div
                        className={
                          "w-0.5 flex-shrink-0 self-stretch min-h-[60px] rounded-full " +
                          (item.importance === "Critical"
                            ? "bg-rose-400"
                            : item.importance === "Warning"
                            ? "bg-amber-400"
                            : "bg-slate-300")
                        }
                        aria-hidden
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-0 mt-1 text-xs text-slate-500">
                          {item.object && <span>Объект: {item.object}</span>}
                          {item.mgmt && <span>УК: {item.mgmt}</span>}
                          {item.amount != null && <span>{money(item.amount)}</span>}
                          <span>{formatDateDisplay(item.date)}</span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{item.description}</p>
                        {item.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {item.actions.map((a, idx) => (
                              <Button
                                key={idx}
                                variant="ghost"
                                size="sm"
                                className="rounded-full text-blue-600 hover:text-blue-700 h-8"
                                onClick={() => navigate("/owner")}
                              >
                                {a.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionShell>
  );
}

/* ------------------------------------------------------------------
   Documents — информационный и доверительный экран для владельца без объектов.
   Не файловое хранилище: объясняем, какие документы будут, когда появятся, зачем.
   Empty state с одним главным CTA. Таблицу документов не показываем (MVP).
------------------------------------------------------------------ */

function DocumentsSection({ onAddObject }: { onAddObject: () => void }) {
  const navigate = useNavigate();

  const processSteps = [
    "Добавление объекта",
    "Расчёты платформы",
    "Выбор доли",
    "Подключение УК",
    "Появление договоров",
    "После запуска — отчёты и акты",
  ];

  return (
    <SectionShell
      title="Документы и отчётность"
      subtitle="Юридические и финансовые документы формируются автоматически по мере работы с объектами и инвесторами."
    >
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Что здесь будет — карточки категорий */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Что здесь будет</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SoftCard>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-500" aria-hidden />
                  <span className="font-semibold text-slate-900">Договоры</span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>договор с УК</li>
                  <li>условия участия в модели</li>
                  <li>соглашения по объектам</li>
                </ul>
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Появляются после добавления объекта
                </p>
              </div>
            </SoftCard>
            <SoftCard>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-slate-500" aria-hidden />
                  <span className="font-semibold text-slate-900">Финансовые документы</span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>акты распределения дохода</li>
                  <li>отчёты по выплатам</li>
                </ul>
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Формируются автоматически
                </p>
              </div>
            </SoftCard>
            <SoftCard>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-500" aria-hidden />
                  <span className="font-semibold text-slate-900">Отчёты УК</span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>аренда</li>
                  <li>простой</li>
                  <li>расходы и доход</li>
                </ul>
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                  Используются для расчёта выплат
                </p>
              </div>
            </SoftCard>
          </div>
        </div>

        {/* Как появляются документы — линейный процесс */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Как появляются документы</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              {processSteps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-700">{step}</span>
                  </div>
                  {i < processSteps.length - 1 && (
                    <ArrowRight className="hidden sm:block flex-shrink-0 h-4 w-4 text-slate-300" aria-hidden />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </SoftCard>

        {/* Блок доверия */}
        <SoftCard className="border-blue-100 bg-blue-50/50">
          <div className="p-6 flex gap-4">
            <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Основано на документах</h3>
              <p className="text-sm text-slate-700">
                Все выплаты, доли и расчёты в Betwix основаны на официальных документах и отчётности УК.
                Это защищает владельца, инвесторов и платформу.
              </p>
            </div>
          </div>
        </SoftCard>

        {/* Empty state — вместо таблицы */}
        <SoftCard>
          <div className="p-8 text-center space-y-4">
            <div className="text-slate-400 mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
              <FileText className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Документов пока нет</h3>
              <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                Документы появятся после добавления первого объекта и запуска процесса инвестирования.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                className="rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={onAddObject}
              >
                <Plus className="h-4 w-4 mr-1.5" aria-hidden />
                Добавить объект
              </Button>
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => navigate("/owner/how-it-works")}
              >
                Как это работает
              </Button>
            </div>
          </div>
        </SoftCard>
      </div>
    </SectionShell>
  );
}

/** Format balance for display: 2 decimals, currency symbol. Same as header. */
function formatBalanceDisplay(amount: number, currency: "USD" | "EUR"): string {
  const symbol = currency === "USD" ? "$" : "€";
  return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Лицевой счёт владельца: balance/available from context (0 when no objects). */
function OwnerWalletCard() {
  const { balance, available, currency } = useAuth();
  return (
    <SoftCard>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-slate-500" aria-hidden />
          <h2 className="text-lg font-semibold text-slate-900">Лицевой счёт владельца</h2>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 text-sm">
          <div className="font-medium text-slate-700">Текущий баланс</div>
          <div className="text-xl font-semibold text-slate-900 mt-1">{formatBalanceDisplay(balance, currency)}</div>
          <p className="text-slate-500 mt-2">Отображается в разделе «Управление» по объектам</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
          <div>
            <div className="font-medium text-slate-700">Источники средств</div>
            <div className="mt-1 text-slate-600">Ваша доля аренды, возвраты, корректировки</div>
          </div>
          <div>
            <div className="font-medium text-slate-700">Куда направить</div>
            <div className="mt-1 text-slate-600">Вывод на реквизиты, реинвест, выкуп долей</div>
          </div>
        </div>
        <p className="text-sm text-amber-700/90 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          Средства от сбора средств с инвесторов не выводятся как кэш — они идут в объект.
        </p>
      </div>
    </SoftCard>
  );
}

/* ------------------------------------------------------------------
   Owner Control Panel — панель управления арендным бизнесом (Settings).
   Не «профиль», а правила игры: доли, деньги, УК, уведомления, юридика.
------------------------------------------------------------------ */

function SettingsSection() {
  return (
    <SectionShell
      title="Панель управления"
      subtitle="Контроль бизнес-модели, денег, УК и уведомлений"
    >
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* 1. Моя бизнес-модель */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-slate-500" aria-hidden />
              <h2 className="text-lg font-semibold text-slate-900">Моя бизнес-модель</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div>
                <div className="font-medium text-slate-700">Доля, доступная к продаже</div>
                <div className="mt-1 text-slate-600">10–30% от объекта — вы задаёте диапазон при запуске</div>
              </div>
              <div>
                <div className="font-medium text-slate-700">Цель масштабирования</div>
                <div className="mt-1 text-slate-600">Покупка следующего объекта, реинвест в текущий</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 border-l-2 border-slate-200 pl-3">
              Это не кредит и не продажа собственности: вы остаётесь владельцем, инвесторы получают долю в доходах.
            </p>
          </div>
        </SoftCard>

        {/* 2. Деньги и распределение дохода */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-slate-500" aria-hidden />
              <h2 className="text-lg font-semibold text-slate-900">Деньги и распределение дохода</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div>
                <div className="font-medium text-slate-700">Ваша доля vs доля инвесторов</div>
                <div className="mt-1 text-slate-600">Распределение задаётся при создании объекта и отображается в карточке объекта</div>
              </div>
              <div>
                <div className="font-medium text-slate-700">Принцип распределения</div>
                <div className="mt-1 text-slate-600">После удержаний УК и платформы — пропорционально долям</div>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-sm font-medium text-slate-700">Настройки</div>
              <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                <li>Вывод дохода на счёт или использование внутри Betwix</li>
                <li>Приоритет: реинвест в объект / выкуп долей / вывод</li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="secondary" size="sm" className="rounded-full">Настроить вывод</Button>
                <Button variant="secondary" size="sm" className="rounded-full">Приоритет использования</Button>
              </div>
            </div>
          </div>
        </SoftCard>

        {/* 3. Лицевой счёт владельца — balance/available from context (0 when no objects) */}
        <OwnerWalletCard />

        {/* 4. Управляющая компания */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-slate-500" aria-hidden />
              <h2 className="text-lg font-semibold text-slate-900">Управляющая компания (УК)</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-800">Название УК</span>
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50">Verified</Badge>
            </div>
            <p className="text-sm text-slate-600">
              УК ведёт объект: аренда, эксплуатация, отчётность. Вы получаете данные и контроль без операционки.
            </p>
            <div className="text-sm">
              <div className="font-medium text-slate-700">Какие данные передаёт УК</div>
              <ul className="mt-1 text-slate-600 list-disc list-inside space-y-0.5">
                <li>Доход и простой</li>
                <li>Отчёты и документы</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-sm font-medium text-slate-700 mb-2">Уведомления от УК</div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Отчёты
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Простой и инциденты
                </label>
              </div>
            </div>
          </div>
        </SoftCard>

        {/* 5. Доли и P2P-рынок */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" aria-hidden />
              <h2 className="text-lg font-semibold text-slate-900">Доли и P2P-рынок</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
              <div>
                <div className="font-medium text-slate-700">Что могут инвесторы</div>
                <div className="mt-1 text-slate-600">Покупать и продавать доли на вторичном рынке, получать долю дохода</div>
              </div>
              <div>
                <div className="font-medium text-slate-700">Что можете вы</div>
                <div className="mt-1 text-slate-600">Выкупать доли у инвесторов, задавать правила ликвидности</div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-sm font-medium text-slate-700 mb-2">Выкуп долей</div>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="radio" name="buyback" defaultChecked className="border-slate-300" /> Ручной
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="radio" name="buyback" className="border-slate-300" /> Автоматический при предложении
                </label>
              </div>
            </div>
          </div>
        </SoftCard>

        {/* 6. Уведомления — только бизнес-события */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-slate-500" aria-hidden />
              <h2 className="text-lg font-semibold text-slate-900">Уведомления</h2>
            </div>
            <p className="text-sm text-slate-600">Только бизнес-события. Без маркетинга.</p>
            <div className="space-y-2 text-sm">
              {[
                "Простой объекта",
                "Отклонение доходности от плана",
                "Отчёты УК",
                "Продажа долей инвесторами",
                "Возможность выкупа долей",
                "Готовность к покупке нового объекта",
              ].map((label, i) => (
                <label key={i} className="flex items-center gap-2 text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300" />
                  {label}
                </label>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="rounded-full">Сохранить уведомления</Button>
          </div>
        </SoftCard>

        {/* 7. Правила и юридика — инфо-блок */}
        <SoftCard>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-slate-500" aria-hidden />
              <h2 className="text-lg font-semibold text-slate-900">Правила и юридика</h2>
            </div>
            <p className="text-sm text-slate-600">
              Короткие принципы: вы владеете объектом, инвесторы — долями в доходах. УК управляет операционкой. Платформа обеспечивает учёт и распределение.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/owner/how-it-works" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Как это работает
              </Link>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-700 hover:underline">
                Условия
              </a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-700 hover:underline">
                Роль УК
              </a>
            </div>
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