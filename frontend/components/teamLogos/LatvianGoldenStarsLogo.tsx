import React from 'react';

const LatvianGoldenStarsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/latvia.png"
        alt="Latvian Golden Stars Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default LatvianGoldenStarsLogo;