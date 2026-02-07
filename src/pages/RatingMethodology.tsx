import { ChevronDown } from "lucide-react";
import PageContainer from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SCALE_ITEMS = [
  { grades: "A / A-", desc: "низкий риск, высокая стабильность", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { grades: "B / B-", desc: "умеренный риск, возможны колебания", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { grades: "C / C-", desc: "повышенный риск, нестабильные параметры", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { grades: "D", desc: "высокий риск, требуется повышенное внимание", color: "bg-slate-200 text-slate-800 border-slate-300" },
];

const ACCORDION_ITEMS = [
  {
    title: "Факторы и веса (пример базовой модели)",
    content: (
      <>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
          <li>Денежный поток и стабильность аренды — 30%</li>
          <li>Локация и качество объекта — 20%</li>
          <li>Экономика и запас прочности — 20%</li>
          <li>Юридическая структура и документы — 15%</li>
          <li>Управление (УК) и дисциплина процессов — 15%</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Веса могут адаптироваться по типам объектов и доступности данных.
        </p>
      </>
    ),
  },
  {
    title: "Что влияет на «Денежный поток»",
    content: (
      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
        <li>текущая/прогнозная заполняемость</li>
        <li>срок аренды и условия договора</li>
        <li>история оплат арендатора (если доступно)</li>
        <li>доля простоев и причина простоев</li>
        <li>соотношение доход/расходы по объекту</li>
      </ul>
    ),
  },
  {
    title: "Что влияет на «Финансы и запас прочности»",
    content: (
      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
        <li>прогноз чистого дохода (NOI-логика)</li>
        <li>резерв на ремонты и непредвиденные расходы</li>
        <li>чувствительность к снижению аренды (stress-check)</li>
        <li>регулярность расходов УК</li>
        <li>наличие крупных будущих CAPEX (если известно)</li>
      </ul>
    ),
  },
  {
    title: "Юридическая чистота и структура прав",
    content: (
      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
        <li>полнота пакета документов и проверка</li>
        <li>отсутствие критичных ограничений/обременений (если применимо)</li>
        <li>прозрачность структуры долей и прав на доход</li>
        <li>корректность договоров с УК и арендаторами</li>
        <li>наличие спорных пунктов / рисковых условий</li>
      </ul>
    ),
  },
  {
    title: "Качество управления (УК)",
    content: (
      <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
        <li>SLA по инцидентам и срокам реакции</li>
        <li>дисциплина отчётности (периодичность/полнота)</li>
        <li>прозрачность расходов</li>
        <li>скорость заселения/перезаселения</li>
        <li>история работы с объектами (если доступно)</li>
      </ul>
    ),
  },
  {
    title: "Обновления рейтинга и события",
    content: (
      <>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
          <li><strong>Планово:</strong> 1 раз в месяц</li>
          <li><strong>Внепланово:</strong> смена арендатора, простой, резкое изменение дохода, смена УК, крупный ремонт/инцидент, юридические изменения</li>
        </ul>
        <p className="mt-2 text-sm text-slate-600">
          В карточке объекта: «Изменения рейтинга» + «что повлияло».
        </p>
      </>
    ),
  },
];

export default function RatingMethodology() {
  return (
    <PageContainer>
      <div className="max-w-3xl space-y-8 pb-12">
        {/* Hero */}
        <header>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Методика рейтингов
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Рейтинг Betwix — индикатор риска и качества объекта на основе аренды, финансовых параметров, юридической структуры и качества управления. Он помогает сравнивать объекты между собой, но не гарантирует доход.
          </p>
        </header>

        <Separator />

        {/* 3 карточки */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Что означает рейтинг</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                <li>A / B / C / D — уровень риска</li>
                <li>Выше рейтинг → больше предсказуемость, меньше неопределённость</li>
                <li>Рейтинг строится на факторах + событиях (обновлениях)</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Из чего считается</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-slate-600 mb-2">Пять групп факторов:</p>
              <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                <li>Денежный поток аренды (стабильность)</li>
                <li>Локация и качество объекта</li>
                <li>Финансы и запас прочности</li>
                <li>Юридическая чистота и структура прав</li>
                <li>Управление (УК): дисциплина и отчётность</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Как использовать инвестору</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside leading-relaxed">
                <li>Сравнивай объекты в одной категории</li>
                <li>Смотри «почему такой рейтинг» (разбивку факторов)</li>
                <li>Следи за изменениями рейтинга после событий (простой / смена арендатора / смена УК)</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Шкала рейтинга */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Шкала рейтинга</h2>
          <div className="flex flex-wrap gap-2">
            {SCALE_ITEMS.map((item, i) => (
              <div
                key={i}
                className={`inline-flex flex-col rounded-lg border px-3 py-2 ${item.color}`}
              >
                <span className="font-semibold text-sm">{item.grades}</span>
                <span className="text-xs opacity-90">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Accordion (details/summary) */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Подробнее по факторам</h2>
          <div className="space-y-2">
            {ACCORDION_ITEMS.map((item, i) => (
              <details
                key={i}
                className="group rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-left font-medium text-slate-900 hover:bg-slate-50/80 transition-colors rounded-lg">
                  <span>{item.title}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 pt-0 text-slate-600 border-t border-slate-100">
                  {item.content}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Где отображается рейтинг */}
        <section>
          <h2 className="text-base font-semibold text-slate-900 mb-3">Где отображается рейтинг</h2>
          <Card className="border border-slate-200">
            <CardContent className="py-4">
              <ul className="space-y-2 text-sm text-slate-600 list-disc list-inside">
                <li>Карточка объекта: бейдж рейтинга + краткое объяснение</li>
                <li>«Почему такой рейтинг»: разбивка факторов</li>
                <li>История изменений: события и пересчёты</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-4 py-1">
          Рейтинг — аналитический индикатор для сравнения объектов. Он зависит от полноты данных и может меняться при новых событиях. Не является инвестиционной рекомендацией и не гарантирует доход.
        </p>
      </div>
    </PageContainer>
  );
}
