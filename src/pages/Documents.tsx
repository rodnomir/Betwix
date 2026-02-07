import { Link } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CARDS = [
  {
    title: "Прозрачность условий",
    items: [
      "Комиссии и условия сделки показываются до подтверждения",
      "История операций и комиссий доступна в кабинете",
      "Условия фиксируются в момент операции",
    ],
  },
  {
    title: "Раскрытие рисков",
    items: [
      "Инвестиции несут риски (доход / ликвидность / объект / УК)",
      "Рейтинг — индикатор, не гарантия",
      "Рекомендуем диверсификацию",
    ],
  },
  {
    title: "Документы объекта",
    items: [
      "В карточке объекта: параметры, отчётность, события",
      "Доступ к ключевым материалам по объекту (если применимо)",
      "Прозрачные обновления данных",
    ],
  },
  {
    title: "Поддержка и вопросы",
    items: [
      "FAQ, контакты и центр поддержки",
      "Канал для обращений и обратной связи",
      "Важные обновления публикуем в «Новости рынка»",
    ],
  },
];

const QUICK_LINKS = [
  { to: "/risks", label: "Риски инвестирования" },
  { to: "/rating-methodology", label: "Методика рейтингов" },
  { to: "/faq", label: "FAQ" },
  { to: "/contacts", label: "Контакты" },
];

export default function Documents() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-6 pb-10">
        {/* Hero */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Правила и раскрытие (MVP)
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Мы показываем ключевые условия до совершения операций: комиссии, правила сделок и раскрытие рисков.
          </p>
        </header>

        <Separator />

        {/* 4 карточки */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {CARDS.map((card, i) => (
            <Card
              key={i}
              className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{card.title}</CardTitle>
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

        {/* Мини-блок ссылок */}
        <section>
          <p className="text-xs text-slate-500 mb-2">Полезные разделы</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-4 py-1">
          Информация носит справочный характер и не является инвестиционной рекомендацией. Прошлые показатели не гарантируют будущий результат.
        </p>
      </div>
    </PageContainer>
  );
}
