import { motion } from "framer-motion";
import { useMemo } from "react";

export function AmbientBackground({ emergency = false }: { emergency?: boolean }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        d: 8 + Math.random() * 14,
        s: 1 + Math.random() * 2.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      {/* Radar sweep */}
      <div className="absolute -top-40 -right-40 h-[720px] w-[720px] rounded-full">
        <div className="absolute inset-0 rounded-full border border-cyan-400/10" />
        <div className="absolute inset-8 rounded-full border border-cyan-400/10" />
        <div className="absolute inset-20 rounded-full border border-cyan-400/10" />
        <div className="absolute inset-0 animate-radar origin-center">
          <div
            className="absolute left-1/2 top-1/2 h-1/2 w-1/2 origin-top-left"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(0,229,255,0.25), rgba(0,229,255,0) 40%)",
            }}
          />
        </div>
      </div>

      {/* Light beams */}
      <div className="absolute left-0 top-1/3 h-px w-full overflow-hidden">
        <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent animate-beam" />
      </div>
      <div className="absolute left-0 top-2/3 h-px w-full overflow-hidden">
        <div className="h-px w-1/4 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent animate-beam" style={{ animationDelay: "3s" }} />
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute h-1 w-1 rounded-full bg-cyan-300/70"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: "0 0 8px rgba(0,229,255,0.8)",
            animation: `pulse-glow ${p.d}s ease-in-out infinite`,
            animationDelay: `${p.s}s`,
          }}
        />
      ))}

      {/* Faint African contour - decorative */}
      <svg className="absolute -bottom-20 left-1/2 -translate-x-1/2 opacity-[0.06]" width="900" height="900" viewBox="0 0 200 200" fill="none">
        <path d="M100 10 C140 30 160 70 150 110 C145 140 130 165 110 180 C90 188 70 180 60 160 C40 130 50 90 65 60 C75 35 85 18 100 10 Z" stroke="#00E5FF" strokeWidth="0.5" />
      </svg>

      {/* Emergency pulse overlay */}
      {emergency && (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.0, 0.15, 0.0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,53,94,0.35), transparent 60%)",
          }}
        />
      )}
    </div>
  );
}
