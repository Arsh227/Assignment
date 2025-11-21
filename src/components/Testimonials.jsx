import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronLeft, HiChevronRight, HiStar } from 'react-icons/hi'

const Testimonials = ({ scrollProgress }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      quote: 'Working with Arsh Khandpur was an absolute pleasure. Their attention to detail and creative problem-solving skills are unmatched.',
      author: 'Sarah Johnson',
      role: 'Product Manager',
      avatar: 'SJ',
    },
    {
      id: 2,
      quote: 'The best developer I\'ve worked with. They don\'t just write code, they craft experiences. Highly recommend!',
      author: 'Michael Chen',
      role: 'Startup Founder',
      avatar: 'MC',
    },
    {
      id: 3,
      quote: 'Incredible designer and developer combo. Arsh Khandpur brought our vision to life in ways we never imagined.',
      author: 'Emily Rodriguez',
      role: 'Creative Director',
      avatar: 'ER',
    },
    {
      id: 4,
      quote: 'Professional, creative, and always pushing boundaries. Arsh Khandpur is a true asset to any team.',
      author: 'David Kim',
      role: 'Tech Lead',
      avatar: 'DK',
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Testimonials</h2>
          <p className="section-subtitle">
            What people say about working with me
          </p>
        </motion.div>

        <div className="testimonials-carousel">
          <motion.button
            className="testimonials-nav-btn testimonials-nav-prev"
            onClick={prevTestimonial}
            aria-label="Previous testimonial"
            whileHover={{ scale: 1.2, rotate: -10, x: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiChevronLeft size={24} />
          </motion.button>

          <div className="testimonials-viewport">
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => {
                if (index !== currentIndex) return null
                return (
                  <motion.div
                    key={testimonial.id}
                    className="testimonial-card"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="testimonial-stars">
                      {[...Array(5)].map((_, i) => (
                        <HiStar key={i} size={20} fill="#fbbf24" />
                      ))}
                    </div>
                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        {testimonial.avatar}
                      </div>
                      <div className="testimonial-info">
                        <div className="testimonial-name">
                          {testimonial.author}
                        </div>
                        <div className="testimonial-role">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <motion.button
            className="testimonials-nav-btn testimonials-nav-next"
            onClick={nextTestimonial}
            aria-label="Next testimonial"
            whileHover={{ scale: 1.2, rotate: 10, x: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiChevronRight size={24} />
          </motion.button>
        </div>

        <div className="testimonials-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials

