import React from 'react';

const SwissIbexLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/switzlerand.jpg"
        alt="Swiss Ibex Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default SwissIbexLogo;