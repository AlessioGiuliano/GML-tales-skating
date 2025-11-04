import React from 'react';

const HongKongIceQilinsLogo: React.FC<{ className?: string }> = ({ className }) => (
    <img
        src="/team-photos/hong-kong.jpg"
        alt="Hong Kong Ice Qilins Logo" 
        className={`${className} object-cover w-full h-full rounded-lg`} 
    />
);

export default HongKongIceQilinsLogo;