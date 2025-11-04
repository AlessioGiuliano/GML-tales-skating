import React from 'react';

const SkaterSVG: React.FC = () => (
    <svg
        width="150"
        height="150"
        viewBox="0 0 135 135"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
    >
        <g transform="translate(0, 0)">
            {/* Corps incliné */}
            <path d="M30 90 C50 70, 80 60, 100 65" />
            {/* Tête */}
            <circle cx="105" cy="58" r="6" strokeWidth="3" />
            {/* Bras avant au sol */}
            <path d="M70 75 L50 100" />
            {/* Bras arrière replié */}
            <path d="M85 70 L95 80" />
            {/* Jambe avant poussant */}
            <path d="M80 80 L110 100" />
            {/* Jambe arrière pliée */}
            <path d="M70 85 L60 110" />
            {/* Patin avant */}
            <path d="M107 100 L117 100" />
            {/* Patin arrière */}
            <path d="M57 110 L67 110" />
        </g>
    </svg>
);



const IntroScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute animate-skateUp">
        <SkaterSVG />
      </div>
      <div className="z-10 text-center animate-fadeIn" style={{ animationDelay: '500ms' }}>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-widest uppercase">
          World Tour
        </h1>
        <p className="text-2xl md:text-4xl font-display font-extrabold text-white/80 uppercase">2024/2025</p>
      </div>
    </div>
  );
};

export default IntroScreen;