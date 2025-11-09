import React from 'react';

export interface Team {
  id: number;
  name: string;
  nameParts: string[];
  country: string;
  iso_name: string;     // ISO Alpha-3 code (ex: "CHE", "CAN")
  bgColor: string;
  textColor: string;
  photo_url: string;    // Path to team photo (ex: "/team-photos/switzerland.png")
}

export interface Competition {
  id: number;
  title: string;
  location: string;
  country: string;
  date: string;
  details?: string;
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

export interface Split {
  lap: number;
  time: string;
}

export interface Athlete {
  id: string;
  name: string;
  country: string;
  team: string;
  bio: string;
}

export interface Result {
  rank: number;
  athlete: Athlete;
  time: string;
  splits: Split[];
}

export interface Race {
  id: string;
  title: string;
  video_url: string;
  hype_score: number;
  personalized_summaries: Record<string, { title: string; text: string }>;
  results: Result[];
}

export interface Phase {
  name: string;
  races: Race[];
}

export interface Competition {
  id: string;
  name: string;
  season: string;
  location: string;
  dates: { start: string; end: string };
  category: string;
  personalized_summaries: Record<string, { title: string; text: string }>;
  phases: Phase[];
}

export interface SupportedTeam {
  key: string;
  name: string;
}

export interface CompetitionData {
  competition: Competition;
  supported_teams: SupportedTeam[];
}

export interface CompetitionScheduleItem {
  id: number;
  title: string;
  location: string;
  country: string;
  date: string;
  details: string;
  stages: {
    name: string;
    topQualifiers: {
      name: string;
      country: string;
      time: string;
    }[];
  }[];
  races: {
    title: string;
    videoId: string;
  }[];
  stats: {
    title: string;
    value: string;
  }[];
  teamStats: {
    metric: string;
    teamValue: string;
    averageValue: string;
    delta: string;
    positive: boolean;
  }[];
}

export interface CompetitionDetailProps {
  selectedTeam: string;
  year: string;
  location: string;
  category: string;
}

export interface CompetitionHeaderProps {
  name: string;
  location: string;
  dates: { start: string; end: string };
  season: string;
}


export interface CompetitionSummaryProps {
  summary?: { title: string; text: string };
}

export interface PhaseListProps {
  phases: Phase[];
  selectedTeam: string;
}

export interface RaceVideoProps {
  url: string;
  title: string;
}

export interface RaceResultsProps {
  results: Result[];
}

export interface HypeSectionProps {
  races: Race[];
}