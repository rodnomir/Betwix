import React, { useMemo, useState } from "react";
import PageContainer from "@/components/PageContainer";
import SubTabs, { SubTabsSection } from "@/components/SubTabs";
import {
  TrendingUp,
  TrendingDown,
  Timer,
  ArrowLeftRight,
  Shield,
  SlidersHorizontal,
  Search,
  Star,
  Flame,
  Clock3,
  Info,
  Percent,
  X,
  Landmark,
  MapPin,
  BadgeDollarSign,
} from "lucide-react";

// NOTE:
// - Self-contained page for Canvas preview.
// - Uses Tailwind classes.
// - Replace mock data with your API later.

type Region = "Все регионы" | "Европа" | "США" | "Азия" | "Восток" | "LatAm" | "СНГ";

type AssetType =
  | "Все типы"
  | "Коммерческая"
  | "Офисная"
  | "Торговая"
  | "Склады"
  | "Бизнес"
  | "Жилая";

type Urgency = "Норм" | "Срочно" | "Не срочно";

type Listing = {
  id: number;
  starred?: boolean;
  assetName: string;
  assetType: Exclude<AssetType, "Все типы">;
  country: string;
  city: string;
  sharePct: number; // percent of property token/ownership
  price: number; // quote currency
  nav: number; // fair value (NAV)
  yieldPct: number; // distribution yield
  holdMonths: number;
  urgency: Urgency;
  sellerNote?: string;
  liquidityScore: "Высокая" | "Средняя" | "Низкая";
  assetValue: number; // total asset valuation
  investorsCount: number;
  totalShares: number;
  avgP2PPrice: number;
  lastDealDays: number;
  turnover30d: number;
  concentrationPct: number;
};

const fmtMoney = (v: number, currency: "USD" | "EUR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(v);

const fmtPct = (v: number, digits = 1) => `${v.toFixed(digits)}%`;

const fmtLastDeal = (days: number) => {
  if (days <= 0) return "сегодня";
  if (days === 1) return "1 дн назад";
  if (days < 5) return `${days} дн назад`;
  if (days < 30) return `${Math.floor(days / 7)} нед назад`;
  return `${Math.floor(days / 30)} мес назад`;
};

/** Deterministic mock data generator — ~20 listings per region, ~120 total */
function generateMockListings(): Listing[] {
  const assetTypes: Exclude<AssetType, "Все типы">[] = [
    "Коммерческая",
    "Офисная",
    "Торговая",
    "Склады",
    "Бизнес",
    "Жилая",
  ];
  const sellerNotes: string[] = [
    "Ребаланс портфеля",
    "Фиксация прибыли",
    "Вывод части доли",
    "Нужна ликвидность",
    "Ротация активов",
    "Перераспределение по регионам",
    "Диверсификация",
    "Смена стратегии",
    "Реинвестирование",
    "Завершение проекта",
    "Переезд",
    "Консолидация активов",
  ];
  const liquidityScores: Array<"Высокая" | "Средняя" | "Низкая"> = [
    "Высокая",
    "Высокая",
    "Средняя",
    "Средняя",
    "Низкая",
  ];
  const urgencies: Urgency[] = ["Норм", "Норм", "Норм", "Срочно", "Не срочно"];

  type RegionLoc = { country: string; city: string };
  const regionLocs: Record<Exclude<Region, "Все регионы">, RegionLoc[]> = {
    Европа: [
      { country: "Великобритания", city: "Лондон" },
      { country: "Великобритания", city: "Манчестер" },
      { country: "Великобритания", city: "Бирмингем" },
      { country: "Испания", city: "Мадрид" },
      { country: "Испания", city: "Барселона" },
      { country: "Испания", city: "Валенсия" },
      { country: "Португалия", city: "Лиссабон" },
      { country: "Португалия", city: "Порту" },
      { country: "Германия", city: "Берлин" },
      { country: "Германия", city: "Мюнхен" },
      { country: "Франция", city: "Париж" },
      { country: "Франция", city: "Лион" },
      { country: "Италия", city: "Милан" },
      { country: "Нидерланды", city: "Амстердам" },
    ],
    США: [
      { country: "США", city: "Нью-Йорк" },
      { country: "США", city: "Лос-Анджелес" },
      { country: "США", city: "Остин" },
      { country: "США", city: "Майами" },
      { country: "США", city: "Чикаго" },
      { country: "США", city: "Даллас" },
      { country: "США", city: "Сан-Франциско" },
      { country: "США", city: "Сиэтл" },
      { country: "США", city: "Денвер" },
      { country: "США", city: "Бостон" },
    ],
    Азия: [
      { country: "Япония", city: "Токио" },
      { country: "Япония", city: "Осака" },
      { country: "Сингапур", city: "Сингапур" },
      { country: "Южная Корея", city: "Сеул" },
      { country: "Южная Корея", city: "Пусан" },
      { country: "Гонконг", city: "Гонконг" },
      { country: "Таиланд", city: "Бангкок" },
      { country: "Вьетнам", city: "Хошимин" },
      { country: "Индонезия", city: "Джакарта" },
      { country: "Малайзия", city: "Куала-Лумпур" },
    ],
    Восток: [
      { country: "ОАЭ", city: "Дубай" },
      { country: "ОАЭ", city: "Абу-Даби" },
      { country: "ОАЭ", city: "Шарджа" },
      { country: "Саудовская Аравия", city: "Эр-Рияд" },
      { country: "Саудовская Аравия", city: "Джидда" },
      { country: "Катар", city: "Доха" },
      { country: "Бахрейн", city: "Манама" },
      { country: "Кувейт", city: "Эль-Кувейт" },
      { country: "Оман", city: "Маскат" },
      { country: "Иордания", city: "Амман" },
    ],
    LatAm: [
      { country: "Бразилия", city: "Сан-Паулу" },
      { country: "Бразилия", city: "Рио-де-Жанейро" },
      { country: "Мексика", city: "Мехико" },
      { country: "Мексика", city: "Канкун" },
      { country: "Аргентина", city: "Буэнос-Айрес" },
      { country: "Чили", city: "Сантьяго" },
      { country: "Колумбия", city: "Богота" },
      { country: "Колумбия", city: "Медельин" },
      { country: "Перу", city: "Лима" },
      { country: "Панама", city: "Панама" },
    ],
    СНГ: [
      { country: "Россия", city: "Москва" },
      { country: "Россия", city: "Санкт-Петербург" },
      { country: "Россия", city: "Казань" },
      { country: "Казахстан", city: "Алматы" },
      { country: "Казахстан", city: "Астана" },
      { country: "Беларусь", city: "Минск" },
      { country: "Грузия", city: "Тбилиси" },
      { country: "Армения", city: "Ереван" },
      { country: "Узбекистан", city: "Ташкент" },
      { country: "Азербайджан", city: "Баку" },
    ],
  };

  const out: Listing[] = [];
  let id = 1;

  for (const region of ["Европа", "США", "Азия", "Восток", "LatAm", "СНГ"] as const) {
    const locs = regionLocs[region];
    const count = 18 + (id % 5); // 18–22 per region
    for (let i = 0; i < count; i++) {
      const loc = locs[i % locs.length];
      const basePrice = 5000 + (id * 347) % 25000;
      const discPct = ((id * 13) % 31) - 15; // -15..15%
      const nav = Math.round(basePrice * 1.02);
      const price = Math.round(nav * (1 + discPct / 100));
      const sharePct = 0.8 + ((id * 7) % 25) / 10;
      const yieldPct = (id % 7 === 0) ? 0 : 6 + ((id * 11) % 65) / 10;
      const holdMonths = 3 + (id * 5) % 24;
      const assetType = assetTypes[(id + region.charCodeAt(0)) % assetTypes.length];
      const sellerNote = sellerNotes[(id + i) % sellerNotes.length];
      const liquidityScore = liquidityScores[(id + i * 3) % liquidityScores.length];
      const urgency = urgencies[(id + i * 2) % urgencies.length];
      const assetValue = Math.round((nav / (sharePct / 100)) * (1 + (id % 11) / 100));
      const investorsCount = 12 + (id * 7) % 88;
      const totalShares = 1000 + (id * 137) % 9000;
      const avgP2PPrice = Math.round(nav * (0.95 + (id % 15) / 500));
      const lastDealDays = 1 + (id * 3) % 21;
      const turnover30d = Math.round((assetValue * 0.02 * (1 + (id % 9) / 10)) / 1000) * 1000;
      const concentrationPct = 45 + (id * 11) % 45;
      out.push({
        id: id++,
        starred: id % 7 === 0,
        assetName: `RE-APT · №${String(id).padStart(3, "0")}`,
        assetType,
        country: loc.country,
        city: loc.city,
        sharePct: Math.round(sharePct * 10) / 10,
        price,
        nav,
        yieldPct: Math.round(yieldPct * 10) / 10,
        holdMonths,
        urgency,
        sellerNote,
        liquidityScore,
        assetValue,
        investorsCount,
        totalShares,
        avgP2PPrice,
        lastDealDays,
        turnover30d,
        concentrationPct,
      });
    }
  }

  return out;
}

const mockListings = generateMockListings();

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
      {children}
    </span>
  );
}

function MetricCard({
  title,
  value,
  delta,
  hint,
  icon,
}: {
  title: string;
  value: string;
  delta?: { value: string; up?: boolean };
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card-market-hover rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          {icon}
          <span>{title}</span>
        </div>
        {delta && (
          <div
            className={
              "text-xs font-medium inline-flex items-center gap-1 " +
              (delta.up ? "text-[#10B981]" : "text-[#EF4444]")
            }
          >
            {delta.up ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {delta.value}
          </div>
        )}
      </div>

      <div className="mt-1 text-lg font-medium tracking-tight">{value}</div>
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors " +
        (active
          ? "bg-slate-100 text-slate-700"
          : "text-slate-600 hover:bg-slate-50")
      }
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={
        "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm transition hover:bg-slate-50 " +
        (checked ? "border-blue-500" : "")
      }
    >
      <span
        className={
          "h-4 w-7 rounded-full border p-0.5 flex items-center " +
          (checked ? "bg-blue-50 border-blue-500" : "bg-slate-100 border-slate-200")
        }
      >
        <span
          className={
            "h-3 w-3 rounded-full bg-white shadow-none transition " +
            (checked ? "translate-x-3" : "translate-x-0")
          }
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

function Drawer({
  open,
  onClose,
  item,
  currency,
}: {
  open: boolean;
  onClose: () => void;
  item: Listing | null;
  currency: "USD" | "EUR";
}) {
  if (!open || !item) return null;

  const discountPct = ((item.price - item.nav) / item.nav) * 100;
  const discountLabel = discountPct >= 0 ? `+${fmtPct(discountPct, 1)}` : fmtPct(discountPct, 1);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-[440px] bg-white shadow-lg border-l border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <div className="text-sm text-slate-500">P2P заявка</div>
            <div className="text-lg font-medium">{item.assetName}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-50 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <Landmark className="h-4 w-4" />
                  {item.assetType}
                </div>
                <div className="text-sm text-slate-500 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {item.country}, {item.city}
                </div>
              </div>
              <Badge>
                {item.urgency === "Срочно" ? (
                  <span className="inline-flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" /> Срочно
                  </span>
                ) : item.urgency === "Не срочно" ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" /> Не срочно
                  </span>
                ) : (
                  "Норм"
                )}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <Percent className="h-4 w-4" /> Доля
              </div>
              <div className="mt-1 text-lg font-medium">{fmtPct(item.sharePct, 1)}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4" /> Цена доли
              </div>
              <div className="mt-1 text-lg font-medium">{fmtMoney(item.price, currency)}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500">NAV доли</div>
              <div className="mt-1 text-lg font-medium">{fmtMoney(item.nav, currency)}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-500">Дисконт / премия</div>
              <div
                className={
                  "mt-1 text-lg font-medium " +
                  (discountPct <= 0 ? "text-[#10B981]" : "text-[#EF4444]")
                }
              >
                {discountLabel}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Доходность по выплатам</div>
              <div className="font-medium">{fmtPct(item.yieldPct, 1)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Срок владения продавца</div>
              <div className="font-medium">{item.holdMonths} мес</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-500">Ликвидность</div>
              <div className="font-medium">{item.liquidityScore}</div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Причина продажи</div>
            <div className="mt-1 font-medium">{item.sellerNote ?? "—"}</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-500">Сделка защищена</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4" />
              Escrow · Автопереход прав · Выплаты с момента сделки
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 rounded-xl bg-[#2A7FF7] px-4 py-3 text-white font-medium hover:bg-[#2563eb] transition">
              Купить сейчас
            </button>
            <button className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium hover:bg-slate-50 transition">
              Предложить цену
            </button>
          </div>

          <div className="text-xs text-slate-500">
            * P2P сделки — вторичный рынок долей. Цена может быть ниже/выше NAV.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function P2PMarketPage() {
  const [tab, setTab] = useState<"aggregated" | "reit" | "rent">("aggregated");
  const [region, setRegion] = useState<Region>("Все регионы");
  const [type, setType] = useState<AssetType>("Все типы");
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
  const [query, setQuery] = useState<string>("");

  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [highLiquidity, setHighLiquidity] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const regions: Region[] = ["Все регионы", "Европа", "США", "Азия", "Восток", "LatAm", "СНГ"];
  const types: AssetType[] = [
    "Все типы",
    "Коммерческая",
    "Офисная",
    "Торговая",
    "Склады",
    "Бизнес",
    "Жилая",
  ];

  const filtered = useMemo(() => {
    return mockListings
      .filter((l) => {
        if (tab === "reit" && l.liquidityScore !== "Высокая") return false;
        if (tab === "rent" && l.yieldPct <= 0) return false;

        if (type !== "Все типы" && l.assetType !== type) return false;
        if (region !== "Все регионы") {
          const europeCountries = [
            "Великобритания",
            "Испания",
            "Португалия",
            "Германия",
            "Франция",
            "Италия",
            "Нидерланды",
          ];
          const usaCountries = ["США"];
          const asiaCountries = [
            "Япония",
            "Сингапур",
            "Южная Корея",
            "Гонконг",
            "Таиланд",
            "Вьетнам",
            "Индонезия",
            "Малайзия",
          ];
          const eastCountries = [
            "ОАЭ",
            "Саудовская Аравия",
            "Катар",
            "Бахрейн",
            "Кувейт",
            "Оман",
            "Иордания",
          ];
          const latamCountries = [
            "Бразилия",
            "Мексика",
            "Аргентина",
            "Чили",
            "Колумбия",
            "Перу",
            "Панама",
          ];
          const cisCountries = [
            "Россия",
            "Казахстан",
            "Беларусь",
            "Грузия",
            "Армения",
            "Узбекистан",
            "Азербайджан",
          ];
          const map: Record<Exclude<Region, "Все регионы">, string[]> = {
            Европа: europeCountries,
            США: usaCountries,
            Азия: asiaCountries,
            Восток: eastCountries,
            LatAm: latamCountries,
            СНГ: cisCountries,
          };
          const allowed = map[region as Exclude<Region, "Все регионы">];
          if (!allowed.includes(l.country)) return false;
        }

        const q = query.trim().toLowerCase();
        if (q) {
          const hay = `${l.assetName} ${l.assetType} ${l.country} ${l.city}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }

        const disc = (l.price - l.nav) / l.nav;
        if (onlyDiscount && !(disc < 0)) return false;
        if (highLiquidity && l.liquidityScore !== "Высокая") return false;

        return true;
      })
      .sort((a, b) => b.id - a.id);
  }, [tab, region, type, query, onlyDiscount, highLiquidity]);

  const marketStats = useMemo(() => {
    const liquidity = "Высокая"; // Global indicator, does not depend on region
    if (filtered.length === 0) {
      return { volume: 0, avgDiscount: 0, avgTimeDays: 0, spread: 0, liquidity };
    }
    // Volume: sum of NAV of filtered listings
    const volume = filtered.reduce((sum, l) => sum + l.nav, 0);
    // Average discount: (price - nav) / nav * 100
    const discounts = filtered.map((l) => ((l.price - l.nav) / l.nav) * 100);
    const avgDiscount = discounts.reduce((a, b) => a + b, 0) / discounts.length;
    // Average time: holdMonths * 30 → days, then average
    const avgTimeDays = filtered.reduce((sum, l) => sum + l.holdMonths * 30, 0) / filtered.length;
    // Spread: max - min discount as simplified bid-ask proxy
    const spread = Math.abs(Math.max(...discounts) - Math.min(...discounts));
    return {
      volume,
      avgDiscount: Number.isFinite(avgDiscount) ? avgDiscount : 0,
      avgTimeDays: Number.isFinite(avgTimeDays) ? avgTimeDays : 0,
      spread: Number.isFinite(spread) ? spread : 0,
      liquidity,
    };
  }, [filtered]);

  const openItem = (item: Listing) => {
    setSelected(item);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="min-h-full">
      <PageContainer>
        {/* Sub tabs — light canvas style (P2P only) */}
        <div className="p2p-aggregated-switch">
          <SubTabsSection>
            <SubTabs
              active={tab}
              onChange={(v) => setTab(v as "aggregated" | "reit" | "rent")}
              subtitle={
                tab === "aggregated"
                  ? "Все P2P сделки"
                  : tab === "reit"
                    ? "Фондовые доли, высокая ликвидность"
                    : "Доли с доходами по аренде"
              }
            />
          </SubTabsSection>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Объём P2P сделок"
            value={fmtMoney(marketStats.volume, currency)}
            delta={{ value: "0.5%", up: true }}
            hint="годовой оборот"
            icon={<ArrowLeftRight className="h-4 w-4" />}
          />
          <MetricCard
            title="Средний дисконт"
            value={fmtPct(marketStats.avgDiscount, 1)}
            delta={{ value: "0.2%", up: true }}
            hint="относительно NAV"
            icon={<Percent className="h-4 w-4" />}
          />
          <MetricCard
            title="Среднее время сделки"
            value={`${marketStats.avgTimeDays.toFixed(1)} дня`}
            delta={{ value: "0.1 дня", up: false }}
            hint="скорость ликвидности"
            icon={<Timer className="h-4 w-4" />}
          />
          <MetricCard
            title="Liquidity score"
            value={marketStats.liquidity}
            delta={{ value: "0.0", up: true }}
            hint="обобщённый рейтинг"
            icon={<Shield className="h-4 w-4" />}
          />
          <MetricCard
            title="Bid-Ask spread"
            value={fmtPct(marketStats.spread, 1)}
            delta={{ value: "0.1%", up: false }}
            hint="разница спрос/предложение"
            icon={<ArrowLeftRight className="h-4 w-4" />}
          />
        </div>

        {/* News ticker row (infinite marquee) */}
        <style>{`
          @keyframes betwixMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
        <div className="mt-4 overflow-hidden rounded-xl border bg-slate-50">
          <div className="relative overflow-hidden py-2">
            <div className="flex whitespace-nowrap gap-12 px-4 text-sm text-[#374151]" style={{ animation: "betwixMarquee 26s linear infinite" }}>
              <div className="flex items-center gap-6 pr-6">
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🔥 Скидки по UK долям усилились</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">⏱ Среднее время сделки: 6.4 дня</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">📈 Рост оборота P2P за квартал</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🌍 Новые заявки: Европа и ОАЭ</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">📉 Спред снизился до 2.1%</span>
              </div>
              <div className="flex items-center gap-6 pr-6" aria-hidden="true">
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🔥 Скидки по UK долям усилились</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">⏱ Среднее время сделки: 6.4 дня</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">📈 Рост оборота P2P за квартал</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">🌍 Новые заявки: Европа и ОАЭ</span>
                <span className="text-slate-400">•</span>
                <span className="cursor-pointer transition-colors hover:text-blue-600 hover:underline">📉 Спред снизился до 2.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Region tabs + tools */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {regions.map((r) => (
              <Pill key={r} active={region === r} onClick={() => setRegion(r)}>
                {r}
              </Pill>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Поиск: объект, город, страна"
                className="w-[260px] rounded-full border border-slate-200 bg-white pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="inline-flex rounded-full border border-[#DDE2E8] bg-white p-1">
              {(["USD", "EUR"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={
                    "px-3 py-1 text-sm font-medium rounded-full transition " +
                    (currency === c ? "bg-[#1877F2] text-white" : "text-[#6B7280]")
                  }
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <SlidersHorizontal className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
              {isExpanded ? "Свернуть" : "Расширить"}
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="text-slate-500">Тип:</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssetType)}
                className="bg-transparent outline-none"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <Toggle checked={onlyDiscount} onChange={setOnlyDiscount} label="Только со скидкой" />
            <Toggle checked={highLiquidity} onChange={setHighLiquidity} label="Высокая ликвидность" />
          </div>

          <div className="text-sm text-slate-500">
            Найдено: <span className="font-medium text-slate-900">{filtered.length}</span>
          </div>
        </div>

        {/* Table */}
        <div
          className={
            "mt-4 overflow-y-hidden " +
            (isExpanded
              ? "overflow-x-auto"
              : "overflow-hidden rounded-xl border border-slate-200 bg-white")
          }
        >
          <div
            className={
              "grid gap-1 px-4 py-2 border-b border-slate-100 text-xs text-slate-600 font-medium bg-white " +
              (isExpanded ? "min-w-[1700px]" : "")
            }
            style={{
              gridTemplateColumns: isExpanded
                ? "36px minmax(120px, 1fr) minmax(100px, 1fr) 70px minmax(90px, 1fr) minmax(110px, 1fr) 110px 100px 95px 115px 110px 105px 100px 95px 90px minmax(90px, 1fr)"
                : "36px 1fr 1fr 70px 1fr 1fr 110px 1.2fr",
            }}
          >
            <div>☆</div>
            <div>Объект</div>
            <div>Локация</div>
            <div>Доля</div>
            <div>Цена</div>
            <div>Дисконт / NAV</div>
            <div>Ликвидность</div>
            {isExpanded && (
              <>
                <div className="text-right">Стоимость объекта</div>
                <div className="text-right">Инвесторы</div>
                <div className="text-right">Всего долей</div>
                <div className="text-right">Средняя цена P2P</div>
                <div className="text-right">Последняя сделка</div>
                <div className="text-right">Оборот</div>
                <div className="text-right">Концентрация</div>
              </>
            )}
            <div className="text-right">Действие</div>
          </div>

          <div className="divide-y">
            {filtered.map((l) => {
              const discountPct = ((l.price - l.nav) / l.nav) * 100;
              const discLabel = discountPct >= 0 ? `+${fmtPct(discountPct, 1)}` : fmtPct(discountPct, 1);
              const discClass = discountPct <= 0 ? "text-[#10B981]" : "text-[#EF4444]";

              return (
                <div
                  key={l.id}
                  className={
                    "grid gap-1 px-4 py-1 text-sm hover:bg-slate-50 transition bg-white " +
                    (isExpanded ? "min-w-[1700px]" : "")
                  }
                  style={{
                    gridTemplateColumns: isExpanded
                      ? "36px minmax(120px, 1fr) minmax(100px, 1fr) 70px minmax(90px, 1fr) minmax(110px, 1fr) 110px 100px 95px 115px 110px 105px 100px 95px 90px minmax(90px, 1fr)"
                      : "36px 1fr 1fr 70px 1fr 1fr 110px 1.2fr",
                  }}
                >
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="rounded-full p-1.5 text-blue-500 hover:bg-blue-50"
                      aria-label="Star"
                    >
                      <Star
                        className={
                          "h-4 w-4 " +
                          (l.starred ? "fill-blue-500 text-blue-500" : "text-slate-500")
                        }
                      />
                    </button>
                  </div>

                  <div>
                    <div className="font-medium text-slate-900">{l.assetName}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{l.assetType}</div>
                  </div>

                  <div>
                    <div className="font-medium">{l.country}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{l.city}</div>
                  </div>

                  <div>
                    <div className="font-medium">{fmtPct(l.sharePct, 1)}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{l.holdMonths} мес</div>
                  </div>

                  <div>
                    <div className="font-medium">{fmtMoney(l.price, currency)}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">доходн. {fmtPct(l.yieldPct, 1)}</div>
                  </div>

                  <div>
                    <div className={"font-medium " + discClass}>{discLabel}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500">NAV {fmtMoney(l.nav, currency)}</div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-2">
                      <Badge>{l.liquidityScore}</Badge>
                      {l.urgency === "Срочно" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[#EF4444]">
                          <Flame className="h-4 w-4" />
                        </span>
                      ) : l.urgency === "Не срочно" ? (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                          <Clock3 className="h-4 w-4" />
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 line-clamp-1">
                      {l.sellerNote ?? ""}
                    </div>
                  </div>

                  {isExpanded && (
                    <>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{fmtMoney(l.assetValue, currency)}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">оценка</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{l.investorsCount}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">владельцев</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{l.totalShares.toLocaleString()}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">шт.</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{fmtMoney(l.avgP2PPrice, currency)}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">за 30 дн</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{fmtLastDeal(l.lastDealDays)}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">{fmtPct(0.3 + (l.id % 7) / 10, 1)} объёма</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{fmtMoney(l.turnover30d, currency)}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">30 дн</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900">{fmtPct(l.concentrationPct, 0)}</div>
                        <div className="mt-0.5 text-[11px] text-slate-500">top-5</div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => openItem(l)}
                      className="rounded-full border border-blue-500 bg-white px-3 py-1.5 text-sm font-medium text-blue-500 hover:bg-blue-50 transition"
                    >
                      Купить
                    </button>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 ? (
              <div
                className={
                  "px-6 py-10 text-center text-sm text-slate-500 bg-white " +
                  (isExpanded ? "min-w-[1700px]" : "")
                }
              >
                Ничего не найдено — измените фильтры.
              </div>
            ) : null}
          </div>

          <div
            className={
              "px-4 py-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between bg-white " +
              (isExpanded ? "min-w-[1700px]" : "")
            }
          >
            <div className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4" />
              P2P сделки защищены: escrow · автопереход прав · выплаты с момента сделки
            </div>
            <div className="inline-flex items-center gap-2">
              <Info className="h-4 w-4" />
              Цена может быть ниже/выше NAV
            </div>
          </div>
        </div>

        {/* Bottom trust blocks */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-medium text-slate-900">Как работает P2P</div>
            <div className="mt-3 space-y-2 text-sm text-slate-500">
              <div className="flex gap-2">
                <span className="mt-0.5">•</span>
                <span>Покупка/продажа долей между инвесторами на вторичном рынке.</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-0.5">•</span>
                <span>Расчёты через escrow: средства блокируются до завершения передачи прав.</span>
              </div>
              <div className="flex gap-2">
                <span className="mt-0.5">•</span>
                <span>Выплаты по доле переходят покупателю с момента сделки.</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-medium text-slate-900">Market activity</div>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Последняя сделка</span>
                <span className="font-medium text-slate-900">RE-APT · №19</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Самая большая скидка</span>
                <span className="font-medium text-[#10B981]">−7.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Самый ликвидный</span>
                <span className="font-medium text-slate-900">RE-APT · №12</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-medium text-slate-900">Подсказка</div>
            <div className="mt-3 text-sm text-slate-500">
              Дисконт/премия считается относительно NAV доли. На P2P рынке важны скорость сделки и спред, а не «сбор».
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-slate-200 pt-6 pb-10 text-sm text-slate-500 flex items-center justify-between">
          <div>© Betwix, 2026</div>
          <div className="hidden md:block">Документы · Правила · Политика конфиденциальности</div>
          <div>Support</div>
        </div>
      </PageContainer>
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} item={selected} currency={currency} />
    </>
  );
}