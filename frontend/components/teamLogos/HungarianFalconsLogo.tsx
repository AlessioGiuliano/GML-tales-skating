import React from 'react';

const HungarianFalconsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/hungary.jpg"
        alt="Hungarian Falcons Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default HungarianFalconsLogo;