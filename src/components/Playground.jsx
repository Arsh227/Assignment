import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiRefresh, HiPlay, HiStop, HiCode } from 'react-icons/hi'
import { useMousePosition } from '../hooks/useMousePosition'
import HandTracking from './HandTracking'

// Particle Playground Component
const ParticlePlayground = () => {
  const canvasRef = useRef(null)
  const { x, y } = useMousePosition()
  const [particles, setParticles] = useState([])
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const newParticles = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 4 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      })
    }
    setParticles(newParticles)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      newParticles.forEach((particle, i) => {
        // Mouse interaction
        const dx = x - rect.left - particle.x
        const dy = y - rect.top - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx -= (dx / distance) * force * 0.1
          particle.vy -= (dy / distance) * force * 0.1
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Friction
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Connect nearby particles
        newParticles.slice(i + 1).forEach(other => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist / 80)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [x, y])

  return (
    <div className="playground-game-container">
      <canvas
        ref={canvasRef}
        className="playground-canvas"
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.3)',
          cursor: 'crosshair',
        }}
      />
      <p className="playground-instructions">Move your mouse to interact with particles!</p>
    </div>
  )
}

// Drawing Canvas Component
const DrawingCanvas = () => {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#6366f1')
  const [brushSize, setBrushSize] = useState(5)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ffffff']

  return (
    <div className="playground-game-container">
      <div className="drawing-controls">
        <div className="color-picker">
          {colors.map((c) => (
            <button
              key={c}
              className={`color-btn ${color === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="brush-controls">
          <label>Brush Size: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
          />
        </div>
        <button onClick={clearCanvas} className="btn btn-secondary">
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        className="playground-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '12px',
          background: 'rgba(0, 0, 0, 0.3)',
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />
      <p className="playground-instructions">Click and drag to draw!</p>
    </div>
  )
}

// Click Game Component
const ClickGame = () => {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isPlaying, setIsPlaying] = useState(false)
  const [targets, setTargets] = useState([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsPlaying(false)
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, timeLeft])

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setIsPlaying(true)
    generateTargets()
  }

  const generateTargets = () => {
    const newTargets = []
    for (let i = 0; i < 5; i++) {
      newTargets.push({
        id: Math.random(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 10,
        size: Math.random() * 30 + 20,
      })
    }
    setTargets(newTargets)
  }

  const hitTarget = (id) => {
    if (!isPlaying) return
    setScore(score + 10)
    setTargets(targets.filter(t => t.id !== id))
    setTimeout(() => {
      if (isPlaying) {
        setTargets([...targets.filter(t => t.id !== id), {
          id: Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 10,
          size: Math.random() * 30 + 20,
        }])
      }
    }, 100)
  }

  return (
    <div className="playground-game-container">
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Score:</span>
          <span className="stat-value">{score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{timeLeft}s</span>
        </div>
      </div>
      {!isPlaying ? (
        <div className="game-start-screen">
          <h3>Click the Targets!</h3>
          <p>Click as many targets as you can in 30 seconds</p>
          <button onClick={startGame} className="btn btn-primary">
            <HiPlay size={20} />
            Start Game
          </button>
        </div>
      ) : (
        <div className="game-area" style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', background: 'rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              className="game-target"
              style={{
                position: 'absolute',
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #6366f1, #8b5cf6)',
                border: 'none',
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => hitTarget(target.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Color Mixer Component
const ColorMixer = () => {
  const [r, setR] = useState(99)
  const [g, setG] = useState(102)
  const [b, setB] = useState(241)
  const [savedColors, setSavedColors] = useState([])

  const color = `rgb(${r}, ${g}, ${b})`
  const hexColor = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`

  const saveColor = () => {
    setSavedColors([...savedColors, { r, g, b, hex: hexColor }])
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    alert(`Copied ${text} to clipboard!`)
  }

  return (
    <div className="playground-game-container">
      <div className="color-mixer-display" style={{ background: color, height: '200px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: r + g + b > 382 ? '#000' : '#fff' }}>
        {hexColor}
      </div>
      <div className="color-controls">
        <div className="color-slider">
          <label>Red: {r}</label>
          <input type="range" min="0" max="255" value={r} onChange={(e) => setR(Number(e.target.value))} />
        </div>
        <div className="color-slider">
          <label>Green: {g}</label>
          <input type="range" min="0" max="255" value={g} onChange={(e) => setG(Number(e.target.value))} />
        </div>
        <div className="color-slider">
          <label>Blue: {b}</label>
          <input type="range" min="0" max="255" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </div>
      </div>
      <div className="color-actions">
        <button onClick={() => copyToClipboard(hexColor)} className="btn btn-primary">
          Copy Hex
        </button>
        <button onClick={() => copyToClipboard(color)} className="btn btn-secondary">
          Copy RGB
        </button>
        <button onClick={saveColor} className="btn btn-secondary">
          Save Color
        </button>
      </div>
      {savedColors.length > 0 && (
        <div className="saved-colors">
          <h4>Saved Colors:</h4>
          <div className="color-palette">
            {savedColors.map((color, i) => (
              <div
                key={i}
                className="saved-color-item"
                style={{ background: color.hex }}
                onClick={() => {
                  setR(color.r)
                  setG(color.g)
                  setB(color.b)
                }}
                title={color.hex}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Snake Game Component
const SnakeGame = () => {
  const canvasRef = useRef(null)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    gridSize: 20,
  })

  useEffect(() => {
    if (!isPlaying) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const gridSize = gameStateRef.current.gridSize
    canvas.width = 400
    canvas.height = 400
    const tileSize = canvas.width / gridSize

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const { snake, food } = gameStateRef.current

      // Draw food
      ctx.fillStyle = '#10b981'
      ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize - 2, tileSize - 2)

      // Draw snake
      ctx.fillStyle = '#6366f1'
      snake.forEach((segment, i) => {
        if (i === 0) ctx.fillStyle = '#8b5cf6'
        else ctx.fillStyle = '#6366f1'
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize - 2, tileSize - 2)
      })
    }

    const gameLoop = setInterval(() => {
      const state = gameStateRef.current
      const head = { ...state.snake[0] }
      head.x += state.direction.x
      head.y += state.direction.y

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true)
        setIsPlaying(false)
        return
      }

      // Check self collision
      if (state.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true)
        setIsPlaying(false)
        return
      }

      state.snake.unshift(head)

      // Check food collision
      if (head.x === state.food.x && head.y === state.food.y) {
        setScore(score => score + 10)
        state.food = {
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        }
      } else {
        state.snake.pop()
      }

      draw()
    }, 150)

    draw()

    return () => clearInterval(gameLoop)
  }, [isPlaying])

  const handleKeyPress = (e) => {
    if (!isPlaying) return
    const state = gameStateRef.current
    const key = e.key

    if (key === 'ArrowUp' && state.direction.y === 0) state.direction = { x: 0, y: -1 }
    if (key === 'ArrowDown' && state.direction.y === 0) state.direction = { x: 0, y: 1 }
    if (key === 'ArrowLeft' && state.direction.x === 0) state.direction = { x: -1, y: 0 }
    if (key === 'ArrowRight' && state.direction.x === 0) state.direction = { x: 1, y: 0 }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isPlaying])

  const startGame = () => {
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      food: { x: 15, y: 15 },
      gridSize: 20,
    }
    setScore(0)
    setGameOver(false)
    setIsPlaying(true)
  }

  return (
    <div className="playground-game-container">
      <div className="game-stats">
        <div className="stat">
          <span className="stat-label">Score:</span>
          <span className="stat-value">{score}</span>
        </div>
      </div>
      {!isPlaying ? (
        <div className="game-start-screen">
          {gameOver && <h3>Game Over! Final Score: {score}</h3>}
          {!gameOver && <h3>Snake Game</h3>}
          <p>Use arrow keys to control the snake</p>
          <button onClick={startGame} className="btn btn-primary">
            <HiPlay size={20} />
            {gameOver ? 'Play Again' : 'Start Game'}
          </button>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="playground-canvas"
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '400px',
              borderRadius: '12px',
              background: 'rgba(0, 0, 0, 0.3)',
              margin: '0 auto',
              display: 'block',
            }}
          />
          <p className="playground-instructions">Use arrow keys to play!</p>
        </>
      )}
    </div>
  )
}

const Playground = ({ scrollProgress }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const experiments = [
    {
      id: 1,
      title: 'Particle Playground',
      description: 'Interactive particle physics simulation - move your mouse to interact!',
      tech: 'Canvas API · Physics · Math',
      color: '#6366f1',
      component: ParticlePlayground,
    },
    {
      id: 2,
      title: 'Drawing Canvas',
      description: 'Draw and create art with customizable brushes and colors',
      tech: 'Canvas API · HTML5 · Creativity',
      color: '#8b5cf6',
      component: DrawingCanvas,
    },
    {
      id: 3,
      title: 'Click Game',
      description: 'Test your reflexes - click targets as fast as you can!',
      tech: 'React · Framer Motion · Game Logic',
      color: '#ec4899',
      component: ClickGame,
    },
    {
      id: 4,
      title: 'Color Mixer',
      description: 'Mix colors and create custom palettes',
      tech: 'React · Color Theory · UX',
      color: '#10b981',
      component: ColorMixer,
    },
    {
      id: 5,
      title: 'Snake Game',
      description: 'Classic snake game - use arrow keys to play',
      tech: 'Canvas API · Game Logic · React',
      color: '#f59e0b',
      component: SnakeGame,
    },
    {
      id: 6,
      title: 'Hand Tracking',
      description: 'Control your computer with hand gestures - index finger as mouse, gestures for click and scroll',
      tech: 'MediaPipe · Webcam · AI · Gesture Recognition',
      color: '#00ffff',
      component: HandTracking,
    },
  ]

  const randomExperiment = () => {
    const randomIndex = Math.floor(Math.random() * experiments.length)
    setSelectedIndex(randomIndex)
  }

  const SelectedComponent = experiments[selectedIndex]?.component

  return (
    <section id="playground" className="playground">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Playground</h2>
          <p className="section-subtitle">
            Interactive experiments and mini-games - click to play!
          </p>
        </motion.div>

        <div className="playground-content">
          <div className="playground-cards">
            {experiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                className={`playground-card ${index === selectedIndex ? 'active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: index === selectedIndex ? 1.1 : 1.05,
                  rotate: index === selectedIndex ? 0 : 5,
                  y: -10,
                  rotateY: 5,
                  boxShadow: `0 20px 50px ${experiment.color}40`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIndex(index)}
                style={{
                  borderColor: index === selectedIndex ? experiment.color : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                <div
                  className="playground-card-accent"
                  style={{ background: experiment.color }}
                />
                <h3>{experiment.title}</h3>
                <p>{experiment.description}</p>
                <span className="playground-tech">{experiment.tech}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="playground-game-area"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            key={selectedIndex}
            transition={{ duration: 0.3 }}
          >
            {SelectedComponent && <SelectedComponent />}
          </motion.div>

          <motion.button
            className="playground-random-btn magnetic-button"
            onClick={(e) => {
              randomExperiment()
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
            whileHover={{ 
              scale: 1.1, 
              rotate: 360,
              boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "linear"
              }}
            >
              <HiRefresh size={20} />
            </motion.span>
            Random Game
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default Playground
