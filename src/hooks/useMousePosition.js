import { useState, useEffect } from 'react'

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ 
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => {
      // Ensure position updates when mouse enters viewport
      window.addEventListener('mousemove', handleMouseMove)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return mousePosition
}
