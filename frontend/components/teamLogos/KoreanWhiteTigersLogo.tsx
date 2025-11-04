import React from 'react';

const KoreanWhiteTigersLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/korea.png"
        alt="Korean White Tigers Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default KoreanWhiteTigersLogo;