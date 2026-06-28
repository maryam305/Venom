import { motion } from "framer-motion";
import { ArrowRight, Brain, Eye, MapPin, Stethoscope } from "lucide-react";

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-6 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass mb-8 flex items-center gap-2 rounded-full px-4 py-2"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(0,255,157,0.9)]" />
        <span className="mono text-[10px] tracking-[0.25em] text-emerald-200/90">
          MULTIMODAL · LIVE · AFRICA-WIDE
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="text-center font-display text-[16vw] font-bold leading-[0.85] tracking-tighter md:text-[10rem]"
      >
        <span className="bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent">
          VENOM
        </span>
        <span className="text-cyan-300 neon-text">.AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-6 max-w-2xl text-center text-lg text-muted-foreground md:text-xl"
      >
        Hybrid multimodal snakebite intelligence platform — fusing geography,
        clinical signal, and computer vision into life-saving decisions.
      </motion.p>

      {/* Three floating modules */}
      <div className="relative mt-20 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { icon: Eye, label: "Computer Vision", sub: "Species recognition", delay: 0 },
          { icon: Stethoscope, label: "Clinical Symptoms", sub: "Toxidrome matching", delay: 0.15 },
          { icon: MapPin, label: "Geographic Intel", sub: "Regional biology", delay: 0.3 },
        ].map(({ icon: Icon, label, sub, delay }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 + delay }}
            className="glass animate-float-slow group relative overflow-hidden rounded-2xl p-6"
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/25" />
            <div className="relative">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 neon-border">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-display text-xl">{label}</div>
              <div className="mono mt-1 text-[11px] tracking-[0.15em] text-muted-foreground">
                {sub.toUpperCase()}
              </div>
              <div className="mono mt-6 flex items-center justify-between text-[10px] text-cyan-300/70">
                <span>SIGNAL · {String(i + 1).padStart(2, "0")}</span>
                <span>ACTIVE</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Connection SVG to fusion node */}
        <svg className="pointer-events-none absolute inset-x-0 -bottom-32 mx-auto h-40 w-full" viewBox="0 0 800 200" fill="none">
          <path d="M120 10 Q400 100 400 180" stroke="url(#g1)" strokeWidth="1" className="animate-dash" />
          <path d="M400 10 L400 180" stroke="url(#g1)" strokeWidth="1" className="animate-dash" />
          <path d="M680 10 Q400 100 400 180" stroke="url(#g1)" strokeWidth="1" className="animate-dash" />
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#00E5FF" stopOpacity="0" />
              <stop offset="1" stopColor="#00E5FF" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Fusion Core */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="relative mt-44"
      >
        <div className="relative flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border border-cyan-300/30" style={{ animationDuration: "12s" }} />
          <div className="absolute inset-3 animate-spin rounded-full border border-cyan-300/20" style={{ animationDuration: "9s", animationDirection: "reverse" }} />
          <div className="absolute inset-6 animate-spin rounded-full border border-emerald-300/20" style={{ animationDuration: "16s" }} />
          <div className="absolute inset-8 rounded-full bg-cyan-400/10 blur-2xl" />
          <div className="glass-strong relative flex h-24 w-24 items-center justify-center rounded-full neon-border">
            <Brain className="h-8 w-8 text-cyan-300" />
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="mono text-[10px] tracking-[0.3em] text-cyan-300/80">AI FUSION ENGINE</div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="group mt-10 mb-24 inline-flex items-center gap-3 rounded-full bg-cyan-300 px-7 py-4 font-display text-sm font-semibold text-[#04121b] shadow-[0_0_40px_rgba(0,229,255,0.55)] transition hover:bg-white"
      >
        START ASSESSMENT
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </motion.button>
    </section>
  );
}
