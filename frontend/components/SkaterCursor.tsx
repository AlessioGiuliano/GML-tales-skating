import { motion, useMotionValue, useSpring } from "framer-motion"
import { useEffect, useState } from "react"
import skaterLeft from "../skater-left.png"
import skaterRight from "../skater-right.png"
import skaterIdle from "../skater-idle.png"

export default function SkaterCursor() {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const smoothX = useSpring(x, { stiffness: 120, damping: 15 })
    const smoothY = useSpring(y, { stiffness: 120, damping: 15 })

    const [isIdle, setIsIdle] = useState(true)
    const [frame, setFrame] = useState(0)

    useEffect(() => {
        let idleTimeout
        const move = (e) => {
            x.set(e.clientX)
            y.set(e.clientY)
            setIsIdle(false)
            clearTimeout(idleTimeout)
            idleTimeout = setTimeout(() => setIsIdle(true), 50)
        }

        window.addEventListener("mousemove", move)
        return () => {
            window.removeEventListener("mousemove", move)
            clearTimeout(idleTimeout)
        }
    }, [x, y])

    // Alterne entre left/right quand il bouge
    useEffect(() => {
        if (isIdle) return
        const interval = setInterval(() => {
            setFrame((prev) => (prev === 0 ? 1 : 0))
        }, 400)
        return () => clearInterval(interval)
    }, [isIdle])

    const getImage = () => {
        if (isIdle) return skaterIdle
        return frame === 0 ? skaterLeft : skaterRight
    }

    return (
        <motion.div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
                zIndex: 9999,
            }}
        >
            <img
                src={getImage()}
                alt="Skater cursor"
                width={60}
                height={60}
                draggable={false}
            />
        </motion.div>
    )
}
