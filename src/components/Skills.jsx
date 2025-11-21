import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  HiCode,
  HiServer,
  HiColorSwatch,
  HiCog,
  HiSparkles,
} from 'react-icons/hi'
import {
  SiReact,
  SiJavascript,
  SiPython,
  SiNodedotjs,
  SiFigma,
  SiAdobe,
  SiGit,
  SiDocker,
  SiTypescript,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiTailwindcss,
  SiSass,
  SiBootstrap,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiFirebase,
  SiAmazonaws,
  SiGooglecloud,
  SiVercel,
  SiNetlify,
  SiWebpack,
  SiVite,
  SiJest,
  SiCypress,
  SiStorybook,
  SiGraphql,
  SiExpress,
  SiFastapi,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiKubernetes,
  SiJenkins,
  SiGithubactions,
  SiPostman,
  SiVisualstudiocode,
  SiLinux,
  SiUbuntu,
  SiWindows,
  SiApple,
} from 'react-icons/si'

const Skills = ({ scrollProgress }) => {
  const [animatedSkills, setAnimatedSkills] = useState(new Set())
  const [pulseIndex, setPulseIndex] = useState(0)

  // Rotate pulse animation through skills
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 50)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const skillCategories = [
    {
      title: 'Frontend',
      icon: HiCode,
      color: '#61DAFB',
      skills: [
        { name: 'React', icon: SiReact, level: 90, color: '#61DAFB' },
        { name: 'JavaScript', icon: SiJavascript, level: 95, color: '#F7DF1E' },
        { name: 'TypeScript', icon: SiTypescript, level: 85, color: '#3178C6' },
        { name: 'Next.js', icon: SiNextdotjs, level: 88, color: '#000000' },
        { name: 'Vue.js', icon: SiVuedotjs, level: 75, color: '#4FC08D' },
        { name: 'Angular', icon: SiAngular, level: 70, color: '#DD0031' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, level: 92, color: '#06B6D4' },
        { name: 'SASS', icon: SiSass, level: 88, color: '#CC6699' },
        { name: 'Bootstrap', icon: SiBootstrap, level: 85, color: '#7952B3' },
      ],
    },
    {
      title: 'Backend / AI',
      icon: HiServer,
      color: '#339933',
      skills: [
        { name: 'Node.js', icon: SiNodedotjs, level: 90, color: '#339933' },
        { name: 'Python', icon: SiPython, level: 88, color: '#3776AB' },
        { name: 'Express', icon: SiExpress, level: 85, color: '#000000' },
        { name: 'FastAPI', icon: SiFastapi, level: 80, color: '#009688' },
        { name: 'GraphQL', icon: SiGraphql, level: 75, color: '#E10098' },
        { name: 'TensorFlow', icon: SiTensorflow, level: 70, color: '#FF6F00' },
        { name: 'PyTorch', icon: SiPytorch, level: 72, color: '#EE4C2C' },
        { name: 'OpenCV', icon: SiOpencv, level: 75, color: '#5C3EE8' },
      ],
    },
    {
      title: 'Databases',
      icon: HiServer,
      color: '#4DB33D',
      skills: [
        { name: 'MongoDB', icon: SiMongodb, level: 85, color: '#47A248' },
        { name: 'PostgreSQL', icon: SiPostgresql, level: 82, color: '#336791' },
        { name: 'MySQL', icon: SiMysql, level: 80, color: '#4479A1' },
        { name: 'Redis', icon: SiRedis, level: 75, color: '#DC382D' },
        { name: 'Firebase', icon: SiFirebase, level: 78, color: '#FFCA28' },
      ],
    },
    {
      title: 'Cloud & DevOps',
      icon: HiCog,
      color: '#FF9900',
      skills: [
        { name: 'AWS', icon: SiAmazonaws, level: 80, color: '#FF9900' },
        { name: 'Google Cloud', icon: SiGooglecloud, level: 75, color: '#4285F4' },
        { name: 'Docker', icon: SiDocker, level: 85, color: '#2496ED' },
        { name: 'Kubernetes', icon: SiKubernetes, level: 70, color: '#326CE5' },
        { name: 'Vercel', icon: SiVercel, level: 90, color: '#000000' },
        { name: 'Netlify', icon: SiNetlify, level: 88, color: '#00C7B7' },
        { name: 'GitHub Actions', icon: SiGithubactions, level: 85, color: '#2088FF' },
        { name: 'Jenkins', icon: SiJenkins, level: 72, color: '#D24939' },
      ],
    },
    {
      title: 'Design',
      icon: HiColorSwatch,
      color: '#F24E1E',
      skills: [
        { name: 'Figma', icon: SiFigma, level: 92, color: '#F24E1E' },
        { name: 'Adobe Suite', icon: SiAdobe, level: 80, color: '#FF0000' },
        { name: 'UI/UX Design', level: 88 },
        { name: 'Prototyping', level: 85 },
        { name: 'Design Systems', level: 87 },
      ],
    },
    {
      title: 'Tools & Testing',
      icon: HiSparkles,
      color: '#F05032',
      skills: [
        { name: 'Git', icon: SiGit, level: 93, color: '#F05032' },
        { name: 'Vite', icon: SiVite, level: 90, color: '#646CFF' },
        { name: 'Webpack', icon: SiWebpack, level: 82, color: '#8DD6F9' },
        { name: 'Jest', icon: SiJest, level: 85, color: '#C21325' },
        { name: 'Cypress', icon: SiCypress, level: 78, color: '#17202C' },
        { name: 'Storybook', icon: SiStorybook, level: 80, color: '#FF4785' },
        { name: 'Postman', icon: SiPostman, level: 88, color: '#FF6C37' },
        { name: 'VS Code', icon: SiVisualstudiocode, level: 95, color: '#007ACC' },
      ],
    },
    {
      title: 'Operating Systems',
      icon: HiCog,
      color: '#0078D4',
      skills: [
        { name: 'Linux', icon: SiLinux, level: 85, color: '#FCC624' },
        { name: 'Ubuntu', icon: SiUbuntu, level: 88, color: '#E95420' },
        { name: 'Windows', icon: SiWindows, level: 90, color: '#0078D4' },
        { name: 'macOS', icon: SiApple, level: 92, color: '#000000' },
      ],
    },
  ]

  return (
    <section id="skills" className="skills">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Skills & Tools</h2>
          <p className="section-subtitle">
            Technologies I work with and love
          </p>
        </motion.div>

        <div className="skills-grid">
          {skillCategories.map((category, catIndex) => {
            const CategoryIcon = category.icon
            return (
              <motion.div
                key={category.title}
                className="skill-category"
                initial={{ opacity: 0, y: 60, scale: 0.8, rotateX: -45 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: catIndex * 0.15,
                  duration: 0.8,
                  type: "spring",
                  stiffness: 120
                }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="skill-category-header">
                  <CategoryIcon size={28} />
                  <h3>{category.title}</h3>
                </div>
                <div className="skill-list">
                  {category.skills.map((skill, skillIndex) => {
                    const SkillIcon = skill.icon
                    const globalIndex = catIndex * 10 + skillIndex
                    const isPulsing = pulseIndex === globalIndex
                    const isAnimated = animatedSkills.has(skill.name)
                    
                    return (
                      <motion.div
                        key={skill.name}
                        className="skill-item interactive-skill"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: (catIndex * 0.1) + (skillIndex * 0.05),
                          type: "spring",
                          stiffness: 200,
                          damping: 15
                        }}
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: [0, -5, 5, -5, 0],
                          x: 5,
                          boxShadow: `0 10px 30px ${skill.color || 'rgba(99, 102, 241, 0.3)'}`,
                          transition: { duration: 0.3 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onHoverStart={() => setAnimatedSkills(prev => new Set([...prev, skill.name]))}
                        onHoverEnd={() => setAnimatedSkills(prev => {
                          const newSet = new Set(prev)
                          newSet.delete(skill.name)
                          return newSet
                        })}
                        animate={isPulsing ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            `0 0 0px ${skill.color || 'rgba(99, 102, 241, 0)'}`,
                            `0 0 20px ${skill.color || 'rgba(99, 102, 241, 0.5)'}`,
                            `0 0 0px ${skill.color || 'rgba(99, 102, 241, 0)'}`
                          ]
                        } : {}}
                        transition={isPulsing ? {
                          duration: 1,
                          repeat: 1,
                          ease: "easeInOut"
                        } : {}}
                      >
                        {SkillIcon && (
                          <motion.div 
                            className="skill-icon"
                            style={{ color: skill.color || 'var(--accent-primary)' }}
                            animate={isAnimated ? {
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            } : {
                              rotate: 0,
                              scale: 1,
                            }}
                            transition={isAnimated ? {
                              rotate: { duration: 1, ease: "easeInOut" },
                              scale: { duration: 0.5, ease: "easeInOut" }
                            } : {}}
                          >
                            <SkillIcon size={20} />
                          </motion.div>
                        )}
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <div className="skill-level-bar">
                            <motion.div
                              className="skill-level-fill"
                              style={{
                                background: skill.color 
                                  ? `linear-gradient(90deg, ${skill.color}, ${skill.color}dd)`
                                  : undefined
                              }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ 
                                delay: (catIndex * 0.1) + (skillIndex * 0.05) + 0.2, 
                                duration: 1,
                                type: "spring",
                                stiffness: 100
                              }}
                              animate={{
                                boxShadow: [
                                  `0 0 0px ${skill.color || 'rgba(99, 102, 241, 0)'}`,
                                  `0 0 10px ${skill.color || 'rgba(99, 102, 241, 0.5)'}`,
                                  `0 0 0px ${skill.color || 'rgba(99, 102, 241, 0)'}`
                                ]
                              }}
                              transition={{
                                boxShadow: {
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }
                              }}
                            />
                            <motion.span
                              className="skill-level-text"
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ 
                                delay: (catIndex * 0.1) + (skillIndex * 0.05) + 0.5
                              }}
                            >
                              {skill.level}%
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Skills

