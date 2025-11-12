import React, { useState } from "react";
import BracketTournamentView from "../components/BracketTournamentView";
import { Competition } from "../types";

const BracketPopup: React.FC<{
    competition: Competition;
    supportedTeam: string;
}> = ({ competition, supportedTeam }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* === Mini floating preview (top center) === */}
            <div
                onClick={() => setOpen(true)}
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-[2000] cursor-pointer rounded-full px-6 py-3 
        bg-gradient-to-r from-cyan-400/90 to-blue-500/90 shadow-[0_0_20px_#00bfff50] border border-white/20
        backdrop-blur-md transition-all duration-500 ${
                    open ? "opacity-0 pointer-events-none scale-90" : "opacity-100 hover:scale-105"
                }`}
            >
                <div className="flex items-center justify-center gap-2 text-white font-semibold tracking-wide">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white/90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h8m-8 6h16"
                        />
                    </svg>
                    Bracket Overview
                </div>
            </div>

            {/* === Backdrop === */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1999] opacity-100 animate-fadeIn"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* === Expanded view === */}
            <div
                className={`fixed top-8 left-1/2 -translate-x-1/2 w-[95vw] md:w-[80vw] lg:w-[70vw] h-[85vh]
        bg-gradient-to-b from-blue-950 via-blue-900 to-blue-800 rounded-3xl shadow-[0_0_40px_#00bfff40]
        border border-white/10 overflow-y-auto z-[2001] backdrop-blur-xl transition-all duration-500
        ${open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}`}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-blue-950/70 backdrop-blur-xl rounded-t-3xl">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        Competition Bracket
                    </h3>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-white/80 hover:text-white transition-colors text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <BracketTournamentView
                        competition={competition}
                        supportedTeam={supportedTeam}
                    />
                </div>
            </div>
        </>
    );
};

export default BracketPopup;
