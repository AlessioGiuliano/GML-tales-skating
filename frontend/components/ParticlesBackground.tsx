import React, { useEffect, useRef } from "react";

const ParticlesBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        const numParticles = 80;
        const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }[] = [];

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.15 + 0.05,
                speedY: -(Math.random() * 0.15 + 0.05),
                opacity: Math.random() * 0.5 + 0.3,
            });
        }

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p) => {
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
                gradient.addColorStop(0, `rgba(0, 215, 255, ${p.opacity})`);
                gradient.addColorStop(1, "transparent");
                ctx.fillStyle = gradient;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x > width + 10) p.x = -10;
                if (p.y < -10) p.y = height + 10;
            });

            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ filter: "blur(0.5px)", opacity: 0.45 }}
        />
    );
};

export default ParticlesBackground;
