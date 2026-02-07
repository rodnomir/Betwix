import { Link } from "react-router-dom";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "sec-1", label: "1) Термины и определения" },
  { id: "sec-2", label: "2) Принятие условий" },
  { id: "sec-3", label: "3) Изменение условий" },
  { id: "sec-4", label: "4) Описание Платформы и роль Betwix" },
  { id: "sec-5", label: "5) Требования к пользователю и ответственность за данные" },
  { id: "sec-6", label: "6) Регистрация, аккаунт и безопасность" },
  { id: "sec-7", label: "7) Лоты, информация об объектах и раскрытие" },
  { id: "sec-8", label: "8) Сделки и взаимодействие пользователей" },
  { id: "sec-9", label: "9) Комиссии и платежи" },
  { id: "sec-10", label: "10) Управляющие компании и сторонние услуги" },
  { id: "sec-11", label: "11) Риски и отказ от гарантий" },
  { id: "sec-12", label: "12) Запрещенные действия" },
  { id: "sec-13", label: "13) Интеллектуальная собственность" },
  { id: "sec-14", label: "14) Конфиденциальность и cookies" },
  { id: "sec-15", label: "15) Ограничение ответственности" },
  { id: "sec-16", label: "16) Блокировка и прекращение доступа" },
  { id: "sec-17", label: "17) Возмещение убытков (Indemnity)" },
  { id: "sec-18", label: "18) Применимое право и разрешение споров" },
  { id: "sec-19", label: "19) Контакты" },
  { id: "sec-20", label: "20) Заключительные положения" },
];

export default function Terms() {
  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto px-6 py-10 sm:py-12 space-y-8 pb-12">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Условия обслуживания
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Дата вступления в силу: [дд.мм.гггг] · Версия: MVP v0.1
          </p>
        </header>

        <p className="text-sm text-slate-600 leading-relaxed">
          Betwix — тестовый продукт (MVP). Информация на сайте носит справочный характер и{" "}
          <strong>не является инвестиционной рекомендацией</strong>, индивидуальной консультацией, офертой или гарантией доходности.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Используя сайт/платформу Betwix (далее — «Платформа»), вы подтверждаете, что прочитали и приняли настоящие Условия.
        </p>

        <Separator />

        {/* Содержание */}
        <Card className="border border-slate-200">
          <CardContent className="py-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Содержание</h2>
            <ul className="text-sm text-slate-600 space-y-1.5 columns-1 sm:columns-2 gap-x-6">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-slate-900 hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-8">
          <section id="sec-1">
            <h2 className="text-base font-semibold text-slate-900 mb-3">1) Термины и определения</h2>
            <ul className="text-sm text-slate-600 leading-relaxed space-y-1.5 list-none">
              <li><strong>«Betwix», «мы», «нас», «наш»</strong> — [Юрлицо/команда], управляющая Платформой.</li>
              <li><strong>«Пользователь», «вы»</strong> — лицо, использующее Платформу.</li>
              <li><strong>«Инвестор»</strong> — пользователь, приобретающий/отчуждающий права на долю дохода (или иные права), представленные на Платформе.</li>
              <li><strong>«Владелец объекта»</strong> — пользователь/сторона, предоставляющая информацию об объекте и инициирующая размещение.</li>
              <li><strong>«Управляющая компания (УК)»</strong> — независимая организация, осуществляющая эксплуатацию/аренду/отчетность по объекту.</li>
              <li><strong>«Объект»</strong> — объект недвижимости или иной актив, информация о котором размещена на Платформе.</li>
              <li><strong>«Лот»</strong> — предложение, связанное с объектом и/или правами на долю дохода/иными правами.</li>
              <li><strong>«P2P-сделка»</strong> — сделка между пользователями (покупка/продажа прав), заключаемая с использованием Платформы.</li>
              <li><strong>«Комиссия»</strong> — плата за использование функционала Платформы (в т.ч. за сделки/листинг/сервисные услуги), если применимо.</li>
            </ul>
          </section>

          <section id="sec-2">
            <h2 className="text-base font-semibold text-slate-900 mb-3">2) Принятие условий</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              2.1. Использование Платформы означает согласие с настоящими Условиями, Политикой конфиденциальности и Политикой cookies (ссылки размещаются на Платформе).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              2.2. Если вы не согласны с Условиями — не используйте Платформу.
            </p>
          </section>

          <section id="sec-3">
            <h2 className="text-base font-semibold text-slate-900 mb-3">3) Изменение условий</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              3.1. Мы можем обновлять Условия. Новая версия вступает в силу с момента публикации на Платформе, если не указано иное.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              3.2. Продолжая пользоваться Платформой после обновлений, вы принимаете изменения.
            </p>
          </section>

          <section id="sec-4">
            <h2 className="text-base font-semibold text-slate-900 mb-3">4) Описание Платформы и роль Betwix</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              4.1. Платформа предоставляет информационные материалы, витрину лотов, базовый учет и инструменты взаимодействия участников (владельцев, инвесторов, УК).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              4.2. Betwix <strong>не является</strong> банком, брокером, инвестиционным консультантом или гарантией исполнения обязательств третьих лиц, если прямо не указано иное в отдельном договоре.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              4.3. Платформа может содержать аналитические показатели/рейтинги/оценки. Они носят справочный характер и могут быть ошибочными или неполными.
            </p>
          </section>

          <section id="sec-5">
            <h2 className="text-base font-semibold text-slate-900 mb-3">5) Требования к пользователю и ответственность за данные</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              5.1. Вы подтверждаете, что обладаете правоспособностью и правом заключать сделки в своей юрисдикции.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              5.2. Вы несете ответственность за корректность данных, которые предоставляете, и за последствия решений, принятых на их основе.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              5.3. Вы обязуетесь использовать Платформу законно и добросовестно.
            </p>
          </section>

          <section id="sec-6">
            <h2 className="text-base font-semibold text-slate-900 mb-3">6) Регистрация, аккаунт и безопасность</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              6.1. Для доступа к части функций может потребоваться регистрация.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              6.2. Вы обязаны поддерживать актуальность контактных данных и обеспечивать конфиденциальность доступа к аккаунту.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              6.3. Вы несете ответственность за действия, совершенные через ваш аккаунт.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              6.4. Мы можем вводить базовую верификацию личности/контактов, а также ограничения по доступу к функциям (в т.ч. по рискам злоупотреблений и требованиям комплаенса).
            </p>
          </section>

          <section id="sec-7">
            <h2 className="text-base font-semibold text-slate-900 mb-3">7) Лоты, информация об объектах и раскрытие</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              7.1. Информация об объектах (описания, доходность, расходы, прогнозы) предоставляется владельцами объектов и/или третьими лицами.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              7.2. Мы стремимся к стандартизации данных, но <strong>не гарантируем</strong> их полноту, точность и актуальность.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              7.3. Прогнозы доходности являются предположениями и могут не реализоваться.
            </p>
          </section>

          <section id="sec-8">
            <h2 className="text-base font-semibold text-slate-900 mb-3">8) Сделки и взаимодействие пользователей</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              8.1. P2P-сделки заключаются между пользователями. Платформа может предоставлять инструменты оформления/учета и статусы, но не является стороной сделки, если прямо не указано иное.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              8.2. Исполнение обязательств по сделке, а также налоговые последствия определяются сторонами сделки и применимым правом.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              8.3. В рамках MVP некоторые операции могут иметь ограниченный функционал или симуляционный характер.
            </p>
          </section>

          <section id="sec-9">
            <h2 className="text-base font-semibold text-slate-900 mb-3">9) Комиссии и платежи</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              9.1. На Платформе могут применяться комиссии:
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-3">
              <li>за сделку (P2P/первичная покупка доли/прав),</li>
              <li>за листинг/размещение объекта,</li>
              <li>сервисные сборы за сопровождение,</li>
              <li>партнерские услуги (оценка, юрсопровождение и т.п.).</li>
            </ul>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              9.2. Размер комиссий, плательщик и момент списания отображаются до подтверждения операции и/или фиксируются правилами соответствующего процесса на Платформе.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              9.3. Комиссии и платежи могут зависеть от типа операции, юрисдикции и выбранного сценария.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              9.4. Если платежи обрабатываются через сторонних провайдеров, их условия применяются дополнительно.
            </p>
          </section>

          <section id="sec-10">
            <h2 className="text-base font-semibold text-slate-900 mb-3">10) Управляющие компании и сторонние услуги</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              10.1. УК и партнеры действуют независимо. Условия их услуг определяются договором между пользователем и соответствующим партнером, если не указано иное.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              10.2. Betwix не несет ответственности за качество, сроки и результат услуг УК/партнеров, кроме случаев, когда иное прямо закреплено в отдельном письменном договоре.
            </p>
          </section>

          <section id="sec-11">
            <h2 className="text-base font-semibold text-slate-900 mb-3">11) Риски и отказ от гарантий</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              11.1. Инвестиции и операции с долями/правами могут приводить к частичной или полной потере вложенных средств.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              11.2. Мы не гарантируем:
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-2">
              <li>доходность, ликвидность или рост стоимости,</li>
              <li>отсутствие задержек/паузы аренды,</li>
              <li>отсутствие ошибок в данных,</li>
              <li>бесперебойную работу Платформы.</li>
            </ul>
            <p className="text-sm text-slate-600 leading-relaxed">
              11.3. Платформа предоставляется «как есть» (as is) в рамках MVP.
            </p>
          </section>

          <section id="sec-12">
            <h2 className="text-base font-semibold text-slate-900 mb-3">12) Запрещенные действия</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              Пользователю запрещено:
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>предоставлять заведомо ложные сведения, подделывать документы, вводить в заблуждение,</li>
              <li>пытаться получить доступ к чужим аккаунтам/данным,</li>
              <li>нарушать работу Платформы (DDoS, сканирование уязвимостей без разрешения, вредоносный код),</li>
              <li>использовать Платформу для отмывания средств, мошенничества и иных незаконных целей,</li>
              <li>нарушать права третьих лиц (в т.ч. интеллектуальные).</li>
            </ul>
          </section>

          <section id="sec-13">
            <h2 className="text-base font-semibold text-slate-900 mb-3">13) Интеллектуальная собственность</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              13.1. Права на дизайн, код, тексты, интерфейсы и бренд Betwix принадлежат Betwix и/или правообладателям.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              13.2. Пользователь получает ограниченную, неисключительную, отзывную лицензию на использование Платформы исключительно по назначению.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              13.3. Любое копирование/распространение материалов без разрешения запрещено, кроме случаев, прямо допускаемых законом.
            </p>
          </section>

          <section id="sec-14">
            <h2 className="text-base font-semibold text-slate-900 mb-3">14) Конфиденциальность и cookies</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              14.1. Обработка персональных данных регулируется <strong>Политикой конфиденциальности</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              14.2. Использование cookies регулируется <strong>Политикой cookies</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-2">
              <Link to="/privacy" className="text-blue-600 hover:underline">Политика конфиденциальности</Link>
              {" · "}
              <Link to="/cookies" className="text-blue-600 hover:underline">Политика cookies</Link>
            </p>
          </section>

          <section id="sec-15">
            <h2 className="text-base font-semibold text-slate-900 mb-3">15) Ограничение ответственности</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              15.1. В пределах, допускаемых законом, Betwix не несет ответственности за:
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-2">
              <li>косвенные убытки, упущенную выгоду,</li>
              <li>действия/бездействие третьих лиц (УК, партнеров, иных пользователей),</li>
              <li>решения, принятые пользователем на основе информации Платформы.</li>
            </ul>
            <p className="text-sm text-slate-600 leading-relaxed">
              15.2. Если ответственность Betwix не может быть исключена законом, она ограничивается суммой, фактически уплаченной пользователем Betwix за последние [3] месяца по соответствующей услуге (если применимо), либо минимальной суммой, предусмотренной законом.
            </p>
          </section>

          <section id="sec-16">
            <h2 className="text-base font-semibold text-slate-900 mb-3">16) Блокировка и прекращение доступа</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              16.1. Мы можем приостановить/ограничить доступ к Платформе, если:
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-2">
              <li>есть признаки нарушения Условий,</li>
              <li>требуется проверка безопасности/комплаенса,</li>
              <li>есть технические/юридические причины.</li>
            </ul>
            <p className="text-sm text-slate-600 leading-relaxed">
              16.2. Пользователь может прекратить использование Платформы в любой момент.
            </p>
          </section>

          <section id="sec-17">
            <h2 className="text-base font-semibold text-slate-900 mb-3">17) Возмещение убытков (Indemnity)</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Вы обязуетесь возместить убытки Betwix, если они возникли из-за ваших нарушений Условий, незаконных действий или претензий третьих лиц, связанных с вашим использованием Платформы.
            </p>
          </section>

          <section id="sec-18">
            <h2 className="text-base font-semibold text-slate-900 mb-3">18) Применимое право и разрешение споров</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              18.1. Применимое право: право юрисдикции регистрации Betwix — <strong>[указать страну/регион]</strong>.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              18.2. Споры решаются путем переговоров, а при недостижении согласия — в суде по месту регистрации Betwix, если иное не предусмотрено императивными нормами вашей юрисдикции.
            </p>
          </section>

          <section id="sec-19">
            <h2 className="text-base font-semibold text-slate-900 mb-3">19) Контакты</h2>
            <ul className="text-sm text-slate-600 leading-relaxed space-y-1 list-none">
              <li><strong>Betwix:</strong> [название юрлица/проекта]</li>
              <li><strong>Email:</strong> [support@betwix…]</li>
              <li><strong>Страница контактов:</strong> <Link to="/contacts" className="text-blue-600 hover:underline">/contacts</Link></li>
              <li><strong>Адрес:</strong> [юридический адрес, если есть]</li>
            </ul>
          </section>

          <section id="sec-20">
            <h2 className="text-base font-semibold text-slate-900 mb-3">20) Заключительные положения</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              20.1. Если какое-либо положение Условий признается недействительным, остальные положения остаются в силе.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              20.2. Заголовки разделов используются для удобства и не влияют на толкование.
            </p>
          </section>
        </div>

        <Separator />

        <Card className="border border-slate-200 bg-slate-50/50">
          <CardContent className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm font-medium text-slate-800">Контакты</p>
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
