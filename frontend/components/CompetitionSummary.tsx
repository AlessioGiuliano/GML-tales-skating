import React from 'react';
import { CompetitionSummaryProps } from '../types';

const CompetitionSummary: React.FC<CompetitionSummaryProps> = ({ summary }) => {
    if (!summary) return null;

    return (
        <section
            className="p-6 rounded-xl animate-fadeInUp"
            style={{
                animationDelay: '100ms',
                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
        >
            <h2 className="text-2xl font-bold mb-2">{summary.title}</h2>
            <p className="text-white/90 leading-relaxed">{summary.text}</p>
        </section>
    );
};

export default CompetitionSummary;
