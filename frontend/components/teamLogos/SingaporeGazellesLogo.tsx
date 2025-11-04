import React from 'react';

const SingaporeGazellesLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/singapore.jpg"
        alt="Singapore Gazelles Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default SingaporeGazellesLogo;