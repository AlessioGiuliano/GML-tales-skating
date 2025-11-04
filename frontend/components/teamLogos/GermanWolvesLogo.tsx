import React from 'react';

const GermanWolvesLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/germany.jpg"
        alt="German Wolves Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default GermanWolvesLogo;