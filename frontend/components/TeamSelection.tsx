import React, { useState, useRef, useEffect } from 'react';
import { Team, TeamSelectionProps } from '../types';
import TeamLogo from './TeamLogo';

const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onSelectTeam, hoveredTeam, onHoverTeam }) => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;
    if (!scrollElement) return;

    const checkScrollability = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      // Use a small tolerance to prevent flickering from sub-pixel values
      const tolerance = 1;
      setCanScrollUp(scrollTop > tolerance);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - tolerance);
    };

    // Initial check on mount
    checkScrollability();

    // Check on scroll
    scrollElement.addEventListener('scroll', checkScrollability, { passive: true });
    
    // Check on resize (in case content becomes scrollable/unscrollable)
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(scrollElement);
    if(scrollElement.firstElementChild) {
        resizeObserver.observe(scrollElement.firstElementChild);
    }

    // Cleanup listeners
    return () => {
      scrollElement.removeEventListener('scroll', checkScrollability);
      resizeObserver.disconnect();
    };
  }, []);

  const containerClasses = [
    'relative', 'flex-grow', 'min-h-0', 'w-full', 'max-w-7xl', 'scroll-fade-container',
    canScrollUp ? 'fade-top' : '',
    canScrollDown ? 'fade-bottom' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="absolute inset-0 flex flex-col items-center p-4 sm:p-8 animate-fadeIn">
      <div className="text-center mb-6 flex-shrink-0">
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-wider uppercase mb-2">CHOOSE YOUR TOTEM</h1>
        <p className="text-lg text-white/80">Select a team to represent for the 2024/2025 season.</p>
      </div>
      
      <div className={containerClasses}>
        <div ref={scrollContainerRef} className="h-full overflow-y-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto pb-8">
            {teams.map((team, index) => {
              return (
                <button
                  key={team.id}
                  onClick={() => onSelectTeam(team)}
                  onMouseEnter={() => onHoverTeam(team)}
                  onMouseLeave={() => onHoverTeam(null)}
                  className="group flex flex-col items-center justify-center p-1 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 aspect-video"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid rgba(255, 255, 255, 0.2)`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    animation: `fadeInUp 0.5s ease-out ${index * 0.03}s both`,
                  }}
                >
                  <div className="transition-transform duration-300 group-hover:rotate-[-2deg] w-full h-full" style={{ color: team.textColor }}>
                    <TeamLogo team={team} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 h-24 w-full max-w-md flex-shrink-0">
        <div
            className="rounded-xl p-6 text-center transition-all duration-300 h-full flex flex-col justify-center"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}
        >
            {hoveredTeam ? (
                <div className="animate-fadeIn">
                    <h3 className="text-2xl font-extrabold font-display uppercase" style={{ color: hoveredTeam.textColor }}>{hoveredTeam.name}</h3>
                    <p className="text-md opacity-90">{hoveredTeam.country}</p>
                </div>
            ) : (
                <p className="text-white/60">Hover over a totem to see team details</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default TeamSelection;