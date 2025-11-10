import React from 'react';

export const countryToFlagMap: { [key: string]: string } = {
  KOR: '🇰🇷',
  USA: '🇺🇸',
  NED: '🇳🇱',
  BEL: '🇧🇪',
  BUL: '🇧🇬',
  CAN: '🇨🇦',
  CHN: '🇨🇳',
  CRO: '🇭🇷',
  POL: '🇵🇱',
  ITA: '🇮🇹',
  KAZ: '🇰🇿',
  BRA: '🇧🇷',
  LUX: '🇱🇺',
  LAT: '🇱🇻',
  IND: '🇮🇳',
  MGL: '🇲🇳',
  JPN: '🇯🇵',
  HUN: '🇭🇺',
  FRA: '🇫🇷',
  TPE: '🇹🇼',
  GBR: '🇬🇧',
  UKR: '🇺🇦',
  GER: '🇩🇪',
  CZE: '🇨🇿',
  BGR: '🇧🇬',
  AUS: '🇦🇺',
  AUT: '🇦🇹',
  TUR: '🇹🇷',
  HKG: '🇭🇰',
  NZL: '🇳🇿',
  IRL: '🇮🇪',
  CHE: '🇨🇭',
  NOR: '🇳🇴',
  THA: '🇹🇭',
  SGP: '🇸🇬',
  PHL: '🇵🇭',
};

const CountryFlag: React.FC<{ country: string; className?: string }> = ({ country, className }) => {
  const flag = countryToFlagMap[country] || '🏳️';
  if (flag === '🏳️')
    console.log(country)
  return (
    <span className={className} role="img" aria-label={`${country} flag`}>
      {flag}
    </span>
  );
};

export default CountryFlag;
