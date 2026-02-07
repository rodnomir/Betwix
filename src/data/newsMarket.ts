import { NEWS_ITEMS } from "./news";

export type NewsSegment =
  | "all"
  | "жилая"
  | "коммерческая"
  | "земля"
  | "ритейл"
  | "складская";

export type DemoNewsItem = {
  id: string;
  slug: string;
  segment: NewsSegment;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  country: string;
  body: string;
  views: number;
};

const SEGMENTS: NewsSegment[] = [
  "жилая",
  "коммерческая",
  "земля",
  "ритейл",
  "складская",
];
const COUNTRIES = [
  "Португалия",
  "Испания",
  "Германия",
  "Польша",
  "Нидерланды",
  "Франция",
];

function buildDemoNews(): DemoNewsItem[] {
  const list: DemoNewsItem[] = NEWS_ITEMS.map((item, i) => ({
    id: item.id,
    slug: item.slug,
    segment: SEGMENTS[i % SEGMENTS.length],
    category: item.category,
    title: item.title,
    excerpt: item.excerpt,
    date: item.date,
    tags: item.tags,
    country: COUNTRIES[i % COUNTRIES.length],
    body: item.content,
    views: 1200 + i * 87,
  }));
  return list.sort((a, b) => (b.date > a.date ? 1 : -1));
}

/** Длинный текст статьи для отображения (минимум ~2000 символов). */
export const ARTICLE_BODY_PLACEHOLDER =
  "Рынок доходной недвижимости в Европе продолжает привлекать внимание инвесторов. Цены на жильё и коммерческие объекты зависят от локации, спроса на аренду и макроэкономических факторов. Эксперты отмечают рост интереса к сегменту частной аренды и студенческого жилья в ряде стран.\n\n" +
  "Управляющие компании играют ключевую роль в обеспечении доходности объектов: от подбора арендаторов до своевременного ремонта и отчётности. Качество управления напрямую влияет на стабильность поступлений и удовлетворённость инвесторов. Платформы, агрегирующие объекты и стандартизирующие отчётность, упрощают сравнение предложений.\n\n" +
  "Ликвидность долей в недвижимости остаётся ограниченной по сравнению с публичными инструментами. Вторичный рынок через P2P-площадки позволяет инвесторам выходить из позиций, однако срок и цена продажи не гарантированы. Рекомендуется учитывать горизонт инвестирования и диверсификацию по объектам и регионам.\n\n" +
  "Регуляторная среда различается по юрисдикциям: требования к лицензированию, налогообложению и раскрытию информации меняются. Инвесторам стоит ознакомиться с местным законодательством и условиями конкретных продуктов перед принятием решений. Информация на данном сайте носит справочный характер и не является инвестиционной рекомендацией.\n\n" +
  "В ближайшие месяцы ожидается дальнейшее развитие цифровых платформ учёта прав и прозрачности данных по объектам. Стандартизация отчётности и событийный учёт способствуют снижению информационной асимметрии и повышению доверия участников рынка.\n\n" +
  "Диверсификация по типам активов — жилая аренда, коммерческая недвижимость, складские и ритейл-объекты — позволяет снижать риски портфеля. Доходность и ликвидность существенно различаются в зависимости от сегмента и страны. Аналитики рекомендуют учитывать не только объявленную доходность, но и историю исполнения обязательств управляющими компаниями и застройщиками.";

export const demoNews: DemoNewsItem[] = buildDemoNews();

export const demoTicker: { label: string; value: string; delta: number }[] = [
  { label: "Португалия · Аренда", value: "€12/м²", delta: 2.4 },
  { label: "Испания · Цена", value: "€2 840/м²", delta: -0.8 },
  { label: "Германия · Yield", value: "4.2%", delta: 0.2 },
  { label: "Польша · Аренда", value: "€9/м²", delta: 1.1 },
  { label: "Нидерланды · Цена", value: "€4 100/м²", delta: -1.2 },
  { label: "Франция · Yield", value: "3.8%", delta: 0.5 },
  { label: "Португалия · Yield", value: "5.1%", delta: 0.3 },
  { label: "Испания · Аренда", value: "€11/м²", delta: 1.8 },
  { label: "Германия · Аренда", value: "€14/м²", delta: -0.4 },
  { label: "Польша · Цена", value: "€1 920/м²", delta: 2.0 },
];

/** Индексы: средняя стоимость 1 м² по стране (€), изменение в % за период. Для блока «Индексы» в стиле РБК. */
export type CountryIndexItem = {
  code: string;
  name: string;
  pricePerM2: number;
  deltaPct: number;
};

export const demoCountryIndex: CountryIndexItem[] = [
  { code: "DE", name: "Германия", pricePerM2: 3567, deltaPct: 1.7 },
  { code: "PL", name: "Польша", pricePerM2: 1920, deltaPct: 2.0 },
  { code: "SK", name: "Словакия", pricePerM2: 2180, deltaPct: -0.5 },
  { code: "CZ", name: "Чехия", pricePerM2: 2450, deltaPct: 1.2 },
  { code: "AT", name: "Австрия", pricePerM2: 4120, deltaPct: -0.8 },
  { code: "HU", name: "Венгрия", pricePerM2: 1680, deltaPct: 0.9 },
  { code: "RO", name: "Румыния", pricePerM2: 1320, deltaPct: 2.4 },
  { code: "ES", name: "Испания", pricePerM2: 2840, deltaPct: -0.3 },
  { code: "IT", name: "Италия", pricePerM2: 2690, deltaPct: 0.4 },
];

/** Форматирование цены за м²: "3 567 €" */
export function formatPricePerM2(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/\u202f/g, " ")} €`;
}

export type LeaderMetric = "аренда" | "цена" | "yield";
export type LeaderDirection = "growth" | "fall";

const LEADER_ROWS_GROWTH = [
  { country: "Португалия", pct: 2.4, value: "€12/м²" },
  { country: "Польша", pct: 2.0, value: "€1 920/м²" },
  { country: "Испания", pct: 1.8, value: "€11/м²" },
  { country: "Польша", pct: 1.1, value: "€9/м²" },
  { country: "Франция", pct: 0.5, value: "3.8%" },
];

const LEADER_ROWS_FALL = [
  { country: "Нидерланды", pct: -1.2, value: "€4 100/м²" },
  { country: "Испания", pct: -0.8, value: "€2 840/м²" },
  { country: "Германия", pct: -0.4, value: "€14/м²" },
  { country: "Португалия", pct: -0.3, value: "5.1%" },
  { country: "Германия", pct: -0.2, value: "4.2%" },
];

const LEADER_BY_METRIC: Record<
  LeaderMetric,
  { growth: typeof LEADER_ROWS_GROWTH; fall: typeof LEADER_ROWS_FALL }
> = {
  аренда: {
    growth: LEADER_ROWS_GROWTH,
    fall: LEADER_ROWS_FALL,
  },
  цена: {
    growth: [
      { country: "Польша", pct: 2.0, value: "€1 920/м²" },
      { country: "Португалия", pct: 1.5, value: "€2 200/м²" },
      { country: "Испания", pct: 1.2, value: "€2 840/м²" },
      { country: "Франция", pct: 0.9, value: "€3 100/м²" },
      { country: "Германия", pct: 0.4, value: "€3 400/м²" },
    ],
    fall: [
      { country: "Нидерланды", pct: -1.2, value: "€4 100/м²" },
      { country: "Испания", pct: -0.8, value: "€2 840/м²" },
      { country: "Германия", pct: -0.4, value: "€3 400/м²" },
      { country: "Франция", pct: -0.3, value: "€3 100/м²" },
      { country: "Польша", pct: -0.2, value: "€1 920/м²" },
    ],
  },
  yield: {
    growth: [
      { country: "Португалия", pct: 0.5, value: "5.1%" },
      { country: "Франция", pct: 0.4, value: "3.8%" },
      { country: "Германия", pct: 0.2, value: "4.2%" },
      { country: "Польша", pct: 0.2, value: "4.8%" },
      { country: "Испания", pct: 0.1, value: "4.0%" },
    ],
    fall: [
      { country: "Нидерланды", pct: -0.4, value: "3.2%" },
      { country: "Германия", pct: -0.3, value: "4.2%" },
      { country: "Испания", pct: -0.2, value: "4.0%" },
      { country: "Франция", pct: -0.2, value: "3.8%" },
      { country: "Португалия", pct: -0.1, value: "5.1%" },
    ],
  },
};

export function getDemoLeaders(
  metric: LeaderMetric,
  direction: LeaderDirection
): { country: string; pct: number; value: string }[] {
  return LEADER_BY_METRIC[metric][direction];
}

export const SEGMENT_TABS: { value: NewsSegment; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "жилая", label: "Жилая" },
  { value: "коммерческая", label: "Коммерческая" },
  { value: "земля", label: "Земля" },
  { value: "ритейл", label: "Ритейл" },
  { value: "складская", label: "Складская" },
];

export const COUNTRIES_LIST = [...new Set(COUNTRIES)].sort();
