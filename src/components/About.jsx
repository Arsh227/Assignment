import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiBriefcase, HiLocationMarker } from 'react-icons/hi'

const About = ({ scrollProgress }) => {
  const [funFactIndex, setFunFactIndex] = useState(0)
  
  const funFactsList = [
    ['☕ Drinks way too much coffee', '🚀 Builds side projects for fun', '🎨 Loves experimenting with new design trends', '🤖 Fascinated by AI and machine learning', '📚 Always learning something new'],
    ['🎮 Secretly a gamer', '🌙 Night owl coder', '🎵 Codes to music', '💡 Idea generator', '🔧 Fixes things for fun'],
    ['☕ Coffee enthusiast', '🚀 Space nerd', '🎨 Design lover', '🤖 Tech geek', '📚 Bookworm'],
  ]

  return (
    <section id="about" className="about">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            A little story about how I got here
          </p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <motion.div 
              className="about-image"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img 
                src="/images/about/profile.jpeg" 
                alt="Profile"
                onError={(e) => {
                  // Hide image and show placeholder if it doesn't exist
                  e.target.style.display = 'none'
                  const placeholder = e.target.parentElement.querySelector('.about-image-placeholder')
                  if (placeholder) placeholder.style.display = 'flex'
                }}
                onLoad={(e) => {
                  // Hide placeholder when image loads successfully
                  const placeholder = e.target.parentElement.querySelector('.about-image-placeholder')
                  if (placeholder) placeholder.style.display = 'none'
                }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block',
                  position: 'relative',
                  zIndex: 2
                }}
              />
              <div className="about-image-placeholder" style={{ display: 'flex' }}>
                <div style={{ textAlign: 'center' }}>
                  <span>Your Photo</span>
                  <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
                    Upload profile.jpeg to /public/images/about/
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <h3>Hey there! 👋</h3>
            <p>
              I'm a creative developer and designer who's passionate about
              building things that matter. My journey started with curiosity
              about how websites work, and it's evolved into a love for
              crafting digital experiences that are both beautiful and
              functional.
            </p>
            <p>
              When I'm not coding, you'll find me experimenting with AI tools,
              sketching UI ideas, or working on side projects that solve
              problems I encounter in daily life. I believe the best products
              come from understanding users deeply and iterating quickly.
            </p>

            <motion.div
              className="experience-highlight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="experience-icon">
                <HiBriefcase size={24} />
              </div>
              <div className="experience-content">
                <h4>Tech Lead</h4>
                <p className="experience-company">House Of Saint Noir</p>
                <div className="experience-location">
                  <HiLocationMarker size={16} />
                  <span>United Kingdom</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="fun-facts"
              whileHover={{ scale: 1.02 }}
              onClick={() => setFunFactIndex((prev) => (prev + 1) % funFactsList.length)}
              style={{ cursor: 'pointer' }}
            >
              <h4>Fun Facts <span style={{ fontSize: '14px', opacity: 0.7 }}>(click to change!)</span></h4>
              <ul>
                {funFactsList[funFactIndex].map((fact, index) => (
                  <motion.li
                    key={`${funFactIndex}-${index}-${fact}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ x: 5, color: '#6366f1' }}
                  >
                    {fact}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About

