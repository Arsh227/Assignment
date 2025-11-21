import { useEffect, useRef } from 'react'
import { useScroll3D } from '../hooks/useScroll3D'

const InfiniteScrollBackground = () => {
  const { scrollY, scrollProgress, scrollVelocity } = useScroll3D()
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return

    // Create continuous scrolling effect
    const layers = containerRef.current.querySelectorAll('.scroll-layer')
    const viewportHeight = window.innerHeight
    
    layers.forEach((layer, index) => {
      const speed = (index + 1) * 0.5
      const offset = (scrollY * speed) % (viewportHeight * 2)
      layer.style.transform = `translateY(${offset}px)`
    })
  }, [scrollY])

  return (
    <div 
      ref={containerRef}
      className="infinite-scroll-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '200vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Layer 1 - Slow moving grid */}
      <div 
        className="scroll-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200vh',
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translateY(${scrollY * 0.2}px)`,
          opacity: 0.3,
        }}
      />

      {/* Layer 2 - Medium moving particles */}
      <div 
        className="scroll-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200vh',
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      >
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 37) % 100}%`,
              top: `${(i * 23) % 200}%`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: `rgba(99, 102, 241, ${0.3 + (i % 3) * 0.2})`,
              boxShadow: `0 0 ${10 + (i % 5) * 5}px rgba(99, 102, 241, 0.5)`,
              transform: `translateY(${Math.sin(scrollY * 0.01 + i) * 20}px)`,
            }}
          />
        ))}
      </div>

      {/* Layer 3 - Fast moving lines */}
      <div 
        className="scroll-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200vh',
          transform: `translateY(${scrollY * 0.6}px)`,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${(i * 47) % 100}%`,
              top: `${(i * 31) % 200}%`,
              width: '2px',
              height: `${100 + (i % 5) * 50}px`,
              background: `linear-gradient(to bottom, 
                transparent, 
                rgba(139, 92, 246, ${0.2 + (i % 3) * 0.1}), 
                transparent)`,
              transform: `rotate(${(i % 3) * 45}deg)`,
            }}
          />
        ))}
      </div>

      {/* Layer 4 - Continuous wave pattern */}
      <div 
        className="scroll-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200vh',
          transform: `translateY(${scrollY * 0.3}px)`,
          opacity: 0.2,
        }}
      >
        {typeof window !== 'undefined' && (
          <svg width="100%" height="200vh" style={{ position: 'absolute' }}>
            {[...Array(5)].map((_, i) => {
              const width = window.innerWidth || 1920
              return (
                <path
                  key={i}
                  d={`M 0 ${i * 400} Q ${width / 2} ${i * 400 + 100 + Math.sin(scrollY * 0.01 + i) * 50} ${width} ${i * 400}`}
                  stroke="rgba(99, 102, 241, 0.3)"
                  strokeWidth="2"
                  fill="none"
                  style={{
                    transform: `translateY(${Math.sin(scrollY * 0.005 + i) * 30}px)`,
                  }}
                />
              )
            })}
          </svg>
        )}
      </div>

      {/* Velocity-based glow effect */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${300 + scrollVelocity * 100}px`,
          height: `${300 + scrollVelocity * 100}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, 
            rgba(99, 102, 241, ${0.1 + scrollVelocity * 0.1}), 
            transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 0.1s ease-out',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

export default InfiniteScrollBackground

