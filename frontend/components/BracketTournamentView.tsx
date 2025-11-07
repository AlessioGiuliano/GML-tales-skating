import React from "react";
import { Competition } from "@/types";

interface BracketTournamentViewProps {
    competition: Competition;
}

const BracketTournamentView: React.FC<BracketTournamentViewProps> = ({ competition }) => {
    if (!competition?.phases?.length) return <p>No phases available</p>;

    const phases = competition.phases;
    const finalsIndex = phases.findIndex((p) => p.name.toLowerCase() === "finals");

    const leftPhases = phases.slice(0, finalsIndex);
    const rightPhases = [...phases.slice(0, finalsIndex)].reverse();
    const finals = phases[finalsIndex];

    const splitRaces = (races: any[]) => {
        const half = Math.ceil(races.length / 2);
        return {
            left: races.slice(0, half),
            right: races.slice(half).reverse(),
        };
    };

    // First-level phases we want horizontally displayed (Preliminaries & Heats)
    const preliminaries = phases.find(p => p.name.toLowerCase() === "preliminaries");
    const heats = phases.find(p => p.name.toLowerCase() === "heats");

    return (
        <div className="relative w-full py-12 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white rounded-2xl">

            {/* ===== MOBILE VIEW (all phases listed horizontally) ===== */}
            <div className="block xl:hidden px-6">
                {phases.map((phase, i) => (
                    <div key={i} className="mb-10">
                        <h2 className="text-lg font-bold mb-4 text-center">{phase.name}</h2>
                        <div className="flex flex-wrap justify-center gap-3">
                            {phase.races?.length ? (
                                phase.races.map((race, j) => (
                                    <div
                                        key={j}
                                        className="bg-white text-blue-900 rounded-md shadow-md px-4 py-2 text-sm font-medium"
                                    >
                                        {race.title}
                                    </div>
                                ))
                            ) : (
                                <div className="italic text-gray-300">No races</div>
                            )}
                        </div>

                        {/* Stylish divider */}
                        {i !== phases.length - 1 && <div className="relative mt-8 mb-6">
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>}
                    </div>
                ))}
            </div>

            {/* ===== DESKTOP VIEW (full bracket) ===== */}
            <div className="hidden xl:flex flex-col">
                {/* PRELIMINARIES */}
                {preliminaries && preliminaries.races?.length > 0 && (
                    <div className="px-6 md:px-12 mb-10">
                        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
                            {preliminaries.name}
                        </h2>

                        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                            {preliminaries.races.map((race, i) => (
                                <div
                                    key={i}
                                    className="bg-white text-blue-900 rounded-md shadow-md px-4 py-2 text-sm md:text-base font-medium"
                                >
                                    {race.title}
                                </div>
                            ))}
                        </div>

                        <div className="relative mt-8 mb-6">
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                    </div>
                )}

                {/* HEATS */}
                {heats && heats.races?.length > 0 && (
                    <div className="px-6 md:px-12 mb-10">
                        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">
                            {heats.name}
                        </h2>

                        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                            {heats.races.map((race, i) => (
                                <div
                                    key={i}
                                    className="bg-white text-blue-900 rounded-md shadow-md px-4 py-2 text-sm md:text-base font-medium"
                                >
                                    {race.title}
                                </div>
                            ))}
                        </div>

                        <div className="relative mt-8 mb-6">
                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                        </div>
                    </div>
                )}

                {/* MAIN BRACKET */}
                <div
                    className="flex justify-center items-center gap-8 px-4 md:px-8
                      overflow-x-auto md:overflow-x-hidden
                      min-w-max md:min-w-0 w-full"
                >
                    {/* LEFT SIDE */}
                    <div className="flex gap-6 justify-end items-center">
                        {leftPhases.map((phase, i) => {
                            if (["preliminaries", "heats"].includes(phase.name.toLowerCase())) return null;
                            const { left } = splitRaces(phase.races || []);
                            return (
                                <div key={i} className="flex flex-col items-end justify-center items-center text-center text-sm md:text-base">
                                    <h2 className="font-semibold mb-2">{phase.name}</h2>
                                    <ul className="flex flex-col gap-2 justify-center">
                                        {left.length ? (
                                            left.map((race, j) => (
                                                <li
                                                    key={j}
                                                    className="bg-white w-max text-blue-900 rounded-md shadow-sm px-3 py-1.5 font-medium"
                                                >
                                                    {race.title}
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
                    <div className="flex flex-col items-center justify-center text-sm md:text-base">
                        <h2 className="text-lg md:text-xl font-bold mb-3">Finals</h2>
                        <ul className="space-y-2">
                            {finals?.races?.length ? (
                                finals.races.map((race, j) => (
                                    <li
                                        key={j}
                                        className="bg-yellow-300 w-max text-blue-900 rounded-md shadow-md px-4 py-2 font-semibold"
                                    >
                                        {race.title}
                                    </li>
                                ))
                            ) : (
                                <li className="italic text-gray-300">No final races</li>
                            )}
                        </ul>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex gap-6 justify-start items-center">
                        {rightPhases.map((phase, i) => {
                            if (["preliminaries", "heats"].includes(phase.name.toLowerCase())) return null;
                            const { right } = splitRaces(phase.races || []);
                            return (
                                <div key={i} className="flex flex-col items-start justify-center items-center text-center text-sm md:text-base">
                                    <h2 className="font-semibold mb-2">{phase.name}</h2>
                                    <ul className="flex flex-col gap-2 justify-center">
                                        {right.length ? (
                                            right.map((race, j) => (
                                                <li
                                                    key={j}
                                                    className="bg-white w-max text-blue-900 rounded-md shadow-sm px-3 py-1.5 font-medium"
                                                >
                                                    {race.title}
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
