import { motion } from 'framer-motion'
import { HiArrowUp } from 'react-icons/hi'

const BackToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.button
      className="back-to-top"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Back to top"
    >
      <HiArrowUp size={20} />
    </motion.button>
  )
}

export default BackToTop

