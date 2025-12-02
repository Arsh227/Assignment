import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Projects from './components/Projects'
import About from './components/About'
import Skills from './components/Skills'
import Playground from './components/Playground'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ClickEffects from './components/ClickEffects'
import EasterEggs from './components/EasterEggs'
import InteractiveBackground from './components/InteractiveBackground'

import { useScroll3D } from './hooks/useScroll3D'
import { useMousePosition } from './hooks/useMousePosition'
import './App.css'

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const { scrollProgress, scrollY } = useScroll3D()
  const { x, y } = useMousePosition()

  // Throttled scroll handler for back to top button
  const handleScroll = useCallback(() => {
    setShowBackToTop(window.scrollY > 400)
  }, [])

  useEffect(() => {
    // Clean up any leftover purple dots from previous renders
    const cleanupPurpleDots = () => {
      const allDivs = document.querySelectorAll('div')
      allDivs.forEach(div => {
        const style = div.getAttribute('style') || ''
        const bgColor = window.getComputedStyle(div).backgroundColor
        const borderRadius = window.getComputedStyle(div).borderRadius
        const width = window.getComputedStyle(div).width
        const height = window.getComputedStyle(div).height
        
        // Remove small circular purple elements
        if (
          (bgColor.includes('rgb(99, 102, 241)') || bgColor.includes('rgb(139, 92, 246)')) &&
          (borderRadius === '50%' || borderRadius.includes('50%')) &&
          (parseInt(width) < 50 && parseInt(height) < 50) &&
          div.style.position === 'fixed'
        ) {
          div.remove()
        }
      })
    }
    
    // Run cleanup immediately and on interval
    cleanupPurpleDots()
    const cleanupInterval = setInterval(cleanupPurpleDots, 1000)
    
    let rafId = null
    const throttledHandleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        handleScroll()
        rafId = null
      })
    }
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      clearInterval(cleanupInterval)
      window.removeEventListener('scroll', throttledHandleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [handleScroll])

  // Memoized mouse parallax calculations
  const mouseX = useMemo(() => {
    if (typeof window === 'undefined') return 0
    return (x / window.innerWidth - 0.5) * 20
  }, [x])

  const mouseY = useMemo(() => {
    if (typeof window === 'undefined') return 0
    return (y / window.innerHeight - 0.5) * 20
  }, [y])

  // Memoized animation variants for performance
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }), [])

  const sectionVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }), [])

  return (
    <motion.div 
      className="app"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        '--mouse-x': `${mouseX}px`,
        '--mouse-y': `${mouseY}px`,
      }}
    >
      <InteractiveBackground />
      <ClickEffects />
      <EasterEggs />
      <Navigation />
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * 0.05}px)`,
        }}
      >
        <Hero scrollProgress={scrollProgress} scrollY={scrollY} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * 0.04}px)`,
        }}
      >
        <Projects scrollProgress={scrollProgress} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * -0.035}px)`,
          willChange: 'transform',
        }}
      >
        <About scrollProgress={scrollProgress} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * 0.045}px)`,
        }}
      >
        <Skills scrollProgress={scrollProgress} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * -0.04}px)`,
        }}
      >
        <Playground scrollProgress={scrollProgress} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * 0.035}px)`,
        }}
      >
        <Testimonials scrollProgress={scrollProgress} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * -0.03}px)`,
        }}
      >
        <Contact scrollProgress={scrollProgress} />
      </motion.div>
      <motion.div 
        variants={sectionVariants}
        style={{
          transform: `translateY(${scrollY * 0.02}px)`,
        }}
      >
        <Footer />
      </motion.div>
      {showBackToTop && <BackToTop />}
      <SpeedInsights />
    </motion.div>
  )
}

export default App

