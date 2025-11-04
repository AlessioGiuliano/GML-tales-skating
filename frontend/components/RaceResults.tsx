import React, { useState } from 'react';
import { RaceResultsProps, Result } from '../types';
import CountryFlag from './CountryFlag';

const AthleteBio: React.FC<{ athlete: Result['athlete'] }> = ({ athlete }) => (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-20 p-3 bg-gray-800 border border-gray-600 rounded-lg shadow-xl text-sm text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="font-bold">{athlete.name}</p>
        <p className="text-xs text-white/70">{athlete.team}</p>
        <p className="mt-2 text-white/90">{athlete.bio}</p>
    </div>
);

const RaceResults: React.FC<RaceResultsProps> = ({ results }) => {
    const [expandedResult, setExpandedResult] = useState<number | null>(null);

    const toggleSplits = (rank: number) => {
        setExpandedResult(expandedResult === rank ? null : rank);
    };

    if (results.length === 0) {
        return <p className="text-white/60 p-4 text-center">Results are not yet available.</p>
    }

    return (
        <div className="rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
            <table className="w-full text-left text-sm rounded-lg overflow-x-hidden">
                <thead className="bg-white/10 text-xs uppercase">
                    <tr>
                        <th className="p-3">Rank</th>
                        <th className="p-3">Athlete</th>
                        <th className="p-3">Time</th>
                        <th className="p-3"></th>
                    </tr>
                </thead>
                <tbody>
                {results.map((result) => (
                    <React.Fragment key={result.rank}>
                        <tr className="border-b border-white/10 hover:bg-white/5">
                            <td className="p-3 font-bold text-center">{result.rank}</td>
                            <td className="p-3 group relative">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <CountryFlag country={result.athlete.country} />
                                    <span>{result.athlete.name}</span>
                                </div>
                                <AthleteBio athlete={result.athlete} />
                            </td>
                            <td className="p-3 font-mono">{result.time}</td>
                            <td className="p-3 text-right">
                                {result.splits.length > 0 && <button
                                    onClick={() => toggleSplits(result.rank)}
                                    className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                                    aria-expanded={expandedResult === result.rank}
                                >
                                    Splits
                                </button>}
                            </td>
                        </tr>
                        {expandedResult === result.rank && (
                            <tr className="bg-black/20">
                                <td colSpan={4} className="p-4">
                                    <div className="flex gap-x-4 gap-y-2 flex-wrap text-xs">
                                        {result.splits.map(split => (
                                            <div key={split.lap}>
                                                <span className="opacity-70">Lap {split.lap}: </span>
                                                <span className="font-mono font-semibold">{split.time}s</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RaceResults;
