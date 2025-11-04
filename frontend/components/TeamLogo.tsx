import React from 'react';
import { Team } from '../types';
import * as Logos from './teamLogos';
import TemplateTotem from './TemplateTotem';

interface TeamLogoProps {
  team: Team;
  className?: string;
}

// A mapping from a sanitized team name to its logo component.
const componentMap: { [key: string]: React.FC<{ className?: string }> } = {
  'KoreanWhiteTigers': Logos.KoreanWhiteTigersLogo,
  'USAEagles': Logos.UsaEaglesLogo,
  'DutchLions': Logos.DutchLionsLogo,
  'BelgiumIceBears': Logos.BelgiumIceBearsLogo,
  'CanadianIceMaples': Logos.CanadianIceMaplesLogo,
  'ChineseLoongs': Logos.ChineseLoongsLogo,
  'PolishHussars': Logos.PolishHussarsLogo,
  'ItalianGladiators': Logos.ItalianGladiatorsLogo,
  'KazakhNomads': Logos.KazakhNomadsLogo,
  'JapaneseNinjas': Logos.JapaneseNinjasLogo,
  'HungarianFalcons': Logos.HungarianFalconsLogo,
  'FrenchRoosters': Logos.FrenchRoostersLogo,
  'BritishRoyals': Logos.BritishRoyalsLogo,
  'UkrainianWildCats': Logos.UkrainianWildCatsLogo,
  'CroatianDalmatians': Logos.CroatianDalmatiansLogo,
  'GermanWolves': Logos.GermanWolvesLogo,
  'CzechiaIceSpiders': Logos.CzechiaIceSpidersLogo,
  'BulgarianKings': Logos.BulgarianKingsLogo,
  'LatvianGoldenStars': Logos.LatvianGoldenStarsLogo,
  'AustralianRacingRoos': Logos.AustralianRacingRoosLogo,
  'TurkishAnatolianPars': Logos.TurkishAnatolianParsLogo,
  'HongKongIceQilins': Logos.HongKongIceQilinsLogo,
  'NewZealandIceKeas': Logos.NewZealandIceKeasLogo,
  'IrishWolfHounds': Logos.IrishWolfHoundsLogo,
  'SwissIbex': Logos.SwissIbexLogo,
  'NorwegianVikings': Logos.NorwegianVikingsLogo,
  'ThaiElephants': Logos.ThaiElephantsLogo,
  'SingaporeGazelles': Logos.SingaporeGazellesLogo,
  'PhilippineTamaraws': Logos.PhilippineTamarawsLogo,
};

const TeamLogo: React.FC<TeamLogoProps> = ({ team, className }) => {
  // Generate a key like "KoreanWhiteTigers" from "Korean White Tigers"
  const componentKey = team.name.replace(/\s/g, '');
  const LogoComponent = componentMap[componentKey];

  if (LogoComponent) {
    return <LogoComponent className={className} />;
  }

  // Fallback to the template totem if a specific logo isn't found
  return <TemplateTotem className={className} />;
};

export default TeamLogo;
