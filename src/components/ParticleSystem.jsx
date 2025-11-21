import { useEffect, useRef } from 'react'
import { useMousePosition } from '../hooks/useMousePosition'

const ParticleSystem = () => {
  const canvasRef = useRef(null)
  const { x, y } = useMousePosition()
  const particlesRef = useRef([])
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = particlesRef.current

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const createParticle = (mx, my) => {
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']
      return {
        x: mx || Math.random() * canvas.width,
        y: my || Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: Math.random() * 0.02 + 0.005,
      }
    }

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    // Add particles on mouse move
    let mouseX = x
    let mouseY = y
    let lastMouseX = x
    let lastMouseY = y

    const handleMouseMove = () => {
      mouseX = x
      mouseY = y
      // Add particle trail
      if (Math.abs(mouseX - lastMouseX) > 5 || Math.abs(mouseY - lastMouseY) > 5) {
        particles.push(createParticle(mouseX, mouseY))
        lastMouseX = mouseX
        lastMouseY = mouseY
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        // Update position
        p.x += p.vx
        p.y += p.vy
        
        // Update life
        p.life -= p.decay
        
        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // Draw particle
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = p.color
        ctx.fill()
        ctx.restore()

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.save()
            ctx.globalAlpha = (1 - distance / 100) * 0.2 * p.life * p2.life
            ctx.strokeStyle = p.color
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }

      // Keep particle count manageable
      if (particles.length < 30) {
        particles.push(createParticle())
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
    handleMouseMove()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [x, y])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6,
      }}
    />
  )
}

export default ParticleSystem

