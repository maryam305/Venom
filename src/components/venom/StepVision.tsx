import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Upload, ImageIcon, CheckCircle2, AlertCircle, Dna, Crosshair, Fingerprint, Palette } from "lucide-react";
import { StepHeader } from "./StepGeography";
import { classifySnakeImage, type ClassifyResult } from "@/lib/api";

interface Props {
  onNext: () => void;
  value: string | null;
  onChange: (v: string | null) => void;
  imageFile: File | null;
  onFileChange: (f: File | null) => void;
  visionResult: ClassifyResult | null;
  onVisionResult: (r: ClassifyResult | null) => void;
}

export function StepVision({ onNext, value, onChange, imageFile, onFileChange, visionResult, onVisionResult }: Props) {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(!!value && !!visionResult);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Store the file for later API use
    onFileChange(file);
    setError(null);

    // Display the image preview
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Run classification against backend
    setScanning(true);
    setDone(false);
    onVisionResult(null);

    try {
      const result = await classifySnakeImage(file);
      onVisionResult(result);
      setDone(true);
    } catch (err: any) {
      console.error("Vision classification error:", err);
      setError(err.message ?? "Classification failed");
      setDone(true);
    } finally {
      setScanning(false);
    }
  };

  const confidencePercent = visionResult ? (visionResult.confidence * 100).toFixed(1) : null;

  return (
    <section className="mx-auto min-h-[100svh] max-w-7xl px-6 pt-32 pb-24">
      <StepHeader index={3} title="Vision Analysis" subtitle="Upload an image of the snake. Our EfficientNet-B0 neural model isolates morphology and patterns across 6 African species." />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          onClick={() => inputRef.current?.click()}
          className="glass group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-cyan-300/20 transition hover:border-cyan-300/50"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {/* Corner brackets */}
          {["top-4 left-4 border-l-2 border-t-2", "top-4 right-4 border-r-2 border-t-2", "bottom-4 left-4 border-l-2 border-b-2", "bottom-4 right-4 border-r-2 border-b-2"].map((c) => (
            <div key={c} className={`absolute h-6 w-6 border-cyan-300/60 ${c}`} />
          ))}

          {value ? (
            <>
              <img src={value} alt="snake" className="absolute inset-0 h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04121b]/80 via-transparent to-[#04121b]/40" />
              {scanning && (
                <>
                  <motion.div
                    initial={{ y: "-100%" }}
                    animate={{ y: "100%" }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-b from-cyan-300/0 via-cyan-300 to-cyan-300/0 shadow-[0_0_24px_rgba(0,229,255,0.9)]"
                  />
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="mono text-[10px] tracking-[0.25em] text-cyan-300">ANALYZING MORPHOLOGY · EFFICIENTNET-B0 INFERENCE</div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-cyan-300" />
                    </div>
                  </div>
                </>
              )}
              {done && !scanning && visionResult && (
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center justify-between">
                    <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                      <span className="mono text-[10px] tracking-[0.2em] text-emerald-300">
                        IDENTIFIED · {confidencePercent}% CONF
                      </span>
                    </div>
                    <div className="glass mono rounded-full px-3 py-1.5 text-[10px] tracking-[0.2em] text-cyan-300">
                      {visionResult.common_name.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
              {done && !scanning && error && (
                <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2">
                  <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-300" />
                    <span className="mono text-[10px] tracking-[0.2em] text-amber-300">VISION OFFLINE · SYNDROMIC MODE</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative flex flex-col items-center gap-4 text-center">
              {/* Outline snake illustration */}
              <svg width="200" height="120" viewBox="0 0 200 120" fill="none" className="text-cyan-300/40">
                <path d="M10 80 Q40 20 80 60 Q120 100 160 50 Q180 30 195 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="195" cy="50" r="3" fill="currentColor" />
              </svg>
              <div>
                <div className="font-display text-2xl">Drop snake image here</div>
                <div className="mt-1 text-sm text-muted-foreground">or click to browse · JPG / PNG / HEIC</div>
              </div>
              <div className="mono mt-2 flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] tracking-[0.2em] text-cyan-300 neon-border">
                <Upload className="h-3 w-3" /> NEURAL MODEL · EFFICIENTNET-B0
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Model Info Panel */}
          <div className="glass-strong rounded-3xl p-6">
            <div className="mono text-[10px] tracking-[0.25em] text-cyan-300/80">
              {visionResult ? "CLASSIFICATION RESULT" : "MODEL CHECKLIST"}
            </div>

            {visionResult ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/5 p-4">
                  <div className="font-display text-2xl italic">{visionResult.species_scientific}</div>
                  <div className="mono mt-1 text-[10px] tracking-[0.2em] text-cyan-300">{visionResult.common_name.toUpperCase()}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="mono text-[9px] tracking-[0.2em] text-muted-foreground">CONFIDENCE</div>
                    <div className="mt-1 font-display text-xl text-cyan-300">{confidencePercent}%</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="mono text-[9px] tracking-[0.2em] text-muted-foreground">VENOM RISK</div>
                    <div className={`mt-1 font-display text-xl ${visionResult.venom_risk === "Very high" ? "text-rose-300" : "text-amber-300"}`}>
                      {visionResult.venom_risk}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="mono text-[9px] tracking-[0.2em] text-muted-foreground">VENOM ACTION</div>
                  <div className="mt-1 text-sm">{visionResult.venom_action}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="mono text-[9px] tracking-[0.2em] text-muted-foreground">FANG TYPE</div>
                  <div className="mt-1 text-sm">{visionResult.fang_type}</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="mono text-[9px] tracking-[0.2em] text-muted-foreground">CLINICAL NOTE</div>
                  <div className="mt-1 text-xs text-muted-foreground">{visionResult.clinical_note}</div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {[
                  { l: "Pattern recognition", icon: Fingerprint, ok: done && !error },
                  { l: "Scale row analysis", icon: Crosshair, ok: done && !error },
                  { l: "Head morphology", icon: Dna, ok: done && !error },
                  { l: "Color spectrum", icon: Palette, ok: done && !error },
                ].map((c) => (
                  <div key={c.l} className="flex items-center justify-between">
                    <span className="text-sm">{c.l}</span>
                    <span className={`mono text-[10px] tracking-[0.2em] ${c.ok ? "text-emerald-300" : "text-muted-foreground"}`}>
                      {c.ok ? "● PASS" : "○ PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="glass-strong rounded-2xl border border-amber-400/20 p-4">
              <div className="flex items-center gap-2 text-amber-300">
                <AlertCircle className="h-4 w-4" />
                <span className="mono text-[10px] tracking-[0.2em]">BACKEND OFFLINE</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Vision model unreachable. The clinical engine will proceed in <strong className="text-amber-200">syndromic-only mode</strong> using geography and symptoms.
              </p>
            </div>
          )}

          <button
            onClick={onNext}
            className="group flex w-full items-center justify-between rounded-2xl bg-cyan-300 px-6 py-4 font-display text-sm font-semibold text-[#04121b] shadow-[0_0_30px_rgba(0,229,255,0.45)] transition hover:bg-white"
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {visionResult ? "RUN FUSION · SPECIES IDENTIFIED" : value ? "RUN FUSION · VISION PENDING" : "SKIP · NO IMAGE"}
            </span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
