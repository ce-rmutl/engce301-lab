// src/components/Projects/Projects.jsx - Template
import './Projects.css';
import ProjectCard from './ProjectCard';

function Projects() {
  return (
    <section id="projects" className="projects section">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <p className="section-subtitle">
          Here are some of the projects I've worked on recently.
        </p>
        
        {/* TODO: นักศึกษาเพิ่ม project list ที่นี่ */}
        <div className="projects-grid">
          <div className="project-placeholder">
            <p>Add your projects here</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;