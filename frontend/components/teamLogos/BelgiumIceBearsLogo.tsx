import React from 'react';

const BelgiumIceBearsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img 
        src="/team-photos/belgium.png"
        alt="Belgium Ice Bears Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default BelgiumIceBearsLogo;