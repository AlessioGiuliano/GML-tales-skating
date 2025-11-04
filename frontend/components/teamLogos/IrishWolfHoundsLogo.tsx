import React from 'react';

const IrishWolfHoundsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img 
        src="/team-photos/ireland.png"
        alt="Irish Wolf Hounds Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default IrishWolfHoundsLogo;