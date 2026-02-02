/** Shared Lots data — source of truth for Object Page */

export type PropertyType =
  | "Жилая"
  | "Коммерческая"
  | "Офисная"
  | "Торговая"
  | "Склады"
  | "Бизнес";

export type Owner = {
  id: string;
  name: string;
  rating: number;
  avatar?: string;
};

export const DEMO_OWNERS: Owner[] = [
  { id: "owner-1", name: "John Doe", rating: 7.8 },
  { id: "owner-2", name: "Anna Smith", rating: 8.2 },
  { id: "owner-3", name: "Michael Brown", rating: 7.1 },
  { id: "owner-4", name: "Elena Vasiliev", rating: 8.5 },
  { id: "owner-5", name: "James Wilson", rating: 6.9 },
  { id: "owner-6", name: "Maria Garcia", rating: 8.0 },
  { id: "owner-7", name: "Thomas Müller", rating: 7.4 },
  { id: "owner-8", name: "Sophie Laurent", rating: 7.6 },
  { id: "owner-9", name: "David Kim", rating: 8.3 },
  { id: "owner-10", name: "Olga Petrova", rating: 7.2 },
  { id: "owner-11", name: "Richard Clark", rating: 6.7 },
  { id: "owner-12", name: "Yuki Tanaka", rating: 8.1 },
  { id: "owner-13", name: "Carlos Silva", rating: 7.5 },
  { id: "owner-14", name: "Emma Johnson", rating: 7.9 },
  { id: "owner-15", name: "Hans Weber", rating: 7.3 },
];

export type Listing = {
  id: string;
  ownerId: string;
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

  const ownerCounts: number[] = DEMO_OWNERS.map(() =>
    Math.floor(Math.random() * 8)
  );
  const totalListings = ownerCounts.reduce((a, b) => a + b, 0);
  if (totalListings === 0) ownerCounts[0] = 5;

  const allCities: { country: string; city: string }[] = [];
  Object.entries(citiesByCountry).forEach(([country, cities]) => {
    cities.forEach((city) => allCities.push({ country, city }));
  });

  const listings: Listing[] = [];
  let idx = 1;
  let cityIdx = 0;

  DEMO_OWNERS.forEach((owner, ownerIdx) => {
    const count = ownerCounts[ownerIdx];
    for (let i = 0; i < count; i++) {
      const { country, city } = allCities[cityIdx % allCities.length];
      cityIdx++;
      const rentMonthly = 1500 + Math.floor(Math.random() * 8000);
      const rentYearly = rentMonthly * 12;
      const businessValue = rentYearly * (8 + Math.random() * 6);

      listings.push({
        id: `lot-${String(idx).padStart(3, "0")}`,
        ownerId: owner.id,
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

export function getOwnerById(id: string | undefined): Owner | null {
  if (!id) return null;
  return DEMO_OWNERS.find((o) => o.id === id) ?? null;
}

export function getListingsByOwnerId(ownerId: string): Listing[] {
  return DEMO_LISTINGS.filter((l) => l.ownerId === ownerId);
}
