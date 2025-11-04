import React from 'react';
import { HeaderProps } from '../types';
import SkaterIcon from './SkaterIcon';

const Header: React.FC<HeaderProps> = ({ selectedTeam, onSwitchTeam, onGoToSchedule }) => {
  return (
    <header className="max-w-7xl w-full mx-auto flex justify-between items-center py-4 px-4 sm:p-8 flex-shrink-0">
      <button 
        onClick={onGoToSchedule}
        disabled={!selectedTeam}
        className="disabled:cursor-default group"
        aria-label="Go to season schedule"
      >
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-wider group-enabled:hover:opacity-80 transition-opacity">
          World Tour <span className="opacity-70">24/25</span>
        </h1>
      </button>
      
      {selectedTeam && (
        <div className="flex items-center gap-3 sm:gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                  <p className="font-extrabold text-sm leading-tight">{selectedTeam.name}</p>
                  <p className="text-xs opacity-80 leading-tight uppercase">Profile</p>
              </div>
              <div 
                  className="p-2 rounded-lg" 
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
              >
                  <SkaterIcon color={selectedTeam.textColor} />
              </div>
          </div>
          <button
            onClick={onSwitchTeam}
            className="text-xs font-bold uppercase px-3 py-2 rounded-lg transition-colors duration-300 hover:bg-white/20"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }}
            aria-label="Switch team"
          >
            Switch
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;