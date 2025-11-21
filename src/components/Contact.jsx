import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiMail, HiPaperAirplane } from 'react-icons/hi'
import { SiLinkedin, SiGithub } from 'react-icons/si'

const Contact = ({ scrollProgress }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    projectType: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
    
    // Create celebration effect
    const button = e.target.querySelector('button[type="submit"]')
    if (button) {
      // Create confetti effect
      for (let i = 0; i < 30; i++) {
        setTimeout(() => {
          const confetti = document.createElement('div')
          confetti.style.position = 'fixed'
          const rect = button.getBoundingClientRect()
          confetti.style.left = `${rect.left + rect.width / 2}px`
          confetti.style.top = `${rect.top + rect.height / 2}px`
          confetti.style.width = '6px'
          confetti.style.height = '6px'
          confetti.style.backgroundColor = ['#6366f1', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 3)]
          confetti.style.borderRadius = '50%'
          confetti.style.pointerEvents = 'none'
          confetti.style.zIndex = '9999'
          
          document.body.appendChild(confetti)
          
          const angle = (Math.PI * 2 * i) / 30
          const velocity = 3 + Math.random() * 3
          const vx = Math.cos(angle) * velocity
          const vy = Math.sin(angle) * velocity
          
          confetti.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx * 50}px, ${vy * 50}px) scale(0)`, opacity: 0 }
          ], {
            duration: 800,
            easing: 'ease-out'
          }).onfinish = () => confetti.remove()
        }, i * 20)
      }
    }
    
    setTimeout(() => {
      alert('Thank you for your message! I\'ll get back to you soon.')
      setFormData({ name: '', email: '', message: '', projectType: '' })
    }, 500)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-subtitle">
            Got a problem, idea, or chaos you want solved?
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3>Let's build something cool.</h3>
            <p>
              Whether you have a project in mind, want to collaborate, or just
              want to chat about tech and design, I'd love to hear from you.
            </p>

            <div className="contact-links">
              <motion.a
                href="mailto:arshkhandpur227@gmail.com"
                className="contact-link interactive-link"
                whileHover={{ scale: 1.08, x: 10, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0 }}
                >
                  <HiMail size={20} />
                </motion.span>
                <span>arshkhandpur227@gmail.com</span>
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link interactive-link"
                whileHover={{ scale: 1.08, x: 10, rotate: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                >
                  <SiLinkedin size={20} />
                </motion.span>
                <span>LinkedIn</span>
              </motion.a>
              <motion.a
                href="https://github.com/Arsh227"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link interactive-link"
                whileHover={{ scale: 1.08, x: 10, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                >
                  <SiGithub size={20} />
                </motion.span>
                <span>GitHub</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectType">Project Type</label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
              >
                <option value="">Select a type</option>
                <option value="web">Web Development</option>
                <option value="ai">AI/ML Project</option>
                <option value="design">UX/Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary btn-full"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
              <HiPaperAirplane className="btn-icon" />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}

export default Contact

