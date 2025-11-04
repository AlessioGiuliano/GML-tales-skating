import React from 'react';
import { motion } from 'framer-motion';

interface TheEdgeProps {
    color?: string;
}

const TheEdge: React.FC<TheEdgeProps> = ({ color = '#0e3be1' }) => {
    const tipColor = '#00d7ff';

    return (
        <motion.div
            className="absolute bottom-0 left-0 w-full h-auto pointer-events-none z-0 mix-blend-screen opacity-80"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1440 250"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="edgeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor={tipColor} />
                    </linearGradient>
                </defs>
                <motion.path
                    d="M0,250 C360,150 720,280 1080,180 C1440,80 1440,150 1440,150 L1440,250 L0,250 Z"
                    fill="url(#edgeGradient)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                />
            </svg>
        </motion.div>
    );
};

export default TheEdge;
