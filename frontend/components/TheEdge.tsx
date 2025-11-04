import React from 'react';

const TheEdge: React.FC = () => (
  <div className="absolute bottom-0 left-0 w-full h-auto pointer-events-none z-0 mix-blend-screen opacity-70">
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 1440 250" 
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="edgeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0e3be1" />
          <stop offset="100%" stopColor="#00d7ff" />
        </linearGradient>
      </defs>
      <path 
        d="M0,250 C360,150 720,280 1080,180 C1440,80 1440,150 1440,150 L1440,250 L0,250 Z" 
        fill="url(#edgeGradient)"
      />
    </svg>
  </div>
);

export default TheEdge;
