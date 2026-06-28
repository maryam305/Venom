import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Upload, ImageIcon, CheckCircle2 } from "lucide-react";
import { StepHeader } from "./StepGeography";

export function StepVision({ onNext, value, onChange }: { onNext: () => void; value: string | null; onChange: (v: string | null) => void }) {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setScanning(true);
      setDone(false);
      onChange(reader.result as string);
      setTimeout(() => {
        setScanning(false);
        setDone(true);
      }, 2200);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="mx-auto min-h-[100svh] max-w-7xl px-6 pt-32 pb-24">
      <StepHeader index={3} title="Vision Analysis" subtitle="Upload an image of the snake. Our neural model isolates morphology and patterns." />

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
                    <div className="mono text-[10px] tracking-[0.25em] text-cyan-300">ANALYZING MORPHOLOGY · PATTERN · SCALE GEOMETRY</div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-cyan-300" />
                    </div>
                  </div>
                </>
              )}
              {done && !scanning && (
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    <span className="mono text-[10px] tracking-[0.2em] text-emerald-300">VISION READY · 94.2% QUALITY</span>
                  </div>
                  <div className="glass mono rounded-full px-3 py-1.5 text-[10px] tracking-[0.2em] text-cyan-300">RESOLUTION OK</div>
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
                <Upload className="h-3 w-3" /> NEURAL MODEL · VENOM-VISION v2
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass-strong rounded-3xl p-6">
            <div className="mono text-[10px] tracking-[0.25em] text-cyan-300/80">MODEL CHECKLIST</div>
            <div className="mt-4 space-y-3">
              {[
                { l: "Pattern recognition", ok: done },
                { l: "Scale row analysis", ok: done },
                { l: "Head morphology", ok: done },
                { l: "Color spectrum", ok: done },
              ].map((c) => (
                <div key={c.l} className="flex items-center justify-between">
                  <span className="text-sm">{c.l}</span>
                  <span className={`mono text-[10px] tracking-[0.2em] ${c.ok ? "text-emerald-300" : "text-muted-foreground"}`}>
                    {c.ok ? "● PASS" : "○ PENDING"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNext}
            className="group flex w-full items-center justify-between rounded-2xl bg-cyan-300 px-6 py-4 font-display text-sm font-semibold text-[#04121b] shadow-[0_0_30px_rgba(0,229,255,0.45)] transition hover:bg-white"
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {value ? "RUN FUSION" : "SKIP · NO IMAGE"}
            </span>
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
