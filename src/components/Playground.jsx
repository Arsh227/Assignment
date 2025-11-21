import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiRefresh } from 'react-icons/hi'

const Playground = ({ scrollProgress }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const experiments = [
    {
      id: 1,
      title: 'Gesture-Controlled Slides',
      description: 'Control presentations with hand gestures using computer vision',
      tech: 'Python · OpenCV · MediaPipe',
      color: '#6366f1',
    },
    {
      id: 2,
      title: 'AI Resume Tool',
      description: 'Generate and optimize resumes using GPT-4',
      tech: 'React · OpenAI API · Node.js',
      color: '#8b5cf6',
    },
    {
      id: 3,
      title: 'CSS Art Experiments',
      description: 'Creating art using pure CSS - no images, just code',
      tech: 'CSS · HTML · Creativity',
      color: '#ec4899',
    },
    {
      id: 4,
      title: 'Interactive Particle System',
      description: 'Mouse-reactive particle animations with physics',
      tech: 'JavaScript · Canvas API · Math',
      color: '#10b981',
    },
    {
      id: 5,
      title: 'Voice Command Interface',
      description: 'Voice-controlled web interface using Web Speech API',
      tech: 'JavaScript · Web APIs · UX',
      color: '#f59e0b',
    },
  ]

  const randomExperiment = () => {
    const randomIndex = Math.floor(Math.random() * experiments.length)
    setSelectedIndex(randomIndex)
  }

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
            Side projects, experiments, and creative chaos
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
            Random Experiment
          </motion.button>
        </div>
      </div>
    </section>
  )
}

export default Playground

