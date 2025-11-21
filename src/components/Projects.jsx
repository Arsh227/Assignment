import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiExternalLink, HiCode } from 'react-icons/hi'
import { useMousePosition } from '../hooks/useMousePosition'
import { useGitHubRepos } from '../hooks/useGitHubRepos'

const ProjectCard = ({ project, index, scrollProgress }) => {
  const cardRotate = scrollProgress * (180 + index * 30)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  return (
    <motion.div
      className="project-card magnetic-card"
      initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -45 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        delay: index * 0.15,
        duration: 0.8,
        type: "spring",
        stiffness: 100
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }}
      onClick={() => {
        if (project.url || project.githubUrl) {
          window.open(project.url || project.githubUrl, '_blank', 'noopener,noreferrer')
        }
      }}
      whileHover={{ 
        y: -15, 
        scale: 1.08, 
        rotateY: 8, 
        rotateX: -5,
        z: 50,
        boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)"
      }}
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateY(${cardRotate * 0.1}deg) translateZ(${index * 30}px)`,
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
        cursor: project.githubUrl ? 'pointer' : 'default',
      }}
    >
      <div className="project-image-wrapper">
        <motion.img
          src={project.image}
          alt={project.title}
          className="project-image"
          onError={(e) => {
            // Fallback to placeholder if image doesn't exist
            e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800'
          }}
          animate={isHovered ? {
            scale: 1.15,
            x: (mousePos.x - 150) * 0.1,
            y: (mousePos.y - 120) * 0.1,
          } : {
            scale: 1,
            x: 0,
            y: 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <motion.div 
          className="project-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.a
            href={project.url || project.githubUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="project-btn ripple-button"
            whileHover={{ scale: 1.15, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation() // Prevent card click
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
          >
            {project.featured ? (
              <>
                <HiExternalLink size={20} />
                Visit App
              </>
            ) : (
              <>
                <HiCode size={20} />
                View on GitHub
              </>
            )}
          </motion.a>
        </motion.div>
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        <div className="project-tech">
          {project.tech.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
        <div className="project-tags">
          {project.featured && (
            <span className="project-tag featured-tag">
              ⭐ Featured
            </span>
          )}
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const Projects = ({ scrollProgress }) => {
  const { x, y } = useMousePosition()
  const { repos, loading, error } = useGitHubRepos('Arsh227')

  // Featured projects (custom projects that appear first)
  const featuredProjects = [
    {
      id: 'taskflow-featured',
      title: 'Taskflow',
      description: 'A powerful task management and productivity app built with modern web technologies. Streamline your workflow, organize tasks, and boost productivity with an intuitive interface.',
      tech: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      tags: ['Featured', 'Web App', 'Productivity'],
      image: '/images/projects/taskflow.jpg',
      githubUrl: 'https://github.com/Arsh227',
      url: 'https://app.houseofsaintnoir.com/',
      featured: true,
    },
  ]

  // Map GitHub repos to project format
  const githubProjects = repos.map((repo, index) => {
    // Get tech stack from languages (limit to 4)
    const tech = repo.languages?.slice(0, 4) || []
    
    // Generate tags from repo topics or default tags
    const tags = repo.topics?.slice(0, 2) || []
    if (repo.stargazers_count > 0) {
      tags.push(`${repo.stargazers_count} ⭐`)
    }
    
    // Use repo description or default
    const description = repo.description || 'A project from my GitHub repository.'
    
    // Generate image path (try project image first, then fallback)
    const image = `/images/projects/project-${(index % 6) + 1}.jpg`
    
    // Format title nicely
    const formatTitle = (name) => {
      return name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
    
    return {
      id: repo.id,
      title: formatTitle(repo.name),
      description: description.length > 120 ? description.substring(0, 120) + '...' : description,
      tech: tech.length > 0 ? tech : ['Code'],
      tags: tags.length > 0 ? tags : ['Project'],
      image: image,
      githubUrl: repo.html_url,
      url: repo.homepage || repo.html_url,
      stars: repo.stargazers_count,
      updated: repo.updated_at,
    }
  })

  // Combine featured projects with GitHub projects
  const allProjects = [...featuredProjects, ...githubProjects]

  // Fallback projects if no repos loaded yet or error
  const fallbackProjects = [
    ...featuredProjects,
    {
      id: 1,
      title: 'Loading Projects...',
      description: 'Fetching repositories from GitHub...',
      tech: ['Loading'],
      tags: ['GitHub'],
      image: '/images/projects/project-1.jpg',
    },
  ]

  return (
    <section id="work" className="projects">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle">
            A collection of projects that showcase my skills and creativity
          </p>
        </motion.div>

        {loading && (
          <motion.div
            className="projects-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Loading projects from GitHub...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="projects-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Unable to load projects from GitHub. Showing placeholder projects.</p>
          </motion.div>
        )}

        <div className="projects-grid">
          {(allProjects.length > 0 ? allProjects : fallbackProjects).map((project, index) => (
            <ProjectCard 
              key={project.id || index}
              project={project}
              index={index}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects

