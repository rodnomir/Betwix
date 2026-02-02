import type { ReactNode } from "react";

type TabOption = { value: string; label: string };

const DEFAULT_TABS: TabOption[] = [
  { value: "aggregated", label: "Aggregated" },
  { value: "reit", label: "REIT" },
  { value: "rent", label: "Rent" },
];

type Props = {
  active: string;
  onChange: (value: string) => void;
  subtitle?: string;
  tabs?: TabOption[];
};

/** Shared section wrapper: identical spacing on Lots and P2P (P2P is reference) */
export function SubTabsSection({ children }: { children: ReactNode }) {
  return <section className="mb-3">{children}</section>;
}

export default function SubTabs({ active, onChange, subtitle, tabs = DEFAULT_TABS }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex rounded-full border border-[#E5E7EB] bg-[#F8FAFC] p-1">
        {tabs.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={
              "rounded-full px-4 py-1.5 text-sm transition-colors " +
              (active === value
                ? "bg-blue-600 font-medium text-white"
                : "font-normal text-slate-500 hover:bg-slate-100 hover:text-slate-700")
            }
          >
            {label}
          </button>
        ))}
      </div>
      {subtitle && (
        <span className="text-sm font-normal text-slate-500">{subtitle}</span>
      )}
    </div>
  );
}
