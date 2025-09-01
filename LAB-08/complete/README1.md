# Complete Portfolio Solution - เฉลย LAB
## Personal Portfolio Website with React.js

---

## 📋 Project Structure ที่สมบูรณ์

```
portfolio-website/
├── public/
│   ├── images/
│   │   ├── projects/
│   │   │   ├── ecommerce.jpg
│   │   │   ├── weather-app.jpg
│   │   │   └── todo-app.jpg
│   │   └── profile.jpg
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── Header.css
│   │   ├── About/
│   │   │   ├── About.jsx
│   │   │   └── About.css
│   │   ├── Projects/
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   └── Projects.css
│   │   ├── Contact/
│   │   │   ├── Contact.jsx
│   │   │   └── Contact.css
│   │   └── ThemeToggle/
│   │       ├── ThemeToggle.jsx
│   │       └── ThemeToggle.css
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── data/
│   │   └── portfolioData.js
│   ├── hooks/
│   │   └── useScrollToTop.js
│   ├── styles/
│   │   └── global.css
│   ├── utils/
│   │   └── constants.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Complete Setup Instructions

### Step 1: Initialize Project
```bash
# Create project
npm create vite@latest portfolio-solution -- --template react
cd portfolio-solution

# Install dependencies
npm install lucide-react

# Install dev dependencies
npm install --save-dev @types/node
```

### Step 2: Update package.json
```json
{
  "name": "portfolio-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "deploy": "npm run build && npx gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "vite": "^4.4.5",
    "gh-pages": "^6.0.0"
  }
}
```

### Step 3: Update vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true
  }
})
```

---

## 📄 Complete File Implementation

### 1. Updated HTML Template
```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="Personal portfolio of John Doe - Full Stack Developer specializing in React.js and modern web technologies" />
  <meta name="keywords" content="web developer, react, javascript, frontend, fullstack, portfolio, john doe" />
  <meta name="author" content="John Doe" />
  <meta name="robots" content="index, follow" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://johndoe-portfolio.netlify.app/" />
  <meta property="og:title" content="John Doe - Full Stack Developer Portfolio" />
  <meta property="og:description" content="Experienced developer creating innovative web solutions with modern technologies" />
  <meta property="og:image" content="https://johndoe-portfolio.netlify.app/images/og-image.jpg" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://johndoe-portfolio.netlify.app/" />
  <meta property="twitter:title" content="John Doe - Full Stack Developer Portfolio" />
  <meta property="twitter:description" content="Experienced developer creating innovative web solutions with modern technologies" />
  <meta property="twitter:image" content="https://johndoe-portfolio.netlify.app/images/og-image.jpg" />
  
  <!-- Favicon -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  
  <title>John Doe - Full Stack Developer Portfolio</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 2. Portfolio Data Structure
```javascript
// src/data/portfolioData.js
export const personalInfo = {
  name: "John Doe",
  title: "Full Stack Developer",
  email: "john.doe@example.com",
  phone: "+66 XX XXX XXXX",
  location: "Bangkok, Thailand",
  description: `Passionate full stack developer with 3+ years of experience creating 
    modern web applications. I love turning complex problems into simple, elegant solutions 
    and building applications that provide exceptional user experiences.`,
  resume: "/resume-john-doe.pdf",
  social: {
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe"
  }
};

export const skills = [
  {
    category: "Frontend",
    technologies: ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Next.js"],
    icon: "💻",
    color: "#3b82f6"
  },
  {
    category: "Backend",
    technologies: ["Node.js", "Python", "Express", "FastAPI", "PostgreSQL"],
    icon: "⚙️",
    color: "#10b981"
  },
  {
    category: "Tools & Others",
    technologies: ["Git", "Docker", "AWS", "Firebase", "Figma"],
    icon: "🛠️",
    color: "#f59e0b"
  },
  {
    category: "Soft Skills",
    technologies: ["Problem Solving", "Team Work", "Communication", "Leadership"],
    icon: "🧠",
    color: "#ef4444"
  }
];

export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online store with user authentication, payment integration, admin dashboard, and real-time inventory management. Built with modern web technologies for optimal performance.",
    longDescription: `This comprehensive e-commerce solution includes:
    • User registration and authentication system
    • Product catalog with search and filtering
    • Shopping cart and checkout process
    • Stripe payment integration
    • Admin dashboard for inventory management
    • Order tracking and email notifications
    • Responsive design for all devices`,
    image: "/images/projects/ecommerce.jpg",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT"],
    demoUrl: "https://ecommerce-demo.netlify.app",
    githubUrl: "https://github.com/johndoe/ecommerce-platform",
    featured: true,
    category: "Full Stack",
    status: "Completed",
    duration: "3 months"
  },
  {
    id: 2,
    title: "Weather Forecast App",
    description: "Real-time weather application with location-based forecasts, interactive maps, and detailed weather analytics. Features beautiful UI with smooth animations.",
    longDescription: `A modern weather application featuring:
    • Current weather conditions and 7-day forecast
    • Location-based weather detection
    • Interactive weather maps
    • Weather alerts and notifications
    • Favorite locations management
    • Weather history and trends
    • Beautiful, responsive design with animations`,
    image: "/images/projects/weather-app.jpg",
    technologies: ["React", "OpenWeather API", "Mapbox", "Chart.js", "CSS3"],
    demoUrl: "https://weather-forecast-app.netlify.app",
    githubUrl: "https://github.com/johndoe/weather-app",
    featured: true,
    category: "Frontend",
    status: "Completed",
    duration: "1 month"
  },
  {
    id: 3,
    title: "Task Management System",
    description: "Collaborative project management tool with real-time updates, team collaboration features, and advanced task tracking capabilities.",
    longDescription: `A comprehensive task management solution including:
    • Project and task creation with deadlines
    • Team collaboration and assignment
    • Real-time updates and notifications
    • Progress tracking and analytics
    • File sharing and comments
    • Calendar integration
    • Mobile-responsive design`,
    image: "/images/projects/todo-app.jpg",
    technologies: ["React", "Firebase", "Material-UI", "Chart.js"],
    demoUrl: "https://task-manager-pro.netlify.app",
    githubUrl: "https://github.com/johndoe/task-management",
    featured: false,
    category: "Full Stack",
    status: "Completed",
    duration: "2 months"
  },
  {
    id: 4,
    title: "Personal Blog Platform",
    description: "Modern blog platform with markdown support, comment system, and SEO optimization. Features clean design and fast performance.",
    longDescription: `A feature-rich blogging platform with:
    • Markdown editor with live preview
    • Comment system and user interactions
    • SEO optimization and meta tags
    • Search functionality
    • Categories and tags system
    • Social media sharing
    • Admin dashboard for content management`,
    image: "/images/projects/blog-platform.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    demoUrl: "https://blog-platform-demo.vercel.app",
    githubUrl: "https://github.com/johndoe/blog-platform",
    featured: false,
    category: "Full Stack",
    status: "In Progress",
    duration: "Ongoing"
  },
  {
    id: 5,
    title: "Crypto Trading Dashboard",
    description: "Real-time cryptocurrency trading dashboard with portfolio tracking, price alerts, and technical analysis tools.",
    longDescription: `An advanced crypto trading interface featuring:
    • Real-time price monitoring
    • Portfolio performance tracking
    • Technical analysis charts
    • Price alerts and notifications
    • Trading history and analytics
    • Multi-exchange integration
    • Dark/light theme support`,
    image: "/images/projects/crypto-dashboard.jpg",
    technologies: ["React", "TypeScript", "TradingView", "WebSocket", "Redux"],
    demoUrl: "https://crypto-dashboard-demo.netlify.app",
    githubUrl: "https://github.com/johndoe/crypto-dashboard",
    featured: true,
    category: "Frontend",
    status: "Completed",
    duration: "2 months"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Product Manager at TechCorp",
    content: "John delivered an exceptional e-commerce platform that exceeded our expectations. His attention to detail and technical expertise made the project a huge success.",
    avatar: "/images/testimonials/sarah.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Mike Chen",
    position: "CTO at StartupXYZ",
    content: "Working with John was a pleasure. He's not only technically skilled but also great at communicating complex ideas in simple terms.",
    avatar: "/images/testimonials/mike.jpg",
    rating: 5
  }
];
```

### 3. Complete Projects Component
```jsx
// src/components/Projects/Projects.jsx
import { useState, useMemo } from 'react';
import { Filter, Search, ExternalLink, Github, Calendar, User } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '../../data/portfolioData';
import './Projects.css';

function Projects() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Get unique categories for filter
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(projects.map(project => project.category))];
    return cats;
  }, []);

  // Filter and search projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesFilter = filter === 'all' || project.category === filter;
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFeatured = !showFeaturedOnly || project.featured;
      
      return matchesFilter && matchesSearch && matchesFeatured;
    });
  }, [filter, searchTerm, showFeaturedOnly]);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <section id="projects" className="projects section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">My Projects</h2>
          <p className="section-subtitle">
            A collection of projects I've worked on, showcasing my skills in web development,
            UI/UX design, and problem-solving.
          </p>
        </div>

        {/* Featured Projects */}
        {!searchTerm && filter === 'all' && !showFeaturedOnly && (
          <div className="featured-section">
            <h3 className="featured-title">
              <span className="featured-icon">⭐</span>
              Featured Projects
            </h3>
            <div className="featured-grid">
              {featuredProjects.slice(0, 2).map(project => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="projects-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search projects, technologies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="category-filters">
              <Filter size={16} />
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${filter === category ? 'active' : ''}`}
                  onClick={() => setFilter(category)}
                >
                  {category === 'all' ? 'All Projects' : category}
                </button>
              ))}
            </div>

            <label className="featured-toggle">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
              />
              <span>Featured Only</span>
            </label>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <h3>No projects found</h3>
              <p>Try adjusting your search terms or filters</p>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  setShowFeaturedOnly(false);
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="projects-stats">
          <div className="stat">
            <span className="stat-number">{projects.length}</span>
            <span className="stat-label">Total Projects</span>
          </div>
          <div className="stat">
            <span className="stat-number">{featuredProjects.length}</span>
            <span className="stat-label">Featured</span>
          </div>
          <div className="stat">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;
```

### 4. ProjectCard Component
```jsx
// src/components/Projects/ProjectCard.jsx
import { useState } from 'react';
import { ExternalLink, Github, Calendar, Tag, ArrowRight, X } from 'lucide-react';
import './Projects.css';

function ProjectCard({ project, featured = false }) {
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
    // Prevent body scroll when modal is open
    if (!showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <>
      <div className={`project-card ${featured ? 'featured-card' : ''}`}>
        {featured && <div className="featured-badge">Featured</div>}
        
        <div className="project-image-container">
          <img 
            src={project.image} 
            alt={project.title}
            className="project-image"
          />
          <div className="project-overlay">
            <div className="project-links">
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link demo-link"
                  title="View Live Demo"
                >
                  <ExternalLink size={18} />
                </a>
              )}
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link github-link"
                  title="View Source Code"
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="project-content">
          <div className="project-header">
            <h3 className="project-title">{project.title}</h3>
            <div className="project-meta">
              <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                {project.status}
              </span>
              <span className="duration">
                <Calendar size={14} />
                {project.duration}
              </span>
            </div>
          </div>

          <p className="project-description">{project.description}</p>

          <div className="project-technologies">
            {project.technologies.map((tech, index) => (
              <span key={index} className="tech-tag">
                <Tag size={12} />
                {tech}
              </span>
            ))}
          </div>

          <div className="project-footer">
            <span className="project-category">{project.category}</span>
            <button 
              className="learn-more-btn"
              onClick={handleModalToggle}
            >
              Learn More
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={handleModalToggle}>
          <div className="project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleModalToggle}>
              <X size={24} />
            </button>
            
            <div className="modal-content">
              <img 
                src={project.image} 
                alt={project.title}
                className="modal-image"
              />
              
              <div className="modal-info">
                <h2>{project.title}</h2>
                <div className="modal-meta">
                  <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                  <span className="category">{project.category}</span>
                  <span className="duration">{project.duration}</span>
                </div>
                
                <div className="modal-description">
                  {project.longDescription.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="modal-technologies">
                  <h4>Technologies Used:</h4>
                  <div className="tech-list">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="modal-actions">
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <ExternalLink size={18} />
                      View Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <Github size={18} />
                      View Source
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectCard;
```

### 5. Complete Projects CSS
```css
/* src/components/Projects/Projects.css */
.projects {
  background: var(--bg-primary);
  min-height: 100vh;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Featured Section */
.featured-section {
  margin-bottom: 4rem;
}

.featured-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.featured-icon {
  font-size: 1.2rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Controls */
.projects-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-box svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.category-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category-filters svg {
  color: var(--text-secondary);
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.filter-btn.active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.featured-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.featured-toggle input {
  cursor: pointer;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Project Card */
.project-card {
  background: var(--bg-secondary);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.featured-card {
  border: 2px solid var(--accent-primary);
  background: linear-gradient(145deg, var(--bg-secondary), var(--accent-tertiary));
}

.featured-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--accent-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
}

.project-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: white;
  color: var(--accent-primary);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.project-link:hover {
  background: var(--accent-primary);
  color: white;
  transform: scale(1.1);
}

.project-content {
  padding: 1.5rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.project-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status.completed {
  background: #dcfce7;
  color: #166534;
}

.status.in-progress {
  background: #fef3c7;
  color: #92400e;
}

.duration {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-tertiary);
}

.project-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: var(--accent-tertiary);
  color: var(--accent-primary);
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-category {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.learn-more-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--accent-primary);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.learn-more-btn:hover {
  color: var(--accent-secondary);
  transform: translateX(2px);
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.project-modal {
  background: var(--bg-primary);
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-primary);
  z-index: 10;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--accent-primary);
  color: white;
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 1rem 0 0 1rem;
}

.modal-info {
  padding: 2rem;
}

.modal-info h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.modal-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.modal-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-description p {
  margin-bottom: 1rem;
}

.modal-technologies h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

/* Stats */
.projects-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 4rem 2rem;
}

.no-results-content h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.no-results-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .featured-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-controls {
    padding: 1rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .category-filters {
    justify-content: flex-start;
  }
  
  .modal-content {
    grid-template-columns: 1fr;
  }
  
  .modal-image {
    height: 200px;
    border-radius: 1rem 1rem 0 0;
  }
  
  .projects-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .modal-backdrop {
    padding: 1rem;
  }
  
  .modal-info {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

### 6. Complete Contact Component
```jsx
// src/components/Contact/Contact.jsx
import { useState } from 'react';
import { 
  Mail, Phone, MapPin, Send, Github, Linkedin, Twitter, 
  CheckCircle, AlertCircle, Loader, User, MessageSquare 
} from 'lucide-react';
import { personalInfo } from '../../data/portfolioData';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        
        // Auto-clear success message after 10 seconds
        setTimeout(() => setSubmitStatus(null), 10000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setSubmitStatus('error');
      
      // Auto-clear error message after 8 seconds
      setTimeout(() => setSubmitStatus(null), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: 'Email',
      value: personalInfo.email,
      link: `mailto:${personalInfo.email}`,
      description: 'Send me an email anytime!'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      value: personalInfo.phone,
      link: `tel:${personalInfo.phone}`,
      description: 'Let\'s have a conversation'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Location',
      value: personalInfo.location,
      link: `https://maps.google.com/?q=${encodeURIComponent(personalInfo.location)}`,
      description: 'Come say hello'
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github size={24} />,
      url: personalInfo.social.github,
      color: '#333'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin size={24} />,
      url: personalInfo.social.linkedin,
      color: '#0077b5'
    },
    {
      name: 'Twitter',
      icon: <Twitter size={24} />,
      url: personalInfo.social.twitter,
      color: '#1da1f2'
    }
  ];

  return (
    <section id="contact" className="contact section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Have a project in mind or just want to chat about technology? 
            I'd love to hear from you! Let's create something amazing together.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h3>Send Me a Message</h3>
              <p>Fill out the form below and I'll get back to you as soon as possible.</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    <User size={18} />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={18} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <span className="error-message">
                      <AlertCircle size={16} />
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  <MessageSquare size={18} />
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? 'error' : ''}
                  placeholder="What's this about?"
                  disabled={isSubmitting}
                />
                {errors.subject && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.subject}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message">
                  <MessageSquare size={18} />
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className={errors.message ? 'error' : ''}
                  placeholder="Tell me about your project or just say hello..."
                  disabled={isSubmitting}
                ></textarea>
                <div className="character-count">
                  {formData.message.length}/1000
                </div>
                {errors.message && (
                  <span className="error-message">
                    <AlertCircle size={16} />
                    {errors.message}
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="spinner" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="status-message success">
                  <CheckCircle size={20} />
                  <div>
                    <strong>Message sent successfully!</strong>
                    <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="status-message error">
                  <AlertCircle size={20} />
                  <div>
                    <strong>Oops! Something went wrong.</strong>
                    <p>Please try again or contact me directly via email.</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="contact-info-section">
            <div className="info-header">
              <h3>Let's Connect</h3>
              <p>Prefer to reach out directly? Here are other ways to get in touch.</p>
            </div>

            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <a 
                  key={index}
                  href={method.link}
                  className="contact-method"
                  target={method.title === 'Location' ? '_blank' : '_self'}
                  rel={method.title === 'Location' ? 'noopener noreferrer' : ''}
                >
                  <div className="method-icon">
                    {method.icon}
                  </div>
                  <div className="method-info">
                    <h4>{method.title}</h4>
                    <p className="method-value">{method.value}</p>
                    <p className="method-description">{method.description}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h4>Follow Me</h4>
              <p>Stay connected and see what I'm working on</p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    style={{ '--social-color': social.color }}
                    title={`Follow me on ${social.name}`}
                  >
                    {social.icon}
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="availability-section">
              <h4>Current Availability</h4>
              <div className="availability-status">
                <div className="status-indicator available"></div>
                <div>
                  <p><strong>Available for new projects</strong></p>
                  <p>I'm currently accepting new freelance opportunities and collaborations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
```

### 7. Contact Component CSS
```css
/* src/components/Contact/Contact.css */
.contact {
  background: var(--bg-secondary);
  position: relative;
}

.contact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-primary), transparent);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

/* Form Section */
.contact-form-section {
  background: var(--bg-primary);
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-secondary);
  line-height: 1.5;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 0.875rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  background: var(--bg-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.character-count {
  align-self: flex-end;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  margin-top: -0.25rem;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.submit-btn {
  padding: 1rem 2rem;
  background: var(--accent-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-secondary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.submit-btn.submitting {
  background: var(--accent-secondary);
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.status-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.status-message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #166534;
}

.status-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #991b1b;
}

.status-message div p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Contact Info Section */
.contact-info-section {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.info-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.info-header p {
  color: var(--text-secondary);
  line-height: 1.5;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-method {
  display: flex;
  AlignItemsService: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-method:hover {
  background: var(--bg-secondary);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: var(--accent-tertiary);
  color: var(--accent-primary);
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.method-info h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.method-value {
  font-weight: 500;
  color: var(--accent-primary);
  margin-bottom: 0.25rem;
}

.method-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Social Section */
.social-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.social-section p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: var(--social-color);
  border-color: var(--social-color);
  color: white;
  transform: translateY(-2px);
}

/* Availability Section */
.availability-section {
  padding: 1.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
}

.availability-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.availability-status {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 0.375rem;
  flex-shrink: 0;
}

.status-indicator.available {
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.availability-status p {
  margin: 0;
  line-height: 1.5;
}

.availability-status p:first-child {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.availability-status p:last-child {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 968px) {