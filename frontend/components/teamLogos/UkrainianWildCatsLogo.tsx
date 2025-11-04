import React from 'react';

const UkrainianWildCatsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/ukraine.jpg"
        alt="Ukrainian Wild Cats Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default UkrainianWildCatsLogo;