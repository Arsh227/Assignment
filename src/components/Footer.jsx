import { motion } from 'framer-motion'
import { SiGithub, SiLinkedin, SiTwitter } from 'react-icons/si'

const Footer = () => {
  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <motion.div
            className="footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3>Arsh Khandpur</h3>
            <p>Built with curiosity and way too many tabs open.</p>
          </motion.div>

          <motion.div
            className="footer-links"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#work')
                  }}
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#about')
                  }}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection('#contact')
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="footer-social"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4>Connect</h4>
            <div className="social-icons">
              <motion.a
                href="https://github.com/Arsh227"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                aria-label="GitHub"
              >
                <SiGithub size={24} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                aria-label="LinkedIn"
              >
                <SiLinkedin size={24} />
              </motion.a>
              <motion.a
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                aria-label="Twitter"
              >
                <SiTwitter size={24} />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Arsh Khandpur. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

