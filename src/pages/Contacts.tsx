import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Building2, Users, Briefcase } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPPORT_EMAIL = "support@betwix.io";
const PARTNERS_EMAIL = "partners@betwix.io";

const TOPIC_OPTIONS = [
  { value: "investor", label: "Инвестор" },
  { value: "owner", label: "Владелец" },
  { value: "uk", label: "УК" },
  { value: "partnership", label: "Партнёрство" },
  { value: "other", label: "Другое" },
];

export default function Contacts() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageContainer>
      <div className="max-w-3xl space-y-6 pb-10">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Контакты
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Мы отвечаем на вопросы инвесторов, владельцев и управляющих компаний. Betwix работает в режиме тестового запуска (MVP).
          </p>
        </header>

        <Separator />

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Связаться с нами</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">Email поддержки:</span>{" "}
              <a href={"mailto:" + SUPPORT_EMAIL} className="text-blue-600 hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="text-xs text-slate-500">
              Время ответа: обычно в течение 24–48 часов.
            </p>
            <p className="text-xs text-slate-500">
              Пн–Пт, 10:00–18:00 (CET)
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={"mailto:" + SUPPORT_EMAIL}
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
              >
                Написать в поддержку
              </a>
              <Link
                to="/support"
                className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Создать обращение
              </Link>
            </div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Для разных запросов
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900">Инвесторам</h3>
                    <p className="mt-0.5 text-sm text-slate-600">Вопросы по объектам, сделкам, кабинету</p>
                    <a
                      href={"mailto:" + SUPPORT_EMAIL + "?subject=Вопрос%20инвестора"}
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Написать
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900">Владельцам объектов</h3>
                    <p className="mt-0.5 text-sm text-slate-600">Листинг, документы, подготовка объекта</p>
                    <a
                      href={"mailto:" + SUPPORT_EMAIL + "?subject=Вопрос%20владельца"}
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Написать
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900">Управляющим компаниям</h3>
                    <p className="mt-0.5 text-sm text-slate-600">Подключение к пилоту, требования, SLA</p>
                    <Link
                      to="/for-management-companies"
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Перейти
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900">Партнёрства / медиа</h3>
                    <p className="mt-0.5 text-sm text-slate-600">Партнёрства, интеграции, PR</p>
                    <a
                      href={"mailto:" + PARTNERS_EMAIL + "?subject=Партнёрство"}
                      className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Написать
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            Форма обратной связи
          </h2>
          {submitted ? (
            <Card className="border border-emerald-200 bg-emerald-50/50">
              <CardContent className="py-5">
                <p className="text-sm font-medium text-emerald-800">
                  Спасибо! Мы получили сообщение и ответим на email.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-slate-200">
              <CardContent className="pt-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-slate-700">
                      Имя
                    </label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Ваше имя"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-topic" className="mb-1 block text-sm font-medium text-slate-700">
                      Тема
                    </label>
                    <Select value={form.topic} onValueChange={(v) => setForm((f) => ({ ...f, topic: v }))}>
                      <SelectTrigger id="contact-topic">
                        <SelectValue placeholder="Выберите тему" />
                      </SelectTrigger>
                      <SelectContent>
                        {TOPIC_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-slate-700">
                      Сообщение
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Ваше сообщение"
                      required
                      rows={4}
                      className="flex w-full rounded-md border border-[#DDE2E8] bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit">Отправить</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </section>

        <Separator />

        <p className="text-xs text-slate-500 leading-relaxed">
          Betwix — тестовый продукт (MVP). Информация на сайте носит справочный характер и не является инвестиционной рекомендацией.{" "}
          <Link to="/risks" className="text-slate-600 hover:underline">Риски инвестирования</Link>
          {", "}
          <Link to="/rating-methodology" className="text-slate-600 hover:underline">Методика рейтингов</Link>
          {", "}
          <Link to="/documents" className="text-slate-600 hover:underline">Правила и раскрытие</Link>
          .
        </p>
      </div>
    </PageContainer>
  );
}
