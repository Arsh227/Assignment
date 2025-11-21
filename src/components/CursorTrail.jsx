import { useEffect, useRef } from 'react'
import { useMousePosition } from '../hooks/useMousePosition'

const CursorTrail = () => {
  const { x, y } = useMousePosition()
  const trailRef = useRef([])

  useEffect(() => {
    if (x === null || y === null) return

    // Create trail dot
    const dot = document.createElement('div')
    dot.style.position = 'fixed'
    dot.style.left = `${x}px`
    dot.style.top = `${y}px`
    dot.style.width = '10px'
    dot.style.height = '10px'
    dot.style.borderRadius = '50%'
    dot.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.4))'
    dot.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.5)'
    dot.style.pointerEvents = 'none'
    dot.style.zIndex = '9998'
    dot.style.transform = 'translate(-50%, -50%)'
    dot.style.transition = 'opacity 0.3s ease-out'
    
    document.body.appendChild(dot)
    trailRef.current.push(dot)

    // Remove old dots
    if (trailRef.current.length > 15) {
      const oldDot = trailRef.current.shift()
      oldDot.style.opacity = '0'
      setTimeout(() => oldDot.remove(), 300)
    }

    // Fade out dots
    trailRef.current.forEach((d, index) => {
      const opacity = 1 - (index / trailRef.current.length) * 0.8
      d.style.opacity = opacity.toString()
      const scale = 1 - (index / trailRef.current.length) * 0.5
      d.style.transform = `translate(-50%, -50%) scale(${scale})`
    })
  }, [x, y])

  return null
}

export default CursorTrail

