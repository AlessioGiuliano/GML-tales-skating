import React from 'react';
import { CompetitionHeaderProps } from '../types';

const CompetitionHeader: React.FC<CompetitionHeaderProps> = ({ name, location, dates, season }) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    return (
        <header className="mb-8 text-center animate-fadeInUp">
            <h1 className="text-4xl sm:text-5xl font-display font-extrabold uppercase tracking-wider">{name}</h1>
            <p className="text-xl text-white/80 mt-2">{location} | {formatDate(dates.start)} - {formatDate(dates.end)}, {new Date(dates.end).getFullYear()}</p>
            <p className="text-md text-white/60 uppercase tracking-widest">{season} Season</p>
        </header>
    );
};

export default CompetitionHeader;
