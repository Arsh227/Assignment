import { useState, useEffect, useRef } from 'react'

// Throttle function for performance optimization
const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const useScroll3D = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState('down')
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const lastScrollYRef = useRef(0)
  const lastTimeRef = useRef(Date.now())
  const rafRef = useRef(null)

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const maxScroll = documentHeight - windowHeight
      
      const now = Date.now()
      const deltaTime = now - lastTimeRef.current
      const deltaScroll = Math.abs(currentScroll - lastScrollYRef.current)
      
      // Calculate scroll velocity
      const velocity = deltaTime > 0 ? deltaScroll / deltaTime : 0
      setScrollVelocity(velocity)
      
      // Determine scroll direction
      if (currentScroll > lastScrollYRef.current) {
        setScrollDirection('down')
      } else if (currentScroll < lastScrollYRef.current) {
        setScrollDirection('up')
      }
      
      setScrollY(currentScroll)
      setScrollProgress(Math.min(currentScroll / maxScroll, 1))
      
      lastScrollYRef.current = currentScroll
      lastTimeRef.current = now
    }

    // Throttled scroll handler using requestAnimationFrame for smooth 60fps
    const handleScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        updateScroll()
        rafRef.current = null
      })
    }

    // Throttle to ~16ms (60fps) for optimal performance
    const throttledHandleScroll = throttle(handleScroll, 16)

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    updateScroll() // Initial call
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return { 
    scrollProgress, 
    scrollY, 
    scrollDirection, 
    scrollVelocity,
    // Infinite scroll values (loops continuously)
    infiniteScroll: scrollY % (window.innerHeight * 2),
    infiniteProgress: (scrollY % (window.innerHeight * 2)) / (window.innerHeight * 2)
  }
}

