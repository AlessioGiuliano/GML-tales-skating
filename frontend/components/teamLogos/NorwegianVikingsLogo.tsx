import React from 'react';

const NorwegianVikingsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/norway.jpg"
        alt="Norwegian Vikings Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default NorwegianVikingsLogo;