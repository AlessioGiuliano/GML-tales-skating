import React from 'react';

const TemplateTotem: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        className={className}
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4Z" stroke="currentColor" strokeWidth="4" strokeMiterlimit="10"/>
        <path d="M20 24H44" stroke="currentColor" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round"/>
        <path d="M26 34H38" stroke="currentColor" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round"/>
        <path d="M29 44H35" stroke="currentColor" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round"/>
    </svg>
);

export default TemplateTotem;
