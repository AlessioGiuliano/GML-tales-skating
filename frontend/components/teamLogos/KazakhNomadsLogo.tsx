import React from 'react';

const KazakhNomadsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/kazakhstan.jpg"
        alt="Kazakh Nomads Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default KazakhNomadsLogo;