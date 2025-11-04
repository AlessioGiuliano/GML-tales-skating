import React from 'react';

const DutchLionsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/holland.png"
        alt="Dutch Lions Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default DutchLionsLogo;