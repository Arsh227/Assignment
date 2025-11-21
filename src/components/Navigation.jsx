import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Playground', href: '#playground' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ]

  const scrollToSection = (href) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <motion.nav
      className={`nav ${isScrolled ? 'nav-scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
    >
      <div className="nav-container">
        <motion.a
          href="#hero"
          className="nav-logo"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('#hero')
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: 2 }}
        >
          Arsh Khandpur
        </motion.a>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-open' : ''}`}>
          {navItems.map((item, index) => (
            <li key={item.name}>
              <motion.a
                href={item.href}
                className="nav-link-interactive"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(item.href)
                }}
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.name}
              </motion.a>
            </li>
          ))}
        </ul>

        <motion.button
          className="nav-cta"
          onClick={(e) => {
            e.preventDefault()
            scrollToSection('#contact')
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Let's Work Together
        </motion.button>

        <button
          className="nav-mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>
    </motion.nav>
  )
}

export default Navigation

