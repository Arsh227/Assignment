import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiArrowDown, HiDownload } from 'react-icons/hi'

const Hero = ({ scrollProgress, scrollY }) => {
  const [currentRole, setCurrentRole] = useState(0)
  const roles = [
    'Developer',
    'Designer',
    'Problem Solver',
    'Chaos Thinker',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }


  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: 0.3
          }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30, x: -30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ 
              delay: 0.5, 
              duration: 1,
              ease: [0.6, -0.05, 0.01, 0.99]
            }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Designing playful experiences
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              with code and curiosity.
            </motion.span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            I craft digital experiences that blend beautiful design with
            <br />
            powerful functionality. Web development · AI/ML · UX Design
          </motion.p>

          <motion.div
            className="hero-roles"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 1,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            <span className="hero-roles-prefix">I'm a </span>
            <motion.span
              key={currentRole}
              className="hero-roles-role"
              initial={{ opacity: 0, y: 10, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -10, rotateX: 90 }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              {roles[currentRole]}
            </motion.span>
          </motion.div>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.2,
              type: "spring",
              stiffness: 150,
              damping: 15
            }}
          >
            <motion.button
              className="btn btn-primary magnetic-button"
              onClick={(e) => {
                scrollToSection('#work')
                // Ripple effect
                const ripple = document.createElement('span')
                ripple.className = 'ripple'
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                ripple.style.left = `${x}px`
                ripple.style.top = `${y}px`
                e.currentTarget.appendChild(ripple)
                setTimeout(() => ripple.remove(), 600)
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.1, 
                y: -5, 
                boxShadow: "0 15px 40px rgba(99, 102, 241, 0.5)",
                rotate: 1
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                animate={{ 
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "linear"
                }}
                style={{
                  background: 'linear-gradient(90deg, white, rgba(255,255,255,0.5), white)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                View My Work
              </motion.span>
              <motion.span
                animate={{ x: [0, 5, 0], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
              >
                <HiArrowDown className="btn-icon" />
              </motion.span>
            </motion.button>
            <motion.button
              className="btn btn-secondary magnetic-button"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.1, 
                y: -5,
                boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
                rotate: -1
              }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                const ripple = document.createElement('span')
                ripple.className = 'ripple'
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                ripple.style.left = `${x}px`
                ripple.style.top = `${y}px`
                e.currentTarget.appendChild(ripple)
                setTimeout(() => ripple.remove(), 600)
              }}
            >
              Download Resume
              <HiDownload className="btn-icon" />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ 
            delay: 0.6,
            duration: 1.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <div className="hero-card-stack">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="hero-card"
                style={{ zIndex: 3 - i }}
                initial={{ opacity: 0, y: 100, rotate: -45 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotate: 0,
                  y: [0, -10, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  initial: { delay: 0.8 + i * 0.2, duration: 0.8, type: "spring" },
                  y: { duration: 3 + i, repeat: Infinity, delay: i * 0.5 },
                  rotate: { duration: 3 + i, repeat: Infinity, delay: i * 0.5 },
                }}
              >
                {i === 0 && (
                  <img 
                    src="/images/about/profile.jpeg" 
                    alt="Arsh Khandpur"
                    className="hero-profile-image"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

