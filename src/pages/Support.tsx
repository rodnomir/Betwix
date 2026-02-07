import { Link } from "react-router-dom";
import { HelpCircle, Mail, BookOpen, Building2, ChevronRight } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HUB_CARDS = [
  {
    title: "FAQ",
    description: "Ответы на частые вопросы по платформе и операциям",
    href: "/faq",
    Icon: HelpCircle,
  },
  {
    title: "Контакты",
    description: "Способы связи с командой Betwix",
    href: "/contacts",
    Icon: Mail,
  },
  {
    title: "Центр поддержки",
    description: "Инструкции, статьи и обращения",
    href: "/support#contact",
    Icon: BookOpen,
  },
  {
    title: "Управляющим компаниям",
    description: "Условия для УК и партнёров",
    href: "/for-management-companies",
    Icon: Building2,
  },
];

const POPULAR_QUESTIONS = [
  "Как зарегистрироваться на платформе?",
  "Как купить долю в объекте?",
  "Когда приходят выплаты по долям?",
  "Как продать долю на P2P-рынке?",
  "Где посмотреть историю операций и комиссий?",
  "Как связаться с поддержкой?",
];

const SUPPORT_EMAIL = "support@betwix.com";

export default function Support() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-8 pb-12">
        {/* Hero */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Поддержка
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Ответы на вопросы, контакты и центр обращений. Выберите раздел ниже или свяжитесь с нами напрямую.
          </p>
        </header>

        <Separator />

        {/* Grid из 4 карточек-ссылок */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {HUB_CARDS.map((card) => (
            <Link
              key={card.href}
              to={card.href}
              className="group block"
            >
              <Card className="h-full border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-blue-200">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <card.Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {card.title}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        <Separator />

        {/* Популярные вопросы */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Популярные вопросы
          </h2>
          <ul className="space-y-2">
            {POPULAR_QUESTIONS.map((q, i) => (
              <li key={i}>
                <Link
                  to="/faq"
                  className="flex items-center justify-between gap-2 rounded-md py-2 pr-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <span>{q}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/faq"
            className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Смотреть все FAQ →
          </Link>
        </section>

        <Separator />

        {/* Связаться с нами */}
        <section id="contact">
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Связаться с нами
          </h2>
          <Card className="border border-slate-200">
            <CardContent className="p-5 space-y-3">
              <p className="text-sm text-slate-600">
                <span className="font-medium text-slate-800">Email поддержки:</span>{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-blue-600 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p className="text-xs text-slate-500">
                Среднее время ответа: 24–48 часов.
              </p>
              <Link
                to="/support#contact"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Создать обращение
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* MVP notice */}
        <p className="text-xs text-slate-500 leading-relaxed">
          Betwix работает в режиме тестового запуска (MVP). Мы собираем обратную связь и улучшаем продукт.
        </p>
      </div>
    </PageContainer>
  );
}
