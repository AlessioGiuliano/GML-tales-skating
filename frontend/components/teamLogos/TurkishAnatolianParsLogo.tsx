import React from 'react';

const TurkishAnatolianParsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/turkey.png"
        alt="Turkish Anatolian Pars Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default TurkishAnatolianParsLogo;