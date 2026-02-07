import { ChevronDown, TrendingDown, Wrench, Wallet, Scale, ShieldCheck } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RISK_CARDS = [
  {
    title: "Рыночные риски",
    Icon: TrendingDown,
    items: [
      "изменение арендных ставок",
      "падение спроса по локации/сегменту",
      "рост конкуренции объектов",
      "макрофакторы (ставки, инфляция)",
    ],
  },
  {
    title: "Операционные риски объекта",
    Icon: Wrench,
    items: [
      "ремонты и внеплановые расходы",
      "простои из-за технических причин",
      "износ, аварии, форс-мажоры",
      "качество обслуживания УК",
    ],
  },
  {
    title: "Риски арендатора и дохода",
    Icon: Wallet,
    items: [
      "задержки платежей",
      "досрочное расторжение договора",
      "снижение ставки при продлении",
      "непредсказуемая заполняемость",
    ],
  },
  {
    title: "Юридические и регуляторные риски",
    Icon: Scale,
    items: [
      "изменения требований/процедур",
      "риски документов и договоров",
      "споры/ограничения (если применимо)",
      "комплаенс и проверки",
    ],
  },
];

const MITIGATION_CARDS = [
  {
    title: "Прозрачность данных и событий",
    Icon: ShieldCheck,
  },
  {
    title: "Контроль процессов УК и отчётность",
    Icon: ShieldCheck,
  },
  {
    title: "Стандарты листинга и документации",
    Icon: ShieldCheck,
  },
];

const SCENARIOS_ACCORDION = [
  {
    title: "Простой (нет арендатора)",
    content: "Период без арендатора снижает доход по объекту. На платформе отображаются статус объекта и события; инвестор может оценить резервы и типичные сроки экспозиции по сегменту.",
  },
  {
    title: "Задержка выплат аренды",
    content: "Задержки со стороны арендатора влияют на сроки выплат по долям. В кабинете доступна история выплат; условия и дисциплина арендатора раскрываются в карточке объекта и отчётах УК.",
  },
  {
    title: "Рост расходов на обслуживание/ремонт",
    content: "Внеплановые расходы уменьшают чистый доход. События по объекту и отчётность УК показывают фактические расходы; при оценке стоит учитывать резервы на CAPEX и страхование.",
  },
  {
    title: "Смена арендатора",
    content: "Смена арендатора может сопровождаться простоем и изменением ставки. В карточке объекта и в событиях отображаются смены; рейтинг объекта может обновляться при таких событиях.",
  },
  {
    title: "Смена УК / качество управления",
    content: "Смена управляющей компании или низкое качество управления влияют на операционную стабильность. Платформа раскрывает данные об УК и истории отчётности; при смене УК рейтинг пересматривается.",
  },
  {
    title: "Падение арендных ставок на рынке",
    content: "Снижение рыночных ставок уменьшает потенциальный доход при перезаключении договоров. Рейтинг и раскрытие по объекту помогают оценить чувствительность; макроизменения не гарантированно предсказуемы.",
  },
  {
    title: "Юридические изменения/споры",
    content: "Изменения в регулировании или споры могут влиять на структуру прав и выплаты. В документах объекта и в событиях отображаются существенные юридические изменения; при рисках они раскрываются в карточке.",
  },
  {
    title: "Низкая ликвидность доли на P2P (временно сложно продать)",
    content: "На P2P-рынке может не быть достаточного спроса или предложения в нужный момент. Стакан, спред и объёмы отображаются на платформе; инвесторам рекомендуется планировать горизонт и не рассчитывать на срочную продажу.",
  },
];

const RISK_TABLE_ROWS = [
  {
    risk: "Простой",
    where: "Карточка объекта → статус/события",
    action: "Оценить резерв, срок экспозиции",
  },
  {
    risk: "Задержка аренды",
    where: "История выплат",
    action: "Проверить условия и дисциплину арендатора",
  },
  {
    risk: "Ремонт/инцидент",
    where: "События + отчёт УК",
    action: "Учесть CAPEX/страхование",
  },
  {
    risk: "Ликвидность",
    where: "P2P стакан/спред/объём",
    action: "Планировать горизонт, не продавать срочно",
  },
];

export default function Risks() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-8 pb-12">
        {/* Hero */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Риски инвестирования
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Инвестиции в доли арендного дохода несут риски. Мы показываем их заранее, чтобы вы принимали решения осознанно.
          </p>
        </header>

        <Separator />

        {/* 4 карточки рисков */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {RISK_CARDS.map((card, i) => (
            <Card
              key={i}
              className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <card.Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
                  {card.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Как Betwix снижает риски */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Как Betwix снижает риски
          </h2>
          <p className="text-xs text-slate-500 mb-3">Меры платформы, не гарантии.</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {MITIGATION_CARDS.map((item, i) => (
              <Card
                key={i}
                className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200"
              >
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <item.Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-snug">
                      {item.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        {/* Accordion: Частые сценарии */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Частые сценарии
          </h2>
          <div className="space-y-2">
            {SCENARIOS_ACCORDION.map((item, i) => (
              <details
                key={i}
                className="group rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-left font-medium text-slate-900 hover:bg-slate-50/80 transition-colors rounded-lg">
                  <span>{item.title}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Мини-таблица Риск → Где видно */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Риск → Где видно на платформе
          </h2>
          <Card className="border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-slate-700">Риск</TableHead>
                  <TableHead className="text-slate-700">Где видно</TableHead>
                  <TableHead className="text-slate-700">Что делать</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RISK_TABLE_ROWS.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm text-slate-700 font-medium">{row.risk}</TableCell>
                    <TableCell className="text-sm text-slate-600">{row.where}</TableCell>
                    <TableCell className="text-sm text-slate-600">{row.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-4 py-1">
          Информация носит справочный характер, не является инвестиционной рекомендацией. Прошлые показатели не гарантируют будущий результат. Перед инвестициями изучите документы объекта и правила платформы.
        </p>
      </div>
    </PageContainer>
  );
}
