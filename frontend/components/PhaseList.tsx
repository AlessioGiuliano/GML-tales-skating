import React, { useEffect, useState } from "react";
import { PhaseListProps } from "../types";
import RaceResults from "./RaceResults";

const RaceVideo: React.FC<{ title: string, video_url: string }> = ({ title, video_url }) => {
    return (
        <video
            key={video_url}
            controls
            // autoPlay
            loop
            muted
            className="w-full rounded-lg border border-blue-500/30 shadow-md"
        >
            <source src={video_url} type="video/webm" />
            Your browser does not support the video tag.
        </video>
    );
};

const PhaseList: React.FC<PhaseListProps> = ({ phases, selectedTeam }) => {
    const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({});

    const togglePhase = (name: string) => {
        setOpenPhases((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    useEffect(() => {
        const handleOpen = (e: Event) => {
            const { phaseName } = (e as CustomEvent).detail;
            setOpenPhases({ [phaseName]: true });
        };

        const handleCloseAll = () => {
            setOpenPhases({});
        };

        window.addEventListener("openPhaseSection", handleOpen);
        window.addEventListener("closeAllPhases", handleCloseAll);

        return () => {
            window.removeEventListener("openPhaseSection", handleOpen);
            window.removeEventListener("closeAllPhases", handleCloseAll);
        };
    }, []);

    return (
        <section className="animate-fadeInUp" style={{ animationDelay: "200ms" }}>
            {phases.map((phase) => {
                const isOpen = openPhases[phase.name];
                const anchorId = phase.name.toLowerCase().replace(/\s+/g, "-");

                return (
                    <div
                        key={phase.name}
                        id={anchorId}
                        className="mb-10 border-b border-blue-500/30 pb-2"
                    >
                        <button
                            onClick={() => togglePhase(phase.name)}
                            className="w-full flex items-center justify-between text-left group transition-all duration-200"
                        >
                            <h2 className="text-2xl sm:text-3xl font-extrabold uppercase mb-2 flex-1 bg-gradient-to-r from-blue-300 to-cyan-400 bg-clip-text text-transparent">
                                {phase.name}
                            </h2>
                            <span
                                className={`text-blue-300 text-2xl transform transition-transform duration-300 group-hover:text-cyan-300 ${
                                    isOpen ? "rotate-180" : "rotate-0"
                                }`}
                            >
                                ▼
                            </span>
                        </button>

                        <div
                            className={`transition-all duration-1000 ${
                                isOpen ? "opacity-100 mt-4" : "hidden opacity-0"
                            }`}
                        >
                            {phase.races.map((race) => {
                                const summary = race.personalized_summaries[selectedTeam];
                                const raceAnchor = `${anchorId}-${race.id}`;

                                return (
                                    <div
                                        key={race.id}
                                        id={raceAnchor}
                                        className={`mb-10 p-4 sm:p-6 rounded-lg transition-all duration-500
                                            ${
                                            race.hype_score > 7
                                                ? "bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/40 shadow-lg shadow-orange-500/30 hover:shadow-orange-400/50 animate-pulse-glow"
                                                : "bg-white/5 hover:bg-white/10 border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <h3 className="text-xl sm:text-2xl font-bold text-cyan-300">
                                                {race.title}
                                            </h3>

                                            {race.hype_score !== undefined && (
                                                <div className="flex flex-row gap-2 ml-auto items-center">
                                                    <div>Hype score</div>
                                                    <div
                                                        className={`text-[16px] font-bold text-white bg-gradient-to-br rounded-full px-[12px] py-[2px] shadow-md border border-white/40 ${
                                                            race.hype_score < 4
                                                                ? "from-blue-400 to-cyan-300"
                                                                : race.hype_score < 7
                                                                    ? "from-violet-400 to-pink-400"
                                                                    : "from-orange-400 to-red-500 animate-pulse-glow shadow-orange-500/50"
                                                        }`}
                                                    >
                                                        {race.hype_score.toFixed(1)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {summary && (
                                            <div className="mb-6 p-4 rounded-md text-sm bg-black/30">
                                                <h4 className="font-bold text-base text-white/90">
                                                    {summary.title}
                                                </h4>
                                                <p className="text-white/70">{summary.text}</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3 text-blue-300">
                                                    Race Video
                                                </h4>
                                                <RaceVideo title={race.title} video_url={race.video_url} />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold mb-3 text-blue-300">
                                                    Results
                                                </h4>
                                                <RaceResults results={race.results} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default PhaseList;
