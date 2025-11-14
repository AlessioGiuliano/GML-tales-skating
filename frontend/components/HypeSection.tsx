import React from "react";
import { HypeSectionProps } from "../types";

const HypeSection: React.FC<HypeSectionProps> = ({ competition }) => {
    const races = competition.phases
        .map((p) => ({
            ...p,
            races: p.races.map((r) => ({ ...r, phaseName: p.name })),
        }))
        .flatMap((p) => p.races);

    const topRaces = [...races]
        .sort((a, b) => b.hype_score - a.hype_score)
        .slice(0, 3);

    const handleOpenRace = (phaseName: string, raceId: string) => {
        const anchorId = `${phaseName.toLowerCase().replace(/\s+/g, "-")}-${raceId}`;
        const element = document.getElementById(anchorId);
        window.dispatchEvent(new CustomEvent("closeAllPhases"));
        console.log(element)
        if (element) {
            window.dispatchEvent(new CustomEvent("openPhaseSection", { detail: { phaseName } }));

            setTimeout(() => {
                const headerOffset = window.innerHeight / 4;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition =
                    elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ behavior: "smooth", top: offsetPosition });
                setTimeout(() => {
                    element.classList.add("animate-glow-highlight");
                    setTimeout(
                        () => element.classList.remove("animate-glow-highlight"),
                        3000
                    );
                }, 200);
            }, 250);
        }
    };

    const scrollToElement = (element: HTMLElement) => {
        const headerOffset = window.innerHeight / 4;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ behavior: "smooth", top: offsetPosition });
        setTimeout(() => {
            element.classList.add("animate-glow-highlight");
            setTimeout(() => element.classList.remove("animate-glow-highlight"), 3000);
        }, 200);
    };

    return (
        <section className="animate-fadeInUp" style={{ animationDelay: "300ms" }}>
            <h2 className="text-3xl font-extrabold uppercase mb-6">
                Top 3 Most Hyped Races
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topRaces.map((race, index) => (
                    <div
                        key={race.id}
                        onClick={() => handleOpenRace(race.phaseName, race.id)}
                        className="rounded-xl cursor-pointer overflow-hidden relative group aspect-video shadow-lg border border-white/10 hover:scale-[1.02] transition-transform duration-300"
                        style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.3}s both`,
                        }}
                    >
                        <img
                            src={`/thumbnails/top${index + 1}.png`}
                            alt={race.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                            <h3 className="font-bold text-lg leading-tight">
                                {race.phaseName} - {race.title}
                            </h3>
                            <p className="text-sm font-bold text-yellow-400">
                                Hype Score: {race.hype_score.toFixed(1)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HypeSection;
