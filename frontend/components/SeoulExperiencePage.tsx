import React, { useEffect, useState, useRef } from "react";
import { CompetitionData } from "../types";
import { fetchCompetitionData } from "../api";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticlesBackground from "../components/ParticlesBackground";
import BracketHUD from "../components/BracketHUD";

gsap.registerPlugin(ScrollTrigger);

const SeoulExperiencePage: React.FC = () => {
    const [data, setData] = useState<CompetitionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
        if (!data || !containerRef.current) return;

        const sections = gsap.utils.toArray<HTMLElement>(".phase-section");

        sections.forEach((section, i) => {
            gsap.fromTo(
                section.querySelector(".phase-content"),
                { opacity: 0, y: 80 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "top 20%",
                        toggleActions: "play none none reverse",
                    },
                }
            );

            gsap.to(section, {
                backgroundPosition: "50% 100%",
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    scrub: true,
                },
            });
        });
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
    const imagePath = `/location-photos/${competition.location
        .toLowerCase()
        .replace(/\s+/g, "-")}.jpg`;

    const formatDateRange = (start: string, end: string): string => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const sameYear = startDate.getFullYear() === endDate.getFullYear();
        const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
        const startStr = startDate.toLocaleDateString("en-US", opts);
        const endStr = endDate.toLocaleDateString("en-US", opts);
        const year = endDate.getFullYear();
        return sameYear ? `${startStr} – ${endStr}, ${year}` : `${startStr} – ${endStr}`;
    };

    return (
        <div
            ref={containerRef}
            className="relative min-h-screen overflow-x-hidden text-white font-display bg-[#050c26]"
        >
            <ParticlesBackground />
            <BracketHUD competition={competition} supportedTeam={supportedTeam} />

            {/* INTRO */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center brightness-75 scale-105"
                    style={{ backgroundImage: `url(${imagePath})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#000]/50 via-[#0b1e61]/70 to-[#000]/90" />

                <div className="relative z-10 animate-fadeInUp">
                    <h1 className="text-6xl md:text-7xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_#00d7ff] mb-4">
                        {competition.name}
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-cyan-300 font-semibold uppercase tracking-widest mb-4">
                        {competition.location}
                    </h2>
                    <p className="text-lg text-white/80">
                        {formatDateRange(competition.dates.start, competition.dates.end)}
                    </p>
                    <p className="text-md text-white/60 mt-1">{competition.season}</p>
                </div>
            </section>

            {/* EXPERIENCE */}
            <main className="relative flex flex-col">
                {competition.phases.map((phase, i) => (
                    <section
                        key={phase.name}
                        className={`phase-section relative w-full min-h-screen flex items-center justify-center text-center overflow-hidden ${
                            i % 2 === 0 ? "bg-[#0d1b4b]" : "bg-[#081237]"
                        }`}
                    >
                        {/* Backgrounds & layers */}
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-30 -z-10"
                            style={{
                                backgroundImage: `url(${imagePath})`,
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1a50]/80 to-[#02102f]/90 -z-10" />

                        {/* Phase Header */}
                        <div className="absolute top-20 w-full text-center z-20">
                            <h2 className="text-6xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_#00d7ff]">
                                {phase.name}
                            </h2>
                        </div>

                        {/* Races */}
                        <div className="phase-content relative z-10 flex flex-wrap justify-center items-center gap-12 mt-20 max-w-[90%]">
                            {phase.races.map((race, j) => (
                                <div
                                    key={race.id}
                                    className="group relative w-[40vw] max-w-[500px] h-[60vh] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.05]"
                                    style={{
                                        backgroundImage: `url(${imagePath})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/60 transition-all duration-500" />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.15),transparent_70%)]" />
                                    <div className="absolute bottom-8 left-8 right-8 text-left">
                                        <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_#00d7ff]">
                                            {race.title}
                                        </h3>
                                        <p className="text-white/80 text-sm">
                                            Hype Score{" "}
                                            <span
                                                className={`font-bold ${
                                                    race.hype_score > 7
                                                        ? "text-orange-400"
                                                        : race.hype_score > 4
                                                            ? "text-pink-400"
                                                            : "text-cyan-300"
                                                }`}
                                            >
                        {race.hype_score.toFixed(1)}
                      </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subtle parallax light */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.12),transparent_60%)] blur-3xl" />
                    </section>
                ))}
            </main>

            {/* ENDING */}
            <section className="relative h-screen flex flex-col justify-center items-center text-center bg-gradient-to-b from-[#001533] to-[#00193f]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,215,255,0.2),transparent_70%)] blur-3xl" />
                <h2 className="text-5xl md:text-6xl font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
                    The Journey Continues
                </h2>
                <p className="text-white/70 max-w-2xl text-lg">
                    Experience every race, every victory, every heartbeat.
                    This is short track — reimagined as pure emotion and energy.
                </p>
            </section>
        </div>
    );
};

export default SeoulExperiencePage;
