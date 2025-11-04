import React, {useEffect, useState} from 'react';
import {Competition, Team} from './types';
import {TEAMS} from './constants';
import IntroScreen from './components/IntroScreen';
import TeamSelection from './components/TeamSelection';
import MainContent from './components/MainContent';
import CompetitionDetail from './components/CompetitionDetail';
import Header from './components/Header';
import TheEdge from './components/TheEdge';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [viewedCompetition, setViewedCompetition] = useState<Competition | null>(null);
  const [overlayColor, setOverlayColor] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const teamParam = params.get('team');
    if (teamParam) {
      const foundTeam = TEAMS.find(
          (t) => t.name.toLowerCase() === teamParam.toLowerCase()
      );
      if (foundTeam) {
        setSelectedTeam(foundTeam);
        setOverlayColor(foundTeam.bgColor);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setHoveredTeam(null);
    setOverlayColor(team.bgColor);

    const params = new URLSearchParams(window.location.search);
    params.set('team', team.name.toLowerCase());
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleSwitchTeam = () => {
    setSelectedTeam(null);
    setViewedCompetition(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('team');
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  };

  const handleViewCompetition = (competition: Competition) => {
    setViewedCompetition(competition);
  };

  const handleBackToSchedule = () => {
    setViewedCompetition(null);
  };

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
          className={`relative w-full font-sans ${
              isTeamSelectionView ? 'h-screen overflow-hidden' : 'min-h-screen'
          }`}
      >
        <div
            className="absolute inset-0 w-full h-full transition-[background-color,opacity] duration-500 ease-in-out"
            style={{
              backgroundColor: hoveredTeam?.bgColor
                  ? `${hoveredTeam.bgColor}B3`
                  : overlayColor
                      ? `${overlayColor}B3`
                      : 'transparent',
              zIndex: 0,
            }}
        />
        <div
            className={`relative z-10 flex flex-col ${
                isTeamSelectionView ? 'h-full' : 'min-h-screen'
            }`}
        >
          <Header
              selectedTeam={selectedTeam}
              onSwitchTeam={handleSwitchTeam}
              onGoToSchedule={handleBackToSchedule}
          />
          <main className={`flex-grow ${isTeamSelectionView ? 'relative' : 'flex flex-col'}`}>
            {renderContent()}
          </main>
        </div>

        <TheEdge color={hoveredTeam?.bgColor || overlayColor || '#0e3be1'} />
      </div>
  );
};

export default App;
