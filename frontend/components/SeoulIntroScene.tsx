import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SeoulIntroScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            tl.fromTo(
                imageRef.current,
                { scale: 1.2, filter: "brightness(0.6)" },
                { scale: 1, filter: "brightness(1)", ease: "power2.out" }
            ).fromTo(
                titleRef.current,
                { opacity: 0, y: 80 },
                { opacity: 1, y: 0, ease: "power2.out" },
                "-=0.4"
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        >
            <div
                ref={imageRef}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url(/location-photos/seoul.jpg)",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b4b]/60 to-[#02102f]/90" />
            <div
                ref={titleRef}
                className="relative z-10 text-center animate-fadeInUp"
            >
                <h1 className="text-6xl md:text-8xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_#00d7ff]">
                    Seoul 2024
                </h1>
                <p className="text-white/80 text-lg md:text-2xl mt-4 tracking-wide">
                    Short Track World Cup — 500m Men
                </p>
            </div>
        </section>
    );
};

export default SeoulIntroScene;
