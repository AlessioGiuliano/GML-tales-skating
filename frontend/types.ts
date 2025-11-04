import React from 'react';

export interface Team {
  id: number;
  name: string;
  nameParts: [string, string];
  country: string;
  iso_name: string;     // ISO Alpha-3 code (ex: "CHE", "CAN")
  bgColor: string;
  textColor: string;
  photo_url: string;    // Path to team photo (ex: "/team-photos/switzerland.png")
}

export interface Qualifier {
  name: string;
  country: string;
  time: string;
}

export interface EventStage {
  name:string;
  topQualifiers: Qualifier[];
}

export interface Race {
  title: string;
  videoId: string;
}

export interface Stat {
  title: string;
  value: string;
}

export interface TeamStatComparison {
  metric: string;
  teamValue: string;
  averageValue: string;
  delta: string;
  positive: boolean;
}

export interface Competition {
  id: number;
  title: string;
  location: string;
  country: string;
  date: string;
  details?: string;
  stages?: EventStage[];
  races?: Race[];
  stats?: Stat[];
  teamStats?: TeamStatComparison[];
}

export interface HeaderProps {
  selectedTeam: Team | null;
  onSwitchTeam: () => void;
  onGoToSchedule: () => void;
}

export interface TeamSelectionProps {
    teams: Team[];
    onSelectTeam: (team: Team) => void;
    hoveredTeam: Team | null;
    onHoverTeam: (team: Team | null) => void;
}

export interface MainContentProps {
  selectedTeam: Team;
  onViewCompetition: (competition: Competition) => void;
}

export interface CompetitionCardProps {
  competition: Competition;
  index: number;
  onViewCompetition: (competition: Competition) => void;
}

export interface CompetitionDetailProps {
  competition: Competition;
  selectedTeam: Team;
  onBack: () => void;
}