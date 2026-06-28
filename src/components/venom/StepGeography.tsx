import { ArrowRight } from "lucide-react";
import { AfricaMap, CountryDossierPanel } from "./AfricaMap";

export function StepGeography({
  onNext,
  value,
  onChange,
}: {
  onNext: () => void;
  value: string | null;
  onChange: (id: string) => void;
}) {
  return (
    <section className="mx-auto min-h-[100svh] max-w-7xl px-6 pt-32 pb-24">
      <StepHeader
        index={1}
        title="Geographic Intelligence"
        subtitle="Where did the encounter occur? Region informs native species and clinical baseline."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass relative aspect-[4/5] overflow-hidden rounded-3xl">
          <AfricaMap value={value} onChange={onChange} />
        </div>

        <div className="space-y-4">
          <CountryDossierPanel name={value} />
          <button
            onClick={onNext}
            disabled={!value}
            className="group flex w-full items-center justify-between rounded-2xl bg-cyan-300 px-6 py-4 font-display text-sm font-semibold text-[#04121b] shadow-[0_0_30px_rgba(0,229,255,0.45)] transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted-foreground disabled:shadow-none"
          >
            CONTINUE · SYMPTOMS <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

export function StepHeader({ index, title, subtitle }: { index: number; title: string; subtitle: string }) {
  return (
    <div>
      <div className="mono text-[10px] tracking-[0.3em] text-cyan-300/80">
        PROTOCOL · STEP {String(index).padStart(2, "0")}
      </div>
      <h2 className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>
    </div>
  );
}
