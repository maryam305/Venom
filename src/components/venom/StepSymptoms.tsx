import { motion } from "framer-motion";
import { ArrowRight, Activity, Droplet, Eye, Wind, Brain, Zap, Hand, Skull, Thermometer } from "lucide-react";
import { StepHeader } from "./StepGeography";

const SYMPTOMS = [
  { id: "bleeding", label: "Bleeding", icon: Droplet, severity: "high", desc: "Coagulopathy signal" },
  { id: "necrosis", label: "Necrosis", icon: Skull, severity: "high", desc: "Cytotoxic envenomation" },
  { id: "paralysis", label: "Paralysis", icon: Hand, severity: "critical", desc: "Neurotoxic — α-bungarotoxin family" },
  { id: "blurred", label: "Blurred Vision", icon: Eye, severity: "mid", desc: "Ptosis / cranial nerves" },
  { id: "breathing", label: "Difficulty Breathing", icon: Wind, severity: "critical", desc: "Respiratory failure risk" },
  { id: "vomiting", label: "Vomiting", icon: Activity, severity: "mid", desc: "Systemic toxin response" },
  { id: "swelling", label: "Swelling", icon: Thermometer, severity: "low", desc: "Local cytotoxicity" },
  { id: "weakness", label: "Muscle Weakness", icon: Zap, severity: "high", desc: "Myotoxic / neurotoxic" },
  { id: "confusion", label: "Confusion", icon: Brain, severity: "high", desc: "Cerebral hypoperfusion" },
];

export function StepSymptoms({ onNext, value, onChange }: { onNext: () => void; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  return (
    <section className="mx-auto min-h-[100svh] max-w-7xl px-6 pt-32 pb-24">
      <StepHeader index={2} title="Clinical Symptoms" subtitle="Select observed presentations. Severity and toxidromes are computed in real-time." />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {SYMPTOMS.map((s, i) => {
            const active = value.includes(s.id);
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                onClick={() => toggle(s.id)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-cyan-300/40 bg-cyan-400/10 neon-border"
                    : "border-white/8 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId={`glow-${s.id}`}
                    className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/30 blur-2xl"
                  />
                )}
                <div className="relative">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? "bg-cyan-300/20 text-cyan-200" : "bg-white/5 text-white/70"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 font-display text-lg">{s.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.desc}</div>
                  <div className="mono mt-4 flex items-center justify-between text-[10px] tracking-[0.18em]">
                    <span className={
                      s.severity === "critical" ? "text-rose-300" : s.severity === "high" ? "text-amber-300" : "text-emerald-300"
                    }>
                      {s.severity.toUpperCase()}
                    </span>
                    <span className={active ? "text-cyan-200" : "text-muted-foreground"}>
                      {active ? "● SELECTED" : "○ TAP"}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="glass-strong sticky top-32 rounded-3xl p-6">
            <div className="mono text-[10px] tracking-[0.25em] text-cyan-300/80">LIVE TOXIDROME</div>
            <div className="mt-2 font-display text-5xl text-cyan-200 neon-text">
              {String(value.length).padStart(2, "0")}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">symptoms selected</div>

            <div className="mt-6 space-y-2">
              {value.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-muted-foreground">
                  Awaiting clinical input
                </div>
              ) : (
                value.map((id) => {
                  const s = SYMPTOMS.find((x) => x.id === id)!;
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2"
                    >
                      <span className="text-sm">{s.label}</span>
                      <span className={`mono text-[10px] ${s.severity === "critical" ? "text-rose-300" : s.severity === "high" ? "text-amber-300" : "text-emerald-300"}`}>
                        {s.severity.toUpperCase()}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>

            <button
              onClick={onNext}
              disabled={value.length === 0}
              className="mt-6 group flex w-full items-center justify-between rounded-2xl bg-cyan-300 px-5 py-3.5 font-display text-sm font-semibold text-[#04121b] shadow-[0_0_30px_rgba(0,229,255,0.45)] transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted-foreground disabled:shadow-none"
            >
              CONTINUE · VISION <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
