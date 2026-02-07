import { useRef, useState } from "react";
import { ChevronDown, Building2, FileCheck, Shield, ListChecks, ClipboardList } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OBJECT_COUNT_OPTIONS = [
  { value: "1-10", label: "1–10" },
  { value: "11-50", label: "11–50" },
  { value: "51-200", label: "51–200" },
  { value: "200+", label: "200+" },
];

const REQUIREMENTS = [
  "Опыт управления недвижимостью (описать)",
  "География и типы объектов",
  "Готовность работать по стандарту отчётности Betwix",
  "Ответственное лицо (контакт)",
  "Готовность начать с пилота",
];

const UK_FAQ = [
  {
    question: "Сколько объектов нужно на старте?",
    answer: "Достаточно 1–3 объектов для пилота.",
  },
  {
    question: "Как вы оцениваете качество УК?",
    answer: "По SLA, дисциплине отчётности, скорости закрытия инцидентов и стабильности показателей по объектам.",
  },
  {
    question: "Как передаются данные?",
    answer: "На MVP — через стандартизированный отчёт (файл/форма) и события. Далее возможна интеграция.",
  },
  {
    question: "Есть ли эксклюзив?",
    answer: "На пилоте — по договорённости. Важно качество и прозрачность.",
  },
  {
    question: "Как мы получаем объекты?",
    answer: "Через поток владельцев и запросы на управление внутри экосистемы Betwix.",
  },
  {
    question: "Как связаться быстрее?",
    answer: "Через форму заявки или email партнёрств.",
  },
];

const textareaClass =
  "flex w-full min-h-[80px] rounded-md border border-[#DDE2E8] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2";

export default function ForManagementCompanies() {
  const formSectionRef = useRef<HTMLDivElement>(null);
  const processSectionRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    countryCity: "",
    website: "",
    contactName: "",
    email: "",
    phone: "",
    objectsCount: "",
    objectTypes: { residential: false, commercial: false, warehouse: false, other: false },
    geography: "",
    experience: "",
    pilotReady: false,
  });

  function scrollToForm() {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToProcess() {
    processSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageContainer>
      <div className="max-w-3xl space-y-10 pb-12">
        {/* 1) HERO */}
        <header className="pt-2">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Управляющим компаниям
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xl">
            Betwix соединяет владельцев объектов и инвесторов. Управляющая компания — ключевой партнёр: эксплуатация, аренда, отчётность. Мы даём поток объектов и стандартизируем процессы.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="primary" onClick={scrollToForm}>
              Подать заявку
            </Button>
            <Button variant="outline" onClick={scrollToProcess}>
              Как мы работаем
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Betwix работает в режиме тестового запуска (MVP). Подключаем партнёров на пилот.
          </p>
        </header>

        <Separator />

        {/* 2) Зачем УК Betwix */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Зачем УК Betwix
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-1">
                  <Building2 className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Новые объекты в управление</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Платформа даёт доступ к владельцам, которые ищут УК для пилота и дальнейшего масштабирования.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-1">
                  <FileCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Стандарты и прозрачность</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Единый формат отчётности, событий и статусов по объектам — меньше хаоса, выше доверие инвесторов.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-1">
                  <Shield className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">Инструменты контроля качества</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  SLA, аудит действий, история событий, единая витрина — проще доказывать качество управления.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 3) Как устроена модель работы (Timeline) */}
        <section ref={processSectionRef}>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Как устроена модель работы
          </h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Заявка и первичная проверка",
                text: "Вы оставляете заявку, мы уточняем опыт, географию, типы объектов, процессы.",
              },
              {
                step: 2,
                title: "Согласование стандартов",
                text: "Фиксируем формат отчётности, SLA по инцидентам, уровни доступа.",
              },
              {
                step: 3,
                title: "Пилотный объект",
                text: "Стартуем с 1–3 объектов: проверяем процессы, скорость реакции, качество отчётов.",
              },
              {
                step: 4,
                title: "Подключение витрины и регулярной отчётности",
                text: "УК ведёт объект, Betwix отражает статусы/события/отчёты в интерфейсе.",
              },
              {
                step: 5,
                title: "Масштабирование",
                text: "После успешного пилота расширяем пул объектов и повышаем рейтинг партнёра.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-medium text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* 4) Что ожидаем от УК — 2 колонки */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Что ожидаем от УК
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border border-slate-200">
              <CardHeader className="py-4">
                <CardTitle className="text-base">Вы делаете</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  <li>Эксплуатация и техническое обслуживание</li>
                  <li>Работа с арендаторами (заселение/выезд/договоры)</li>
                  <li>Сбор аренды и контроль просрочек</li>
                  <li>Оперативное реагирование на инциденты</li>
                  <li>Регулярная отчётность по доходам/расходам и статусам</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-slate-200">
              <CardHeader className="py-4">
                <CardTitle className="text-base">Мы делаем</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                  <li>Приводим владельцев и спрос на управление</li>
                  <li>Задаём единые стандарты данных и отчётов</li>
                  <li>Предоставляем кабинет/канал коммуникации по объекту</li>
                  <li>Обеспечиваем прозрачность для инвесторов</li>
                  <li>Фиксируем правила и SLA в понятном формате</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 5) Отчётность и SLA — 4 карточки */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Отчётность и SLA
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border border-slate-200">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-slate-500" />
                  Отчёт по объекту
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Периодичность: ежемесячно. Доходы/расходы/простой/ключевые события.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-slate-500" />
                  События и статусы
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Инциденты, ремонт, простой, смена арендатора, важные операции — фиксируются как события.
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">SLA реакции</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Время ответа на инциденты и сроки закрытия — по категориям (критично/важно/планово).
                </p>
              </CardContent>
            </Card>
            <Card className="border border-slate-200">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Прозрачность расходов</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Расходы подтверждаются и отражаются в отчётах (без лишней бюрократии, но с проверяемостью).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 6) Требования для подключения (MVP) */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
            Требования для подключения
            <Badge variant="secondary" className="text-xs">MVP</Badge>
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            {REQUIREMENTS.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5" aria-hidden>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Лицензии/разрешения зависят от юрисдикции и типа деятельности. Подробности уточняем на этапе пилота.
          </p>
        </section>

        <Separator />

        {/* 7) FAQ для УК */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            FAQ для УК
          </h2>
          <div className="space-y-2">
            {UK_FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-left font-medium text-slate-900 hover:bg-slate-50/80 transition-colors rounded-lg">
                  <span>{item.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed pt-3">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <Separator />

        {/* 8) CTA + Форма заявки */}
        <section ref={formSectionRef}>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Подать заявку
          </h2>
          {submitted ? (
            <Card className="border border-emerald-200 bg-emerald-50/50">
              <CardContent className="py-8">
                <p className="text-sm font-medium text-emerald-800">
                  Спасибо! Мы свяжемся с вами по email.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-slate-200">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="mc-company" className="mb-1 block text-sm font-medium text-slate-700">
                        Название компании <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="mc-company"
                        value={form.companyName}
                        onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                        placeholder="ООО «УК»"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="mc-country" className="mb-1 block text-sm font-medium text-slate-700">
                        Страна / город <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="mc-country"
                        value={form.countryCity}
                        onChange={(e) => setForm((f) => ({ ...f, countryCity: e.target.value }))}
                        placeholder="Россия, Москва"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mc-website" className="mb-1 block text-sm font-medium text-slate-700">
                      Сайт
                    </label>
                    <Input
                      id="mc-website"
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="mc-contact" className="mb-1 block text-sm font-medium text-slate-700">
                        Контактное лицо <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="mc-contact"
                        value={form.contactName}
                        onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                        placeholder="Имя Фамилия"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="mc-email" className="mb-1 block text-sm font-medium text-slate-700">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="mc-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="email@company.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mc-phone" className="mb-1 block text-sm font-medium text-slate-700">
                      Телефон / мессенджер
                    </label>
                    <Input
                      id="mc-phone"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="+7 ... или Telegram"
                    />
                  </div>
                  <div>
                    <label htmlFor="mc-objects" className="mb-1 block text-sm font-medium text-slate-700">
                      Сколько объектов в управлении
                    </label>
                    <Select
                      value={form.objectsCount}
                      onValueChange={(v) => setForm((f) => ({ ...f, objectsCount: v }))}
                    >
                      <SelectTrigger id="mc-objects">
                        <SelectValue placeholder="Выберите" />
                      </SelectTrigger>
                      <SelectContent>
                        {OBJECT_COUNT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Типы объектов
                    </span>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.objectTypes.residential}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              objectTypes: { ...f.objectTypes, residential: e.target.checked },
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        Жилые
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.objectTypes.commercial}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              objectTypes: { ...f.objectTypes, commercial: e.target.checked },
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        Коммерческие
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.objectTypes.warehouse}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              objectTypes: { ...f.objectTypes, warehouse: e.target.checked },
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        Складские
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.objectTypes.other}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              objectTypes: { ...f.objectTypes, other: e.target.checked },
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        Другое
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="mc-geography" className="mb-1 block text-sm font-medium text-slate-700">
                      География
                    </label>
                    <textarea
                      id="mc-geography"
                      value={form.geography}
                      onChange={(e) => setForm((f) => ({ ...f, geography: e.target.value }))}
                      placeholder="Кратко: города, регионы"
                      rows={2}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="mc-experience" className="mb-1 block text-sm font-medium text-slate-700">
                      Опыт и процессы
                    </label>
                    <textarea
                      id="mc-experience"
                      value={form.experience}
                      onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                      placeholder="Кратко опишите опыт и как строится работа"
                      rows={3}
                      className={textareaClass}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.pilotReady}
                        onChange={(e) => setForm((f) => ({ ...f, pilotReady: e.target.checked }))}
                        required
                        className="rounded border-slate-300"
                      />
                      Готовность начать с пилота <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <Button type="submit" variant="primary">
                    Отправить заявку
                  </Button>
                  <p className="text-xs text-slate-500">
                    Нажимая отправить, вы подтверждаете согласие на обработку данных для связи.
                  </p>
                </form>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Нижний CTA */}
        <Card className="border border-slate-200 bg-slate-50/50">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">
              Готовы стать партнёром?
            </p>
            <Button variant="primary" onClick={scrollToForm}>
              Подать заявку
            </Button>
          </CardContent>
        </Card>

        {/* 9) Нижний дисклеймер */}
        <p className="text-xs text-slate-500 leading-relaxed">
          Betwix — тестовый продукт (MVP). Информация носит справочный характер и не является публичной офертой.
        </p>
      </div>
    </PageContainer>
  );
}
