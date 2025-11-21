import { useState, useEffect } from 'react'

export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return offset
}

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const progress = scrollTop / (documentHeight - windowHeight)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollProgress
}

export const useElementScroll = (ref, speed = 0.5) => {
  const [transform, setTransform] = useState({ translateY: 0, rotateX: 0, opacity: 1 })

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height
      
      // Calculate when element enters viewport
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)))
      
      // Parallax translateY
      const translateY = (windowHeight - elementTop) * speed
      
      // 3D rotation based on scroll position
      const rotateX = (scrollProgress - 0.5) * 10
      
      // Opacity fade
      const opacity = Math.max(0, Math.min(1, scrollProgress * 2))

      setTransform({
        translateY: Math.max(0, translateY),
        rotateX,
        opacity: Math.max(0.3, opacity),
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, speed])

  return transform
}

