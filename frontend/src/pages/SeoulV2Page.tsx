import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { CompetitionData } from "../../types";
import { fetchCompetitionData } from "../../api";
import ParticlesBackground from "../../components/ParticlesBackground";
import PhaseNavBar from "../../components/PhaseNavBar";
import BracketTournamentView from "../../components/BracketTournamentView";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SeoulV2Page: React.FC = () => {
    const [data, setData] = useState<CompetitionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBracket, setShowBracket] = useState(false);
    const phasesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const competitionData = await fetchCompetitionData("2024", "seoul", "500m-men");
                setData(competitionData);
            } catch (err) {
                console.error(err);
                setError("Failed to load competition data.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!data) return;
        ScrollTrigger.killAll();

        phasesRef.current.forEach((phaseEl) => {
            if (!phaseEl) return;
            const races = gsap.utils.toArray<HTMLElement>(".race-panel", phaseEl);
            if (!races.length) return;

            const totalWidth = (races.length - 1) * window.innerWidth * 0.25;

            gsap.to(races, {
                xPercent: -100 * (races.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: phaseEl,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: `+=${totalWidth}`,
                },
            });
        });

        ScrollTrigger.refresh();
    }, [data]);

    if (loading)
        return (
            <div className="text-center p-12 text-xl font-semibold animate-pulse">
                Loading competition data...
            </div>
        );

    if (error)
        return <div className="text-center p-12 text-xl text-red-400">{error}</div>;

    if (!data)
        return <div className="text-center p-12 text-xl">No data available.</div>;

    const { competition } = data;
    const supportedTeam = Object.keys(competition.personalized_summaries)[0];
    const imagePath = `/location-photos/${competition.location.toLowerCase().replace(/\s+/g, "-")}.jpg`;

    return (
        <div className="relative font-display text-white overflow-x-hidden">
            <ParticlesBackground />
            <PhaseNavBar phases={competition.phases.map((p) => p.name)} />

            {/* Floating Bracket Button */}
            <div
                className="fixed top-4 right-6 z-[3500] flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 cursor-pointer hover:bg-black/60 transition-all duration-300"
                onClick={() => setShowBracket((p) => !p)}
            >
                <span className="text-cyan-300 font-bold text-sm tracking-wide">BRACKET</span>
                <span
                    className={`text-cyan-300 transform transition-transform duration-300 ${
                        showBracket ? "rotate-180" : ""
                    }`}
                >
          ▼
        </span>
            </div>

            {/* Floating Bracket View (collapsible) */}
            <div
                className={`fixed top-14 left-1/2 -translate-x-1/2 z-[3400] transition-all duration-700 ${
                    showBracket
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{ width: "min(90vw, 1200px)", maxHeight: "80vh", overflowY: "auto" }}
            >
                <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-cyan-300/30 shadow-[0_0_30px_#00d7ff50]">
                    <BracketTournamentView competition={competition} supportedTeam={supportedTeam} />
                </div>
            </div>

            {competition.phases.map((phase, phaseIndex) => (
                <section
                    id={`phase-${phaseIndex}`}
                    key={phase.name}
                    ref={(el) => (phasesRef.current[phaseIndex] = el!)}
                    className="relative h-screen w-[400vw] flex items-center justify-start"
                >
                    {/* Phase title overlay */}
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-center">
                        <h2 className="text-5xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_#00d7ff]">
                            {phase.name}
                        </h2>
                    </div>

                    {phase.races.map((race) => (
                        <div
                            key={race.id}
                            className="race-panel w-[25vw] h-screen flex-shrink-0 relative overflow-hidden flex items-center justify-center"
                            style={{
                                backgroundImage: `url(${imagePath})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-blue-900/40 to-black/60" />
                            <div className="race-content relative z-10 text-center px-6">
                                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_#00d7ff]">
                                    {race.title}
                                </h2>
                                <div
                                    className={`text-lg font-semibold inline-block px-4 py-1 rounded-full ${
                                        race.hype_score > 7
                                            ? "bg-gradient-to-r from-orange-400 to-red-500 animate-pulse-glow"
                                            : race.hype_score > 4
                                                ? "bg-gradient-to-r from-violet-400 to-pink-400"
                                                : "bg-gradient-to-r from-blue-400 to-cyan-300 text-black"
                                    }`}
                                >
                                    Hype {race.hype_score.toFixed(1)}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </div>
    );
};

export default SeoulV2Page;
