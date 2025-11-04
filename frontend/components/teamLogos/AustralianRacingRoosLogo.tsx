import React from 'react';

const AustralianRacingRoosLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img 
        src="/team-photos/australia.jpg"
        alt="Australian Racing Roos Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default AustralianRacingRoosLogo;