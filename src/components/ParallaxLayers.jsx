import { useScroll3D } from '../hooks/useScroll3D'

const ParallaxLayers = () => {
  const { scrollY, scrollProgress, scrollDirection } = useScroll3D()

  // Create multiple parallax layers moving at different speeds
  const layers = [
    { speed: 0.1, opacity: 0.15, color: '#6366f1' },
    { speed: 0.2, opacity: 0.12, color: '#8b5cf6' },
    { speed: 0.3, opacity: 0.1, color: '#ec4899' },
    { speed: 0.4, opacity: 0.08, color: '#10b981' },
  ]

  return (
    <div 
      className="parallax-layers"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {layers.map((layer, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '200%',
            background: `
              radial-gradient(
                circle at ${50 + Math.sin(scrollY * 0.001 + index) * 20}% ${50 + Math.cos(scrollY * 0.001 + index) * 20}%,
                ${layer.color}${Math.floor(layer.opacity * 255).toString(16).padStart(2, '0')} 0%,
                transparent 50%
              )
            `,
            transform: `translateY(${scrollY * layer.speed}px) ${scrollDirection === 'down' ? 'scale(1)' : 'scale(0.98)'}`,
            transition: 'transform 0.1s ease-out',
            opacity: layer.opacity,
          }}
        />
      ))}

      {/* Animated gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '200%',
          background: `
            linear-gradient(
              ${scrollProgress * 360}deg,
              rgba(99, 102, 241, 0.05) 0%,
              rgba(139, 92, 246, 0.05) 25%,
              rgba(236, 72, 153, 0.05) 50%,
              rgba(16, 185, 129, 0.05) 75%,
              rgba(99, 102, 241, 0.05) 100%
            )
          `,
          transform: `translateY(${scrollY * 0.15}px)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Moving orbs */}
      {typeof window !== 'undefined' && [...Array(8)].map((_, i) => {
        const baseX = (i * 137.5) % 100
        const baseY = (i * 87.3) % 100
        const size = 100 + (i % 4) * 50
        const speed = 0.1 + (i % 3) * 0.05
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${baseX + Math.sin(scrollY * 0.0005 + i) * 10}%`,
              top: `${baseY + Math.cos(scrollY * 0.0005 + i) * 10}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, 
                rgba(${99 + (i % 3) * 40}, ${102 + (i % 2) * 50}, ${241 - (i % 2) * 50}, ${0.1 + (i % 3) * 0.05}), 
                transparent 70%)`,
              transform: `translate(-50%, -50%) translateY(${scrollY * speed}px)`,
              filter: 'blur(30px)',
              transition: 'all 0.2s ease-out',
            }}
          />
        )
      })}
    </div>
  )
}

export default ParallaxLayers

