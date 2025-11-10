import React from "react";
import { CompetitionSummaryProps, Team } from "../types";
import { TEAMS } from "../constants";

interface ExtendedProps extends CompetitionSummaryProps {
    supportedTeam?: string | null;
}

const CompetitionSummary: React.FC<ExtendedProps> = ({ summary, supportedTeam }) => {
    if (!summary) return null;

    const foundTeam = TEAMS.find((t: Team) => t.iso_name === supportedTeam);
    const teamTextColor = foundTeam?.textColor || "#fff";
    const teamBgColor = foundTeam?.bgColor || "rgba(255,255,255,0.25)";
    const teamName = foundTeam?.name || "Your Team";

    return (
        <section
            className="p-6 py-12 animate-fadeInUp relative overflow-hidden rounded-3xl shadow-2xl"
            style={{
                animationDelay: "150ms",
                background: "linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid rgba(255, 255, 255, 0.12)`,
            }}
        >
            {/* Soft glowing team-colored accent */}
            <div
                className="absolute inset-0 opacity-30 blur-2xl"
                style={{
                    background: `radial-gradient(circle at top left, ${teamBgColor} 0%, transparent 70%)`,
                }}
            />

            <h2 className="text-2xl md:text-3xl text-center font-extrabold mb-3 relative z-10 text-white">
                The{" "}
                <span
                    style={{
                        color: teamTextColor,
                        textShadow: `0 0 15px ${teamBgColor}`,
                    }}
                >
                    {teamName}
                </span>{" "}
                Summary
            </h2>

            <div className="relative z-10 max-w-3xl mx-auto mt-6">
                <h3 className="text-lg font-semibold text-white/90 mb-2">{summary.title}</h3>
                <p className="text-white/85 leading-relaxed">{summary.text}</p>
            </div>
        </section>
    );
};

export default CompetitionSummary;
