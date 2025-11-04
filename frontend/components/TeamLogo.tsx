import React from 'react';
import { Team } from '../types';
import * as Logos from './teamLogos';
import TemplateTotem from './TemplateTotem';

interface TeamLogoProps {
  team: Team;
  className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team, className }) => {
  if (team.iso_name !== 'USA') {
    return <img
        src={team.photo_url}
        alt={`${team.name} photo`}
        className={`${className} object-cover w-full h-full rounded-lg`}
    />
  }

  // Fallback to the template totem if a specific logo isn't found
  return <div className={"self-center flex content-center text-2xl font-display font-extrabold tracking-wider h-full"}>
    {team.iso_name}
  </div>;
};

export default TeamLogo;
