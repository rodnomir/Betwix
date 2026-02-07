import * as React from "react";

/**
 * Единый стиль навигационного пункта: как в основном меню сайта (Header).
 * Текст slate → blue при hover, синяя линия из центра (scaleX), 200ms ease-out.
 * Используется в Header (через те же классы) и в кабинете владельца (табы, под-меню).
 */
const BASE_CLASS =
  "group relative block shrink-0 font-medium transition-colors ";
const TEXT_CLASS = "text-slate-800 hover:text-blue-600";
const TEXT_ACTIVE_CLASS = "text-blue-600";
const UNDERLINE_CLASS =
  "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out ";
const UNDERLINE_INACTIVE = "w-0 group-hover:w-full";
const UNDERLINE_ACTIVE = "w-full";

export type NavItemUnderlineProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  /** Дополнительный padding (например pb-1.5 для табов). По умолчанию pb-1. */
  paddingClass?: string;
};

export function NavItemUnderline({
  active,
  onClick,
  children,
  className = "",
  paddingClass = "pb-1.5",
}: NavItemUnderlineProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        BASE_CLASS +
        paddingClass +
        " " +
        (active ? TEXT_ACTIVE_CLASS : TEXT_CLASS) +
        (className ? " " + className : "")
      }
    >
      {children}
      <span
        className={
          UNDERLINE_CLASS + (active ? UNDERLINE_ACTIVE : UNDERLINE_INACTIVE)
        }
        aria-hidden
      />
    </button>
  );
}

/** Классы для использования в Header (NavLink + span), чтобы не дублировать строки. */
export const navItemUnderlineStyles = {
  container: "group relative block pb-1 font-medium transition-colors ",
  text: (active: boolean) => (active ? "text-blue-600" : "text-slate-800 hover:text-blue-600"),
  line: (active: boolean) =>
    "absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 rounded-full bg-blue-500 transition-all duration-200 ease-out " +
    (active ? "w-full" : "w-0 group-hover:w-full"),
};
