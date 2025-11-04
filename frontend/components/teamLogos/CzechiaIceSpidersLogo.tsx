import React from 'react';

const CzechiaIceSpidersLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/czechia.jpg"
        alt="Czechia Ice Spiders Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default CzechiaIceSpidersLogo;