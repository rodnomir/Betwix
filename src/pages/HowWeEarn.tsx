import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import RevenueModelSection from "@/components/RevenueModelSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Почему есть комиссия?",
    answer:
      "Платформа обеспечивает инфраструктуру: учёт прав, витрину объектов, безопасность сделок и прозрачную отчётность. Комиссии покрывают затраты на разработку, поддержку и сервис.",
  },
  {
    question: "Можно ли увидеть сумму заранее?",
    answer:
      "Да. Размер комиссии и условия списания отображаются до подтверждения операции. В кабинете доступна история операций и списанных комиссий.",
  },
  {
    question: "Что входит в сопровождение?",
    answer:
      "Сопровождение может включать ведение учёта по объекту, подготовку отчётности, документооборот и поддержку по вопросам платформы. Конкретный набор услуг определяется условиями и договором.",
  },
  {
    question: "Есть ли скрытые платежи?",
    answer:
      "Все комиссии и сборы описаны в правилах платформы и в условиях по конкретным продуктам. Перед операцией пользователь видит применимые комиссии. Рекомендуем ознакомиться с разделом «Документы и правила».",
  },
  {
    question: "Кто выбирает управляющую компанию?",
    answer:
      "Выбор УК зависит от модели сделки: в одних случаях платформа подключает партнёрскую УК по стандартным критериям, в других — владелец или участники выбирают из предложенных вариантов. Условия раскрываются до принятия решения.",
  },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <Card key={i}>
          <button
            type="button"
            className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors rounded-lg"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-medium text-slate-900">{item.question}</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <CardContent className="pt-0 px-6 pb-4">
              <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

export default function HowWeEarn() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-12 pb-16">
        {/* Hero */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Как мы зарабатываем
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Платформа Betwix получает доход за счёт комиссий за операции и сервисных сборов за инфраструктуру учёта и прозрачность. Модель монетизации прозрачна: пользователь видит, какие платежи идут платформе и при каких действиях.
          </p>
        </header>

        <Separator />

        <RevenueModelSection />

        <Separator />

        {/* Прозрачность */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Прозрачность
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
            <li>Комиссии отображаются до подтверждения операции.</li>
            <li>История операций и списанных комиссий доступна в личном кабинете.</li>
            <li>
              Подробные условия — в разделах{" "}
              <Link to="/documents" className="text-blue-600 hover:underline">
                «Документы и правила»
              </Link>
              ,{" "}
              <Link to="/risks" className="text-blue-600 hover:underline">
                «Риски инвестирования»
              </Link>
              {" "}и{" "}
              <Link to="/rating-methodology" className="text-blue-600 hover:underline">
                «Методика рейтингов»
              </Link>
              .
            </li>
          </ul>
        </section>

        <Separator />

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Частые вопросы
          </h2>
          <FaqAccordion />
        </section>
      </div>
    </PageContainer>
  );
}
