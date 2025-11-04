import React from 'react';

const ItalianGladiatorsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/italy.png"
        alt="Italian Gladiators Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default ItalianGladiatorsLogo;