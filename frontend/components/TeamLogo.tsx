import React from 'react';
import { Team } from '../types';
import * as Logos from './teamLogos';
import TemplateTotem from './TemplateTotem';

interface TeamLogoProps {
  team: Team;
  className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team, className }) => {
  return <img
      src={team.photo_url}
      alt={`${team.name} photo`}
      className={`${className} object-cover w-full h-full rounded-lg`}
  />
};

export default TeamLogo;
