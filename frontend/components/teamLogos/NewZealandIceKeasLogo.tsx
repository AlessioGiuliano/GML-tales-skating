import React from 'react';

const NewZealandIceKeasLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/new-zealand.jpg"
        alt="New Zealand Ice Keas Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default NewZealandIceKeasLogo;