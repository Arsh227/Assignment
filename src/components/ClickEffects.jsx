import { useEffect } from 'react'

const ClickEffects = () => {
  useEffect(() => {
    const createConfetti = (x, y) => {
      const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#f97316']
      const confettiCount = 20

      for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div')
        confetti.style.position = 'fixed'
        confetti.style.left = `${x}px`
        confetti.style.top = `${y}px`
        confetti.style.width = '8px'
        confetti.style.height = '8px'
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
        confetti.style.pointerEvents = 'none'
        confetti.style.zIndex = '9999'
        confetti.style.opacity = '1'
        confetti.style.transform = 'translate(0, 0) rotate(0deg)'
        
        document.body.appendChild(confetti)

        const angle = (Math.PI * 2 * i) / confettiCount
        const velocity = 5 + Math.random() * 5
        const vx = Math.cos(angle) * velocity
        const vy = Math.sin(angle) * velocity
        const rotation = Math.random() * 360
        const rotationSpeed = (Math.random() - 0.5) * 10

        let posX = x
        let posY = y
        let currentRotation = rotation
        let opacity = 1
        let frame = 0

        const animate = () => {
          frame++
          posX += vx
          posY += vy + frame * 0.1 // gravity
          currentRotation += rotationSpeed
          opacity -= 0.02

          confetti.style.left = `${posX}px`
          confetti.style.top = `${posY}px`
          confetti.style.transform = `translate(0, 0) rotate(${currentRotation}deg)`
          confetti.style.opacity = opacity.toString()

          if (opacity > 0 && posY < window.innerHeight + 100) {
            requestAnimationFrame(animate)
          } else {
            confetti.remove()
          }
        }

        requestAnimationFrame(animate)
      }
    }

    const createRipple = (x, y) => {
      const ripple = document.createElement('div')
      ripple.style.position = 'fixed'
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.width = '0'
      ripple.style.height = '0'
      ripple.style.borderRadius = '50%'
      ripple.style.border = '2px solid rgba(99, 102, 241, 0.6)'
      ripple.style.pointerEvents = 'none'
      ripple.style.zIndex = '9999'
      ripple.style.transform = 'translate(-50%, -50%)'
      
      document.body.appendChild(ripple)

      let size = 0
      let opacity = 0.6

      const animate = () => {
        size += 8
        opacity -= 0.02

        ripple.style.width = `${size}px`
        ripple.style.height = `${size}px`
        ripple.style.opacity = opacity.toString()

        if (opacity > 0) {
          requestAnimationFrame(animate)
        } else {
          ripple.remove()
        }
      }

      requestAnimationFrame(animate)
    }

    const handleClick = (e) => {
      // Don't trigger on buttons and links to avoid interference
      if (e.target.tagName === 'BUTTON' || e.target.closest('button') || 
          e.target.tagName === 'A' || e.target.closest('a')) {
        return
      }

      createConfetti(e.clientX, e.clientY)
      createRipple(e.clientX, e.clientY)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}

export default ClickEffects

