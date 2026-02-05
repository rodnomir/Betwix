import { useEffect, useMemo, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getListingById, getOwnerById, getListingsByOwnerId, DEMO_LISTINGS, type Listing } from "@/data/demoListings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LotTableRow } from "@/components/LotTableRow";

const DAYS_IN_YEAR = 365;

type YieldYearData = {
  y: number;
  p: number;
  investorsTotal: number;
  investorsIn: number;
  investorsOut: number;
  income: number;
};

function generateYieldData(listing: Listing, rentYear: number): YieldYearData[] {
  const currentYear = new Date().getFullYear();
  const yearOffsets = [14, 11, 8, 6, 5, 3, 2, 1, 0];
  const years = yearOffsets.map((o) => currentYear - o);
  const seed = listing.businessValue % 100;
  const data: YieldYearData[] = [];
  let investorsTotal = 8 + (seed % 6);
  const yieldDeltas = [0, 0.8, -0.5, 1.2, -0.4, 0.9, -0.6, 0.7, -0.3];
  let p = 3.2 + (seed % 20) / 10;

  for (let i = 0; i < years.length; i++) {
    const inVal = 1 + ((seed + i * 7) % 5);
    const outVal = (seed + i * 11) % 4;
    investorsTotal = Math.max(4, investorsTotal + inVal - outVal);
    p = Math.round(Math.min(12, Math.max(2, p + yieldDeltas[i])) * 10) / 10;
    const income = Math.round((rentYear * p) / 6.5);
    data.push({
      y: years[i],
      p,
      investorsTotal,
      investorsIn: inVal,
      investorsOut: outVal,
      income,
    });
  }
  return data;
}

export function Header() {
  return (
    <div className="sticky top-0 z-50 border-b px-8 py-4 bg-background">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 40'%3E%3Cg fill='%230F2A44'%3E%3Cpath d='M20 4L36 20L20 36L4 20Z'/%3E%3Cpath d='M36 4L52 20L36 36L20 20Z' opacity='0.85'/%3E%3Ctext x='70' y='28' font-family='Inter, system-ui, -apple-system' font-size='22' font-weight='700' letter-spacing='2'%3EBETWIX%3C/text%3E%3C/g%3E%3C/svg%3E"
            alt="Betwix"
            className="h-8"
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <button className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full">
              Вход
            </button>
            <button className="flex items-center gap-2 border rounded-full px-2 py-1 hover:bg-muted">
              <span className="text-lg leading-none">☰</span>
              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs opacity-70">👤</span>
            </button>
          </div>
          <span className="text-sm text-muted-foreground">Для инвесторов и владельцев</span>
        </div>
      </div>
    </div>
  );
}


function ObjectPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { isAuthenticated, openAuthModal } = useAuth();
  const listing: Listing | null =
    (location.state as { listing?: Listing } | null)?.listing ?? getListingById(id ?? "");

  const handleInvestClick = () => {
    if (!isAuthenticated) openAuthModal();
  };

  if (!listing) return <Navigate to="/" replace />;

  const OBJECT_PRICE = listing.businessValue;
  const RENT_YEAR = listing.rentYearly;
  const OCCUPANCY_RATE = 0.72 + (listing.businessValue % 17) / 100;
  const TOTAL_AREA_SQM = 800 + (listing.businessValue % 801);

  const occupancy = useMemo(() => {
    const occupiedArea = Math.round(TOTAL_AREA_SQM * OCCUPANCY_RATE);
    const vacantArea = TOTAL_AREA_SQM - occupiedArea;

    const rentPerSqmYear = RENT_YEAR / TOTAL_AREA_SQM;
    const lostIncomeYear = Math.round(vacantArea * rentPerSqmYear);
    const potentialIncomeYear = RENT_YEAR + lostIncomeYear;

    const vacancyDaysYear = Math.round((1 - OCCUPANCY_RATE) * DAYS_IN_YEAR);

    return {
      occupiedArea,
      vacantArea,
      lostIncomeYear,
      potentialIncomeYear,
      vacancyDaysYear,
    };
  }, [TOTAL_AREA_SQM, OCCUPANCY_RATE, RENT_YEAR, DAYS_IN_YEAR]);

  const yieldData = useMemo(
    () => generateYieldData(listing, RENT_YEAR),
    [listing, RENT_YEAR]
  );
  const currentYield = yieldData[yieldData.length - 1]?.p ?? (RENT_YEAR / listing.businessValue) * 100;
  const yieldGrowthPct =
    yieldData.length >= 2
      ? yieldData[yieldData.length - 1].p - yieldData[yieldData.length - 2].p
      : 0;

  return (
    <div className="flex flex-col bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-12 w-full">
        <LeftSidebar
          listing={listing}
          owner={getOwnerById(listing.ownerId)}
          ownerObjectsCount={getListingsByOwnerId(listing.ownerId).length}
          occupancyRate={OCCUPANCY_RATE}
          occupiedArea={occupancy.occupiedArea}
          vacantArea={occupancy.vacantArea}
          lostIncomeYear={occupancy.lostIncomeYear}
          potentialIncomeYear={occupancy.potentialIncomeYear}
          vacancyDaysYear={occupancy.vacancyDaysYear}
          currentYield={currentYield}
          yieldGrowthPct={yieldGrowthPct}
        />

        <CenterContent
          objectPrice={listing.businessValue}
          rentYear={RENT_YEAR}
          yieldData={yieldData}
          currentListingId={listing.id}
          currentOwnerId={listing.ownerId}
        />

        <RightSidebar
          listing={listing}
          objectPrice={OBJECT_PRICE}
          rentYear={RENT_YEAR}
          minTicket={listing.minTicket}
          onInvestClick={handleInvestClick}
        />
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-background w-full mt-12">
      <div className="max-w-7xl mx-auto px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div className="space-y-3">
          <img
            src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 40'%3E%3Cg fill='%230F2A44'%3E%3Cpath d='M20 4L36 20L20 36L4 20Z'/%3E%3Cpath d='M36 4L52 20L36 36L20 20Z' opacity='0.85'/%3E%3Ctext x='70' y='28' font-family='Inter, system-ui, -apple-system' font-size='22' font-weight='700' letter-spacing='2'%3EBETWIX%3C/text%3E%3C/g%3E%3C/svg%3E"
            alt="Betwix"
            className="h-8 mb-2"
          />
          <div className="text-muted-foreground">Инвестиции в доходную недвижимость</div>
          <div className="text-xs text-muted-foreground">© Betwix, 2026</div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Продукт</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>Объекты</li>
            <li>Инвестировать</li>
            <li>P2P рынок</li>
            <li>Калькулятор доходности</li>
            <li>Как это работает</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Компания</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>О нас</li>
            <li>Как мы зарабатываем</li>
            <li>Методика рейтингов</li>
            <li>Документы</li>
          </ul>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Поддержка</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>FAQ</li>
            <li>Поддержка</li>
            <li>Контакты</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function MetricCard(props: {
  label: string;
  value: string;
  sub?: string;
  accent?: "green" | "orange";
}) {
  const { label, value, sub, accent } = props;

  const accentClass =
    accent === "green"
      ? "text-green-600"
      : accent === "orange"
      ? "text-orange-600"
      : "text-foreground";

  return (
    <div className="rounded-lg border px-3 py-2 space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-lg font-semibold leading-tight ${accentClass}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

function LeftSidebar(props: {
  listing: Listing;
  owner: { id: string; name: string; rating: number } | null;
  ownerObjectsCount: number;
  occupancyRate: number;
  occupiedArea: number;
  vacantArea: number;
  lostIncomeYear: number;
  potentialIncomeYear: number;
  vacancyDaysYear: number;
  currentYield: number;
  yieldGrowthPct: number;
}) {
  const {
    listing,
    owner,
    ownerObjectsCount,
    occupancyRate,
    occupiedArea,
    vacantArea,
    lostIncomeYear,
    potentialIncomeYear,
    currentYield,
    yieldGrowthPct,
  } = props;
  const yieldPct = currentYield.toFixed(1);
  const ownerRating = owner?.rating ?? 7.5 + (listing.businessValue % 25) / 10;
  const isResidential = listing.propertyType === "Жилая";
  const subRatings = useMemo(
    () => ({
      yield: 7 + (listing.businessValue % 4),
      risk: 6 + (listing.salePercent % 5),
      liquidity: 6 + (listing.businessValue % 5),
      location: 7 + (listing.country.length % 4),
      condition: 6 + (listing.termYears % 5),
      prepay: 8 + (listing.minTicket % 3),
      contract: 7 + (listing.termYears % 4),
    }),
    [listing]
  );
  const totalRating =
    (subRatings.yield + subRatings.risk + subRatings.liquidity + subRatings.location +
      subRatings.condition + subRatings.prepay + subRatings.contract) / 7;

  return (
    <div className="col-span-3 px-6 py-6 border-r space-y-8 relative">
      <section className="space-y-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase">Владелец объекта</div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {owner ? owner.name.split(" ").map((n) => n[0]).join("").slice(0, 2) : "?"}
          </div>
          <div>
            <div className="font-medium">{owner?.name ?? "—"}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Рейтинг собственника</span>
              <div className="relative group">
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold cursor-help">{ownerRating.toFixed(1)} / 10</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:block w-80 p-3 text-xs bg-white border rounded shadow-lg text-slate-600 pointer-events-auto">
                  Рейтинг собственника формируется на основе:
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li><b>Стабильности выплат</b> — отсутствие задержек и пропусков выплат инвесторам</li>
                    <li><b>Фактической занятости</b> — средний уровень occupancy по объектам владельца</li>
                    <li><b>Доходности портфеля</b> — соответствие фактической доходности заявленной</li>
                    <li><b>Управления простоями</b> — скорость повторной сдачи помещений</li>
                    <li><b>Истории объектов</b> — доля успешно реализованных и закрытых проектов</li>
                    <li><b>Дисциплины отчётности</b> — регулярность и прозрачность финансовых отчётов</li>
                    <li><b>Опыта управления</b> — срок работы владельца с арендной недвижимостью</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Объектов на платформе: {ownerObjectsCount}</div>
          </div>
        </div>
      </section>

      

      <section className="space-y-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase">Инвесторский обзор</div>

        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-background p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-semibold text-green-600">{yieldPct}%</div>
            <div className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${yieldGrowthPct >= 0 ? "text-green-600 bg-green-100" : "text-rose-600 bg-rose-100"}`}>
              {yieldGrowthPct >= 0 ? "▲" : "▼"} {yieldGrowthPct >= 0 ? "+" : ""}{yieldGrowthPct.toFixed(1)}%
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <div className="text-xs text-muted-foreground">Доход</div>
              <div className="text-lg font-semibold">${listing.rentYearly.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Занятость</div>
              <div className="text-lg font-semibold">{isResidential ? "100%" : `${Math.round(occupancyRate * 100)}%`}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Потенциал</div>
              <div className="text-lg font-semibold text-green-600">
                {isResidential ? "100%" : `$${potentialIncomeYear.toLocaleString()}`}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Потерянный доход</div>
              <div className="text-lg font-semibold text-orange-600">
                {isResidential ? "Нет" : `-$${lostIncomeYear.toLocaleString()}`}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Площадь занята</div>
              <div className="text-lg font-semibold">
                {isResidential ? `${40 + (listing.businessValue % 111)} м²` : `${occupiedArea} м²`}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Свободно</div>
              <div className="text-lg font-semibold text-orange-600">
                {isResidential ? "0 м²" : `${vacantArea} м²`}
              </div>
            </div>
          </div>

          <div className="pt-3 space-y-1 text-xs text-muted-foreground">
            <div>✓ Управляющая компания</div>
            <div>✓ Контракт с индексацией</div>
            <div>✓ Фактическая занятость {isResidential ? "100%" : `${Math.round(occupancyRate * 100)}%`}</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-xl border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              Рейтинг объекта
              <div className="relative group">
                <span className="text-2xl font-semibold text-indigo-600 cursor-help">{totalRating.toFixed(1)} / 10</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:block w-80 p-3 text-xs bg-white border rounded shadow-lg text-slate-600">
                  Рейтинг объекта рассчитывается по следующим параметрам:
                  <ul className="list-disc pl-4 mt-2 space-y-1">
                    <li><b>Доходность</b> — фактическая и прогнозируемая доходность объекта</li>
                    <li><b>Риск</b> — стабильность арендаторов и волатильность дохода</li>
                    <li><b>Ликвидность</b> — скорость продажи доли на P2P рынке</li>
                    <li><b>Локация</b> — страна, город и привлекательность района</li>
                    <li><b>Состояние объекта</b> — физическое состояние и износ</li>
                    <li><b>Предоплата</b> — наличие депозитов и авансов от арендатора</li>
                    <li><b>Договор</b> — срок, условия и юридическая защищённость контракта</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-1 text-sm text-muted-foreground">
            <span>Доходность</span><span className="text-right">{subRatings.yield} / 10</span>
            <span>Риск</span><span className="text-right">{subRatings.risk} / 10</span>
            <span>Ликвидность</span><span className="text-right">{subRatings.liquidity} / 10</span>
            <span>Локация</span><span className="text-right">{subRatings.location} / 10</span>
            <span>Состояние объекта</span><span className="text-right">{subRatings.condition} / 10</span>
            <span>Предоплата</span><span className="text-right">{subRatings.prepay} / 10</span>
            <span>Договор</span><span className="text-right">{subRatings.contract} / 10</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function CenterContent(props: {
  objectPrice: number;
  rentYear: number;
  yieldData: YieldYearData[];
  currentListingId: string;
  currentOwnerId: string;
}) {
  const { objectPrice, rentYear, yieldData, currentListingId, currentOwnerId } = props;
  const [activeTab, setActiveTab] = useState<
    "graph" | "objects" | "news" | "docs"
  >("graph");

  return (
    <div className="col-span-6 px-4 py-6 border-r space-y-10">
      <nav className="sticky top-0 bg-background z-10 border-b pb-2 mb-6">
        <div className="flex gap-6 text-sm">
          {[
            { id: "graph" as const, label: "График" },
            { id: "objects" as const, label: "Объекты владельца" },
            { id: "news" as const, label: "Новости" },
            { id: "docs" as const, label: "Документы" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={
                  "group relative block pb-1 font-medium transition-colors " +
                  (isActive ? "text-blue-600" : "text-slate-800 hover:text-blue-600")
                }
              >
                {tab.label}
                <span
                  className={
                    "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
                    (isActive ? "w-full" : "w-0 group-hover:w-full")
                  }
                />
              </button>
            );
          })}
        </div>
      </nav>

      <div className="animate-in fade-in slide-in-from-top-2 duration-200">
        {activeTab === "graph" && (
          <div className="space-y-6">
            <YieldSection
              objectPrice={objectPrice}
              rentYear={rentYear}
              yieldData={yieldData}
            />
            <section className="rounded-2xl border bg-white p-5 space-y-4">
              <div className="text-base font-semibold">Почему это безопасная инвестиция</div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span>Вы покупаете долю реального арендного дохода, а не обещание</li>
                <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span>Доход выплачивается ежемесячно пропорционально вашей доле</li>
                <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span>Свободный выход через P2P рынок в любой момент</li>
                <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span>Объект управляется профессиональной управляющей компанией</li>
                <li className="flex gap-2"><span className="text-green-600 shrink-0">✓</span>История доходности и все ключевые показатели прозрачны</li>
              </ul>
              <div className="text-xs text-slate-500">
                Управляющие компании проходят отдельную проверку платформой и работают по стандартам Betwix.
              </div>
            </section>
          </div>
        )}
        {activeTab === "objects" && <OwnerObjectsSection currentListingId={currentListingId} currentOwnerId={currentOwnerId} />}
        {activeTab === "news" && <NewsTabContent currentListingId={currentListingId} />}
        {activeTab === "docs" && (
          <DocumentsTabContent
            yieldData={yieldData}
            currentListingId={currentListingId}
          />
        )}
      </div>
    </div>
  );
}

const DOCS_PER_PAGE = 8;
const LOAD_MORE_DOCS = 6;

function DocumentsTabContent(props: {
  yieldData: YieldYearData[];
  currentListingId: string;
}) {
  const { yieldData, currentListingId } = props;
  const years = [...new Set(yieldData.map((d) => d.y))].sort((a, b) => a - b);
  const seed = parseInt(currentListingId.replace(/\D/g, ""), 10) || 1;
  const startShift = seed % 5;
  const baseYears = years.slice(startShift);
  const hasQuarterly = (seed % 3) !== 2;
  const yearlyYears = baseYears;
  const quarterlyYears = hasQuarterly ? baseYears.slice(0, Math.max(1, baseYears.length - (seed % 2))) : [];

  const yearlyByYear = useMemo(() => {
    const m = new Map<number, { title: string; sub: string }[]>();
    for (const y of yearlyYears) {
      m.set(y, [{ title: `Годовой отчёт УК · ${y}`, sub: "Финансы, доходность и заполняемость" }]);
    }
    return m;
  }, [yearlyYears]);

  const quarterlyByYear = useMemo(() => {
    const m = new Map<number, { title: string; sub: string }[]>();
    for (const y of quarterlyYears) {
      const items = [1, 2, 3, 4].map((q) => ({
        title: `Отчёт УК · Q${q} ${y}`,
        sub: "Финансы, доходность и заполняемость",
      }));
      m.set(y, items);
    }
    return m;
  }, [quarterlyYears]);

  const [docSubTab, setDocSubTab] = useState<"yearly" | "quarterly">("yearly");
  const defaultYearlyYear = yearlyYears[yearlyYears.length - 1] ?? null;
  const defaultQuarterlyYear = quarterlyYears[quarterlyYears.length - 1] ?? null;
  const [selectedYear, setSelectedYear] = useState<number | null>(() => defaultYearlyYear ?? defaultQuarterlyYear);
  const [shownCount, setShownCount] = useState(DOCS_PER_PAGE);

  const currentYears = docSubTab === "yearly" ? yearlyYears : quarterlyYears;
  const effectiveYear = selectedYear && currentYears.includes(selectedYear)
    ? selectedYear
    : currentYears[currentYears.length - 1] ?? null;

  useEffect(() => {
    const def = docSubTab === "yearly" ? defaultYearlyYear : defaultQuarterlyYear;
    setSelectedYear(def);
    setShownCount(DOCS_PER_PAGE);
  }, [docSubTab, defaultYearlyYear, defaultQuarterlyYear]);

  const docsForYear = effectiveYear
    ? (docSubTab === "yearly" ? yearlyByYear.get(effectiveYear) ?? [] : quarterlyByYear.get(effectiveYear) ?? [])
    : [];
  const visibleDocs = docsForYear.slice(0, shownCount);
  const hasMoreDocs = shownCount < docsForYear.length;

  const DocCard = ({ title, sub }: { title: string; sub: string }) => (
    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition">
      <div className="flex items-center gap-3">
        <span>📄</span>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
      <button className="text-sm text-blue-600 hover:underline">Скачать</button>
    </div>
  );

  return (
    <section className="space-y-4">
      <div className="text-base font-semibold">Документы по объекту</div>
      <p className="text-sm text-slate-400">
        Доступно только инвесторам и владельцу объекта
      </p>
      <div className="flex gap-5 text-xs border-b border-slate-100 pb-0">
        <button
          type="button"
          onClick={() => setDocSubTab("yearly")}
          className={
            "group relative block pb-2 font-medium transition-colors " +
            (docSubTab === "yearly" ? "text-blue-600" : "text-slate-500 hover:text-blue-600")
          }
        >
          Годовые
          <span
            className={
              "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
              (docSubTab === "yearly" ? "w-full" : "w-0 group-hover:w-full")
            }
          />
        </button>
        <button
          type="button"
          onClick={() => setDocSubTab("quarterly")}
          className={
            "group relative block pb-2 font-medium transition-colors " +
            (docSubTab === "quarterly" ? "text-blue-600" : "text-slate-500 hover:text-blue-600")
          }
        >
          Квартальные
          <span
            className={
              "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
              (docSubTab === "quarterly" ? "w-full" : "w-0 group-hover:w-full")
            }
          />
        </button>
      </div>
      {docSubTab === "yearly" && yearlyYears.length === 0 && (
        <p className="text-sm text-slate-500">Годовые отчёты пока недоступны</p>
      )}
      {currentYears.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentYears.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => { setSelectedYear(y); setShownCount(DOCS_PER_PAGE); }}
              className={
                "px-3 py-1.5 text-sm font-medium rounded transition-colors " +
                (effectiveYear === y ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-100")
              }
            >
              {y}
            </button>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {visibleDocs.map((r) => (
          <DocCard key={r.title} title={r.title} sub={r.sub} />
        ))}
      </div>
      {hasMoreDocs && (
        <button
          type="button"
          onClick={() => setShownCount((n) => Math.min(n + LOAD_MORE_DOCS, docsForYear.length))}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          Показать ещё
        </button>
      )}
      <div className="rounded-xl border bg-slate-50 p-5 mt-8 space-y-4">
        <div className="text-sm font-medium text-slate-700">Отчётность от управляющей компании</div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Все отчёты формируются управляющей компанией на основе фактических данных по объекту.
          В отчётность входят финансовые показатели, заполняемость, арендные поступления и ключевые изменения по договору.
        </p>
        <div className="flex flex-col gap-1.5 text-xs text-slate-600">
          <span className="flex items-baseline gap-2">
            <span className="text-blue-600 shrink-0">✓</span>
            <span>Одобрено владельцем объекта</span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-blue-600 shrink-0">✓</span>
            <span>Проверено платформой Betwix</span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-blue-600 shrink-0">✓</span>
            <span>Подготовлено управляющей компанией</span>
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Обновляется ежеквартально и ежегодно в соответствии с регламентом платформы.
        </p>
      </div>
    </section>
  );
}

const NEWS_TITLES = [
  "Плановое обслуживание завершено",
  "Финансовый отчёт за период",
  "Применена индексация аренды",
  "Комментарий управляющей компании",
  "Операционный статус объекта",
  "Итоги квартальной отчётности",
  "Обновление по техобслуживанию",
  "Отчёт о заполняемости",
  "Изменения в регламенте",
];

const NEWS_DESCRIPTIONS = [
  "Работы выполнены по графику, помещение в рабочем состоянии.",
  "Выручка и расходы соответствуют плану, выплаты по расписанию.",
  "Арендная ставка скорректирована согласно договору.",
  "УК даёт оценку текущей ситуации и перспектив.",
  "Объект работает в штатном режиме, замечаний нет.",
  "Ключевые показатели за квартал подготовлены и опубликованы.",
  "Плановый ремонт проведён, коммуникации проверены.",
  "Уровень занятости стабилен, прогноз сохранён.",
  "Внесены уточнения в процедуры управления объектом.",
];

const EVENT_TITLES = [
  "Поступил арендный платёж",
  "Арендатор заехал",
  "Арендатор выехал",
  "Договор аренды продлён",
  "Вакансия закрыта",
  "Новый инвестор присоединился",
  "Поступил арендный платёж",
  "Обновлён договор аренды",
  "Смена арендатора",
];

const EVENT_DESCRIPTIONS = [
  "Ежемесячный платёж зафиксирован и зачислен.",
  "Новый арендатор вступил во владение помещением.",
  "Помещение освобождено по истечении договора.",
  "Срок действия контракта продлён на новый период.",
  "Помещение сдано, договор подписан.",
  "Доля выкуплена, инвестор внесён в реестр.",
  "Платёж от арендатора получен и подтверждён.",
  "Условия договора обновлены, подписи внесены.",
  "Предыдущий арендатор выбыл, новый въехал.",
];

const UK_NAMES = [
  "УК London Property",
  "УК Berlin Assets",
  "УК Madrid Management",
  "УК Amsterdam Realty",
  "УК Vienna Holdings",
  "УК Zurich Estates",
];

const MONTHS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function generateNewsAndEvents(listingId: string) {
  const seed = parseInt(listingId.replace(/\D/g, ""), 10) || 1;
  const mul = (a: number, b: number) => ((a * 31 + seed) % b + b) % b;
  const newsCount = 3 + mul(seed, 7);
  const eventsCount = 3 + mul(seed + 7, 7);
  const ukIdx = mul(seed, UK_NAMES.length);
  const source = UK_NAMES[ukIdx];

  const now = new Date();
  const items: { news: NewsEventItem[]; events: NewsEventItem[] } = { news: [], events: [] };

  for (let i = 0; i < newsCount; i++) {
    const daysAgo = i * (5 + mul(i, 4)) + mul(seed + i, 3);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    const titleIdx = mul(seed + i * 11, NEWS_TITLES.length);
    const descIdx = mul(seed + i * 13, NEWS_DESCRIPTIONS.length);
    items.news.push({
      id: `news-${listingId}-${i}`,
      title: NEWS_TITLES[titleIdx],
      description: NEWS_DESCRIPTIONS[descIdx],
      date: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      source,
      isNew: i < (mul(seed, 2) + 1),
      likes: 4 + mul(seed + i, 15),
      dislikes: mul(seed + i * 2, 5),
      views: 50 + mul(seed + i * 3, 200),
    });
  }

  for (let i = 0; i < eventsCount; i++) {
    const daysAgo = i * (4 + mul(i + 1, 5)) + mul(seed + i, 2);
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    const titleIdx = mul(seed + i * 17, EVENT_TITLES.length);
    const descIdx = mul(seed + i * 19, EVENT_DESCRIPTIONS.length);
    items.events.push({
      id: `events-${listingId}-${i}`,
      title: EVENT_TITLES[titleIdx],
      description: EVENT_DESCRIPTIONS[descIdx],
      date: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      source,
      isNew: i < (mul(seed + 3, 2) + 1),
      likes: 6 + mul(seed + i, 12),
      dislikes: mul(seed + i * 5, 4),
      views: 80 + mul(seed + i * 7, 180),
    });
  }

  const parseDate = (s: string) => {
    const [d, mon, y] = s.split(" ");
    const mi = MONTHS.indexOf(mon);
    return new Date(parseInt(y, 10), mi, parseInt(d, 10)).getTime();
  };
  items.news.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  items.events.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  const setNewFlags = (list: NewsEventItem[], maxNew: number) => {
    list.forEach((it, idx) => { it.isNew = idx < maxNew; });
  };
  setNewFlags(items.news, Math.min(2, 1 + mul(seed, 2)));
  setNewFlags(items.events, Math.min(2, 1 + mul(seed + 1, 2)));

  return items;
}

type NewsEventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  source: string;
  isNew: boolean;
  likes: number;
  dislikes: number;
  views: number;
};

const ITEMS_PER_PAGE = 10;
const LOAD_MORE_COUNT = 5;

function NewsTabContent(props: { currentListingId: string }) {
  const { currentListingId } = props;
  const [subTab, setSubTab] = useState<"news" | "events">("events");
  const [eventsShown, setEventsShown] = useState(ITEMS_PER_PAGE);
  const [newsShown, setNewsShown] = useState(ITEMS_PER_PAGE);

  const data = useMemo(() => generateNewsAndEvents(currentListingId), [currentListingId]);
  const eventsNewCount = data.events.filter((e) => e.isNew).length;
  const newsNewCount = data.news.filter((n) => n.isNew).length;
  const visibleEvents = data.events.slice(0, eventsShown);
  const visibleNews = data.news.slice(0, newsShown);
  const hasMoreEvents = eventsShown < data.events.length;
  const hasMoreNews = newsShown < data.news.length;

  return (
    <section className="space-y-6">
      <div className="flex gap-5 text-xs border-b border-slate-100 pb-0">
        <button
          type="button"
          onClick={() => setSubTab("news")}
          className={
            "group relative block pb-2 font-medium transition-colors " +
            (subTab === "news" ? "text-blue-600" : "text-slate-500 hover:text-blue-600")
          }
        >
          Новости{newsNewCount > 0 ? ` (${newsNewCount})` : ""}
          <span
            className={
              "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
              (subTab === "news" ? "w-full" : "w-0 group-hover:w-full")
            }
          />
        </button>
        <button
          type="button"
          onClick={() => setSubTab("events")}
          className={
            "group relative block pb-2 font-medium transition-colors " +
            (subTab === "events" ? "text-blue-600" : "text-slate-500 hover:text-blue-600")
          }
        >
          События{eventsNewCount > 0 ? ` (${eventsNewCount})` : ""}
          <span
            className={
              "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
              (subTab === "events" ? "w-full" : "w-0 group-hover:w-full")
            }
          />
        </button>
      </div>

      {subTab === "events" && (
        <div className="divide-y divide-slate-100">
          {visibleEvents.map((item) => (
            <div key={item.id} className="py-5 first:pt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{item.title}</span>
                {item.isNew && (
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">NEW</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="text-xs text-slate-500">
                  {item.date} · {item.source}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <ThumbsUp size={16} className="shrink-0 text-slate-400" />
                    <span className="text-slate-500">{item.likes}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <ThumbsDown size={16} className="shrink-0 text-slate-400" />
                    <span className="text-slate-500">{(item.dislikes % 11) + 1}</span>
                  </span>
                  <span className="text-slate-400">{item.views}</span>
                </div>
              </div>
            </div>
          ))}
          {hasMoreEvents && (
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setEventsShown((n) => Math.min(n + LOAD_MORE_COUNT, data.events.length))}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Показать ещё
              </button>
            </div>
          )}
        </div>
      )}

      {subTab === "news" && (
        <div className="divide-y divide-slate-100">
          {visibleNews.map((item) => (
            <div key={item.id} className="py-5 first:pt-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-900">{item.title}</span>
                {item.isNew && (
                  <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">NEW</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="text-xs text-slate-500">
                  {item.date} · {item.source}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-slate-400">
                    <ThumbsUp size={16} className="shrink-0 text-slate-400" />
                    <span className="text-slate-500">{item.likes}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <ThumbsDown size={16} className="shrink-0 text-slate-400" />
                    <span className="text-slate-500">{(item.dislikes % 11) + 1}</span>
                  </span>
                  <span className="text-slate-400">{item.views}</span>
                </div>
              </div>
            </div>
          ))}
          {hasMoreNews && (
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setNewsShown((n) => Math.min(n + LOAD_MORE_COUNT, data.news.length))}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Показать ещё
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

const MAX_BAR_HEIGHT = 200;

function YieldSection(props: {
  objectPrice: number;
  rentYear: number;
  yieldData: YieldYearData[];
}) {
  const { objectPrice, rentYear, yieldData } = props;
  const currentYield = yieldData[yieldData.length - 1]?.p ?? (rentYear / objectPrice) * 100;
  const investorsCount = yieldData[yieldData.length - 1]?.investorsTotal ?? 0;
  const growthPct =
    yieldData.length >= 2
      ? yieldData[yieldData.length - 1].p - yieldData[yieldData.length - 2].p
      : 0;

  const { minYield, range, scaleTicks } = useMemo(() => {
    const dataMax = Math.max(...yieldData.map((d) => d.p));
    const dataMin = Math.min(...yieldData.map((d) => d.p));
    const buffer = 1;
    const maxY = Math.ceil(dataMax + buffer);
    const minY = Math.max(0, Math.floor(dataMin - 0.5));
    const r = Math.max(maxY - minY, 0.5);
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((minY + (r * i) / 4) * 10) / 10);
    }
    return { minYield: minY, range: r, scaleTicks: ticks };
  }, [yieldData]);

  const fewDataPoints = yieldData.length < 3;

  return (
    <section id="graph" className="overflow-visible border rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold">Доходность по годам</div>
            <div className="relative group">
              <span className="w-5 h-5 flex items-center justify-center rounded-full border text-xs cursor-help">?</span>
              <div className="absolute left-0 top-6 z-50 hidden group-hover:block w-64 p-3 text-xs bg-white border rounded shadow-lg text-slate-600">
                Этот график показывает, как менялась доходность объекта по годам.
                Высота столбцов — годовая доходность в процентах.
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Проценты · суммы · инвесторы</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-slate-500">Текущая доходность</div>
          <div className="text-xl font-semibold text-green-600">{currentYield.toFixed(1)}%</div>
        </div>
      </div>

      {fewDataPoints && (
        <div className="text-xs text-slate-500 text-center py-1">
          Недостаточно исторических данных — отображается начальный период
        </div>
      )}
      <div
        className="relative overflow-visible pl-10"
        style={{ height: MAX_BAR_HEIGHT + 56 }}
      >
        {/* Bar/chart region: scale + grid 200px, year labels 24px below */}
        <div
          className="absolute left-0 right-0 top-0"
          style={{ height: MAX_BAR_HEIGHT + 24 }}
        >
          {/* Left Y-scale labels aligned with grid (bar region only) */}
          <div
            className="absolute left-0 top-0 w-10"
            style={{ height: MAX_BAR_HEIGHT }}
            aria-hidden
          >
            {scaleTicks.map((tickVal, tickIdx) => {
              const bottomPct =
                range > 0 ? ((tickVal - minYield) / range) * 100 : 0;
              return (
                <span
                  key={tickIdx}
                  className="absolute right-1 text-xs text-slate-500 tabular-nums translate-y-1/2"
                  style={{ bottom: `${bottomPct}%` }}
                >
                  {tickVal.toFixed(1)}%
                </span>
              );
            })}
          </div>

          {/* Chart area: grid in 200px, bars in 224px (24px for year labels) */}
          <div
            className="absolute left-10 right-0 top-0"
            style={{ height: MAX_BAR_HEIGHT + 24 }}
          >
          {/* Grid: horizontal lines at scale ticks */}
          <div
            className="absolute inset-x-0 top-0"
            style={{ height: MAX_BAR_HEIGHT }}
            aria-hidden
          >
            {scaleTicks.map((tickVal, idx) => {
              const bottomPct =
                range > 0 ? ((tickVal - minYield) / range) * 100 : 0;
              return (
                <div
                  key={idx}
                  className="absolute left-0 right-0 border-t border-slate-200"
                  style={{
                    bottom: `${bottomPct}%`,
                    opacity: idx === 0 ? 0.2 : 0.3,
                  }}
                />
              );
            })}
            {/* Dashed baseline at minYield */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-slate-300"
              style={{ bottom: 0, opacity: 0.4 }}
            />
          </div>

          {/* Bars container: each bar centered above its year label */}
          <div
            className="absolute inset-0 flex items-end justify-around pb-6 px-2"
          >
            {yieldData.map((d, i) => {
              const isCurrentYear = i === yieldData.length - 1;
              const barHeight =
                range > 0
                  ? Math.max(4, ((d.p - minYield) / range) * MAX_BAR_HEIGHT)
                  : MAX_BAR_HEIGHT;
              const rawDelta = i > 0 ? Number(d.p - yieldData[i - 1].p) : null;
              const delta =
                rawDelta !== null && Math.abs(rawDelta) < 0.05 ? 0 : rawDelta;
              return (
                <div
                  key={i}
                  className="flex flex-1 min-w-0 flex-col items-center justify-end group relative z-10"
                >
                  <div className="flex flex-col items-center mb-1 min-h-[20px] justify-end">
                    {delta !== null ? (
                      <span
                        className={`text-[10px] font-medium tabular-nums ${
                          (delta ?? 0) > 0
                            ? "text-emerald-600"
                            : (delta ?? 0) < 0
                              ? "text-rose-600"
                              : "text-amber-600"
                        }`}
                      >
                        {(delta ?? 0) > 0 ? "▲" : (delta ?? 0) < 0 ? "▼" : "●"}{" "}
                        {(delta ?? 0) > 0 ? "+" : ""}
                        {(delta ?? 0).toFixed(1)}%
                      </span>
                    ) : null}
                  </div>
                  <div
                    className={`rounded-[9px] bg-gradient-to-t from-blue-500 to-indigo-600 transition-all duration-300 ease-out ${
                      isCurrentYear
                        ? "ring-[1.5px] ring-indigo-400/70"
                        : "opacity-70"
                    }`}
                    style={{
                      width: "70%",
                      maxWidth: 38,
                      minWidth: 24,
                      height: `${barHeight}px`,
                    }}
                  />
                  <div className="text-[9px] text-slate-500/70 mt-2">{d.y}</div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50 rounded-lg border border-slate-200 bg-white shadow-lg px-3 py-2.5 text-[11px] text-slate-600 text-left whitespace-nowrap">
                    <div className="font-medium">{d.y}</div>
                    <div>Доходность: {Number(d.p).toFixed(1)}%</div>
                    <div>Инвесторов: {d.investorsTotal}</div>
                    <div className="text-emerald-600">Пришли: +{d.investorsIn}</div>
                    <div className="text-rose-600">Ушли: −{d.investorsOut}</div>
                    <div>Доход: ${d.income.toLocaleString()}/год</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10 pt-3 text-sm text-center">
        <div>
          <div className="text-muted-foreground">Инвесторов</div>
          <div className="text-xl font-semibold">{investorsCount}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Годовой доход</div>
          <div className="text-xl font-semibold text-green-600">
            $
            {(
              yieldData[yieldData.length - 1]?.income ?? rentYear
            ).toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Рост</div>
          <div
            className={`text-xl font-semibold ${
              growthPct >= 0 ? "text-blue-600" : "text-rose-600"
            }`}
          >
            {growthPct >= 0 ? "+" : ""}{growthPct.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        Этот график показывает, как менялась доходность объекта с течением времени.
        Он помогает инвестору оценить стабильность, рост и историческую эффективность вложений.
      </div>
    </section>
  );
}

function OwnerObjectsSection(props: { currentListingId: string; currentOwnerId: string }) {
  const { currentListingId, currentOwnerId } = props;
  const ownerObjects = useMemo(() => {
    return DEMO_LISTINGS.filter(
      (l) => l.ownerId === currentOwnerId && l.id !== currentListingId
    );
  }, [currentListingId, currentOwnerId]);

  const riskStats = useMemo(() => {
    if (ownerObjects.length === 0) return { min: 1, avg: 1.5, max: 2 };
    const coeffs = ownerObjects.map((l) => 1 + l.salePercent / 100);
    const min = Math.min(...coeffs);
    const max = Math.max(...coeffs);
    const avg = coeffs.reduce((a, b) => a + b, 0) / coeffs.length;
    return { min, avg, max };
  }, [ownerObjects]);

  return (
    <section id="objects" className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-base font-semibold">Объекты этого владельца</div>
          <div className="text-sm text-muted-foreground">
            Другие объекты собственника, доступные для инвестирования
          </div>
        </div>
      </div>

      <div className="mt-5 -mx-4 overflow-x-hidden [&>*]:overflow-x-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="w-[150px]">Локация</TableHead>
              <TableHead className="w-[72px] text-center">Доход</TableHead>
              <TableHead className="w-[70px] text-center">Риск</TableHead>
              <TableHead className="w-[140px]">Стоимость</TableHead>
              <TableHead>Сбор</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ownerObjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-500">
                  Нет других объектов
                </TableCell>
              </TableRow>
            ) : (
              ownerObjects.map((l, index) => (
                <LotTableRow
                  key={l.id}
                  listing={l}
                  index={index}
                  riskStats={riskStats}
                  showMinInvestment={false}
                  showType={false}
                  showStar={false}
                  showIndex={false}
                  showInvestButton={false}
                  compactView={true}
                  compactYieldColumn={true}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-900 mb-3">
          Надёжность и управление объектами
        </h3>

        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            Владелец и объекты проверены платформой
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            Управление объектами осуществляется профессиональной управляющей компанией
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            Стабильные выплаты инвесторам на основе фактической аренды
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            Подтверждённая фактическая занятость объектов
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            Действующие договоры с арендаторами
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500">✓</span>
            Прозрачная финансовая отчётность
          </li>
        </ul>

        <p className="mt-3 text-xs text-slate-500">
          Управляющие компании проходят отдельную проверку платформой и работают по стандартам Betwix.
        </p>
      </div>
    </section>
  );
}

const FLAG_MAP: Record<string, string> = {
  Великобритания: "🇬🇧", США: "🇺🇸", Испания: "🇪🇸", Португалия: "🇵🇹", Германия: "🇩🇪",
  Франция: "🇫🇷", Италия: "🇮🇹", Нидерланды: "🇳🇱", ОАЭ: "🇦🇪", Япония: "🇯🇵",
  Россия: "🇷🇺", Казахстан: "🇰🇿", Украина: "🇺🇦", Польша: "🇵🇱", Мексика: "🇲🇽",
  Бразилия: "🇧🇷", Чили: "🇨🇱", Сингапур: "🇸🇬", Таиланд: "🇹🇭", Индия: "🇮🇳",
};

function RightSidebar(props: {
  listing: Listing;
  objectPrice: number;
  rentYear: number;
  minTicket: number;
  onInvestClick: () => void;
}) {
  const { listing, objectPrice, rentYear, minTicket, onInvestClick } = props;
  return (
    <div className="col-span-3 px-6 py-6 border-l space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2"><span className="opacity-60">🏢</span><div className="text-lg font-semibold">{listing.title}</div></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>{FLAG_MAP[listing.country] ?? "🏳️"} {listing.country}</span><span className="opacity-40">•</span><span className="flex items-center gap-1"><span className="opacity-60">📍</span>{listing.city}</span></div>
      </div>
      <InvestmentCalculator objectPrice={objectPrice} rentYear={rentYear} minTicket={minTicket} onInvestClick={onInvestClick} />
    </div>
  );
}


const P2P_MARKET_MULTIPLIER = 1.02;

function InvestmentCalculator(props: { objectPrice: number; rentYear: number; minTicket: number; onInvestClick: () => void }) {
  const { objectPrice, rentYear, minTicket, onInvestClick } = props;
  const [investment, setInvestment] = useState(100);

  const annualNetIncome = rentYear;
  const share = investment / objectPrice;
  const monthlyIncome = (annualNetIncome / 12) * share;
  const yearlyIncome = annualNetIncome * share;
  const estimatedExitValue = investment * P2P_MARKET_MULTIPLIER;

  return (
    <div className="border rounded-3xl p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold">Покупка доли</div>
          <div className="relative group">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border text-xs cursor-help">?</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-6 z-50 hidden group-hover:block w-64 max-w-[90vw] p-3 text-xs bg-white border rounded shadow-lg text-slate-600">
              Вы покупаете долю арендного дохода объекта. Доход выплачивается ежемесячно пропорционально вашей доле. Долю можно продать на P2P рынке в любой момент.
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Покупай и продавай доли в любой момент
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Сумма инвестиций</span>
          <span className="font-semibold">${investment.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={100}
          max={100000}
          step={100}
          value={investment}
          onChange={(e) => setInvestment(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="border-t pt-4 space-y-3 text-sm">
        <InfoRow label="Ваша доля" value={`${(share * 100).toFixed(2)}%`} />
        <InfoRow label="Доход в месяц" value={`$${monthlyIncome.toFixed(2)}`} />
        <InfoRow label="Доход в год" value={`$${yearlyIncome.toFixed(0)}`} />
      </div>

      <div className="text-xs text-muted-foreground">
        Рыночная цена P2P применяется только при продаже доли и не является арендным доходом
      </div>

      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-xl text-base font-medium"
        onClick={onInvestClick}
      >
        Инвестировать
      </button>

      <div className="border-t pt-3 space-y-3">
        <div className="text-sm font-medium">P2P рынок долей</div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>
            Рыночная цена доли: <span className="font-medium text-foreground">{P2P_MARKET_MULTIPLIER}×</span>
          </div>
          <div>
            Оценка стоимости доли при продаже: <span className="font-medium text-foreground">≈ ${estimatedExitValue.toFixed(0)}</span>
          </div>
          <div className="text-muted-foreground/80">Цена формируется рынком и не гарантирована</div>
          <div>
            Последняя сделка: <span className="font-medium text-foreground">$5,120</span>
          </div>
          <div>
            Активных ордеров: <span className="font-medium text-foreground">18</span>
          </div>
          <div>
            Ожидаемое время выхода: <span className="font-medium text-foreground">3–7 дней</span>
          </div>
          <Link to="/p2p" className="text-sm text-slate-500 hover:text-blue-600 cursor-pointer">
            Смотреть ордера на P2P →
          </Link>
        </div>

        <div className="border-t pt-3 text-xs text-muted-foreground space-y-1">
          <div>✓ Выплаты ежемесячно</div>
          <div>✓ Свободный выход через P2P</div>
          <div>✓ Рыночная цена доли</div>
        </div>

        <div className="text-center text-xs text-muted-foreground">Минимальная сумма: ${minTicket.toLocaleString()}</div>
      </div>
    </div>
  );
}

function InfoRow(props: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{props.label}</span>
      <span className="font-medium">{props.value}</span>
    </div>
  );
}

export default ObjectPage;