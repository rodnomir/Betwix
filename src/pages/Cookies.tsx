import { Link } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Cookies() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-6 pb-10">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Политика cookies
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Какие cookies использует сайт Betwix и как ими управлять. Краткая версия (MVP).
          </p>
        </header>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Что такое cookies</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cookies — небольшие текстовые файлы, которые сайт сохраняет в вашем браузере. Они помогают запоминать настройки, сессии входа и обеспечивать работу сайта. Различают необходимые (обязательные для работы), функциональные и аналитические/рекламные.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Какие cookies мы используем</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            На текущем этапе (MVP) Betwix использует только необходимые для работы сайта cookies, например:
          </p>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
            <li>Сессия и аутентификация (вход в кабинет).</li>
            <li>Безопасность и защита от злоупотреблений.</li>
            <li>Базовые настройки отображения и работы интерфейса.</li>
          </ul>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            Аналитические или рекламные cookies сторонних сервисов на сайте не используются. При появлении таких cookies мы обновим эту страницу и при необходимости запросим согласие.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Как отключить или настроить cookies</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            Настройки cookies можно изменить в вашем браузере (раздел «Конфиденциальность», «Cookies» или «Сайты»). Отключение необходимых cookies может привести к ограничению работы сайта (например, невозможности войти в кабинет).
          </p>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
            <li>Chrome: Настройки → Конфиденциальность и безопасность → Файлы cookie.</li>
            <li>Firefox: Настройки → Конфиденциальность и защита → Куки.</li>
            <li>Safari: Настройки → Конфиденциальность → Управление данными сайтов.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Срок хранения</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Сессионные cookies удаляются при закрытии браузера. Постоянные (если используются) хранятся в течение срока, указанного в настройках файла, как правило не более срока, необходимого для работы функции.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Контакты</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            По вопросам cookies: через раздел <Link to="/contacts" className="text-blue-600 hover:underline">Контакты</Link> или email поддержки.
          </p>
        </section>

        <Separator />

        <Card className="border border-slate-200 bg-slate-50/50">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">Вопросы по cookies?</p>
            <Link to="/contacts">
              <Button variant="outline">Связаться с нами</Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-500 leading-relaxed">
          Betwix — тестовый продукт (MVP). Информация справочная, не является инвестиционной рекомендацией.
        </p>
      </div>
    </PageContainer>
  );
}
