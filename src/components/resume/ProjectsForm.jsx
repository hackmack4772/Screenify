import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const ProjectsForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [projects, setProjects] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setProjects(initialData);
    }
  }, [initialData]);

  const addProject = () => {
    setProjects(prev => [...prev, {
      id: Date.now(),
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      isOngoing: false,
      url: '',
      githubUrl: '',
      role: '',
      achievements: [],
      images: []
    }]);
    setIsDirty(true);
  };

  const removeProject = (id) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setIsDirty(true);
  };

  const updateProject = (id, field, value) => {
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        return { ...project, [field]: value };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const addTechnology = (projectId) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: [...project.technologies, { id: Date.now(), name: '' }]
        };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const removeTechnology = (projectId, techId) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: project.technologies.filter(tech => tech.id !== techId)
        };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const updateTechnology = (projectId, techId, value) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          technologies: project.technologies.map(tech => {
            if (tech.id === techId) {
              return { ...tech, name: value };
            }
            return tech;
          })
        };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const addAchievement = (projectId) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          achievements: [...project.achievements, { id: Date.now(), text: '' }]
        };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const removeAchievement = (projectId, achievementId) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          achievements: project.achievements.filter(achievement => achievement.id !== achievementId)
        };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const updateAchievement = (projectId, achievementId, value) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          achievements: project.achievements.map(achievement => {
            if (achievement.id === achievementId) {
              return { ...achievement, text: value };
            }
            return achievement;
          })
        };
      }
      return project;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (projects.length === 0) {
      setError('Add at least one project');
      return false;
    }

    for (const project of projects) {
      if (!project.name.trim()) {
        setError('Project name is required');
        return false;
      }
      if (!project.description.trim()) {
        setError('Project description is required');
        return false;
      }
      if (!project.role.trim()) {
        setError('Your role in the project is required');
        return false;
      }
      if (project.url && !/^https?:\/\/.+/.test(project.url)) {
        setError('Invalid project URL format');
        return false;
      }
      if (project.githubUrl && !/^https?:\/\/github\.com\/.+/.test(project.githubUrl)) {
        setError('Invalid GitHub URL format');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(projects);
    }
  };

  return (
    <BaseSectionForm
      title="Projects"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="projects-container">
        {projects.map((project) => (
          <div key={project.id} className="project-item">
            <div className="project-header">
              <h3>Project Details</h3>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => removeProject(project.id)}
                aria-label="Remove project"
              >
                ×
              </button>
            </div>

            <div className="project-grid">
              <div className="form-field">
                <label htmlFor={`project-name-${project.id}`}>Project Name *</label>
                <input
                  id={`project-name-${project.id}`}
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`project-role-${project.id}`}>Your Role *</label>
                <input
                  id={`project-role-${project.id}`}
                  type="text"
                  value={project.role}
                  onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                  required
                  aria-required="true"
                  placeholder="e.g., Lead Developer, UI Designer"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`project-start-${project.id}`}>Start Date</label>
                <input
                  id={`project-start-${project.id}`}
                  type="date"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label htmlFor={`project-end-${project.id}`}>End Date</label>
                <input
                  id={`project-end-${project.id}`}
                  type="date"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  disabled={project.isOngoing}
                />
              </div>

              <div className="form-field">
                <label htmlFor={`project-ongoing-${project.id}`}>
                  <input
                    id={`project-ongoing-${project.id}`}
                    type="checkbox"
                    checked={project.isOngoing}
                    onChange={(e) => {
                      updateProject(project.id, 'isOngoing', e.target.checked);
                      if (e.target.checked) {
                        updateProject(project.id, 'endDate', '');
                      }
                    }}
                  />
                  Ongoing Project
                </label>
              </div>

              <div className="form-field">
                <label htmlFor={`project-url-${project.id}`}>Project URL</label>
                <input
                  id={`project-url-${project.id}`}
                  type="url"
                  value={project.url}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  placeholder="https://project-url.com"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`project-github-${project.id}`}>GitHub Repository</label>
                <input
                  id={`project-github-${project.id}`}
                  type="url"
                  value={project.githubUrl}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={`project-description-${project.id}`}>Project Description *</label>
              <textarea
                id={`project-description-${project.id}`}
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                required
                aria-required="true"
                rows="3"
                placeholder="Describe the project, its purpose, and your contributions..."
              />
            </div>

            <div className="form-field">
              <label>Technologies Used</label>
              <div className="technologies-list">
                {project.technologies.map((tech) => (
                  <div key={tech.id} className="technology-item">
                    <input
                      type="text"
                      value={tech.name}
                      onChange={(e) => updateTechnology(project.id, tech.id, e.target.value)}
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => removeTechnology(project.id, tech.id)}
                      aria-label="Remove technology"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addTechnology(project.id)}
                >
                  Add Technology
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Key Achievements</label>
              <div className="achievements-list">
                {project.achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <input
                      type="text"
                      value={achievement.text}
                      onChange={(e) => updateAchievement(project.id, achievement.id, e.target.value)}
                      placeholder="e.g., Increased performance by 50%"
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => removeAchievement(project.id, achievement.id)}
                      aria-label="Remove achievement"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addAchievement(project.id)}
                >
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-project"
          onClick={addProject}
        >
          Add Project
        </button>
      </div>
    </BaseSectionForm>
  );
};

ProjectsForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    technologies: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    isOngoing: PropTypes.bool,
    url: PropTypes.string,
    githubUrl: PropTypes.string,
    role: PropTypes.string,
    achievements: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string
    })),
    images: PropTypes.arrayOf(PropTypes.string)
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

ProjectsForm.defaultProps = {
  initialData: [],
  className: ''
};

export default ProjectsForm; 