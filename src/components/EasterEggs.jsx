import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EasterEggs = () => {
  const [konamiCode, setKonamiCode] = useState([])
  const [showMessage, setShowMessage] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [showClickMessage, setShowClickMessage] = useState(false)

  useEffect(() => {
    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ]

    const handleKeyDown = (e) => {
      const newCode = [...konamiCode, e.code]
      setKonamiCode(newCode.slice(-10)) // Keep last 10 keys

      // Check if Konami code is entered
      if (newCode.length >= 10) {
        const lastTen = newCode.slice(-10)
        const matches = lastTen.every((key, index) => key === konamiSequence[index])
        
        if (matches) {
          setShowMessage(true)
          setTimeout(() => setShowMessage(false), 5000)
          
          // Add fun effect
          document.body.style.animation = 'rainbow 2s infinite'
          setTimeout(() => {
            document.body.style.animation = ''
          }, 2000)
        }
      }
    }

    // Click counter easter egg
    const handleClick = () => {
      setClickCount(prev => {
        const newCount = prev + 1
        if (newCount === 42) {
          setShowClickMessage(true)
          setTimeout(() => setShowClickMessage(false), 4000)
        }
        return newCount
      })
    }

    // Double click easter egg
    let lastClickTime = 0
    const handleDoubleClick = (e) => {
      const now = Date.now()
      if (now - lastClickTime < 300) {
        // Create sparkles
        for (let i = 0; i < 15; i++) {
          const sparkle = document.createElement('div')
          sparkle.style.position = 'fixed'
          sparkle.style.left = `${e.clientX}px`
          sparkle.style.top = `${e.clientY}px`
          sparkle.style.width = '4px'
          sparkle.style.height = '4px'
          sparkle.style.backgroundColor = '#6366f1'
          sparkle.style.borderRadius = '50%'
          sparkle.style.pointerEvents = 'none'
          sparkle.style.zIndex = '9999'
          
          document.body.appendChild(sparkle)

          const angle = (Math.PI * 2 * i) / 15
          const distance = 50 + Math.random() * 50
          const targetX = e.clientX + Math.cos(angle) * distance
          const targetY = e.clientY + Math.sin(angle) * distance

          sparkle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${targetX - e.clientX}px, ${targetY - e.clientY}px) scale(0)`, opacity: 0 }
          ], {
            duration: 600,
            easing: 'ease-out'
          }).onfinish = () => sparkle.remove()
        }
      }
      lastClickTime = now
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)
    document.addEventListener('dblclick', handleDoubleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('dblclick', handleDoubleClick)
    }
  }, [konamiCode])

  return (
    <>
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              color: 'white',
              padding: '24px 48px',
              borderRadius: '16px',
              zIndex: 10000,
              fontSize: '24px',
              fontWeight: 'bold',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              textAlign: 'center',
            }}
          >
            🎮 You found the Konami Code! 🎮
            <br />
            <span style={{ fontSize: '16px', fontWeight: 'normal' }}>
              You're awesome!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClickMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.9)',
              color: '#6366f1',
              padding: '16px 32px',
              borderRadius: '12px',
              zIndex: 10000,
              fontSize: '18px',
              fontWeight: 'bold',
              border: '2px solid #6366f1',
            }}
          >
            🎯 42 clicks! The answer to life, the universe, and everything! 🎯
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes rainbow {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
    </>
  )
}

export default EasterEggs

