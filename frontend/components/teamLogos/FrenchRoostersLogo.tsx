import React from 'react';

const FrenchRoostersLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/france.jpg"
        alt="French Roosters Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default FrenchRoostersLogo;