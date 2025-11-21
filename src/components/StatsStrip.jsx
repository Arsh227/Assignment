import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiCode, HiClock, HiSparkles } from 'react-icons/hi'

const StatsStrip = ({ scrollProgress }) => {
  const statsRotation = scrollProgress * 180
  const [clickedIndex, setClickedIndex] = useState(null)
  
  const stats = [
    {
      icon: HiCode,
      value: '10+',
      altValues: ['15+', '20+', '25+', '10+'],
      label: 'Projects',
    },
    {
      icon: HiClock,
      value: '3+',
      altValues: ['4+', '5+', '6+', '3+'],
      label: 'Years tinkering with code',
    },
    {
      icon: HiSparkles,
      value: 'Web · AI · UX',
      altValues: ['React · Node · Python', 'Design · Code · Build', 'Web · AI · UX'],
      label: 'Expertise',
    },
  ]

  const handleStatClick = (index) => {
    setClickedIndex(index)
    setTimeout(() => setClickedIndex(null), 1000)
  }

  return (
    <section className="stats-strip">
      {/* 3D Rotating Cube */}
      <div 
        className="stats-3d-cube"
        style={{
          transform: `rotateX(${statsRotation}deg) rotateY(${statsRotation * 0.7}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="stats-cube-face stats-front"></div>
        <div className="stats-cube-face stats-back"></div>
        <div className="stats-cube-face stats-right"></div>
        <div className="stats-cube-face stats-left"></div>
        <div className="stats-cube-face stats-top"></div>
        <div className="stats-cube-face stats-bottom"></div>
      </div>
      
      <div className="stats-container">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              className="stat-item interactive-stat"
              initial={{ opacity: 0, y: 50, scale: 0.5, rotateX: -90 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.8,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{ 
                scale: 1.15, 
                y: -12, 
                rotateY: 8,
                rotateX: -5,
                boxShadow: "0 15px 40px rgba(99, 102, 241, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStatClick(index)}
              style={{ cursor: 'pointer' }}
            >
              <motion.div
                className="stat-icon"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3, type: "spring", stiffness: 200 }}
                whileHover={{ rotate: 360, scale: 1.2 }}
                animate={clickedIndex === index ? { 
                  rotate: [0, 360, 720],
                  scale: [1, 1.3, 1]
                } : {}}
                transition={{ duration: 0.6 }}
              >
                <Icon size={24} />
              </motion.div>
              <motion.div 
                className="stat-content"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.5 }}
              >
                <motion.div 
                  className="stat-value"
                  key={clickedIndex === index ? 'clicked' : 'normal'}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 + 0.6, type: "spring", stiffness: 200 }}
                  animate={clickedIndex === index ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  } : {}}
                >
                  {clickedIndex === index && stat.altValues 
                    ? stat.altValues[Math.floor(Math.random() * stat.altValues.length)]
                    : stat.value}
                </motion.div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default StatsStrip

