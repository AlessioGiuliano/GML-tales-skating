import React from 'react';
import {HeaderProps, Team} from '../types';

const Header: React.FC<HeaderProps> = ({ selectedTeam, onSwitchTeam, onGoToSchedule }: {selectedTeam: Team, onSwitchTeam, onGoToSchedule}) => {
    return (
        <header className="max-w-7xl w-full mx-auto flex justify-between items-center py-4 px-4 sm:p-8 flex-shrink-0">
            {/* Left side — Title */}
            <button
                onClick={onGoToSchedule}
                disabled={false}
                className="disabled:cursor-default group"
                aria-label="Go to season schedule"
            >
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-wider group-enabled:hover:opacity-80 transition-opacity">
                    World Tour <span className="opacity-70">24/25</span>
                </h1>
            </button>

            {/* Right side — Selected team info */}
            {selectedTeam && (
                <div className="flex items-center gap-3 sm:gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div
                            className="group cursor-pointer p-2 gap-2 rounded-xl flex items-center justify-center overflow-hidden shadow-md border border-white/20 transition-transform duration-300 hover:scale-105"
                            style={{
                                backgroundColor: `${selectedTeam.bgColor}B3`,
                                backdropFilter: 'blur(5px)',
                                WebkitBackdropFilter: 'blur(5px)',
                            }}
                            onClick={onSwitchTeam}
                        >
                            <img
                                src={selectedTeam.photo_url}
                                alt={`${selectedTeam.name} Logo`}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg opacity-90"
                            />
                            <div
                                className="text-center gap-1 flex flex-col"
                                style={{
                                    color: selectedTeam.textColor,
                                }}
                            >
                                <p className="group-hover:opacity-0 group-hover:h-0 group-hover:-mt-1 text-xs opacity-80 leading-tight uppercase">Supported totem</p>
                                <p className="group-hover:block hidden text-xs opacity-80 leading-tight uppercase">Switch Totem</p>
                                <p
                                    className="font-extrabold text-sm leading-tight"
                                >
                                    {selectedTeam.name}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
