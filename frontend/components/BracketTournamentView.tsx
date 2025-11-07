import React from "react";
import { Competition } from "@/types";

interface BracketTournamentViewProps {
    competition: Competition;
}

const BracketTournamentView: React.FC<BracketTournamentViewProps> = ({
                                                                         competition,
                                                                     }) => {
    if (!competition?.phases?.length) return <p>No phases available</p>;

    const phases = competition.phases;
    const finalsIndex = phases.findIndex(
        (p) => p.name.toLowerCase() === "finals"
    );

    const leftPhases = phases.slice(0, finalsIndex);
    const rightPhases = [...phases.slice(0, finalsIndex)].reverse();
    const finals = phases[finalsIndex];

    const splitRaces = (races: any[]) => {
        const half = Math.ceil(races.length / 2);
        return {
            left: races.slice(0, half),
            right: races.slice(half),
        };
    };

    const preliminaries = phases.find(
        (p) => p.name.toLowerCase() === "preliminaries"
    );
    const heats = phases.find((p) => p.name.toLowerCase() === "heats");

    const SectionTitle = ({ title }: { title: string }) => (
        <h2 className="text-center font-extrabold tracking-wide text-lg md:text-2xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-md mb-5">
            {title}
        </h2>
    );

    // === RACE CARD WITH HYPE BADGE + CLICKABLE SCROLL ===
    const RaceCard = ({
                          title,
                          color = "white",
                          hype,
                          phaseName,
                          raceId,
                      }: {
        title: string;
        color?: string;
        hype?: number;
        phaseName: string;
        raceId: string;
    }) => {
        const isFinal = color === "yellow";
        hype = Math.random() * 10; // TODO: use real hype score

        const hypeColor =
            hype !== undefined
                ? hype < 4
                    ? "from-blue-400 to-cyan-300"
                    : hype < 7
                        ? "from-violet-400 to-pink-400"
                        : "from-orange-400 to-red-500"
                : "from-gray-300 to-gray-400";

        const isHot = hype !== undefined && hype >= 7;

        const anchorId = `${phaseName.toLowerCase().replace(/\s+/g, "-")}-${raceId}`;

        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            const element = document.getElementById(anchorId);
            if (!element) return;

            // Ask PhaseList to open this section
            window.dispatchEvent(
                new CustomEvent("closeAllPhases")
            );
            window.dispatchEvent(
                new CustomEvent("openPhaseSection", { detail: { phaseName } })
            );

            // Delay scroll slightly for smoother UX
            setTimeout(() => {
                const headerOffset = window.innerHeight / 4;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ behavior: "smooth", top: offsetPosition });
                setTimeout(() => {
                    element.classList.add("animate-glow-highlight");
                    setTimeout(() => element.classList.remove("animate-glow-highlight"), 3000);
                }, 200)
            }, 250);
        };

        return (
            <a href={`#${anchorId}`} onClick={handleClick}>
                <div
                    className={`relative px-3 py-3 rounded-md cursor-pointer font-semibold shadow-md transition-all duration-200 group
        ${
                        isFinal
                            ? "bg-gradient-to-br from-yellow-300 to-amber-400 text-blue-900 shadow-yellow-300/30 hover:scale-105"
                            : "bg-white/95 text-blue-900 hover:bg-white hover:shadow-xl hover:-translate-y-[2px]"
                    }`}
                >
                    {title}

                    {hype !== undefined && (
                        <div
                            className={`absolute -top-2 -right-2 text-[10px] font-bold text-white 
              bg-gradient-to-br ${hypeColor} rounded-full px-[6px] py-[2px] shadow-md
              border border-white/40 ${
                                isHot ? "animate-pulse-glow shadow-orange-500/50" : ""
                            }`}
                        >
                            {hype.toFixed(1)}
                        </div>
                    )}
                </div>
            </a>
        );
    };

    const Divider = () => (
        <div className="relative mt-8 mb-4">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[0.5px]" />
        </div>
    );

    return (
        <div className="relative w-full py-12 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-700 text-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[150px] bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-cyan-400/30 blur-3xl rounded-full opacity-50 pointer-events-none" />

            {/* ===== MOBILE VIEW ===== */}
            <div className="block xl:hidden px-6">
                {phases.map((phase, i) => (
                    <div key={i} className="mb-12">
                        <SectionTitle title={phase.name} />
                        <div className="flex flex-wrap justify-center gap-3">
                            {phase.races?.length ? (
                                phase.races.map((race, j) => (
                                    <RaceCard
                                        key={j}
                                        title={race.title}
                                        hype={race.hype_score}
                                        phaseName={phase.name}
                                        raceId={race.id}
                                    />
                                ))
                            ) : (
                                <div className="italic text-gray-300">No races</div>
                            )}
                        </div>
                        {i !== phases.length - 1 && <Divider />}
                    </div>
                ))}
            </div>

            {/* ===== DESKTOP BRACKET VIEW ===== */}
            <div className="hidden xl:flex flex-col items-center space-y-3">
                {/* PRELIMINARIES */}
                {preliminaries && preliminaries.races?.length > 0 && (
                    <div className="w-full px-6 mb-2">
                        <h2 className="text-center font-bold text-lg md:text-xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
                            {preliminaries.name}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-3">
                            {preliminaries.races.map((r, i) => (
                                <RaceCard
                                    key={i}
                                    title={r.title}
                                    hype={r.hype_score}
                                    phaseName={preliminaries.name}
                                    raceId={r.id}
                                />
                            ))}
                        </div>
                        <Divider />
                    </div>
                )}

                {/* HEATS */}
                {heats && heats.races?.length > 0 && (
                    <div className="w-full px-6 mb-2">
                        <h2 className="text-center font-bold text-lg md:text-xl bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-6">
                            {heats.name}
                        </h2>
                        <div className="flex flex-wrap justify-center gap-3 md:gap-3">
                            {heats.races.map((r, i) => (
                                <RaceCard
                                    key={i}
                                    title={r.title}
                                    hype={r.hype_score}
                                    phaseName={heats.name}
                                    raceId={r.id}
                                />
                            ))}
                        </div>
                        <Divider />
                    </div>
                )}

                {/* MAIN BRACKET */}
                <div className="flex justify-center items-center gap-4 px-2 md:px-6">
                    {/* LEFT SIDE */}
                    <div className="flex gap-4 justify-end items-center">
                        {leftPhases.map((phase, i) => {
                            if (
                                ["preliminaries", "heats"].includes(phase.name.toLowerCase())
                            )
                                return null;
                            const { left } = splitRaces(phase.races || []);
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-end justify-center text-center items-center text-xs md:text-sm"
                                >
                                    <h3 className="text-cyan-300 font-semibold text-xs md:text-sm mb-3 tracking-wide opacity-80">
                                        {phase.name}
                                    </h3>
                                    <ul className="flex flex-col gap-3 justify-center">
                                        {left.length ? (
                                            left.map((r, j) => (
                                                <li key={j}>
                                                    <RaceCard
                                                        title={r.title}
                                                        hype={r.hype_score}
                                                        phaseName={phase.name}
                                                        raceId={r.id}
                                                    />
                                                </li>
                                            ))
                                        ) : (
                                            <li className="italic text-gray-300">No races</li>
                                        )}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>

                    {/* FINALS */}
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <h2 className="text-lg md:text-xl font-extrabold tracking-wide bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent drop-shadow-md mb-1">
                            Finals
                        </h2>
                        <ul className="space-y-3">
                            {finals?.races?.length ? (
                                finals.races.map((r, j) => (
                                    <li key={j}>
                                        <RaceCard
                                            title={r.title}
                                            color="yellow"
                                            hype={r.hype_score}
                                            phaseName={finals.name}
                                            raceId={r.id}
                                        />
                                    </li>
                                ))
                            ) : (
                                <li className="italic text-gray-300">No races</li>
                            )}
                        </ul>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex gap-4 justify-start items-center">
                        {rightPhases.map((phase, i) => {
                            if (
                                ["preliminaries", "heats"].includes(phase.name.toLowerCase())
                            )
                                return null;
                            const { right } = splitRaces(phase.races || []);
                            return (
                                <div
                                    key={i}
                                    className="flex flex-col items-start justify-center text-center items-center text-xs md:text-sm"
                                >
                                    <h3 className="text-cyan-300 font-semibold text-xs md:text-sm mb-3 tracking-wide opacity-80">
                                        {phase.name}
                                    </h3>
                                    <ul className="flex flex-col gap-3 justify-center">
                                        {right.length ? (
                                            right.map((r, j) => (
                                                <li key={j}>
                                                    <RaceCard
                                                        title={r.title}
                                                        hype={r.hype_score}
                                                        phaseName={phase.name}
                                                        raceId={r.id}
                                                    />
                                                </li>
                                            ))
                                        ) : (
                                            <li className="italic text-gray-300">No races</li>
                                        )}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BracketTournamentView;
