import React from 'react';

const BulgarianKingsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/bulgaria.jpg"
        alt="Bulgarian Kings Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default BulgarianKingsLogo;