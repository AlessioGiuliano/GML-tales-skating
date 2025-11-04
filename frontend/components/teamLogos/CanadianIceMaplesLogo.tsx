import React from 'react';

const CanadianIceMaplesLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/canada.png"
        alt="Canadian Ice Maples Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);
export default CanadianIceMaplesLogo;