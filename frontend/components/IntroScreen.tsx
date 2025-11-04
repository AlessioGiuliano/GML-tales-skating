import React from 'react';

const SkaterSVG: React.FC = () => (
    <svg 
        width="150" 
        height="150" 
        viewBox="0 0 135.47 135.47"
        fill="none" 
        stroke="currentColor" 
        strokeWidth="4"
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
    >
        <g transform="translate(0, -161.53)">
            <path d="m50.8 243.32-1.2266 1.4024-11.19-2.0294-0.12267-3.2049 11.239-1.3532z" />
            <path d="m42.128 242.04-12.046-2.5213-4.2231 16.294 13.921 0.44498z" />
            <path d="m50.8 243.32-8.6718-1.2828-0.81779 2.4727 7.6432 1.332z" />
            <path d="m27.351 258.46-1.547-0.0245 0.54246-2.0049 1.4725 0.27z" />
            <path d="m41.488 239.52-0.54246-1.2975 6.2875 3.5253-1.6215 5.5739-4.1245-7.8016z" />
            <path d="m45.418 242.22 0.81779-1.0123 3.9757-0.34454-0.14725 1.547z" />
            <path d="m49.722 238.99 1.948-3.0097 2.1932 1.1108-1.2021 2.9852z" />
            <path d="m51.67 235.98 8.1287-13.623 10.993 10.148-3.328 6.4844z" />
            <path d="m70.791 238.99-3.2049-5.1294 3.328-1.547 3.328 5.6231z" />
            <path d="m59.798 222.36 10.993 10.148-1.1276 2.0539-10.455-10.615z" />
            <path d="m66.613 227.68 0.44498 1.955-1.9235 0.49417-0.49417-2.1261z" />
            <path d="m66.564 227.53-2.6198-2.5213 1.547 0.36906 1.8989 2.5458z" />
            <path d="m70.668 228.66-8.2032-4.8318 0.94192-1.7439 7.8261 4.5867z" />
            <path d="m81.414 213.99c2.4235-0.14725 4.3958 1.6215 4.5431 4.0249 0.14725 2.4004-1.6215 4.3958-4.0249 4.5431-2.4004 0.14725-4.3958-1.6215-4.5431-4.0249-0.14725-2.4235 1.6215-4.3958 4.0249-4.5431z" />
            <path d="m74.191 244.38-4.1245-6.6813 9.4437-14.896 14.166 4.6359-2.9112 11.239-14.649 4.9659-1.9235 0.71928z" />
            <path d="m87.979 231.29 2.6198 1.1362-0.89231 2.0539-2.4235-1.1607z" />
            <path d="m87.734 231.54 0.12267-1.1607 1.8497-0.46965 0.44498 1.1853z" />
            <path d="m89.431 241.13 2.1932 1.3532-0.12267 1.955-2.4727-1.2828z" />
            <path d="m72.342 243.67-1.0291 0.7438-1.0783-2.0294 1.448-0.62077z" />
            <path d="m91.501 242.48 10.602 11.288 12.316-16.122-4.5867-13.623-14.995 5.5247z" />
            <path d="m114.42 237.64-11.411 12.122 1.3532 1.2583 11.092-12.443z" />
            <path d="m94.943 229.53-2.5213-7.0494 2.1932-0.79338 2.0539 7.0494z" />
            <path d="m98.412 233.15 1.1033-0.71928-0.0981-0.27-0.95543 0.69477z" />
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