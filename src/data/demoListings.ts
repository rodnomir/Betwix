/** Shared Lots data — source of truth for Object Page */

export type PropertyType =
  | "Жилая"
  | "Коммерческая"
  | "Офисная"
  | "Торговая"
  | "Склады"
  | "Бизнес";

export type Listing = {
  id: string;
  title: string;
  country: string;
  city: string;
  address: string;
  rentMonthly: number;
  rentYearly: number;
  termYears: number;
  businessValue: number;
  minTicket: number;
  raiseTarget: number;
  raiseCollected: number;
  raiseStartISO: string;
  daysLeft: number;
  propertyType: PropertyType;
  tenantType: "Физ" | "Юр";
  liquidity: "Низкая" | "Средняя" | "Высокая";
  salePercent: number;
};

function generateDemoListings(): Listing[] {
  const listings: Listing[] = [];
  let idx = 1;

  const citiesByCountry: Record<string, string[]> = {
    Великобритания: ["Лондон", "Манчестер", "Бирмингем"],
    Португалия: ["Лиссабон", "Порту"],
    Испания: ["Мадрид", "Барселона", "Валенсия"],
    Германия: ["Берлин", "Мюнхен", "Гамбург"],
    Нидерланды: ["Амстердам", "Роттердам"],
    Австрия: ["Вена", "Грац"],
    Швейцария: ["Цюрих", "Женева"],
    Франция: ["Париж", "Лион"],
    Польша: ["Варшава", "Краков"],
    США: ["Нью-Йорк", "Майами", "Остин"],
    Канада: ["Торонто", "Ванкувер"],
    Япония: ["Токио", "Осака"],
    "Южная Корея": ["Сеул"],
    Сингапур: ["Сингапур"],
    Таиланд: ["Бангкок", "Пхукет"],
    Индия: ["Мумбаи", "Бангалор"],
    Индонезия: ["Джакарта", "Бали"],
    Вьетнам: ["Хошимин", "Ханой"],
    Малайзия: ["Куала-Лумпур"],
    ОАЭ: ["Дубай", "Абу-Даби"],
    Украина: ["Киев", "Львов"],
    Казахстан: ["Алматы", "Астана"],
    Узбекистан: ["Ташкент"],
    Беларусь: ["Минск"],
    Россия: ["Москва", "Санкт-Петербург"],
    Мексика: ["Мехико"],
    Бразилия: ["Сан-Паулу"],
    Чили: ["Сантьяго"],
    Колумбия: ["Богота"],
  };

  Object.entries(citiesByCountry).forEach(([country, cities]) => {
    const count = 5 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const city = cities[i % cities.length];
      const rentMonthly = 1500 + Math.floor(Math.random() * 8000);
      const rentYearly = rentMonthly * 12;
      const businessValue = rentYearly * (8 + Math.random() * 6);

      listings.push({
        id: `lot-${String(idx).padStart(3, "0")}`,
        title: ["Жилая", "Коммерческая", "Офисная", "Торговая", "Склады", "Бизнес"][
          idx % 6
        ] as PropertyType,
        country,
        city,
        address: "Центральный район",
        rentMonthly,
        rentYearly,
        termYears: 5 + Math.floor(Math.random() * 10),
        businessValue: Math.round(businessValue),
        minTicket: 5000,
        raiseTarget: Math.round(businessValue * 0.6),
        raiseCollected: Math.round(businessValue * Math.random() * 0.4),
        raiseStartISO: "2026-01-01",
        daysLeft: 5 + Math.floor(Math.random() * 30),
        propertyType: ["Жилая", "Коммерческая", "Офисная", "Торговая", "Склады", "Бизнес"][
          idx % 6
        ] as PropertyType,
        tenantType: Math.random() > 0.5 ? "Физ" : "Юр",
        liquidity: ["Низкая", "Средняя", "Высокая"][
          Math.floor(Math.random() * 3)
        ] as Listing["liquidity"],
        salePercent: 40 + Math.floor(Math.random() * 40),
      });
      idx++;
    }
  });

  return listings;
}

export const DEMO_LISTINGS: Listing[] = generateDemoListings();

export function getListingById(id: string | undefined): Listing | null {
  if (!id) return null;
  const numericId = id.replace(/\D/g, "");
  return (
    DEMO_LISTINGS.find((l) => l.id === id || l.id.replace(/\D/g, "") === numericId) ??
    null
  );
}
