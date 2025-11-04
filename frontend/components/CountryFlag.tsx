import React from 'react';

const countryToFlagMap: { [key: string]: string } = {
  'South Korea': '🇰🇷',
  'USA': '🇺🇸',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Canada': '🇨🇦',
  'China': '🇨🇳',
  'Poland': '🇵🇱',
  'Italy': '🇮🇹',
  'Kazakhstan': '🇰🇿',
  'Japan': '🇯🇵',
  'Hungary': '🇭🇺',
  'France': '🇫🇷',
  'Great Britain': '🇬🇧',
  'Ukraine': '🇺🇦',
  'Croatia': '🇭🇷',
  'Germany': '🇩🇪',
  'Czechia': '🇨🇿',
  'Bulgaria': '🇧🇬',
  'Latvia': '🇱🇻',
  'Australia': '🇦🇺',
  'Turkey': '🇹🇷',
  'Hong Kong': '🇭🇰',
  'New Zealand': '🇳🇿',
  'Ireland': '🇮🇪',
  'Switzerland': '🇨🇭',
  'Norway': '🇳🇴',
  'Thailand': '🇹🇭',
  'Singapore': '🇸🇬',
  'Philippines': '🇵🇭',
};

const CountryFlag: React.FC<{ country: string; className?: string }> = ({ country, className }) => {
  const flag = countryToFlagMap[country] || '🏳️';
  return (
    <span className={className} role="img" aria-label={`${country} flag`}>
      {flag}
    </span>
  );
};

export default CountryFlag;
