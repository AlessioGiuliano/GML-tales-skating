import React from 'react';

const BritishRoyalsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/britain.jpg"
        alt="British Royals Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default BritishRoyalsLogo;