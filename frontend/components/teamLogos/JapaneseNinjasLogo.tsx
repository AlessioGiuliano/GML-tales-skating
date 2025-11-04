import React from 'react';

const JapaneseNinjasLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/japan.jpg"
        alt="Japanese Ninjas Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default JapaneseNinjasLogo;