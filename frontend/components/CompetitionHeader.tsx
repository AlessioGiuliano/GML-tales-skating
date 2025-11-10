import React from "react";
import { CompetitionHeaderProps } from "../types";

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({
                                                                 name,
                                                                 location,
                                                                 dates,
                                                                 season,
                                                             }) => {
    const formatDateRange = (start: string, end: string): string => {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const sameMonth = startDate.getMonth() === endDate.getMonth();
        const sameYear = startDate.getFullYear() === endDate.getFullYear();

        const monthOptions: Intl.DateTimeFormatOptions = { month: "long" };
        const dayOptions: Intl.DateTimeFormatOptions = { day: "numeric" };

        const startMonth = startDate.toLocaleDateString("en-US", monthOptions);
        const endMonth = endDate.toLocaleDateString("en-US", monthOptions);
        const startDay = startDate.toLocaleDateString("en-US", dayOptions);
        const endDay = endDate.toLocaleDateString("en-US", dayOptions);
        const year = endDate.getFullYear();

        if (sameMonth && sameYear) {
            return `${startMonth} ${startDay}–${endDay}, ${year}`;
        } else if (sameYear) {
            return `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
        } else {
            return `${startMonth} ${startDay}, ${startDate.getFullYear()} – ${endMonth} ${endDay}, ${year}`;
        }
    };

    const imagePath = `/location-photos/${location
        .toLowerCase()
        .replace(/\s+/g, "-")}.jpg`;

    return (
        <header className="relative mb-10 text-center rounded-3xl overflow-hidden shadow-xl animate-fadeInUp">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePath})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70" />

            <div className="relative z-10 py-16 px-6">
                <h1 className="text-4xl sm:text-5xl font-display font-extrabold uppercase tracking-wider bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                    {name} — {location}
                </h1>
                <p className="text-xl text-white/80 mt-3">
                    {formatDateRange(dates.start, dates.end)}
                </p>
            </div>
        </header>
    );
};

export default CompetitionHeader;
