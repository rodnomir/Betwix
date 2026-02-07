import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Briefcase, ArrowRightLeft } from "lucide-react";

/**
 * Betwix — Platform Hub Diagram
 * VERSION: last-working-2026-02-07 + Green ACK animation overlay
 *
 * Blue flow:
 * 1) Owners → Platform
 * 2) Platform → Investors + Management
 *
 * Green ACK overlay:
 * 3) Investors + Management glow green, then green returns to Platform
 * 4) Platform glows green, then green goes Platform → Owners
 * 5) Owners glow green
 */

type Stage =
  | "owners_to_platform"
  | "platform_to_sides"
  | "sides_to_platform_green"
  | "platform_to_owners_green"
  | "complete";

// Geometry (keep aligned 1:1 across dashed + bars) — compact vertical layout
const CONTAINER_HEIGHT = 320;
const GAP = 64; // fixed dash length (unchanged)
const TOP_Y = 36; // line starts here; top node sits above (top: -36px)
const PLATFORM_W = 260;
const PLATFORM_HALF = PLATFORM_W / 2; // 130
// Use CSS styles (not Tailwind arbitrary calc classes) to avoid parser/JIT edge-cases
const LEFT_LINE_LEFT = `calc(50% - ${PLATFORM_HALF}px - ${GAP}px)`;
const RIGHT_LINE_LEFT = `calc(50% + ${PLATFORM_HALF}px)`;

export default function BetwixPlatformProcess() {
  const [stage, setStage] = useState<Stage>("owners_to_platform");
  const [cycle, setCycle] = useState(0);

  const [outDone, setOutDone] = useState(0);
  const [retDone, setRetDone] = useState(0);

  // reset counters when stage changes
  useEffect(() => {
    if (stage !== "platform_to_sides") setOutDone(0);
    if (stage !== "sides_to_platform_green") setRetDone(0);
  }, [stage]);

  // advance after both side animations complete
  useEffect(() => {
    if (stage === "platform_to_sides" && outDone >= 2) {
      setStage("sides_to_platform_green");
    }
  }, [stage, outDone]);

  useEffect(() => {
    if (stage === "sides_to_platform_green" && retDone >= 2) {
      setStage("platform_to_owners_green");
    }
  }, [stage, retDone]);

  // complete → short pause → restart loop (infinite)
  useEffect(() => {
    if (stage !== "complete") return;
    const t = setTimeout(() => {
      setCycle((c) => c + 1);
      setStage("owners_to_platform");
    }, 500);
    return () => clearTimeout(t);
  }, [stage]);

  const glow = useMemo(() => {
    return {
      ownersGreen: stage === "complete",
      platformGreen:
        stage === "platform_to_owners_green" || stage === "complete",
      investorsGreen:
        stage === "sides_to_platform_green" ||
        stage === "platform_to_owners_green" ||
        stage === "complete",
      mgmtGreen:
        stage === "sides_to_platform_green" ||
        stage === "platform_to_owners_green" ||
        stage === "complete",
      platformBlue: stage === "platform_to_sides",
    };
  }, [stage]);

  return (
    <section className="w-full py-6 bg-gradient-to-b from-white to-slate-50 flex flex-col items-center overflow-visible">
      <h2 className="text-3xl font-semibold text-slate-900 mb-8">
        Как работает платформа Betwix
      </h2>

      <div className="relative w-[1000px] overflow-visible" style={{ height: CONTAINER_HEIGHT }}>
        {/* CENTER PLATFORM */}
        <PlatformCard blue={glow.platformBlue} green={glow.platformGreen} />

        {/* NODES */}
        <Node
          icon={<Building2 />}
          title="Владельцы объектов"
          description="Добавляют объекты и данные о будущем арендном доходе"
          position="top"
          greenGlow={glow.ownersGreen}
        />
        <Node
          icon={<Users />}
          title="Инвесторы"
          description="Покупают и торгуют правами на долю арендного дохода"
          position="left"
          greenGlow={glow.investorsGreen}
        />
        <Node
          icon={<Briefcase />}
          title="Управляющая компания"
          description="Эксплуатация, аренда и отчётность по объектам"
          position="right"
          greenGlow={glow.mgmtGreen}
        />

        {/* STATIC DASHED LINES */}
        <DashedLine from="top" />
        <DashedLine from="left" />
        <DashedLine from="right" />

        {/* FLOWS */}
        <AnimatePresence mode="wait">
          {stage === "owners_to_platform" && (
            <FlowBar
              key={`o2p-${cycle}`}
              path="top"
              color="blue"
              dir="down"
              delay={0}
              onComplete={() => setStage("platform_to_sides")}
            />
          )}

          {stage === "platform_to_sides" && (
            <>
              <FlowBar
                key={`p2i-${cycle}`}
                path="left"
                color="blue"
                dir="out"
                delay={0}
                onComplete={() => setOutDone((v) => v + 1)}
              />
              <FlowBar
                key={`p2m-${cycle}`}
                path="right"
                color="blue"
                dir="out"
                delay={0}
                onComplete={() => setOutDone((v) => v + 1)}
              />
            </>
          )}

          {stage === "sides_to_platform_green" && (
            <>
              <FlowBar
                key={`i2p-${cycle}`}
                path="left"
                color="green"
                dir="in"
                delay={0.2}
                onComplete={() => setRetDone((v) => v + 1)}
              />
              <FlowBar
                key={`m2p-${cycle}`}
                path="right"
                color="green"
                dir="in"
                delay={0.2}
                onComplete={() => setRetDone((v) => v + 1)}
              />
            </>
          )}

          {stage === "platform_to_owners_green" && (
            <FlowBar
              key={`p2o-${cycle}`}
              path="top"
              color="green"
              dir="up"
              delay={0.2}
              onComplete={() => setStage("complete")}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PlatformCard({ blue, green }: { blue: boolean; green: boolean }) {
  const shadow = green
    ? "0 26px 56px rgba(16,185,129,0.35)"
    : blue
    ? "0 28px 56px rgba(59,130,246,0.40)"
    : "0 10px 25px rgba(0,0,0,0.08)";

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[120px] rounded-2xl bg-white border flex flex-col items-center justify-center text-center z-20"
      animate={{ boxShadow: shadow }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ArrowRightLeft className="w-5 h-5 text-blue-600" />
        Платформа Betwix
      </div>
      <div className="mt-2 text-xs text-slate-500 max-w-[220px]">
        Учёт прав · стандарты объектов · витрина · P2P-рынок
      </div>
    </motion.div>
  );
}

function Node({
  icon,
  title,
  description,
  position,
  greenGlow,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  position: "top" | "left" | "right";
  greenGlow: boolean;
}) {
  const [hover, setHover] = useState(false);

  const pos: Record<string, string> = {
    top: "left-1/2 -translate-x-1/2 -top-9",
    left: "left-[166px] top-1/2 -translate-y-1/2",
    right: "right-[166px] top-1/2 -translate-y-1/2",
  };

  const glowShadow = greenGlow
    ? "0 18px 40px rgba(16,185,129,0.35)"
    : "0 4px 16px rgba(0,0,0,0.06)";

  return (
    <div
      className={`absolute ${pos[position]} z-10`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        className="w-[140px] h-[72px] rounded-xl bg-white border flex flex-col items-center justify-center text-center"
        animate={{ boxShadow: glowShadow }}
        transition={{ duration: 0.25 }}
      >
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-blue-600 mb-1">
          {icon}
        </div>
        <div className="text-xs font-medium text-slate-800">{title}</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 6 }}
        transition={{ duration: 0.2 }}
        className="absolute left-1/2 -translate-x-1/2 -top-12 w-[220px] text-xs text-slate-600 bg-white border shadow-lg rounded-lg p-3 pointer-events-none"
      >
        {description}
      </motion.div>
    </div>
  );
}

function DashedLine({ from }: { from: "top" | "left" | "right" }) {
  const base = "absolute z-30 border border-dashed border-slate-300";

  if (from === "top") {
    return (
      <div
        className={base}
        style={{
          left: "50%",
          top: TOP_Y,
          transform: "translateX(-50%)",
          width: 1,
          height: GAP,
        }}
      />
    );
  }

  if (from === "left") {
    return (
      <div
        className={base}
        style={{
          left: LEFT_LINE_LEFT,
          top: "50%",
          transform: "translateY(-50%)",
          height: 1,
          width: GAP,
        }}
      />
    );
  }

  return (
    <div
      className={base}
      style={{
        left: RIGHT_LINE_LEFT,
        top: "50%",
        transform: "translateY(-50%)",
        height: 1,
        width: GAP,
      }}
    />
  );
}

function FlowBar({
  path,
  color,
  dir,
  delay,
  onComplete,
}: {
  path: "top" | "left" | "right";
  color: "blue" | "green";
  dir: "down" | "up" | "out" | "in";
  delay: number;
  onComplete?: () => void;
}) {
  // wrapper styles match dashed lines (thicker)
  const isVertical = path === "top";

  const wrapperStyle: React.CSSProperties = isVertical
    ? {
        left: "50%",
        top: TOP_Y,
        transform: "translateX(-50%)",
        width: 6,
        height: GAP,
      }
    : path === "left"
    ? {
        left: LEFT_LINE_LEFT,
        top: "50%",
        transform: "translateY(-50%)",
        height: 6,
        width: GAP,
      }
    : {
        left: RIGHT_LINE_LEFT,
        top: "50%",
        transform: "translateY(-50%)",
        height: 6,
        width: GAP,
      };

  // direction + transformOrigin
  const origin = isVertical
    ? dir === "down"
      ? "top"
      : "bottom"
    : path === "left"
    ? dir === "out"
      ? "right"
      : "left"
    : dir === "out"
    ? "left"
    : "right";

  const initial = isVertical ? { scaleY: 0 } : { scaleX: 0 };
  const animate = isVertical ? { scaleY: 1 } : { scaleX: 1 };

  // gradient direction follows growth direction
  const gradientDir = isVertical
    ? dir === "down"
      ? "bg-gradient-to-b"
      : "bg-gradient-to-t"
    : path === "left"
    ? dir === "out"
      ? "bg-gradient-to-l"
      : "bg-gradient-to-r"
    : dir === "out"
    ? "bg-gradient-to-r"
    : "bg-gradient-to-l";

  const palette =
    color === "green"
      ? "from-emerald-500 via-emerald-300 to-transparent"
      : "from-blue-500 via-blue-300 to-transparent";

  return (
    <motion.div
      className={`absolute z-40 rounded-full ${gradientDir} ${palette}`}
      style={{ ...wrapperStyle, transformOrigin: origin }}
      initial={initial}
      animate={animate}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: "easeInOut", delay }}
      onAnimationComplete={onComplete}
    />
  );
}
