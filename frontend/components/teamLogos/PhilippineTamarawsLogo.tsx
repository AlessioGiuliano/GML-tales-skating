import React from 'react';

const PhilippineTamarawsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/philippines.png"
        alt="Philippine Tamaraws Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default PhilippineTamarawsLogo;