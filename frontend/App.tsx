import React, { useState, useEffect } from 'react';
import { Team, Competition } from './types';
import { TEAMS } from './constants';
import IntroScreen from './components/IntroScreen';
import TeamSelection from './components/TeamSelection';
import MainContent from './components/MainContent';
import CompetitionDetail from './components/CompetitionDetail';
import Header from './components/Header';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [viewedCompetition, setViewedCompetition] = useState<Competition | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3800); // Duration should be slightly less than the animation

    return () => clearTimeout(timer);
  }, []);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setHoveredTeam(null); // Clear hover when team is selected
  };

  const handleSwitchTeam = () => {
    setSelectedTeam(null);
    setViewedCompetition(null);
  };

  const handleViewCompetition = (competition: Competition) => {
    setViewedCompetition(competition);
  };

  const handleBackToSchedule = () => {
    setViewedCompetition(null);
  };
  
  const overlayColor = selectedTeam?.bgColor || hoveredTeam?.bgColor;
  
  const isTeamSelectionView = !selectedTeam;

  const renderContent = () => {
    if (!selectedTeam) {
      return (
        <TeamSelection 
          teams={TEAMS} 
          onSelectTeam={handleSelectTeam} 
          hoveredTeam={hoveredTeam}
          onHoverTeam={setHoveredTeam}
        />
      );
    }
    if (viewedCompetition) {
      return (
        <CompetitionDetail
          competition={viewedCompetition}
          selectedTeam={selectedTeam}
          onBack={handleBackToSchedule}
        />
      );
    }
    return (
      <MainContent 
        selectedTeam={selectedTeam} 
        onViewCompetition={handleViewCompetition}
      />
    );
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  return (
    <div 
      className={`relative w-full font-sans ${isTeamSelectionView ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
    >
      <div
        className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out"
        style={{
          backgroundColor: overlayColor || 'transparent',
          opacity: overlayColor ? 0.2 : 0,
          zIndex: 0,
        }}
      />
      <div className={`relative z-10 flex flex-col ${isTeamSelectionView ? 'h-full' : 'min-h-screen'}`}>
        <Header 
          selectedTeam={selectedTeam}
          onSwitchTeam={handleSwitchTeam}
          onGoToSchedule={handleBackToSchedule}
        />
        <main className={`flex-grow ${isTeamSelectionView ? 'relative' : 'flex flex-col'}`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;