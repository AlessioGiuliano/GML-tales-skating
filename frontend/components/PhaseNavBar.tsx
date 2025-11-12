import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PhaseNavBarProps {
    phases: string[];
}

const PhaseNavBar: React.FC<PhaseNavBarProps> = ({ phases }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const triggers: ScrollTrigger[] = [];

        phases.forEach((phase, index) => {
            const trigger = ScrollTrigger.create({
                trigger: `#phase-${index}`,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveIndex(index),
                onEnterBack: () => setActiveIndex(index),
            });
            triggers.push(trigger);
        });

        return () => {
            triggers.forEach((t) => t.kill());
        };
    }, [phases]);

    const scrollToPhase = (index: number) => {
        const el = document.getElementById(`phase-${index}`);
        if (!el) return;
        gsap.to(window, { scrollTo: el, duration: 1, ease: "power2.out" });
    };

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[3000] flex items-center justify-center gap-4 px-6 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-[0_0_20px_#00bfff50]">
            {phases.map((phase, i) => (
                <button
                    key={i}
                    onClick={() => scrollToPhase(i)}
                    title={phase}
                    className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                        i === activeIndex ? "bg-cyan-400 shadow-[0_0_15px_#00d7ff]" : "bg-white/30 hover:bg-cyan-200/70"
                    }`}
                >
                    {i === activeIndex && (
                        <span className="absolute inset-0 rounded-full bg-cyan-400 animate-pulse opacity-60" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default PhaseNavBar;
