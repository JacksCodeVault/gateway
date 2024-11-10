import { useEffect, useRef } from "react"
import { motion, useAnimationFrame } from "framer-motion"
import { cn } from "@/lib/utils"

export default function AnimatedGridPattern({
  numSquares = 30,
  className,
  duration = 3,
  maxOpacity = 0.1,
  repeatDelay = 1,
}) {
  const squares = useRef([])
  const timeouts = useRef([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  useAnimationFrame(() => {
    squares.current.forEach((square, i) => {
      if (!square) return

      const timeout = setTimeout(() => {
        square.style.opacity = Math.random() * maxOpacity
      }, (i * duration * 1000) / numSquares)

      timeouts.current.push(timeout)
    })

    const timeout = setTimeout(() => {
      squares.current.forEach(square => {
        if (!square) return
        square.style.opacity = 0
      })
    }, duration * 1000 + repeatDelay * 1000)

    timeouts.current.push(timeout)
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("absolute inset-0 grid", className)}
      style={{
        gridTemplateColumns: `repeat(${numSquares}, 1fr)`,
        gridTemplateRows: `repeat(${numSquares}, 1fr)`,
      }}
    >
      {Array.from({ length: numSquares * numSquares }).map((_, i) => (
        <div
          key={i}
          ref={el => (squares.current[i] = el)}
          className="border-[0.5px] border-neutral-200 dark:border-neutral-800 transition-opacity duration-1000"
        />
      ))}
    </motion.div>
  )
}
