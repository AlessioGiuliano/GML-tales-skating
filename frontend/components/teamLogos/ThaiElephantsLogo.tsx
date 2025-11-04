import React from 'react';

const ThaiElephantsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/thailand.jpg"
        alt="Thai Elephants Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default ThaiElephantsLogo;