import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CARDS = [
  {
    title: "Комиссия за сделку (P2P / первичка)",
    description:
      "Взимается при покупке/продаже доли. Прозрачно показывается до подтверждения сделки.",
    badge: "по тарифу",
    chips: [
      { label: "Плательщик", value: "покупатель или продавец", color: "bg-blue-50 text-blue-800 border-blue-200" },
      { label: "Событие", value: "сделка доли", color: "bg-slate-100 text-slate-700 border-slate-200" },
      { label: "Списание", value: "при исполнении", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    ],
  },
  {
    title: "Комиссия за размещение / листинг объекта",
    description:
      "Для владельца при публикации объекта и подготовке пакета данных. Условия фиксируются правилами листинга.",
    badge: "по договору",
    chips: [
      { label: "Плательщик", value: "владелец объекта", color: "bg-blue-50 text-blue-800 border-blue-200" },
      { label: "Событие", value: "листинг", color: "bg-slate-100 text-slate-700 border-slate-200" },
      { label: "Списание", value: "при размещении/по договору", color: "bg-amber-50 text-amber-800 border-amber-200" },
    ],
  },
  {
    title: "Сервисный сбор за сопровождение",
    description:
      "Опциональные сервисы: учёт, отчётность, документооборот, поддержка. Подключается по необходимости.",
    badge: "по тарифу",
    chips: [
      { label: "Плательщик", value: "владелец/по договору", color: "bg-blue-50 text-blue-800 border-blue-200" },
      { label: "Событие", value: "сервисный пакет", color: "bg-slate-100 text-slate-700 border-slate-200" },
      { label: "Списание", value: "ежемесячно/по условиям", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    ],
  },
  {
    title: "Партнёрские услуги",
    description:
      "Оценка, юр. сопровождение, страхование, услуги УК. Платформа даёт доступ к партнёрам и прозрачные условия.",
    badge: "по договору",
    chips: [
      { label: "Плательщик", value: "заказчик услуги", color: "bg-blue-50 text-blue-800 border-blue-200" },
      { label: "Событие", value: "партнёрская услуга", color: "bg-slate-100 text-slate-700 border-slate-200" },
      { label: "Списание", value: "по факту оказания", color: "bg-amber-50 text-amber-800 border-amber-200" },
    ],
  },
];

const TABLE_ROWS = [
  {
    event: "Сделка на P2P-рынке (покупка/продажа доли)",
    payer: "Покупатель или продавец",
    type: "Комиссия за сделку",
    when: "При заключении сделки",
    where: "Экран подтверждения, история операций",
  },
  {
    event: "Первичная покупка доли в объекте",
    payer: "Инвестор",
    type: "Комиссия за сделку",
    when: "При зачислении доли",
    where: "Карточка объекта, история операций",
  },
  {
    event: "Размещение объекта на платформе",
    payer: "Владелец объекта",
    type: "Комиссия за листинг",
    when: "По условиям размещения",
    where: "Кабинет владельца, документы",
  },
  {
    event: "Сопровождение: учёт и отчётность",
    payer: "Владелец или по договору",
    type: "Сервисный сбор",
    when: "Периодически по условиям",
    where: "Лицевой счёт, история",
  },
  {
    event: "Подключение управляющей компании",
    payer: "Сторона по договору с УК",
    type: "Партнёрская услуга",
    when: "По факту оказания услуг",
    where: "Документы, выписки",
  },
  {
    event: "Оценка объекта / юридическое сопровождение",
    payer: "Заказчик услуги",
    type: "Партнёрская услуга",
    when: "По факту оказания",
    where: "Документы, история операций",
  },
];

export default function RevenueModelSection() {
  const [tableOpen, setTableOpen] = useState(false);

  return (
    <section className="py-8 md:py-10">
      <h2 className="text-lg font-semibold text-slate-900">
        Модель дохода
      </h2>
      <p className="mt-1 text-sm text-slate-600 mb-6">
        Прозрачные комиссии и сервисы — понятно кто платит, за что и когда.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CARDS.map((card, i) => (
          <Card
            key={i}
            className="relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 border border-slate-200"
          >
            <Badge
              variant="secondary"
              className="absolute top-4 right-4 text-xs"
            >
              {card.badge}
            </Badge>
            <CardHeader className="pb-2 pr-24">
              <CardTitle className="text-base leading-snug">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed">
                {card.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {card.chips.map((chip, j) => (
                  <span
                    key={j}
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${chip.color}`}
                  >
                    <span className="font-medium">{chip.label}:</span>
                    <span className="ml-1">{chip.value}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Пример расчёта */}
      <Card className="mt-6 border-slate-200 bg-slate-50/50">
        <CardContent className="py-4 px-5">
          <p className="text-sm font-medium text-slate-800">
            Сделка на €10 000 → комиссия платформы (по тарифу)
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Ставки зависят от типа объекта и условий сделки.
          </p>
        </CardContent>
      </Card>

      {/* Accordion: Кто / За что / Когда — подробно */}
      <Card className="mt-6 border border-slate-200 overflow-hidden">
        <button
          type="button"
          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
          onClick={() => setTableOpen((v) => !v)}
          aria-expanded={tableOpen}
        >
          <span className="font-medium text-slate-900">
            Кто / За что / Когда — подробно
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
              tableOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {tableOpen && (
          <div className="border-t border-slate-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Событие</TableHead>
                  <TableHead>Плательщик</TableHead>
                  <TableHead>Тип комиссии</TableHead>
                  <TableHead>Когда списывается</TableHead>
                  <TableHead>Где видно</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TABLE_ROWS.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-slate-700 text-sm">{row.event}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{row.payer}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{row.type}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{row.when}</TableCell>
                    <TableCell className="text-slate-600 text-sm">{row.where}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </section>
  );
}
