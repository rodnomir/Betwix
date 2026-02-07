// Betwix — How it works (общая публичная страница + из ЛК владельца)

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SECTIONS = [
  { id: "short", title: "Коротко за 20 секунд" },
  { id: "essence", title: "Суть модели простыми словами" },
  { id: "steps", title: "Как это происходит по шагам" },
  { id: "calculations", title: "Что именно считает платформа" },
  { id: "uk-role", title: "Роль управляющей компании" },
  { id: "money-rules", title: "Деньги и правила" },
  { id: "payouts", title: "Выплаты владельцу и лицевой счёт" },
  { id: "p2p", title: "P2P рынок и выкуп долей" },
  { id: "next-object", title: "Покупка следующего объекта" },
  { id: "fees", title: "Комиссии и монетизация" },
  { id: "responsibilities", title: "Кто за что отвечает" },
  { id: "faq", title: "FAQ" },
] as const;

export default function HowItWorks() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromOwner = location.pathname.startsWith("/owner");
  const backTo = isFromOwner ? "/owner" : "/";

  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    const refs = sectionRefs.current;
    SECTIONS.forEach((s) => {
      const el = refs[s.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FEFEFF]">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Back + Header / Hero */}
        <div className="mb-10">
          <Button
            variant="ghost"
            className="mb-6 -ml-2 text-slate-600 hover:text-slate-900"
            onClick={() => navigate(backTo)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад
          </Button>
          <p className="text-sm text-slate-500 mb-2">Для владельцев арендного бизнеса</p>
          <h1 className="text-2xl font-semibold text-slate-900 leading-tight">
            Масштабируйте арендный бизнес, продавая долю — а не беря кредит
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-600">
            Вы продаёте часть будущего дохода текущего объекта, не теряя и не продавая собственность, привлекаете капитал и покупаете следующий объект через управляющую компанию.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate(backTo)}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Добавить объект
            </Button>
          </div>

          {/* Important notice — без иконки */}
          <Card className="mt-8 border-slate-200 bg-slate-50/80">
            <CardContent className="p-4">
              <p className="text-sm text-slate-700">
                <strong className="text-slate-900">Важно:</strong> собранные средства резервируются под покупку нового объекта. Вывод как кэш недоступен.
              </p>
            </CardContent>
          </Card>

          {/* Старый путь vs Новый путь */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="border-slate-200 bg-slate-50/50">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Кредит на покупку объекта</h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  <li>Долг и проценты</li>
                  <li>Много документов и проверок</li>
                  <li>Высокий процент отказов</li>
                  <li>Долгие сроки одобрения</li>
                  <li>Вся аренда уходит на погашение кредита</li>
                  <li>Высокая нагрузка и риски</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Модель Betwix</h3>
                <ul className="space-y-1.5 text-sm text-slate-700">
                  <li>Без кредита и долгов</li>
                  <li>Без продажи собственности</li>
                  <li>Продаётся только часть будущего дохода</li>
                  <li>Быстрый доступ к капиталу</li>
                  <li>Покупка нового объекта через УК</li>
                  <li>У вас уже 2 объекта вместо 1</li>
                  <li>Возможность масштабироваться дальше</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Ключевая мысль */}
          <p className="mt-6 text-sm font-medium text-slate-800 max-w-2xl">
            Старая модель тормозит рост. Новая модель позволяет масштабироваться, сохраняя собственность и увеличивая капитализацию.
          </p>

          {/* Вторая CTA внизу шапки */}
          <div className="mt-8">
            <Button
              onClick={() => navigate(backTo)}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" /> Добавить объект
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Sticky nav */}
          <nav className="shrink-0 lg:sticky lg:top-24 lg:self-start lg:w-56">
            <ul className="space-y-1 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(s.id)}
                    className={`w-full rounded-md px-3 py-2 text-left transition-colors ${
                      activeId === s.id
                        ? "bg-blue-50 font-medium text-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-12 pb-16">
            <section
              id="short"
              ref={(el) => { sectionRefs.current.short = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Коротко за 20 секунд</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Вы добавляете объект и выбираете долю, которую готовы продать. Платформа помогает: сделать расчёты по объекту, собрать капитал через инвесторов и купить следующий объект через управляющую компанию.
              </p>
            </section>

            <section
              id="essence"
              ref={(el) => { sectionRefs.current.essence = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Суть модели простыми словами</h2>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li><strong className="text-slate-900">Что вы делаете:</strong> Вы продаёте часть дохода от своего арендного бизнеса (долю), чтобы получить капитал на расширение.</li>
                <li><strong className="text-slate-900">Зачем:</strong> Чтобы купить новый объект и увеличить портфель, не «копя годами».</li>
                <li><strong className="text-slate-900">Важно:</strong> Это не кредит… Вы обмениваете часть будущего дохода на капитал сегодня.</li>
              </ul>
            </section>

            <section
              id="steps"
              ref={(el) => { sectionRefs.current.steps = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Как это происходит по шагам</h2>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li><strong>Шаг 1 — Добавляете объект (3–5 минут):</strong> базовые данные + минимальные документы.</li>
                <li><strong>Шаг 2 — Платформа делает расчёты:</strong> доходность / риски / окупаемость / расходы / простои / денежный поток.</li>
                <li><strong>Шаг 3 — Вы выбираете долю для продажи:</strong> 10–30% + цель.</li>
                <li><strong>Шаг 4 — Запускается сбор на платформе:</strong> инвесторы выкупают доли, при достижении целевого порога (например 85%) — переход к покупке.</li>
                <li><strong>Шаг 5 — Деньги резервируются под покупку нового объекта:</strong> не выводятся как кэш, идут на покупку через УК.</li>
                <li><strong>Шаг 6 — УК подбирает новый объект:</strong> по запросу владельца + расчёты.</li>
              </ul>
            </section>

            <section
              id="calculations"
              ref={(el) => { sectionRefs.current.calculations = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Что именно считает платформа (без сложных терминов)</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>Доход</li>
                <li>Расходы и простои</li>
                <li>Риски</li>
                <li>Окупаемость</li>
                <li>Итог расчётов (стоимость доли + прогноз + готовность к запуску)</li>
              </ul>
            </section>

            <section
              id="uk-role"
              ref={(el) => { sectionRefs.current["uk-role"] = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Роль управляющей компании (почему это обязательно)</h2>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li><strong className="text-slate-900">Что делает УК:</strong> управление арендой, контроль поступлений, отчётность, прозрачность.</li>
                <li><strong className="text-slate-900">Зачем владельцу:</strong> масштабирование без операционки.</li>
                <li><strong className="text-slate-900">Зачем инвесторам:</strong> честные выплаты, нельзя скрыть простой / расходы / доход.</li>
              </ul>
            </section>

            <section
              id="money-rules"
              ref={(el) => { sectionRefs.current["money-rules"] = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Деньги и правила: что важно знать заранее</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>Собранные средства не выводятся владельцу как свободные деньги — резервируются под покупку нового объекта.</li>
                <li>Объект работает по правилам УК (аренда, контроль простоя, отчётность).</li>
                <li>Детальные комиссии / обязанности / документы фиксируются после первичной заявки.</li>
              </ul>
            </section>

            <section
              id="payouts"
              ref={(el) => { sectionRefs.current.payouts = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Выплаты владельцу, лицевой счёт и «ваша доля»</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>Вы продаёте только часть (например 20%), остальная доля остаётся вашей (80%).</li>
                <li>Доход делится пропорционально долям: инвесторам и владельцу.</li>
                <li>Ваша часть зачисляется на лицевой счёт Betwix: можно выводить или использовать внутри (покупать доли других объектов / выкупать доли своего объекта).</li>
              </ul>
            </section>

            <section
              id="p2p"
              ref={(el) => { sectionRefs.current.p2p = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">P2P рынок и выкуп долей</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>Инвестор может выйти, продав долю на P2P рынке: доля переходит новому инвестору, выплаты получает новый держатель.</li>
                <li>Владелец может выкупать доли обратно частями / полностью, в том числе деньгами с лицевого счёта.</li>
              </ul>
            </section>

            <section
              id="next-object"
              ref={(el) => { sectionRefs.current["next-object"] = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Покупка следующего объекта</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>После успешного сбора средства резервируются, УК предлагает варианты, владелец утверждает, запускается покупка.</li>
                <li>Принцип: это капитал на расширение, а не деньги «на руки».</li>
              </ul>
            </section>

            <section
              id="fees"
              ref={(el) => { sectionRefs.current.fees = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Комиссии и монетизация (коротко, без цифр)</h2>
              <p className="mt-4 text-slate-700">
                Возможные комиссии: УК за управление, платформа за инфраструктуру / сбор / сделки, возможные комиссии P2P / сопровождения (фиксируются на детальном этапе).
              </p>
            </section>

            <section
              id="responsibilities"
              ref={(el) => { sectionRefs.current.responsibilities = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">Кто за что отвечает</h2>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li><strong className="text-slate-900">Владелец:</strong> данные, доля, цель, подтверждение покупки.</li>
                <li><strong className="text-slate-900">Betwix:</strong> расчёты, инфраструктура долей / выплат, организация сбора.</li>
                <li><strong className="text-slate-900">УК:</strong> аренда / операционка / прозрачность / подбор объекта.</li>
                <li><strong className="text-slate-900">Инвесторы:</strong> покупают доли, получают выплаты, выходят через P2P.</li>
              </ul>
            </section>

            <section
              id="faq"
              ref={(el) => { sectionRefs.current.faq = el; }}
              className="scroll-mt-24"
            >
              <h2 className="text-lg font-semibold text-slate-900">FAQ</h2>
              <ul className="mt-4 space-y-3 text-slate-700">
                <li><strong className="text-slate-900">Это кредит?</strong> — Нет.</li>
                <li><strong className="text-slate-900">Я выбираю долю сам?</strong> — Да.</li>
                <li><strong className="text-slate-900">Когда покупается новый объект?</strong> — После сбора и подтверждения параметров.</li>
                <li><strong className="text-slate-900">Кто управляет объектом?</strong> — УК.</li>
                <li><strong className="text-slate-900">Где детали?</strong> — на этой странице / в условиях на следующем шаге.</li>
              </ul>
            </section>

            {/* Bottom CTA */}
            <div className="border-t border-slate-200 pt-10">
              <p className="text-sm text-slate-600 mb-4">Готовы добавить объект?</p>
              <Button
                onClick={() => navigate(backTo)}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="mr-2 h-4 w-4" /> Добавить объект
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
