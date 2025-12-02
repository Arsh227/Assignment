import { useState, useEffect, useRef } from 'react'

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  })
  const rafId = useRef(null)

  useEffect(() => {
    let lastX = mousePosition.x
    let lastY = mousePosition.y

    const handleMouseMove = (e) => {
      // Cancel any pending animation frame
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }

      // Use requestAnimationFrame for smooth updates
      rafId.current = requestAnimationFrame(() => {
        const newX = e.clientX
        const newY = e.clientY
        
        // Only update if position actually changed (prevents unnecessary renders)
        if (Math.abs(newX - lastX) > 0.1 || Math.abs(newY - lastY) > 0.1) {
          lastX = newX
          lastY = newY
          setMousePosition({ x: newX, y: newY })
        }
      })
    }

    const handleMouseEnter = (e) => {
      // Update position immediately when mouse enters
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Use passive listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return mousePosition
}
