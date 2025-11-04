import React from 'react';

const UsaEaglesLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center justify-center w-full h-full rounded-lg ${className}`} style={{ backgroundColor: '#002868' }}>
    <span className="font-extrabold text-white text-2xl md:text-3xl" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>USA</span>
  </div>
);

export default UsaEaglesLogo;
