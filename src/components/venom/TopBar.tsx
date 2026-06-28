import { motion } from "framer-motion";
import { Activity, Radar } from "lucide-react";

export function TopBar({ step, emergency }: { step: number; emergency: boolean }) {
  const stages = ["Hero", "Geography", "Symptoms", "Vision", "Fusion", "Report"];
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between gap-4 px-4">
        <div className="glass flex items-center gap-3 rounded-full px-4 py-2.5">
          <div className="relative">
            <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.9)]" />
            <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-cyan-300/60" />
          </div>
          <span className="font-display text-sm font-semibold tracking-[0.18em]">
            VENOM<span className="text-cyan-300">.AI</span>
          </span>
          <span className="mono ml-2 hidden text-[10px] text-muted-foreground sm:inline">
            v1.0 · INTELLIGENCE CORE
          </span>
        </div>

        <div className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {stages.map((s, i) => (
            <div
              key={s}
              className={`mono rounded-full px-3 py-1 text-[10px] tracking-[0.18em] transition ${
                i === step
                  ? "bg-cyan-400/15 text-cyan-200 neon-border"
                  : i < step
                    ? "text-emerald-300/80"
                    : "text-muted-foreground"
              }`}
            >
              {String(i).padStart(2, "0")} · {s.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="glass flex items-center gap-3 rounded-full px-4 py-2.5">
          {emergency ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="flex items-center gap-2 text-rose-300"
            >
              <Activity className="h-3.5 w-3.5" />
              <span className="mono text-[10px] tracking-[0.2em]">EMERGENCY</span>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-300/90">
              <Radar className="h-3.5 w-3.5" />
              <span className="mono text-[10px] tracking-[0.2em]">SYS NOMINAL</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
