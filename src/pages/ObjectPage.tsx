import React, { useMemo, useState } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { getListingById, type Listing } from "@/data/demoListings";

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

function Header() {
  return (
    <div className="sticky top-0 z-50 border-b px-8 py-4 bg-background">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
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
  const listing: Listing | null =
    (location.state as { listing?: Listing } | null)?.listing ?? getListingById(id ?? "");

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
    <div className="flex min-h-full flex-col bg-background">
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 w-full min-h-[calc(100vh-8rem)]">
        <LeftSidebar
          listing={listing}
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
        />

        <RightSidebar
          listing={listing}
          objectPrice={OBJECT_PRICE}
          rentYear={RENT_YEAR}
          minTicket={listing.minTicket}
        />
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-white w-full mt-8">
      <div className="max-w-[1600px] mx-auto px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
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

function MetricCard(props: {
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
    occupancyRate,
    occupiedArea,
    vacantArea,
    lostIncomeYear,
    potentialIncomeYear,
    vacancyDaysYear,
    currentYield,
    yieldGrowthPct,
  } = props;
  const yieldPct = currentYield.toFixed(1);
  const ownerRating = 7.5 + (listing.businessValue % 25) / 10;
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
    <div className="col-span-3 px-6 py-6 border-r space-y-8 relative min-h-[1500px]">
      <section className="space-y-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase">Владелец объекта</div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">JD</div>
          <div>
            <div className="font-medium">John Doe</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Рейтинг собственника</span>
              <div className="relative group">
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold cursor-help">{ownerRating.toFixed(1)} / 10</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:block w-80 p-3 text-xs bg-background border rounded shadow text-muted-foreground pointer-events-auto">
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
            <div className="text-xs text-muted-foreground">Объектов на платформе: 6</div>
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
              <div className="text-lg font-semibold">{Math.round(occupancyRate * 100)}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Потенциал</div>
              <div className="text-lg font-semibold text-green-600">
                ${potentialIncomeYear.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Потерянный доход</div>
              <div className="text-lg font-semibold text-orange-600">-${lostIncomeYear.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Площадь занята</div>
              <div className="text-lg font-semibold">{occupiedArea} м²</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Свободно</div>
              <div className="text-lg font-semibold text-orange-600">{vacantArea} м²</div>
            </div>
          </div>

          <div className="pt-3 space-y-1 text-xs text-muted-foreground">
            <div>✓ Управляющая компания</div>
            <div>✓ Контракт с индексацией</div>
            <div>✓ Фактическая занятость {Math.round(occupancyRate * 100)}%</div>
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:block w-80 p-3 text-xs bg-background border rounded shadow text-muted-foreground">
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
}) {
  const { objectPrice, rentYear, yieldData } = props;
  const [activeTab, setActiveTab] = useState<
    "graph" | "objects" | "news" | "docs"
  >("graph");

  return (
    <div className="col-span-6 min-h-0 overflow-visible px-4 py-6 border-r">
      <nav className="sticky top-0 bg-background z-10 border-b pb-2 mb-6">
        <div className="flex gap-6 text-sm">
          {[
            { id: "graph" as const, label: "График" },
            { id: "objects" as const, label: "Объекты владельца" },
            { id: "news" as const, label: "Новости" },
            { id: "docs" as const, label: "Документы" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-1 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="animate-in fade-in slide-in-from-top-2 duration-200">
        {activeTab === "graph" && (
          <YieldSection
            objectPrice={objectPrice}
            rentYear={rentYear}
            yieldData={yieldData}
          />
        )}
        {activeTab === "objects" && <OwnerObjectsSection />}
        {activeTab === "news" && (
          <section className="space-y-4">
            <div className="text-base font-semibold">
              Новости управляющей компании
            </div>
            <div className="space-y-4">
              {Array.from({ length: 15 }).map((_, i) => (
                <NewsItem
                  key={i}
                  author="УК London Property"
                  date={`Новость №${i + 1} · 2026`}
                  text="Плановое обновление по объекту. Все показатели в пределах нормы, арендаторы работают в штатном режиме."
                />
              ))}
            </div>
          </section>
        )}
        {activeTab === "docs" && (
          <section className="space-y-4">
            <div className="text-base font-semibold">Документы по объекту</div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted transition">
                <div className="flex items-center gap-3">
                  <span>📄</span>
                  <div>
                    <div className="text-sm font-medium">
                      Отчёт УК · Декабрь 2025
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Финансы и заполняемость
                    </div>
                  </div>
                </div>
                <button className="text-sm text-blue-600 hover:underline">
                  Скачать
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
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
              <div className="absolute left-0 top-6 z-20 hidden group-hover:block w-64 p-3 text-xs bg-background border rounded shadow">
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

function OwnerObjectsSection() {
  const objects = [
    {
      id: 1,
      locationCountry: "🇬🇧 Великобритания",
      locationCity: "Лондон",
      yield: "9.5%",
      risk: "81%",
      riskDelta: "▼ 1,450 Kr",
      min: "$5,000",
      progress: 24,
      days: "30 дней",
      left: "480,934",
    },
    {
      id: 2,
      locationCountry: "🇬🇧 Великобритания",
      locationCity: "Манчестер",
      yield: "7.1%",
      risk: "74%",
      riskDelta: "▲ 820 Kr",
      min: "$5,000",
      progress: 25,
      days: "45 дней",
      left: "105,931",
    },
    {
      id: 3,
      locationCountry: "🇬🇧 Великобритания",
      locationCity: "Бирмингем",
      yield: "8.3%",
      risk: "76%",
      riskDelta: "▲ 410 Kr",
      min: "$5,000",
      progress: 40,
      days: "20 дней",
      left: "210,120",
    },
    {
      id: 4,
      locationCountry: "🇬🇧 Великобритания",
      locationCity: "Лидс",
      yield: "6.9%",
      risk: "72%",
      riskDelta: "▼ 120 Kr",
      min: "$5,000",
      progress: 60,
      days: "12 дней",
      left: "98,400",
    },
    {
      id: 5,
      locationCountry: "🇬🇧 Великобритания",
      locationCity: "Бристоль",
      yield: "7.8%",
      risk: "79%",
      riskDelta: "▲ 560 Kr",
      min: "$5,000",
      progress: 18,
      days: "55 дней",
      left: "315,600",
    },
    {
      id: 6,
      locationCountry: "🇬🇧 Великобритания",
      locationCity: "Ливерпуль",
      yield: "8.1%",
      risk: "77%",
      riskDelta: "▲ 300 Kr",
      min: "$5,000",
      progress: 33,
      days: "28 дней",
      left: "188,900",
    },
  ];

  return (
    <section id="objects" className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-base font-semibold">Объекты владельца</div>
          <div className="text-sm text-muted-foreground">
            Другие объекты этого собственника, доступные для инвестирования
          </div>
        </div>
        
      </div>

      <div className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-6 gap-6 px-2 text-sm text-muted-foreground">
          <div>Локация</div>
          <div>Доходность</div>
          <div>Риск</div>
          <div>Мин</div>
          <div className="col-span-2">Сбор</div>
        </div>

        {objects.map((o) => (
          <div
            key={o.id}
            className="grid grid-cols-6 gap-6 items-center px-2 py-4 border-t hover:bg-muted transition"
          >
            {/* Location */}
            <div>
              <div className="font-medium">{o.locationCountry}</div>
              <div className="text-xs text-muted-foreground">📍 {o.locationCity}</div>
            </div>

            {/* Yield */}
            <div>
              <div className="text-green-600 font-semibold">{o.yield}</div>
              <div className="text-xs text-muted-foreground">годовых</div>
            </div>

            {/* Risk */}
            <div>
              <div className="font-medium">{o.risk}</div>
              <div className="text-xs text-green-600">{o.riskDelta}</div>
            </div>

            {/* Min */}
            <div className="font-medium">{o.min}</div>

            {/* Progress */}
            <div className="col-span-2 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{o.progress}%</span>
                <span>${o.left}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${o.progress}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">{o.days}</div>
            </div>
          </div>
        ))}
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
}) {
  const { listing, objectPrice, rentYear, minTicket } = props;
  return (
    <div className="col-span-3 px-6 py-6 border-l space-y-6 min-h-[1500px]">
      <div className="space-y-1">
        <div className="flex items-center gap-2"><span className="opacity-60">🏢</span><div className="text-lg font-semibold">{listing.title}</div></div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>{FLAG_MAP[listing.country] ?? "🏳️"} {listing.country}</span><span className="opacity-40">•</span><span className="flex items-center gap-1"><span className="opacity-60">📍</span>{listing.city}</span></div>
        <div className="flex gap-2 pt-2">{[1,2,3,4,5].map((i) => (<div key={i} className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">фото</div>))}</div>
      </div>
      <InvestmentCalculator objectPrice={objectPrice} rentYear={rentYear} minTicket={minTicket} />
    </div>
  );
}


function InvestmentCalculator(props: { objectPrice: number; rentYear: number; minTicket: number }) {
  const { objectPrice, rentYear, minTicket } = props;
  const [investment, setInvestment] = useState(100);
  const [years, setYears] = useState(10);

  const share = investment / objectPrice;
  const incomeYear = rentYear * share;
  const incomeMonth = incomeYear / 12;
  const totalIncome = incomeYear * years;
  const finalAmount = investment + totalIncome;

  return (
    <div className="border rounded-3xl p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="text-xl font-semibold">Покупка доли</div>
          <div className="relative group">
            <span className="w-5 h-5 flex items-center justify-center rounded-full border text-xs cursor-help">?</span>
            <div className="absolute left-1/2 -translate-x-1/2 top-6 z-20 hidden group-hover:block w-64 max-w-[90vw] p-3 text-xs bg-background border rounded shadow">
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

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Срок инвестирования</span>
          <span className="font-semibold">{years} лет</span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="border-t pt-4 space-y-3 text-sm">
        <InfoRow label="Ваша доля" value={`${(share * 100).toFixed(2)}%`} />
        <InfoRow label="Доход в месяц" value={`$${incomeMonth.toFixed(2)}`} />
        <InfoRow label="Доход в год" value={`$${incomeYear.toFixed(0)}`} />
        <InfoRow label={`Общий доход (${years} лет)`} value={`$${totalIncome.toLocaleString()}`} />
        <InfoRow label="Финальная сумма" value={`$${finalAmount.toLocaleString()}`} />
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-2xl text-lg">
        Инвестировать от ${minTicket.toLocaleString()}
      </button>

      <div className="border-t pt-3 space-y-3">
        <div className="text-sm font-medium">P2P рынок долей</div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>
            Рыночная цена доли: <span className="font-medium text-foreground">1.02×</span>
          </div>
          <div>
            Последняя сделка: <span className="font-medium text-foreground">$5,120</span>
          </div>
          <div>
            Активных ордеров: <span className="font-medium text-foreground">18</span>
          </div>
          <div>
            Ожидаемое время выхода: <span className="font-medium text-foreground">3–7 дней</span>
          </div>
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

function NewsItem(props: { author: string; date: string; text: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
        {props.author.charAt(0)}
      </div>
      <div>
        <div className="text-xs text-muted-foreground">
          {props.author} · {props.date}
        </div>
        <div className="text-sm">{props.text}</div>
      </div>
    </div>
  );
}