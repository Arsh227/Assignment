import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMousePosition } from '../hooks/useMousePosition'

const CursorTrail = () => {
  const { x, y } = useMousePosition()
  const [isVisible, setIsVisible] = useState(false)
  
  // Smooth spring animation for cursor trail
  const cursorX = useSpring(useMotionValue(x), { stiffness: 150, damping: 20 })
  const cursorY = useSpring(useMotionValue(y), { stiffness: 150, damping: 20 })

  useEffect(() => {
    cursorX.set(x)
    cursorY.set(y)
    
    // Show trail when mouse moves
    if (!isVisible) {
      setIsVisible(true)
    }
  }, [x, y, cursorX, cursorY, isVisible])

  // Hide cursor when mouse leaves window
  useEffect(() => {
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)
    
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  // Trail dots configuration
  const trailCount = 12
  const trailDots = Array.from({ length: trailCount }, (_, i) => i)

  if (!isVisible) return null

  return (
    <div className="cursor-trail-container">
      {/* Main cursor dot */}
      <motion.div
        className="cursor-trail-main"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />

      {/* Trail dots */}
      {trailDots.map((index) => {
        const delay = index * 0.02
        const size = 8 - index * 0.4
        const opacity = 0.8 - index * 0.06
        
        return (
          <motion.div
            key={index}
            className="cursor-trail-dot"
            style={{
              x: cursorX,
              y: cursorY,
              width: `${size}px`,
              height: `${size}px`,
            }}
            animate={{
              scale: [1, 0.8, 1],
              opacity: [opacity * 0.5, opacity, opacity * 0.5],
            }}
            transition={{
              x: {
                delay: delay,
                type: "spring",
                stiffness: 200 - index * 10,
                damping: 20 - index * 1,
              },
              y: {
                delay: delay,
                type: "spring",
                stiffness: 200 - index * 10,
                damping: 20 - index * 1,
              },
              scale: {
                duration: 1.5 + index * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: {
                duration: 1.5 + index * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        )
      })}
    </div>
  )
}

export default CursorTrail
