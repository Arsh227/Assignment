import { useEffect, useRef, useState } from 'react'
import { useScroll3D } from '../hooks/useScroll3D'
import { useMousePosition } from '../hooks/useMousePosition'

const InteractiveBackground = () => {
  const { scrollY, scrollProgress } = useScroll3D()
  const { x, y } = useMousePosition()
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [mouseVelocity, setMouseVelocity] = useState({ vx: 0, vy: 0 })
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const prevMouseRef = useRef({ x: 0, y: 0 })
  const prevScrollRef = useRef(scrollY)

  // Track mouse velocity for dynamic connections
  useEffect(() => {
    const deltaX = x - prevMouseRef.current.x
    const deltaY = y - prevMouseRef.current.y
    const timeDelta = 16 // ~60fps
    
    setMouseVelocity({
      vx: deltaX / timeDelta,
      vy: deltaY / timeDelta,
    })
    
    prevMouseRef.current = { x, y }
  }, [x, y])

  // Track scroll velocity
  useEffect(() => {
    const deltaScroll = scrollY - prevScrollRef.current
    setScrollVelocity(Math.abs(deltaScroll))
    prevScrollRef.current = scrollY
  }, [scrollY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let particles = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create animated gradient mesh particles
    const createParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          radius: Math.random() * 2 + 1.5,
          opacity: Math.random() * 0.5 + 0.3,
          color: Math.random() > 0.7 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.18)',
        })
      }
    }
    createParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Calculate mouse velocity magnitude
      const mouseSpeed = Math.sqrt(mouseVelocity.vx ** 2 + mouseVelocity.vy ** 2)
      const isMouseMoving = mouseSpeed > 0.5
      const isScrolling = scrollVelocity > 0.5

      // Dynamic connection distance based on interaction (very slow changes)
      const baseConnectionDistance = 120
      const activeConnectionDistance = isMouseMoving || isScrolling ? 135 : baseConnectionDistance
      
      // Connection opacity multiplier based on activity (very slow, very subtle)
      const activityMultiplier = isMouseMoving || isScrolling ? 1.05 : 0.98

      // Mouse influence
      const mouseX = x / canvas.width
      const mouseY = y / canvas.height

      // Draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Enhanced mouse interaction when moving (very slow)
        const dx = mouseX * canvas.width - particle.x
        const dy = mouseY * canvas.height - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = isMouseMoving ? 250 : 200

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance
          const interactionStrength = isMouseMoving ? 0.05 : 0.04
          particle.x += (dx / distance) * force * interactionStrength
          particle.y += (dy / distance) * force * interactionStrength
        }

        // Scroll-based movement (very slow)
        if (isScrolling) {
          particle.x += (Math.random() - 0.5) * scrollVelocity * 0.002
          particle.y += (Math.random() - 0.5) * scrollVelocity * 0.002
        }

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle with very subtle enhanced visibility when active (very slow change)
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        const particleOpacity = isMouseMoving || isScrolling 
          ? Math.min(1, particle.opacity * 1.02) 
          : particle.opacity
        ctx.globalAlpha = particleOpacity
        ctx.fill()
        ctx.globalAlpha = 1

        // Connect nearby particles with dynamic distance
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < activeConnectionDistance) {
            // Calculate connection strength
            const connectionStrength = 1 - (distance / activeConnectionDistance)
            const baseOpacity = connectionStrength * 0.35 * activityMultiplier
            
            // Enhance connections near mouse when moving (very subtle)
            const mouseDx = mouseX * canvas.width - (particle.x + otherParticle.x) / 2
            const mouseDy = mouseY * canvas.height - (particle.y + otherParticle.y) / 2
            const mouseDistance = Math.sqrt(mouseDx ** 2 + mouseDy ** 2)
            const mouseInfluence = mouseDistance < 200 && isMouseMoving 
              ? (1 - mouseDistance / 200) * 0.08 
              : 0
            
            const finalOpacity = Math.min(0.5, baseOpacity + mouseInfluence)

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${finalOpacity})`
            ctx.lineWidth = isMouseMoving || isScrolling ? 1.25 : 1.2
            ctx.stroke()
          }
        })
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [x, y, mouseVelocity, scrollVelocity])

  // Calculate scroll-based gradient position
  const gradientX = 50 + Math.sin(scrollProgress * Math.PI * 2) * 20
  const gradientY = 50 + Math.cos(scrollProgress * Math.PI * 2) * 20

  return (
    <div 
      className="interactive-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(
              circle at ${gradientX}% ${gradientY}%,
              rgba(255, 255, 255, 0.12) 0%,
              transparent 60%
            ),
            radial-gradient(
              circle at ${100 - gradientX}% ${100 - gradientY}%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 60%
            )
          `,
          transform: `translateY(${scrollY * 0.03}px)`,
          transition: 'background 1s ease-out',
        }}
      />

      {/* Animated grid pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200%',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.05}px)`,
          opacity: 0.8,
        }}
      />

      {/* Interactive particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 1,
        }}
      />

      {/* Mouse-responsive spotlight effect */}
      <div
        style={{
          position: 'absolute',
          left: typeof window !== 'undefined' ? `${(x / window.innerWidth) * 100}%` : '50%',
          top: typeof window !== 'undefined' ? `${(y / window.innerHeight) * 100}%` : '50%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 1.2s ease-out, top 1.2s ease-out',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default InteractiveBackground

