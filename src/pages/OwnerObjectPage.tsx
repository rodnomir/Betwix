import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle } from "lucide-react";
import { getOwnerObjectById } from "./Owner";
import { Card } from "@/components/ui/card";

const MAX_BAR_HEIGHT = 160;

type YieldYearData = {
  y: number;
  p: number;
  income: number;
};

function generateYieldData(rentYear: number, seed: number): YieldYearData[] {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];
  const yieldDeltas = [0.8, -0.5, 0.7];
  let p = 3.2 + (seed % 20) / 10;
  const data: YieldYearData[] = [];
  for (let i = 0; i < years.length; i++) {
    p = Math.round(Math.min(12, Math.max(2, p + yieldDeltas[i])) * 10) / 10;
    const income = Math.round((rentYear * p) / 6.5);
    data.push({ y: years[i], p, income });
  }
  return data;
}

function money(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function OwnerObjectPage() {
  const { id } = useParams<{ id: string }>();
  const obj = getOwnerObjectById(id ?? "");
  const [chartMode, setChartMode] = useState<"pct" | "usd">("usd");

  if (!obj) return <Navigate to="/owner" replace />;

  const rentYear = obj.rentMonthly * 12;
  const seed = parseInt(obj.id.replace(/\D/g, ""), 10) || 1;
  const yieldData = useMemo(
    () => generateYieldData(rentYear, seed),
    [rentYear, seed]
  );
  const growthPct =
    yieldData.length >= 2
      ? yieldData[yieldData.length - 1].p - yieldData[yieldData.length - 2].p
      : 0;

  const isResidential = obj.type === "Жилая";
  const vacancyRate = isResidential ? 0 : 100 - obj.occupancyPct;
  const totalAreaSqm = Math.round(obj.objectValue / 600) || 800;
  const vacantAreaSqm = isResidential ? 0 : Math.round(totalAreaSqm * (vacancyRate / 100));
  const rentPerSqm = rentYear / totalAreaSqm;
  const lostIncomeYear = isResidential ? 0 : Math.round(vacantAreaSqm * rentPerSqm);
  const potentialIncomeYear = rentYear + lostIncomeYear;

  const { minYield, range, scaleTicks } = useMemo(() => {
    const vals = chartMode === "pct" ? yieldData.map((d) => d.p) : yieldData.map((d) => d.income);
    const dataMax = Math.max(...vals);
    const dataMin = Math.min(...vals);
    const buffer = chartMode === "pct" ? 1 : dataMax * 0.1;
    const maxY = chartMode === "pct" ? Math.ceil(dataMax + buffer) : Math.ceil((dataMax + buffer) / 1000) * 1000;
    const minY = chartMode === "pct" ? Math.max(0, Math.floor(dataMin - 0.5)) : 0;
    const r = Math.max(maxY - minY, 0.5);
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(chartMode === "pct" ? Math.round((minY + (r * i) / 4) * 10) / 10 : Math.round(minY + (r * i) / 4));
    }
    return { minYield: minY, range: r, scaleTicks: ticks };
  }, [yieldData, chartMode]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1280px] px-6 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/owner"
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" /> Назад в кабинет
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{obj.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {obj.id} · {obj.type} · {obj.city}
          </p>
        </div>

        {/* 1. Financial Core KPIs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
            <div className="text-sm font-medium text-slate-500">Годовой доход</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{money(rentYear)}</div>
          </Card>
          <Card className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
            <div className="text-sm font-medium text-slate-500">Доход в месяц</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{money(obj.rentMonthly)}</div>
          </Card>
          <Card className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
            <div className="text-sm font-medium text-slate-500">Рост доходности</div>
            <div
              className={
                "mt-2 text-2xl font-semibold " +
                (growthPct >= 0 ? "text-blue-600" : "text-rose-600")
              }
            >
              {growthPct >= 0 ? "+" : ""}{growthPct.toFixed(1)}%
            </div>
            <div className="mt-1 text-xs text-slate-500">YoY</div>
          </Card>
          <Card className="rounded-2xl border bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
            <div className="text-sm font-medium text-slate-500">Потенциал vs факт</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{money(potentialIncomeYear - rentYear)}</div>
            <div className="mt-1 text-xs text-slate-500">дельта в год</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* 2. Chart */}
            <Card className="rounded-2xl border p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="text-base font-semibold text-slate-900">Доход объекта во времени</div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setChartMode("usd")}
                    className={
                      "px-3 py-1 text-xs font-medium rounded " +
                      (chartMode === "usd" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100")
                    }
                  >
                    $ дохода
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMode("pct")}
                    className={
                      "px-3 py-1 text-xs font-medium rounded " +
                      (chartMode === "pct" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100")
                    }
                  >
                    % доходности
                  </button>
                </div>
              </div>
              <div className="relative pl-10" style={{ height: MAX_BAR_HEIGHT + 40 }}>
                <div className="absolute left-0 top-0 w-10" style={{ height: MAX_BAR_HEIGHT }} aria-hidden>
                  {scaleTicks.map((tickVal, i) => {
                    const bottomPct = range > 0 ? ((tickVal - minYield) / range) * 100 : 0;
                    return (
                      <span
                        key={i}
                        className="absolute right-1 text-xs text-slate-500 tabular-nums translate-y-1/2"
                        style={{ bottom: `${bottomPct}%` }}
                      >
                        {chartMode === "pct" ? `${tickVal.toFixed(1)}%` : `$${(tickVal / 1000).toFixed(0)}k`}
                      </span>
                    );
                  })}
                </div>
                <div className="absolute left-10 right-0 flex items-end justify-around pb-8 px-2" style={{ height: MAX_BAR_HEIGHT }}>
                  {yieldData.map((d, i) => {
                    const val = chartMode === "pct" ? d.p : d.income;
                    const barHeight =
                      range > 0 ? Math.max(8, ((val - minYield) / range) * MAX_BAR_HEIGHT) : MAX_BAR_HEIGHT;
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center justify-end">
                        <div
                          className="rounded-lg bg-blue-600 w-[70%] max-w-[36px]"
                          style={{ height: `${barHeight}px` }}
                        />
                        <div className="text-[10px] text-slate-500 mt-2">{d.y}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {/* 3. Liquidity */}
            <Card className="rounded-2xl border p-4">
              <div className="text-sm font-semibold text-slate-900 mb-2">Ликвидность</div>
              <div className="text-lg font-medium text-slate-800">
                {obj.liquidity ?? "Средняя"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Влияет на скорость продаж долей инвесторами
              </div>
            </Card>

            {/* 4. Risks */}
            <Card className="rounded-2xl border p-4">
              <div className="text-sm font-semibold text-slate-900 mb-3">Риски</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Vacancy rate</span>
                  <span className="font-medium text-slate-900">{vacancyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Свободная площадь</span>
                  <span className="font-medium text-slate-900">{vacantAreaSqm} м²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Потерянный доход</span>
                  <span className="font-medium text-rose-600">{money(lostIncomeYear)}</span>
                </div>
              </div>
            </Card>

            {/* 5. UK */}
            <Card className="rounded-2xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-500" />
                  <span className="font-semibold text-slate-900">{obj.mgmt.name}</span>
                  {obj.mgmt.verified && (
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-2">
                {obj.mgmt.verified ? "Verified" : "Not verified"}
              </div>
              <Link
                to="/owner"
                state={{ openSection: "documents" }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Перейти к отчётам УК →
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
