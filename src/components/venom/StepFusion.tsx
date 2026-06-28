import { motion } from "framer-motion";
import { useEffect } from "react";
import { Brain, Eye, MapPin, Stethoscope } from "lucide-react";

export function StepFusion({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <section className="mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6">
      <div className="mono mb-4 text-[10px] tracking-[0.3em] text-cyan-300/80">
        FUSING MULTIMODAL SIGNALS
      </div>
      <h2 className="font-display text-4xl md:text-6xl">AI Core engaged</h2>

      <div className="relative mt-16 h-[520px] w-full max-w-3xl">
        <svg viewBox="0 0 600 520" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="flow" x1="0" x2="1">
              <stop offset="0" stopColor="#00E5FF" stopOpacity="0" />
              <stop offset="0.5" stopColor="#00E5FF" stopOpacity="1" />
              <stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            { x1: 80, y1: 100, x2: 300, y2: 260 },
            { x1: 520, y1: 100, x2: 300, y2: 260 },
            { x1: 300, y1: 460, x2: 300, y2: 260 },
          ].map((l, i) => (
            <g key={i}>
              <line {...l} stroke="rgba(0,229,255,0.2)" strokeWidth="1" />
              <line {...l} stroke="url(#flow)" strokeWidth="2" strokeDasharray="6 200" className="animate-dash" style={{ animationDelay: `${i * 0.3}s` }} />
            </g>
          ))}
        </svg>

        {/* Nodes */}
        <Node className="left-0 top-12" icon={MapPin} label="Geography" delay={0} />
        <Node className="right-0 top-12" icon={Eye} label="Vision" delay={0.2} />
        <Node className="left-1/2 bottom-0 -translate-x-1/2" icon={Stethoscope} label="Symptoms" delay={0.4} />

        {/* Core */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border border-cyan-300/30" style={{ animationDuration: "10s" }} />
            <div className="absolute inset-6 animate-spin rounded-full border border-cyan-300/40" style={{ animationDuration: "7s", animationDirection: "reverse" }} />
            <div className="absolute inset-12 animate-spin rounded-full border border-emerald-300/40" style={{ animationDuration: "14s" }} />
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl"
            />
            <div className="glass-strong relative flex h-28 w-28 items-center justify-center rounded-full neon-border">
              <Brain className="h-10 w-10 text-cyan-300" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mono mt-8 flex items-center gap-3 text-[10px] tracking-[0.3em] text-cyan-300/80">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
        REASONING · CROSS-REFERENCING REGIONAL BIOLOGY · TOXIDROME · MORPHOLOGY
      </div>
    </section>
  );
}

function Node({ className, icon: Icon, label, delay }: { className: string; icon: typeof Brain; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`absolute ${className}`}
    >
      <div className="glass flex h-24 w-24 flex-col items-center justify-center rounded-2xl neon-border animate-float-slow">
        <Icon className="h-5 w-5 text-cyan-300" />
        <div className="mono mt-2 text-[9px] tracking-[0.2em] text-muted-foreground">{label.toUpperCase()}</div>
      </div>
    </motion.div>
  );
}
