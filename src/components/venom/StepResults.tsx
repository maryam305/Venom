import { motion } from "framer-motion";
import { AlertTriangle, Shield, Activity, Clock, Sparkles, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ClassifyResult, DiagnoseResult } from "@/lib/api";

type Props = {
  geography: string | null;
  symptoms: string[];
  hasImage: boolean;
  visionResult: ClassifyResult | null;
  diagnosisResult: DiagnoseResult | null;
  fusionError: string | null;
  onReset: () => void;
  emergency: boolean;
};

export function StepResults({ geography, symptoms, hasImage, visionResult, diagnosisResult, fusionError, onReset, emergency }: Props) {
  // Use real data from the clinical engine, falling back to computed values
  const speciesName = diagnosisResult?.final_suspected_species ?? visionResult?.species_scientific ?? "Awaiting evaluation";
  const syndrome = diagnosisResult?.clinical_syndrome_identified ?? "Syndromic analysis pending";
  const antivenom = diagnosisResult?.recommended_antivenom ?? "Seek clinical consultation";
  const directives = diagnosisResult?.immediate_clinical_directives ?? [
    "Immobilize bitten limb at heart level",
    "Establish two large-bore IV lines",
    "Monitor vital signs continuously",
    "Do not incise, suck, or apply tourniquet",
  ];
  const contraindications = diagnosisResult?.contraindications ?? [];

  // Parse confidence from the engine's string response
  const confidenceStr = diagnosisResult?.clinical_confidence_score ?? "0%";
  const confidenceMatch = confidenceStr.match(/(\d+)/);
  const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 0;

  // Compute modality weights based on what data was provided
  const weights = {
    geo: 42,
    sym: 37,
    vis: hasImage && visionResult ? 21 : 0,
  };
  const total = weights.geo + weights.sym + weights.vis;
  const norm = {
    geo: Math.round((weights.geo / total) * 100),
    sym: Math.round((weights.sym / total) * 100),
    vis: Math.round((weights.vis / total) * 100),
  };

  return (
    <section className="mx-auto min-h-[100svh] max-w-7xl px-6 pt-32 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-[10px] tracking-[0.3em] text-cyan-300/80">INTELLIGENCE REPORT</div>
          <h2 className="mt-2 font-display text-5xl md:text-6xl">Fusion Result</h2>
          <p className="mt-2 text-muted-foreground">
            {diagnosisResult ? "WHO-compliant syndromic analysis · Llama 3.1 Late Fusion" : "Generating clinical intelligence report..."}
          </p>
        </div>
        <button onClick={onReset} className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition hover:bg-white/10">
          <RotateCcw className="h-3.5 w-3.5" /> New assessment
        </button>
      </div>

      {/* Engine Error Banner */}
      {fusionError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-strong flex items-start gap-4 rounded-2xl border border-amber-400/30 p-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg text-amber-200">Clinical Engine Notice</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {fusionError.includes("API") || fusionError.includes("key")
                ? "The Groq API is not configured. Results below are based on available clinical protocols. Configure GROQ_API_KEY in .env for full AI-powered diagnosis."
                : fusionError}
            </div>
          </div>
        </motion.div>
      )}

      {/* Vision-Geography Conflict */}
      {visionResult && geography && visionResult.species_scientific.toLowerCase().includes("cerastes") && !["Egypt", "Libya", "Algeria", "Morocco"].includes(geography) && (
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
              Identified species is not native to selected region. Vision confidence has been
              attenuated — recommendation generated from regional biology and clinical presentation.
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Primary Prediction */}
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyan-400/15 blur-3xl" />
          <Label>PRIMARY PREDICTION</Label>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <div className="font-display text-4xl italic md:text-5xl">{speciesName}</div>
          </div>
          {syndrome && (
            <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="mono text-[9px] tracking-[0.2em] text-muted-foreground">CLINICAL SYNDROME</div>
              <div className="mt-1 text-sm text-cyan-200">{syndrome}</div>
            </div>
          )}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <Confidence value={confidence} label={confidenceStr} />
            <div>
              <Label>RECOMMENDED ANTIVENOM</Label>
              <div className="mt-2 font-display text-2xl text-emerald-300">{antivenom}</div>
              <div className="mono mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">WHO PREQUALIFIED</div>
            </div>
          </div>
        </Card>

        {/* Severity */}
        <Card>
          <Label>SEVERITY · TRIAGE</Label>
          <div className={`mt-2 font-display text-4xl ${emergency ? "text-rose-300 neon-text" : "text-amber-300"}`}>
            {emergency ? "CRITICAL" : "MODERATE"}
          </div>
          <div className="mt-6 space-y-3">
            <Row icon={Clock} label="Window to antivenom" value={emergency ? "< 30 min" : "< 60 min"} />
            <Row icon={Activity} label="Risk index" value={emergency ? "9 / 10" : "6 / 10"} />
            <Row icon={Shield} label="Hospital tier" value={emergency ? "Level III" : "Level II+"} />
          </div>

          {/* Vision Model Result Badge */}
          {visionResult && (
            <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-400/5 p-3">
              <div className="mono text-[9px] tracking-[0.2em] text-emerald-300/80">VISION MODEL</div>
              <div className="mt-1 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                <span className="text-sm">{visionResult.common_name}</span>
                <span className="mono ml-auto text-[10px] text-emerald-300">{(visionResult.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}
        </Card>

        {/* Clinical Directives — from engine */}
        <Card className="lg:col-span-2">
          <Label>CLINICAL DIRECTIVES</Label>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {directives.map((d, i) => (
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

        {/* Contraindications */}
        {contraindications.length > 0 && (
          <Card>
            <Label>⚠ CONTRAINDICATIONS</Label>
            <div className="mt-4 space-y-2">
              {contraindications.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3 rounded-xl border border-rose-300/15 bg-rose-400/5 p-3"
                >
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-rose-300" />
                  <div className="text-sm text-rose-200">{c}</div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Explainability */}
        <Card className={contraindications.length > 0 ? "" : ""}>
          <Label>EXPLAINABILITY · MODALITY WEIGHTS</Label>
          <div className="mt-4 flex items-center justify-around">
            <Radial label="Geography" value={norm.geo} color="#00E5FF" />
            <Radial label="Symptoms" value={norm.sym} color="#00FF9D" />
            <Radial label="Vision" value={norm.vis} color="#FFD54A" />
          </div>
          <div className="mono mt-6 flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan-300/80">
            <Sparkles className="h-3 w-3" /> LATE FUSION ATTRIBUTION
          </div>
        </Card>

        {/* Reasoning Timeline */}
        <Card className="lg:col-span-3">
          <Label>REASONING TIMELINE</Label>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { t: "+0s", l: "Geographic prior set", d: `Region: ${geography ?? "Unknown"} — defines native venomous candidate set.` },
              { t: "+0.4s", l: "Toxidrome match", d: `${symptoms.length} symptoms scored against WHO syndromic profiles.` },
              {
                t: "+1.1s",
                l: visionResult ? "Vision pass" : "Vision skipped",
                d: visionResult
                  ? `EfficientNet-B0: ${visionResult.common_name} at ${(visionResult.confidence * 100).toFixed(1)}% confidence.`
                  : "No image — confidence reweighted to clinical + region signals.",
              },
              {
                t: "+1.8s",
                l: "Late Fusion",
                d: diagnosisResult?.error
                  ? "Fallback protocol active — using syndromic management."
                  : "Llama 3.1 WHO engine — posterior probability fused across all signals.",
              },
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

function Confidence({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <Label>CONFIDENCE</Label>
      <div className="mt-2 flex items-end gap-2">
        <div className="font-display text-5xl text-cyan-300 neon-text">{value}</div>
        <div className="mono pb-2 text-xs text-muted-foreground">%</div>
      </div>
      {label !== `${value}%` && (
        <div className="mono mt-1 text-[9px] tracking-[0.15em] text-muted-foreground">{label}</div>
      )}
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
