import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useMemo } from "react";
import { AmbientBackground } from "@/components/venom/AmbientBackground";
import { TopBar } from "@/components/venom/TopBar";
import { Hero } from "@/components/venom/Hero";
import { StepGeography } from "@/components/venom/StepGeography";
import { StepSymptoms } from "@/components/venom/StepSymptoms";
import { StepVision } from "@/components/venom/StepVision";
import { StepFusion } from "@/components/venom/StepFusion";
import { StepResults } from "@/components/venom/StepResults";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "VENOM.AI — Multimodal Snakebite Intelligence" },
            { name: "description", content: "Hybrid multimodal AI decision support for African snakebite emergencies." },
            { property: "og:title", content: "VENOM.AI — Multimodal Snakebite Intelligence" },
            { property: "og:description", content: "Hybrid multimodal AI decision support for African snakebite emergencies." },
        ],
    }),
    component: Index,
});

function Index() {
    const [step, setStep] = useState(0);
    const [geography, setGeography] = useState < string | null > (null);
    const [symptoms, setSymptoms] = useState < string[] > ([]);
    const [image, setImage] = useState < string | null > (null);

    const emergency = useMemo(
        () => symptoms.some((s) => ["paralysis", "breathing", "necrosis"].includes(s)),
        [symptoms],
    );

    const reset = () => {
        setStep(0);
        setGeography(null);
        setSymptoms([]);
        setImage(null);
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <AmbientBackground emergency={emergency} />
            <TopBar step={step} emergency={emergency} />

            <main className="relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {step === 0 && <Hero onStart={() => setStep(1)} />}
                        {step === 1 && (
                            <StepGeography value={geography} onChange={setGeography} onNext={() => setStep(2)} />
                        )}
                        {step === 2 && (
                            <StepSymptoms value={symptoms} onChange={setSymptoms} onNext={() => setStep(3)} />
                        )}
                        {step === 3 && (
                            <StepVision value={image} onChange={setImage} onNext={() => setStep(4)} />
                        )}
                        {step === 4 && <StepFusion onDone={() => setStep(5)} />}
                        {step === 5 && (
                            <StepResults
                                geography={geography}
                                symptoms={symptoms}
                                hasImage={!!image}
                                onReset={reset}
                                emergency={emergency}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="relative z-10 border-t border-white/5 px-6 py-6">
                <div className="mono mx-auto flex max-w-7xl items-center justify-between text-[10px] tracking-[0.2em] text-muted-foreground">
                    <span>VENOM.AI · MULTIMODAL DECISION SUPPORT</span>
                    <span>FOR RESEARCH USE · NOT A SUBSTITUTE FOR CLINICAL JUDGMENT</span>
                </div>
            </footer>
        </div>
    );
}
