import React from 'react';

const PolishHussarsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/poland.jpg"
        alt="Polish Hussars Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default PolishHussarsLogo;