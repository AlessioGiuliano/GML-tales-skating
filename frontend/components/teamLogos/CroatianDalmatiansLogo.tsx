import React from 'react';

const CroatianDalmatiansLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/croatia.jpg"
        alt="Croatian Dalmatians Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default CroatianDalmatiansLogo;