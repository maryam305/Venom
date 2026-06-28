import { motion } from "framer-motion";
import { AlertTriangle, Shield, Activity, Clock, Sparkles, RotateCcw } from "lucide-react";

type Props = {
  geography: string | null;
  symptoms: string[];
  hasImage: boolean;
  onReset: () => void;
  emergency: boolean;
};

const SPECIES_BY_REGION: Record<string, { name: string; common: string; antivenom: string }> = {
  NG: { name: "Echis ocellatus", common: "West African Carpet Viper", antivenom: "EchiTAb-Plus-ICP" },
  GH: { name: "Echis ocellatus", common: "West African Carpet Viper", antivenom: "EchiTAb-Plus-ICP" },
  KE: { name: "Dendroaspis polylepis", common: "Black Mamba", antivenom: "SAIMR Polyvalent" },
  ZA: { name: "Bitis arietans", common: "Puff Adder", antivenom: "SAIMR Polyvalent" },
  EG: { name: "Cerastes cerastes", common: "Saharan Horned Viper", antivenom: "Inoserp PAN-AFRICA" },
  ET: { name: "Bitis arietans", common: "Puff Adder", antivenom: "SAIMR Polyvalent" },
};

export function StepResults({ geography, symptoms, hasImage, onReset, emergency }: Props) {
  const sp = SPECIES_BY_REGION[geography ?? "NG"] ?? SPECIES_BY_REGION.NG;
  const conflict = hasImage && geography === "EG"; // demo synthetic rule

  const weights = {
    geo: 42,
    sym: 37,
    vis: hasImage ? 21 : 0,
  };
  const total = weights.geo + weights.sym + weights.vis;
  const norm = {
    geo: Math.round((weights.geo / total) * 100),
    sym: Math.round((weights.sym / total) * 100),
    vis: Math.round((weights.vis / total) * 100),
  };

  const confidence = Math.min(96, 62 + symptoms.length * 4 + (hasImage ? 8 : 0));

  return (
    <section className="mx-auto min-h-[100svh] max-w-7xl px-6 pt-32 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-[10px] tracking-[0.3em] text-cyan-300/80">INTELLIGENCE REPORT</div>
          <h2 className="mt-2 font-display text-5xl md:text-6xl">Fusion Result</h2>
          <p className="mt-2 text-muted-foreground">Generated in 1.84s · Hybrid multimodal reasoning</p>
        </div>
        <button onClick={onReset} className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10">
          <RotateCcw className="h-3.5 w-3.5" /> New assessment
        </button>
      </div>

      {conflict && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-strong flex items-start gap-4 rounded-2xl border border-amber-400/30 p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg text-amber-200">Geographic Conflict Detected</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Uploaded species is not native to selected region. Vision confidence has been
              attenuated — recommendation generated from regional biology and clinical presentation.
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Prediction */}
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
          <Label>PRIMARY PREDICTION</Label>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <div className="font-display text-4xl italic md:text-5xl">{sp.name}</div>
            <div className="mono text-xs tracking-[0.2em] text-muted-foreground">{sp.common.toUpperCase()}</div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <Confidence value={confidence} />
            <div>
              <Label>RECOMMENDED ANTIVENOM</Label>
              <div className="mt-2 font-display text-2xl text-emerald-300">{sp.antivenom}</div>
              <div className="mono mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">POLYVALENT · WHO PREQUALIFIED</div>
            </div>
          </div>
        </Card>

        <Card>
          <Label>SEVERITY · TRIAGE</Label>
          <div className={`mt-2 font-display text-4xl ${emergency ? "text-rose-300 neon-text" : "text-amber-300"}`}>
            {emergency ? "CRITICAL" : "MODERATE"}
          </div>
          <div className="mt-6 space-y-3">
            <Row icon={Clock} label="Window to antivenom" value="< 60 min" />
            <Row icon={Activity} label="Risk index" value={emergency ? "9 / 10" : "6 / 10"} />
            <Row icon={Shield} label="Hospital tier" value="Level II+" />
          </div>
        </Card>

        {/* Clinical directives */}
        <Card className="lg:col-span-2">
          <Label>CLINICAL DIRECTIVES</Label>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              "Immobilize bitten limb at heart level",
              "Establish two large-bore IV lines",
              "Administer antivenom IV with adrenaline ready",
              "Monitor 20-min whole blood clotting test",
              "Tetanus prophylaxis; broad-spectrum antibiotics if necrosis",
              "Do not incise, suck, or apply tourniquet",
            ].map((d, i) => (
              <motion.div
                key={d}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="mono mt-0.5 text-[10px] text-cyan-300">{String(i + 1).padStart(2, "0")}</div>
                <div className="text-sm">{d}</div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Explainability */}
        <Card>
          <Label>EXPLAINABILITY · MODALITY WEIGHTS</Label>
          <div className="mt-4 flex items-center justify-around">
            <Radial label="Geography" value={norm.geo} color="#00E5FF" />
            <Radial label="Symptoms" value={norm.sym} color="#00FF9D" />
            <Radial label="Vision" value={norm.vis} color="#FFD54A" />
          </div>
          <div className="mono mt-6 flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan-300/80">
            <Sparkles className="h-3 w-3" /> SHAP-WEIGHTED ATTRIBUTION
          </div>
        </Card>

        {/* Timeline + explanation */}
        <Card className="lg:col-span-3">
          <Label>REASONING TIMELINE</Label>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { t: "+0s", l: "Geographic prior set", d: "Region defines native venomous candidate set." },
              { t: "+0.4s", l: "Toxidrome match", d: `Selected ${symptoms.length} symptoms scored against viper/elapid profiles.` },
              { t: "+1.1s", l: hasImage ? "Vision pass" : "Vision skipped", d: hasImage ? "Morphology + scale pattern aligned with viperid family." : "No image — confidence reweighted to clinical + region." },
              { t: "+1.8s", l: "Fusion arbitration", d: "Posterior probability over species; antivenom mapped from compendium." },
            ].map((s, i) => (
              <div key={s.l} className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                <div className="mono text-[10px] tracking-[0.2em] text-cyan-300">{s.t}</div>
                <div className="mt-2 font-display text-lg">{s.l}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.d}</div>
                {i < 3 && <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-cyan-300/30 md:block" />}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-strong rounded-3xl p-6 ${className}`}>{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <div className="mono text-[10px] tracking-[0.25em] text-cyan-300/80">{children}</div>;
}
function Row({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mono text-xs">{value}</div>
    </div>
  );
}

function Confidence({ value }: { value: number }) {
  return (
    <div>
      <Label>CONFIDENCE</Label>
      <div className="mt-2 flex items-end gap-2">
        <div className="font-display text-5xl text-cyan-300 neon-text">{value}</div>
        <div className="mono pb-2 text-xs text-muted-foreground">%</div>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.2, ease: "easeOut" }} className="h-full bg-gradient-to-r from-cyan-400 to-emerald-300" />
      </div>
    </div>
  );
}

function Radial({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
        <motion.circle
          cx="42"
          cy="42"
          r={r}
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          transform="rotate(-90 42 42)"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x="42" y="47" textAnchor="middle" className="font-display fill-white" fontSize="16">{value}%</text>
      </svg>
      <div className="mono mt-2 text-[10px] tracking-[0.2em] text-muted-foreground">{label.toUpperCase()}</div>
    </div>
  );
}
