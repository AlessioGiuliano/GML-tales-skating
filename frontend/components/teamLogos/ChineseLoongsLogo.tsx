import React from 'react';

const ChineseLoongsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/china.png"
        alt="Chinese Loongs Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default ChineseLoongsLogo;