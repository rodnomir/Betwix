import { Link } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-6 pb-10">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Политика конфиденциальности
          </h1>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            Как Betwix собирает, использует и хранит персональные данные. Краткая версия (MVP).
          </p>
        </header>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Какие данные мы собираем</h2>
          <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
            <li><strong>Данные форм и аккаунта:</strong> email, имя, данные контакта при регистрации, обратной связи или заявках.</li>
            <li><strong>Технические данные:</strong> IP, тип браузера, данные о сессиях и действиях на сайте (логи), необходимые для работы и безопасности.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Цели обработки</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            Данные используются для: предоставления доступа к платформе и сервисам, обработки заявок и обратной связи, обеспечения безопасности и работы сайта, выполнения договорных и правовых обязательств.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Правовые основания</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            Обработка осуществляется на основании: вашего согласия (где запрашивается), исполнения договора с вами, законного интереса Betwix (безопасность, улучшение сервиса, аналитика в рамках необходимого), соблюдения законодательства.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Хранение</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Данные хранятся в течение срока, необходимого для указанных целей, и в соответствии с требованиями закона. По истечении срока данные удаляются или обезличиваются.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Передача третьим лицам</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            На текущем этапе (MVP) мы не передаём персональные данные третьим лицам для маркетинга или рекламы. Передача возможна только хостингу и техническим сервисам, необходимым для работы платформы, а также по требованию закона или для защиты прав.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Ваши права</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-2">
            Вы вправе запросить доступ к своим данным, исправление, удаление или ограничение обработки, а также возразить против обработки, где применимо. Для этого напишите нам через раздел контактов. Жалобы можно направлять в надзорный орган по защите персональных данных.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-2">Контакты</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            По вопросам персональных данных: через раздел <Link to="/contacts" className="text-blue-600 hover:underline">Контакты</Link> или email поддержки, указанный там.
          </p>
        </section>

        <Separator />

        <Card className="border border-slate-200 bg-slate-50/50">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">Вопросы по персональным данным?</p>
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
