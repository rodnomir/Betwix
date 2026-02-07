import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import BetwixPlatformProcess from "@/components/platform/BetwixPlatformProcess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SECTION_IDS = ["about", "model", "trust", "liquidity", "disclaimer"] as const;
const NAV_ITEMS: { id: (typeof SECTION_IDS)[number]; label: string }[] = [
  { id: "about", label: "О платформе" },
  { id: "model", label: "Как работает модель" },
  { id: "trust", label: "Прозрачность и защита" },
  { id: "liquidity", label: "Ликвидность и P2P" },
  { id: "disclaimer", label: "Важно понимать" },
];

function SectionNav({
  activeId,
  onNavigate,
}: {
  activeId: string | null;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav
      className="sticky top-0 z-10 -mx-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-200 bg-[#FEFEFF]/95 py-3 backdrop-blur-sm"
      aria-label="Навигация по разделу"
    >
      {NAV_ITEMS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
          className={`text-sm transition-colors ${
            activeId === id
              ? "font-medium text-blue-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default function About() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>("about");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const opts: IntersectionObserverInit = {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };
    SECTION_IDS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveId(id);
      }, opts);
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageContainer>
      <div className="max-w-3xl space-y-12 pb-16">
        {/* HERO */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            О платформе
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Betwix — платформа, которая соединяет инвесторов, владельцев доходной недвижимости и управляющие компании. Мы создаём инфраструктуру для торговли долями и правами на доход от аренды без необходимости продавать объект целиком или привлекать классический банковский кредит.
          </p>
          <Badge variant="secondary" className="mt-4">
            Тестовый запуск (MVP): собираем интерес владельцев и инвесторов
          </Badge>
        </header>

        <SectionNav activeId={activeId} onNavigate={scrollToSection} />

        <Separator />

        {/* Что такое Betwix — #about */}
        <section
          id="about"
          ref={(el) => { sectionRefs.current.about = el; }}
          className="scroll-mt-24"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Что такое Betwix
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Betwix — технологическая платформа для размещения объектов доходной недвижимости, расчёта долей и организации сбора средств от инвесторов. Владельцы получают доступ к капиталу на расширение портфеля; инвесторы — к потоку доходов от аренды с прозрачной отчётностью. Betwix не является банком, брокером или управляющей компанией: мы обеспечиваем инфраструктуру, стандарты раскрытия информации и взаимодействие сторон.
          </p>
        </section>

        <Separator />

        {/* Анимированная схема */}
        <BetwixPlatformProcess />

        <Separator />

        {/* Что получает инвестор и владелец */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Что получает инвестор и что получает владелец
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Инвестор</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Доступ к арендному доходу от отобранных объектов</li>
                  <li>Прозрачность условий и раскрытие данных по объектам</li>
                  <li>Регулярная отчётность по доходам и расходам</li>
                  <li>Потенциальная ликвидность через P2P-рынок долей</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Владелец объекта</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Привлечение капитала без продажи объекта целиком</li>
                  <li>Модель без банковского кредита в классическом виде</li>
                  <li>Использование средств на расширение портфеля через управляющую компанию</li>
                  <li>Сохранение контроля над объектом при продаже части будущего дохода</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Как устроена модель — #model */}
        <section
          id="model"
          ref={(el) => { sectionRefs.current.model = el; }}
          className="scroll-mt-24"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Как устроена модель
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Взаимодействие строится между тремя сторонами; каждая несёт свою зону ответственности.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Владелец объекта</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Предоставляет данные по объекту, выбирает долю дохода для размещения и цель привлечения средств. Утверждает параметры покупки следующего объекта при участии управляющей компании.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Инвестор</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Изучает предложения на платформе, принимает решение о покупке долей самостоятельно. Получает выплаты пропорционально доле и может выйти через P2P-рынок в соответствии с правилами платформы.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Управляющая компания</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ведёт операционную работу по объекту: аренда, контроль поступлений, отчётность. Обеспечивает прозрачность для инвесторов и владельца. Может участвовать в подборе и покупке следующего объекта.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* Прозрачность — #trust */}
        <section
          id="trust"
          ref={(el) => { sectionRefs.current.trust = el; }}
          className="scroll-mt-24"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Прозрачность и защита интересов
          </h2>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Платформа ориентирована на прозрачные условия и понятные механизмы расчётов. Там, где применимо, используются платёжные партнёры, механизмы резервирования или раздельного учёта средств. Стандарты листинга и раскрытия информации по объектам задают единый уровень данных для принятия решений. Отчётность по доходам и расходам предоставляется в соответствии с правилами платформы и выбранной моделью сделки.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            Конкретные механизмы могут отличаться в зависимости от юрисдикции и типа сделки.
          </p>
        </section>

        <Separator />

        {/* Ликвидность — #liquidity */}
        <section
          id="liquidity"
          ref={(el) => { sectionRefs.current.liquidity = el; }}
          className="scroll-mt-24"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Ликвидность и P2P рынок
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            P2P-рынок долей даёт инвестору возможность выйти из позиции до окончания срока, продав долю другому участнику. Это направление развития платформы; в рамках тестового запуска (MVP) функциональность P2P может быть ограничена или вводиться поэтапно.
          </p>
        </section>

        <Separator />

        {/* Важно понимать — #disclaimer */}
        <section
          id="disclaimer"
          ref={(el) => { sectionRefs.current.disclaimer = el; }}
          className="scroll-mt-24"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Важно понимать
          </h2>
          <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
            <li>Информация на платформе не является инвестиционной рекомендацией.</li>
            <li>Доходность не гарантируется; фактические результаты могут отличаться.</li>
            <li>Решение о участии принимает пользователь самостоятельно, с учётом собственной ситуации и рисков.</li>
            <li>Инвестиции связаны с рисками; с основными из них можно ознакомиться на странице <Link to="/risks" className="text-blue-600 hover:underline">«Риски инвестирования»</Link>.</li>
          </ul>
        </section>

        <p className="text-sm text-slate-600">
          <Link to="/lots" className="text-blue-600 hover:underline">
            Смотреть лоты
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
