import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const GEO_URL = "/geo/africa.json";

export interface CountryDossier {
  species: string[];
  risk: number;
  climate: string;
  ecosystem: string;
  infra: number;
}

const DOSSIERS: Record<string, CountryDossier> = {
  Nigeria: { species: ["Echis ocellatus", "Naja nigricollis", "Bitis arietans"], risk: 9, climate: "Tropical savanna", ecosystem: "Savanna · Rainforest", infra: 5 },
  Kenya: { species: ["Dendroaspis polylepis", "Naja ashei", "Bitis arietans"], risk: 8, climate: "Equatorial · semi-arid", ecosystem: "Savanna · Highlands", infra: 6 },
  "South Africa": { species: ["Bitis arietans", "Naja nivea", "Hemachatus haemachatus"], risk: 6, climate: "Mediterranean / semi-arid", ecosystem: "Fynbos · Bushveld", infra: 8 },
  Egypt: { species: ["Cerastes cerastes", "Naja haje", "Walterinnesia aegyptia"], risk: 5, climate: "Hyper-arid desert", ecosystem: "Sahara · Nile basin", infra: 7 },
  Ethiopia: { species: ["Bitis arietans", "Naja pallida", "Echis pyramidum"], risk: 7, climate: "Highland · arid", ecosystem: "Plateau · Rift Valley", infra: 4 },
  Ghana: { species: ["Echis ocellatus", "Naja melanoleuca", "Bitis nasicornis"], risk: 8, climate: "Tropical", ecosystem: "Rainforest · Savanna", infra: 5 },
  Tanzania: { species: ["Dendroaspis polylepis", "Bitis gabonica", "Naja melanoleuca"], risk: 8, climate: "Tropical coastal", ecosystem: "Savanna · Rift Valley", infra: 5 },
  Morocco: { species: ["Cerastes cerastes", "Bitis arietans", "Macrovipera mauritanica"], risk: 4, climate: "Mediterranean / arid", ecosystem: "Atlas · Sahara", infra: 7 },
  Algeria: { species: ["Cerastes cerastes", "Cerastes vipera", "Naja haje"], risk: 5, climate: "Desert · Mediterranean", ecosystem: "Sahara · Tell Atlas", infra: 6 },
  Libya: { species: ["Cerastes cerastes", "Naja haje", "Echis pyramidum"], risk: 5, climate: "Hyper-arid", ecosystem: "Sahara", infra: 4 },
  Sudan: { species: ["Echis pyramidum", "Naja nubiae", "Bitis arietans"], risk: 7, climate: "Arid · semi-arid", ecosystem: "Sahel · Savanna", infra: 3 },
  "Dem. Rep. Congo": { species: ["Dendroaspis jamesoni", "Bitis gabonica", "Atheris squamigera"], risk: 8, climate: "Equatorial humid", ecosystem: "Congo Basin Rainforest", infra: 3 },
  Cameroon: { species: ["Bitis gabonica", "Dendroaspis jamesoni", "Naja melanoleuca"], risk: 7, climate: "Tropical", ecosystem: "Rainforest · Sahel", infra: 4 },
  Mozambique: { species: ["Dendroaspis polylepis", "Bitis arietans", "Naja mossambica"], risk: 8, climate: "Tropical coastal", ecosystem: "Savanna · Mangroves", infra: 4 },
  Angola: { species: ["Bitis arietans", "Naja anchietae", "Dendroaspis polylepis"], risk: 7, climate: "Tropical · arid south", ecosystem: "Savanna · Miombo", infra: 4 },
  Namibia: { species: ["Bitis arietans", "Naja nivea", "Naja anchietae"], risk: 5, climate: "Desert · semi-arid", ecosystem: "Namib · Kalahari", infra: 7 },
  Botswana: { species: ["Dendroaspis polylepis", "Naja anchietae", "Bitis arietans"], risk: 6, climate: "Semi-arid", ecosystem: "Kalahari · Okavango", infra: 7 },
  Zimbabwe: { species: ["Dendroaspis polylepis", "Naja annulifera", "Bitis arietans"], risk: 7, climate: "Tropical highland", ecosystem: "Miombo · Mopane", infra: 5 },
  Zambia: { species: ["Dendroaspis polylepis", "Naja annulifera", "Bitis arietans"], risk: 7, climate: "Tropical savanna", ecosystem: "Miombo · Wetlands", infra: 4 },
  Madagascar: { species: ["Acrantophis madagascariensis", "Sanzinia madagascariensis"], risk: 2, climate: "Tropical · varied", ecosystem: "Endemic rainforest", infra: 4 },
  Uganda: { species: ["Bitis gabonica", "Dendroaspis jamesoni", "Naja melanoleuca"], risk: 7, climate: "Equatorial", ecosystem: "Rainforest · Savanna", infra: 5 },
  Somalia: { species: ["Echis pyramidum", "Naja pallida", "Bitis arietans"], risk: 8, climate: "Hot arid", ecosystem: "Horn savanna · Coast", infra: 2 },
  Mali: { species: ["Echis ocellatus", "Naja katiensis", "Bitis arietans"], risk: 7, climate: "Sahelian · arid", ecosystem: "Sahel · Sahara", infra: 3 },
  Niger: { species: ["Echis ocellatus", "Naja nigricollis", "Cerastes cerastes"], risk: 7, climate: "Sahelian · arid", ecosystem: "Sahel · Sahara", infra: 3 },
  Chad: { species: ["Echis ocellatus", "Naja nigricollis", "Bitis arietans"], risk: 7, climate: "Arid · semi-arid", ecosystem: "Sahel · Sahara", infra: 3 },
  Senegal: { species: ["Echis ocellatus", "Naja nigricollis", "Bitis arietans"], risk: 6, climate: "Sahelian coastal", ecosystem: "Sahel · Mangroves", infra: 5 },
  "Côte d'Ivoire": { species: ["Echis ocellatus", "Bitis nasicornis", "Naja melanoleuca"], risk: 7, climate: "Tropical", ecosystem: "Rainforest · Savanna", infra: 5 },
};

function defaultDossier(name: string): CountryDossier {
  return {
    species: ["Bitis arietans", "Naja spp."],
    risk: 4,
    climate: "Varied",
    ecosystem: "Regional habitat",
    infra: 5,
  };
}

interface Props {
  value: string | null;
  onChange: (name: string) => void;
}

export function AfricaMap({ value, onChange }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const activeName = hover ?? value;

  const [centroidCenter, zoom] = useMemo<[[number, number], number]>(() => {
    if (!value) return [[20, 2], 1];
    return [[20, 2], 1];
  }, [value]);

  return (
    <div className="relative h-full w-full">
      {/* Ambient glow behind continent */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_55%_55%,rgba(0,229,255,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-6 rounded-[40%] shadow-[0_0_120px_30px_rgba(0,229,255,0.08)_inset]" />

      {/* Decorative rings / radar */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="map-grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(0,229,255,0.06)" strokeWidth="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#map-grid)" />
      </svg>

      {/* HUD overlays */}
      <div className="pointer-events-none absolute left-5 top-5 z-10 mono text-[10px] tracking-[0.25em] text-cyan-300/80">
        AFRICA · GEO-INTEL LAYER
      </div>
      <div className="pointer-events-none absolute right-5 top-5 z-10 mono text-[10px] tracking-[0.25em] text-muted-foreground">
        {activeName ? activeName.toUpperCase() : "54 SOVEREIGN STATES"}
      </div>
      <div className="pointer-events-none absolute left-5 bottom-5 z-10 mono text-[10px] tracking-[0.25em] text-muted-foreground">
        PROJ · MERCATOR · CENTERED 20°E
      </div>
      <div className="pointer-events-none absolute right-5 bottom-5 z-10 mono text-[10px] tracking-[0.25em] text-cyan-300/70">
        ◉ LIVE
      </div>

      {/* Corner brackets */}
      {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "left-3 bottom-3 border-l border-b", "right-3 bottom-3 border-r border-b"].map(
        (c, i) => (
          <span key={i} className={`pointer-events-none absolute h-5 w-5 border-cyan-300/40 ${c}`} />
        ),
      )}

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 380, center: [20, 2] }}
        width={800}
        height={800}
        style={{ width: "100%", height: "100%" }}
      >
        <defs>
          <filter id="country-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="country-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ZoomableGroup
          zoom={zoom}
          center={centroidCenter}
          minZoom={1}
          maxZoom={4}
          disablePanning={!value}
          disableZooming={!value}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = geo.properties.name as string;
                const isHover = hover === name;
                const isSelected = value === name;
                const isActive = isHover || isSelected;
                const dim = !!value && !isSelected;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHover(name)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => onChange(name)}
                    style={{
                      default: {
                        fill: isSelected
                          ? "rgba(0,229,255,0.28)"
                          : dim
                            ? "rgba(0,229,255,0.015)"
                            : "rgba(0,229,255,0.04)",
                        stroke: isSelected
                          ? "#7DF9FF"
                          : dim
                            ? "rgba(0,229,255,0.18)"
                            : "rgba(0,229,255,0.5)",
                        strokeWidth: isSelected ? 0.9 : 0.4,
                        outline: "none",
                        filter: isActive ? "url(#country-glow-strong)" : undefined,
                        transition: "all 280ms ease",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: "rgba(0,229,255,0.18)",
                        stroke: "#00E5FF",
                        strokeWidth: 0.8,
                        outline: "none",
                        filter: "url(#country-glow-strong)",
                        cursor: "pointer",
                      },
                      pressed: { outline: "none", fill: "rgba(0,229,255,0.35)" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Pulse marker on selected centroid */}
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              if (!value) return null;
              const sel = geographies.find((g) => g.properties.name === value);
              if (!sel) return null;
              const [cx, cy] = geoCentroid(sel);
              return (
                <g>
                  <circle cx={0} cy={0} r={0} />
                  <PulseAt lon={cx} lat={cy} />
                </g>
              );
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

function PulseAt({ lon, lat }: { lon: number; lat: number }) {
  // Render using a foreignObject-free approach via Marker would need import; use simple SVG with projection via group.
  // Trick: reuse ComposableMap by wrapping inside Marker — but we already are inside Geographies. Use react-simple-maps Marker.
  return <RsmMarker coordinates={[lon, lat]} />;
}

function RsmMarker({ coordinates }: { coordinates: [number, number] }) {
  return (
    <Marker coordinates={coordinates}>
      <circle r={2} fill="#7DF9FF">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle r={4} fill="none" stroke="#00E5FF" strokeWidth="0.6">
        <animate attributeName="r" values="2;14;2" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0;0.9" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </Marker>
  );
}

export function CountryDossierPanel({ name }: { name: string | null }) {
  const dossier = name ? DOSSIERS[name] ?? defaultDossier(name) : null;
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={name ?? "none"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35 }}
        className="glass-strong rounded-3xl p-6"
      >
        <div className="mono text-[10px] tracking-[0.25em] text-cyan-300/80">
          {name ? "COUNTRY DOSSIER" : "SELECT · A COUNTRY"}
        </div>
        <div className="mt-2 font-display text-3xl">{name ?? "Africa"}</div>
        {dossier && (
          <>
            <div className="mt-1 text-sm text-muted-foreground">{dossier.climate}</div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="RISK INDEX" value={`${dossier.risk}/10`} accent />
              <Stat label="MED INFRA" value={`${dossier.infra}/10`} />
            </div>
            <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <div className="mono text-[10px] tracking-[0.2em] text-muted-foreground">ECOSYSTEM</div>
              <div className="mt-1 text-sm">{dossier.ecosystem}</div>
            </div>
            <div className="mt-4">
              <div className="mono mb-2 text-[10px] tracking-[0.2em] text-muted-foreground">NATIVE VENOMOUS</div>
              <div className="space-y-2">
                {dossier.species.map((s) => (
                  <div key={s} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2">
                    <span className="font-display italic">{s}</span>
                    <span className="mono text-[10px] text-cyan-300/80">ENDEMIC</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="mono text-[10px] tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl ${accent ? "text-cyan-300" : "text-white"}`}>{value}</div>
    </div>
  );
}
