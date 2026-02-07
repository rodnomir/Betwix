import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUp, ArrowDown, Eye } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { navItemUnderlineStyles } from "@/components/NavItemUnderline";
import {
  demoNews,
  getDemoLeaders,
  SEGMENT_TABS,
  demoCountryIndex,
  formatPricePerM2,
  ARTICLE_BODY_PLACEHOLDER,
  type NewsSegment,
  type DemoNewsItem,
  type LeaderMetric,
  type LeaderDirection,
} from "@/data/newsMarket";

const COUNTRY_FLAG: Record<string, string> = {
  DE: "🇩🇪", PL: "🇵🇱", SK: "🇸🇰", CZ: "🇨🇿", AT: "🇦🇹",
  HU: "🇭🇺", RO: "🇷🇴", ES: "🇪🇸", IT: "🇮🇹",
};

/** Country name (leaders list) → flag emoji */
const LEADER_COUNTRY_FLAG: Record<string, string> = {
  Португалия: "🇵🇹", Польша: "🇵🇱", Испания: "🇪🇸", Франция: "🇫🇷",
  Германия: "🇩🇪", Нидерланды: "🇳🇱",
};

const LEADER_MENU_TOOLTIPS: Record<string, string> = {
  "Leaders growth": "Countries with the highest positive change over the selected period.",
  "Leaders decline": "Countries with the largest negative change over the selected period.",
  Rent: "Change in rental rates. Reflects cash flow dynamics.",
  Price: "Change in price per square meter. Reflects market capitalization growth.",
  Yield: "Rental income relative to property price. Investment efficiency metric.",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function filterNewsBySegment(
  items: DemoNewsItem[],
  segment: NewsSegment
): DemoNewsItem[] {
  if (segment === "all") return [...items].sort((a, b) => (b.date > a.date ? 1 : -1));
  return items
    .filter((item) => item.segment === segment)
    .sort((a, b) => (b.date > a.date ? 1 : -1));
}

function renderArticleBody(body: string): React.ReactNode {
  const fullText = body.length >= 1500 ? body : `${body}\n\n${ARTICLE_BODY_PLACEHOLDER}`;
  return fullText.split(/\n\n+/).map((p, i) => (
    <p key={i} className="text-base text-slate-700 leading-7 mb-4">
      {p}
    </p>
  ));
}

export default function News() {
  const [searchParams, setSearchParams] = useSearchParams();
  const slugFromUrl = searchParams.get("article");
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (slugFromUrl) {
      const found = demoNews.find((n) => n.slug === slugFromUrl);
      return found?.id ?? demoNews[0]?.id ?? null;
    }
    return demoNews[0]?.id ?? null;
  });
  const [segment, setSegment] = useState<NewsSegment>("all");
  const [leaderDirection, setLeaderDirection] = useState<LeaderDirection>("growth");
  const [leaderMetric, setLeaderMetric] = useState<LeaderMetric>("аренда");
  const [tickerPaused, setTickerPaused] = useState(false);

  const filteredList = useMemo(
    () => filterNewsBySegment(demoNews, segment),
    [segment]
  );
  const selectedArticle = useMemo(() => {
    const byId = demoNews.find((n) => n.id === selectedId);
    if (byId) return byId;
    return filteredList[0] ?? null;
  }, [selectedId, filteredList]);
  const leaders = useMemo(
    () => getDemoLeaders(leaderMetric, leaderDirection),
    [leaderMetric, leaderDirection]
  );

  useEffect(() => {
    if (selectedArticle) {
      setSearchParams({ article: selectedArticle.slug }, { replace: true });
    }
  }, [selectedArticle, setSearchParams]);

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <header className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Новости рынка
          </h1>
        </header>

        {/* Навигация по типам недвижимости — как в основном меню (underline из центра) */}
        <nav className="flex flex-wrap items-center gap-6 mb-4 overflow-x-auto">
          {SEGMENT_TABS.map((tab) => {
            const isActive = segment === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSegment(tab.value)}
                className={navItemUnderlineStyles.container + navItemUnderlineStyles.text(isActive)}
              >
                {tab.label}
                <span
                  className={navItemUnderlineStyles.line(isActive)}
                  aria-hidden
                />
              </button>
            );
          })}
        </nav>

        {/* Market snapshot bar — compact 2-line ticker, no borders */}
        <div
          className="overflow-hidden py-1.5 mb-6"
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
        >
          <div
            className={`flex items-start gap-6 w-max ${!tickerPaused ? "animate-ticker" : ""}`}
          >
            {[...demoCountryIndex, ...demoCountryIndex].map((item, i) => {
              const tickerDate = new Date().toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
              });
              const flag = COUNTRY_FLAG[item.code] ?? "";
              const pctStr = item.deltaPct >= 0
                ? `+${item.deltaPct.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
                : `${item.deltaPct.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
              return (
                <div
                  key={`${item.code}-${i}`}
                  className="shrink-0 flex flex-col leading-tight"
                  title="Средняя цена 1 м² (демо)"
                >
                  <div className="text-xs">
                    <span>{flag}</span> <span className="text-slate-800">{item.code}</span>  <span className="text-slate-400 tabular-nums">{tickerDate}</span>
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-slate-900 tabular-nums">
                      {formatPricePerM2(item.pricePerM2)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-medium tabular-nums ${
                        item.deltaPct >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {item.deltaPct >= 0 ? (
                        <ArrowUp className="h-3 w-3" aria-hidden />
                      ) : (
                        <ArrowDown className="h-3 w-3" aria-hidden />
                      )}
                      {pctStr}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4) Основная сетка: Лента | Материал | Сайдбар (без Card, одна вертикальная линия) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Лента слева — без карточки, шире */}
          <div
            className="md:col-span-4 order-2 md:order-1 md:h-[calc(100vh-320px)] md:min-h-[360px] overflow-y-auto border-r border-slate-200 md:pr-4"
            style={{ maxHeight: "50vh" }}
          >
            {filteredList.length === 0 ? (
              <div className="py-6 text-sm text-slate-500 text-center">
                Нет публикаций
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left py-3 px-1 hover:bg-slate-50 transition-colors ${
                      selectedId === item.id
                        ? "bg-slate-50"
                        : ""
                    }`}
                  >
                    <div className="text-xs text-slate-500 mb-0.5">
                      {formatDate(item.date)} · {item.country}
                    </div>
                    <div
                      className={`text-sm line-clamp-1 ${
                        selectedId === item.id
                          ? "font-semibold text-slate-900"
                          : "font-medium text-slate-800"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {item.excerpt}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Материал по центру — без карточки, только контент */}
          <div className="md:col-span-5 order-1 md:order-2 border-r border-slate-200 md:px-6 md:py-4 pb-8">
            {selectedArticle ? (
              <article className="max-w-none">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                  <time dateTime={selectedArticle.date}>
                    {formatDate(selectedArticle.date)}
                  </time>
                  <span>{selectedArticle.country}</span>
                  {selectedArticle.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {selectedArticle.views.toLocaleString("ru-RU")}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-tight">
                  {selectedArticle.title}
                </h2>
                <p className="text-base text-slate-600 leading-7 mb-4">
                  {selectedArticle.excerpt}
                </p>
                <div className="w-full h-48 sm:h-56 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 mb-6" />
                <div className="article-body">
                  {renderArticleBody(selectedArticle.body)}
                </div>
              </article>
            ) : (
              <div className="py-12 text-center text-sm text-slate-500">
                Выберите новость из ленты
              </div>
            )}
          </div>

          {/* Right block — Leaders list: Level 1 = mode, Level 2 = metric, then data */}
          <div className="md:col-span-3 order-3 md:pl-4 md:py-2">
            {/* Level 1 — Mode (primary tabs): Leaders growth | Leaders decline */}
            <div className="flex items-center gap-2 mb-3">
              {[
                { value: "growth" as const, label: "Leaders growth" },
                { value: "fall" as const, label: "Leaders decline" },
              ].map(({ value, label }) => (
                <span key={value} className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLeaderDirection(value)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                      leaderDirection === value
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                  <span className="group relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-300 text-[10px] text-slate-600">
                    ?
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 w-[220px] -translate-x-1/2 rounded bg-slate-800 px-2.5 py-1.5 text-[11px] text-slate-100 opacity-0 transition-opacity group-hover:opacity-100">
                      {LEADER_MENU_TOOLTIPS[label]}
                    </span>
                  </span>
                </span>
              ))}
            </div>
            {/* Level 2 — Metric (secondary): Rent | Price | Yield */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-4">
              {[
                { value: "аренда" as const, label: "Rent" },
                { value: "цена" as const, label: "Price" },
                { value: "yield" as const, label: "Yield" },
              ].map(({ value, label }) => (
                <span key={value} className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setLeaderMetric(value)}
                    className={`font-medium ${leaderMetric === value ? "text-slate-800" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    {label}
                  </button>
                  <span className="group relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-500">
                    ?
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 w-[220px] -translate-x-1/2 rounded bg-slate-800 px-2.5 py-1.5 text-[11px] text-slate-100 opacity-0 transition-opacity group-hover:opacity-100">
                      {LEADER_MENU_TOOLTIPS[label]}
                    </span>
                  </span>
                </span>
              ))}
            </div>
            {/* Data rows: flag + name left; right = pct (primary) above value (secondary) */}
            <div className="space-y-2">
              {leaders.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 text-base leading-none">
                      {LEADER_COUNTRY_FLAG[row.country] ?? "🏳️"}
                    </span>
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {row.country}
                    </span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 text-right">
                    <span
                      className={`text-lg font-semibold tabular-nums leading-tight ${
                        row.pct >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {row.pct >= 0 ? "+" : ""}
                      {row.pct}%
                    </span>
                    <span className="text-xs text-slate-500 tabular-nums mt-0.5">
                      {row.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
          width: max-content;
        }
      `}</style>
    </PageContainer>
  );
}
