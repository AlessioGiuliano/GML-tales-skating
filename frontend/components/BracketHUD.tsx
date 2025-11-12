import React, { useState } from "react";
import { Competition, SupportedTeam } from "../types";
import BracketTournamentView from "./BracketTournamentView";

interface BracketHUDProps {
    competition: Competition;
    supportedTeam?: SupportedTeam | string | null;
}

const BracketHUD: React.FC<BracketHUDProps> = ({ competition, supportedTeam }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating Cyan Button */}
            <button
                onClick={() => setOpen((p) => !p)}
                className={`fixed top-6 right-6 z-[4000] w-14 h-14 flex items-center justify-center rounded-full
          bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_25px_#00d7ff80] border border-white/20
          transition-all duration-500 backdrop-blur-md hover:scale-105 hover:shadow-[0_0_40px_#00e5ff80]`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className={`w-6 h-6 transition-transform duration-500 ${
                        open ? "rotate-180" : "rotate-0"
                    }`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {/* Overlay */}
            <div
                className={`fixed inset-0 z-[3900] bg-black/30 backdrop-blur-sm transition-opacity duration-700 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setOpen(false)}
            />

            {/* Pop-up Bracket View */}
            <div
                className={`fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-[4001] 
          transition-all duration-700 ${
                    open
                        ? "opacity-100 scale-100 pointer-events-auto"
                        : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{
                    width: "min(90vw, 1000px)",
                    maxHeight: "80vh",
                    overflowY: "auto",
                }}
            >
                <div
                    className="relative rounded-3xl border border-cyan-400/30
          bg-gradient-to-b from-[#0d1b4b]/90 via-[#06123a]/90 to-[#02102f]/95
          backdrop-blur-xl shadow-[0_0_40px_#00d7ff60] p-6"
                >
                    <h2 className="text-center text-2xl font-extrabold uppercase mb-6 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-widest">
                        Bracket Overview
                    </h2>

                    <BracketTournamentView
                        competition={competition}
                        supportedTeam={supportedTeam}
                    />

                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-all text-xl"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </>
    );
};

export default BracketHUD;
