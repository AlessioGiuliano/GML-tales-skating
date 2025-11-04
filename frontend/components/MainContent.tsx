import React from 'react';
import {MainContentProps} from '../types';
import {COMPETITIONS} from '../constants';
import CompetitionCard from './CompetitionCard';

const MainContent: React.FC<MainContentProps> = ({ selectedTeam, onViewCompetition }) => {
  return (
    <div className="p-4 sm:p-8 animate-fadeIn relative overflow-hidden flex-grow">
      <div className="relative z-10">
        <main className="max-w-7xl mx-auto">
          <h2 
            className="text-4xl font-display font-extrabold mb-8 text-center uppercase" 
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Season Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPETITIONS.map((comp, index) => (
              <CompetitionCard 
                key={comp.id} 
                competition={comp} 
                index={index}
                onViewCompetition={onViewCompetition}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainContent;