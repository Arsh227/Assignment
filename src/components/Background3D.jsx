import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useScroll3D } from '../hooks/useScroll3D'
import { useMousePosition } from '../hooks/useMousePosition'

const Background3D = () => {
  const { scrollProgress, scrollY } = useScroll3D()
  const { x, y } = useMousePosition()
  const [isLoaded, setIsLoaded] = useState(false)
  const [mouseVelocity, setMouseVelocity] = useState({ vx: 0, vy: 0 })
  const prevMouseRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ vx: 0, vy: 0 })

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Track mouse velocity for dynamic effects
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const deltaX = x - prevMouseRef.current.x
    const deltaY = y - prevMouseRef.current.y
    const timeDelta = 16 // ~60fps
    
    velocityRef.current = {
      vx: deltaX / timeDelta * 2,
      vy: deltaY / timeDelta * 2,
    }
    
    setMouseVelocity(velocityRef.current)
    prevMouseRef.current = { x, y }
  }, [x, y])

  // Calculate mouse influence (normalized to -1 to 1)
  const mouseX = typeof window !== 'undefined' ? (x / window.innerWidth - 0.5) * 2 : 0
  const mouseY = typeof window !== 'undefined' ? (y / window.innerHeight - 0.5) * 2 : 0
  
  // Calculate distance from center for proximity effects
  const mouseDistance = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
  const proximityFactor = Math.max(0, 1 - mouseDistance / 1.2)
  
  // Velocity influence - much stronger
  const velocityInfluence = Math.min(1.5, (Math.abs(mouseVelocity.vx) + Math.abs(mouseVelocity.vy)) / 5)

  // Calculate object positions relative to mouse for proximity scaling - MUCH more sensitive
  const getObjectProximity = (objX, objY) => {
    if (typeof window === 'undefined') return 0
    const screenX = (objX / window.innerWidth) * 2 - 1
    const screenY = (objY / window.innerHeight) * 2 - 1
    const dist = Math.sqrt((mouseX - screenX) ** 2 + (mouseY - screenY) ** 2)
    return Math.max(0, 1 - dist / 0.5) // Much larger proximity radius
  }

  // DRAMATICALLY enhanced mouse interaction - objects follow mouse much more closely
  const object1X = scrollY * 0.3 + Math.sin(scrollProgress * Math.PI * 2) * 30 + mouseX * 200 + mouseVelocity.vx * 10
  const object1Y = scrollY * 0.2 + Math.cos(scrollProgress * Math.PI * 2) * 20 + mouseY * 150 + mouseVelocity.vy * 10
  const object1Rotate = scrollProgress * 360 + mouseX * 150 + mouseVelocity.vx * 15
  const object1Proximity = getObjectProximity(object1X, object1Y)
  const object1Scale = 1 + object1Proximity * 1.2 + proximityFactor * 0.5 + velocityInfluence * 0.4

  const object2X = scrollY * -0.25 + Math.cos(scrollProgress * Math.PI * 2) * 25 + mouseX * -180 - mouseVelocity.vx * 10
  const object2Y = scrollY * 0.15 + Math.sin(scrollProgress * Math.PI * 2) * 20 + mouseY * 130 - mouseVelocity.vy * 10
  const object2Rotate = scrollProgress * -270 + mouseY * 120 + mouseVelocity.vy * 15
  const object2Proximity = getObjectProximity(object2X, object2Y)
  const object2Scale = 1 + object2Proximity * 1.5 + velocityInfluence * 0.6

  const object3X = scrollY * 0.2 + Math.sin(scrollProgress * Math.PI * 3) * 20 + mouseX * 150 + mouseVelocity.vx * 8
  const object3Y = scrollY * -0.25 + Math.cos(scrollProgress * Math.PI * 3) * 20 + mouseY * -150 - mouseVelocity.vy * 8
  const object3Rotate = scrollProgress * 180 + (mouseX + mouseY) * 100 + (mouseVelocity.vx + mouseVelocity.vy) * 12
  const object3Proximity = getObjectProximity(object3X, object3Y)
  const object3Scale = 1 + object3Proximity * 1.3 + proximityFactor * 0.6 + velocityInfluence * 0.5

  const object4X = scrollY * -0.15 + Math.cos(scrollProgress * Math.PI * 2.5) * 20 + mouseX * -130 - mouseVelocity.vx * 8
  const object4Y = scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 20 + mouseY * -130 - mouseVelocity.vy * 8
  const object4Rotate = scrollProgress * 240 + mouseX * -100 - mouseVelocity.vx * 12
  const object4Proximity = getObjectProximity(object4X, object4Y)
  const object4Scale = 1 + object4Proximity * 1.1 + velocityInfluence * 0.4

  const object5X = scrollY * 0.3 + Math.sin(scrollProgress * Math.PI * 1.5) * 25 + mouseX * 180 + mouseVelocity.vx * 10
  const object5Y = scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.5) * 25 + mouseY * 150 + mouseVelocity.vy * 10
  const object5Rotate = scrollProgress * -180 + mouseY * -120 - mouseVelocity.vy * 15
  const object5Proximity = getObjectProximity(object5X, object5Y)
  const object5Scale = 1 + object5Proximity * 1.2 + proximityFactor * 0.5 + velocityInfluence * 0.4

  return (
    <div className="background-3d-container">
      {/* Floating 3D Cube 1 - Bold */}
      <motion.div 
        className="bg-3d-object bg-cube-1"
        initial={{ opacity: 0, scale: 0, rotateX: -180, rotateY: -180 }}
        animate={{ 
          opacity: isLoaded ? Math.min(1, 0.9 + object1Proximity * 0.1 + proximityFactor * 0.3) : 0,
          scale: isLoaded ? object1Scale : 0,
          rotateX: isLoaded ? object1Rotate : -180,
          rotateY: isLoaded ? object1Rotate * 0.7 : -180,
          x: isLoaded ? object1X : 0,
          y: isLoaded ? object1Y : 0,
        }}
        transition={{ 
          duration: 1.5,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          filter: `brightness(${1 + object1Proximity * 1.2 + proximityFactor * 0.8}) drop-shadow(0 0 ${20 + object1Proximity * 60 + velocityInfluence * 30}px rgba(99, 102, 241, ${0.6 + object1Proximity * 0.9}))`,
        }}
      >
        <div className="bg-cube-face bg-front"></div>
        <div className="bg-cube-face bg-back"></div>
        <div className="bg-cube-face bg-right"></div>
        <div className="bg-cube-face bg-left"></div>
        <div className="bg-cube-face bg-top"></div>
        <div className="bg-cube-face bg-bottom"></div>
      </motion.div>

      {/* Floating 3D Sphere 1 */}
      <motion.div 
        className="bg-3d-object bg-sphere-1"
        initial={{ opacity: 0, scale: 0, x: -200, y: -200 }}
        animate={{ 
          opacity: isLoaded ? Math.min(1, 0.85 + object2Proximity * 0.15 + velocityInfluence * 0.2) : 0,
          scale: isLoaded ? object2Scale : 0,
          x: isLoaded ? object2X : -200,
          y: isLoaded ? object2Y : -200,
          rotateX: isLoaded ? object2Rotate : 0,
          rotateY: isLoaded ? object2Rotate * 1.2 : 0,
        }}
        transition={{ 
          duration: 1.2,
          delay: 0.4,
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          filter: `brightness(${1 + object2Proximity * 1.5 + velocityInfluence * 0.8}) drop-shadow(0 0 ${25 + object2Proximity * 80 + velocityInfluence * 40}px rgba(99, 102, 241, ${0.7 + object2Proximity * 1.0}))`,
        }}
      />

      {/* Floating 3D Octahedron */}
      <motion.div 
        className="bg-3d-object bg-octahedron"
        animate={{
          x: object3X,
          y: object3Y,
          rotateX: object3Rotate,
          rotateY: object3Rotate * 0.9,
          rotateZ: object3Rotate * 0.6,
          scale: object3Scale,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          opacity: Math.min(1, 0.9 + object3Proximity * 0.1 + proximityFactor * 0.3),
          filter: `brightness(${1 + object3Proximity * 1.3 + proximityFactor * 0.9}) drop-shadow(0 0 ${18 + object3Proximity * 70 + velocityInfluence * 35}px rgba(236, 72, 153, ${0.6 + object3Proximity * 0.9}))`,
        }}
      >
        <div className="bg-octa-face bg-octa-top"></div>
        <div className="bg-octa-face bg-octa-bottom"></div>
        <div className="bg-octa-face bg-octa-front"></div>
        <div className="bg-octa-face bg-octa-back"></div>
        <div className="bg-octa-face bg-octa-left"></div>
        <div className="bg-octa-face bg-octa-right"></div>
        <div className="bg-octa-face bg-octa-front-right"></div>
        <div className="bg-octa-face bg-octa-back-left"></div>
      </motion.div>

      {/* Floating 3D Pyramid */}
      <motion.div 
        className="bg-3d-object bg-pyramid"
        animate={{
          x: object4X,
          y: object4Y,
          rotateX: object4Rotate,
          rotateY: object4Rotate * 0.8,
          scale: object4Scale,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          opacity: Math.min(1, 0.85 + object4Proximity * 0.15 + velocityInfluence * 0.2),
          filter: `brightness(${1 + object4Proximity * 1.1 + velocityInfluence * 0.7}) drop-shadow(0 0 ${15 + object4Proximity * 50 + velocityInfluence * 25}px rgba(99, 102, 241, ${0.6 + object4Proximity * 0.8}))`,
        }}
      />

      {/* Floating 3D Cube 2 - Bold */}
      <motion.div 
        className="bg-3d-object bg-cube-2"
        animate={{
          x: object5X,
          y: object5Y,
          rotateX: object5Rotate,
          rotateY: object5Rotate * 0.6,
          rotateZ: object5Rotate * 0.4,
          scale: object5Scale,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          opacity: Math.min(1, 0.9 + object5Proximity * 0.1 + proximityFactor * 0.3),
          filter: `brightness(${1 + object5Proximity * 1.2 + proximityFactor * 0.8}) drop-shadow(0 0 ${20 + object5Proximity * 60 + velocityInfluence * 30}px rgba(139, 92, 246, ${0.6 + object5Proximity * 0.9}))`,
        }}
      >
        <div className="bg-cube-face bg-front"></div>
        <div className="bg-cube-face bg-back"></div>
        <div className="bg-cube-face bg-right"></div>
        <div className="bg-cube-face bg-left"></div>
        <div className="bg-cube-face bg-top"></div>
        <div className="bg-cube-face bg-bottom"></div>
      </motion.div>

      {/* Bold Large Geometric Figure */}
      <motion.div 
        className="bg-3d-object bg-bold-figure"
        animate={{
          x: scrollY * -0.3 + Math.cos(scrollProgress * Math.PI * 2) * 40 + mouseX * 250 + mouseVelocity.vx * 15,
          y: scrollY * 0.2 + Math.sin(scrollProgress * Math.PI * 2) * 30 + mouseY * 180 + mouseVelocity.vy * 15,
          rotateX: scrollProgress * 240 + mouseY * 100 + mouseVelocity.vy * 20,
          rotateY: scrollProgress * 200 + mouseX * 120 + mouseVelocity.vx * 20,
          rotateZ: scrollProgress * 60 + (mouseX + mouseY) * 80 + (mouseVelocity.vx + mouseVelocity.vy) * 12,
          scale: 1 + getObjectProximity(scrollY * -0.3 + Math.cos(scrollProgress * Math.PI * 2) * 40 + mouseX * 250, scrollY * 0.2 + Math.sin(scrollProgress * Math.PI * 2) * 30 + mouseY * 180) * 1.5 + velocityInfluence * 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          opacity: Math.min(1, 0.95 + proximityFactor * 0.2 + velocityInfluence * 0.3),
          filter: `brightness(${1 + proximityFactor * 1.5 + velocityInfluence * 1.0}) drop-shadow(0 0 ${30 + proximityFactor * 100 + velocityInfluence * 50}px rgba(236, 72, 153, ${0.8 + proximityFactor * 1.2}))`,
        }}
      >
        <div className="bg-bold-face bg-bold-front"></div>
        <div className="bg-bold-face bg-bold-back"></div>
        <div className="bg-bold-face bg-bold-right"></div>
        <div className="bg-bold-face bg-bold-left"></div>
        <div className="bg-bold-face bg-bold-top"></div>
        <div className="bg-bold-face bg-bold-bottom"></div>
      </motion.div>

      {/* Floating 3D Sphere 2 */}
      <motion.div 
        className="bg-3d-object bg-sphere-2"
        animate={{
          x: scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 30 + mouseX * -200 - mouseVelocity.vx * 10,
          y: scrollY * 0.3 + Math.cos(scrollProgress * Math.PI * 2.5) * 25 + mouseY * 180 + mouseVelocity.vy * 10,
          rotateX: scrollProgress * 200 + mouseY * 150 + mouseVelocity.vy * 15,
          rotateY: scrollProgress * 150 + mouseX * 120 + mouseVelocity.vx * 15,
          scale: 1 + getObjectProximity(scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 30 + mouseX * -200, scrollY * 0.3 + Math.cos(scrollProgress * Math.PI * 2.5) * 25 + mouseY * 180) * 1.4 + velocityInfluence * 0.7,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          opacity: Math.min(1, 0.85 + getObjectProximity(scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 30 + mouseX * -200, scrollY * 0.3 + Math.cos(scrollProgress * Math.PI * 2.5) * 25 + mouseY * 180) * 0.15 + velocityInfluence * 0.25),
          filter: `brightness(${1 + getObjectProximity(scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 30 + mouseX * -200, scrollY * 0.3 + Math.cos(scrollProgress * Math.PI * 2.5) * 25 + mouseY * 180) * 1.4 + velocityInfluence * 0.9}) drop-shadow(0 0 ${25 + getObjectProximity(scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 30 + mouseX * -200, scrollY * 0.3 + Math.cos(scrollProgress * Math.PI * 2.5) * 25 + mouseY * 180) * 80 + velocityInfluence * 40}px rgba(139, 92, 246, ${0.7 + getObjectProximity(scrollY * -0.2 + Math.sin(scrollProgress * Math.PI * 2.5) * 30 + mouseX * -200, scrollY * 0.3 + Math.cos(scrollProgress * Math.PI * 2.5) * 25 + mouseY * 180) * 1.0}))`,
        }}
      />

      {/* Floating 3D Tetrahedron */}
      <motion.div 
        className="bg-3d-object bg-tetrahedron"
        animate={{
          x: scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.8) * 30 + mouseX * 180 + mouseVelocity.vx * 10,
          y: scrollY * -0.25 + Math.sin(scrollProgress * Math.PI * 1.8) * 30 + mouseY * -180 - mouseVelocity.vy * 10,
          rotateX: scrollProgress * -220 + mouseY * -100 - mouseVelocity.vy * 12,
          rotateY: scrollProgress * 180 + mouseX * 100 + mouseVelocity.vx * 12,
          scale: 1 + getObjectProximity(scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.8) * 30 + mouseX * 180, scrollY * -0.25 + Math.sin(scrollProgress * Math.PI * 1.8) * 30 + mouseY * -180) * 1.3 + velocityInfluence * 0.6,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          transformStyle: 'preserve-3d',
          opacity: Math.min(1, 0.85 + getObjectProximity(scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.8) * 30 + mouseX * 180, scrollY * -0.25 + Math.sin(scrollProgress * Math.PI * 1.8) * 30 + mouseY * -180) * 0.15 + velocityInfluence * 0.2),
          filter: `brightness(${1 + getObjectProximity(scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.8) * 30 + mouseX * 180, scrollY * -0.25 + Math.sin(scrollProgress * Math.PI * 1.8) * 30 + mouseY * -180) * 1.2 + velocityInfluence * 0.8}) drop-shadow(0 0 ${18 + getObjectProximity(scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.8) * 30 + mouseX * 180, scrollY * -0.25 + Math.sin(scrollProgress * Math.PI * 1.8) * 30 + mouseY * -180) * 55 + velocityInfluence * 28}px rgba(139, 92, 246, ${0.6 + getObjectProximity(scrollY * 0.25 + Math.cos(scrollProgress * Math.PI * 1.8) * 30 + mouseX * 180, scrollY * -0.25 + Math.sin(scrollProgress * Math.PI * 1.8) * 30 + mouseY * -180) * 0.8}))`,
        }}
      />
    </div>
  )
}

export default Background3D

