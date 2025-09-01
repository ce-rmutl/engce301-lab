
function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-technologies">
        {project.technologies.map(tech => (
          <span key={tech} className="project-technology">{tech}</span>
        ))}
      </div>
    </div>
  );
}

export default ProjectCard;
