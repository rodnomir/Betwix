import type { ReactNode } from "react";

/** Shared page layout: max-w 1280px, centered, aligned with header */
export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 pt-2 pb-6">
      {children}
    </div>
  );
}
