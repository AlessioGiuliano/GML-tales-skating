import React from 'react';
import { CompetitionCardProps } from '../types';

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, index, onViewCompetition }) => {
  return (
    <button
      onClick={() => onViewCompetition(competition)}
      className="rounded-xl p-6 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2 text-left w-full"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      }}
    >
      <div>
        <p className="font-bold text-sm opacity-80 mb-1 uppercase">{competition.title}</p>
        <h3 className="text-2xl font-extrabold font-display uppercase leading-tight">{competition.location}</h3>
        {competition.details && <p className="text-sm opacity-70 mb-2">{competition.details}</p>}
        <p className="text-md opacity-90">{competition.country}</p>
      </div>
      <div className="mt-6 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)'}}>
        <p className="font-semibold text-sm">{competition.date}</p>
      </div>
    </button>
  );
};

export default CompetitionCard;