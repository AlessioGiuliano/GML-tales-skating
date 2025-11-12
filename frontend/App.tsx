import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Competition, Team } from './types';
import { TEAMS } from './constants';
import IntroScreen from './components/IntroScreen';
import TeamSelection from './components/TeamSelection';
import MainContent from './components/MainContent';
import CompetitionDetail from './components/CompetitionDetail';
import Header from './components/Header';
import TheEdge from './components/TheEdge';
import SeoulV2Page from "./src/pages/SeoulV2Page";
import SeoulExperiencePage from "./components/SeoulExperiencePage";

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<Team | null>(null);
  const [overlayColor, setOverlayColor] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamParam = 'dutch lions'; // ?? params.get('team');
    if (teamParam) {
      const foundTeam = TEAMS.find(
          (t) => t.name.toLowerCase() === teamParam.toLowerCase()
      );
      if (foundTeam) {
        setSelectedTeam(foundTeam);
        setOverlayColor(foundTeam.bgColor);
      }
    }
  }, [location.search]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setHoveredTeam(null);
    setOverlayColor(team.bgColor);

    const params = new URLSearchParams(location.search);
    params.set('team', team.name.toLowerCase());
    navigate({ pathname: '/', search: params.toString() }, { replace: true });
  };

  const handleSwitchTeam = () => {
    setSelectedTeam(null);
    const params = new URLSearchParams(location.search);
    params.delete('team');
    navigate({ pathname: '/', search: params.toString() }, { replace: true });
  };

  const handleViewCompetition = (competition: Competition) => {
    // Navigate to /seoul when user selects a competition
    navigate('/seoul');
  };

  const isTeamSelectionView = !selectedTeam;

  const renderMainContent = () => {
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
    return (
        <MainContent
            selectedTeam={selectedTeam}
            onViewCompetition={handleViewCompetition}
        />
    );
  };

  if (isLoading) return <IntroScreen />;

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
              onGoToSchedule={() => navigate('/')}
          />
          <main
              className={`flex-grow ${
                  isTeamSelectionView ? 'relative' : 'flex flex-col'
              }`}
          >
            <Routes>
              <Route path="/" element={renderMainContent()} />
                <Route path="/seoul-v2" element={<SeoulExperiencePage />} />
                <Route
                  path="/seoul"
                  element={
                    selectedTeam ? (
                        <CompetitionDetail
                            selectedTeam={selectedTeam.iso_name}
                            year="2024"
                            location="seoul"
                            category="500m-men"
                        />
                    ) : (
                        <div className="p-8 text-center">
                          <p className="text-xl">
                            Please select a team first to view competition details.
                          </p>
                        </div>
                    )
                  }
              />
            </Routes>
          </main>
        </div>

        <TheEdge color={hoveredTeam?.bgColor ? `${hoveredTeam?.bgColor}B3` : '#0e3be1'} />
      </div>
  );
};

const App: React.FC = () => (
    <Router>
      <AppContent />
    </Router>
);

export default App;
