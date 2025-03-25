import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const WorkExperienceForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [experiences, setExperiences] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setExperiences(initialData);
    }
  }, [initialData]);

  const addExperience = () => {
    setExperiences(prev => [
      ...prev,
      {
        id: Date.now(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: []
      }
    ]);
    setIsDirty(true);
  };

  const removeExperience = (id) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
    setIsDirty(true);
  };

  const updateExperience = (id, field, value) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    }));
    setIsDirty(true);
  };

  const addAchievement = (experienceId) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        return {
          ...exp,
          achievements: [...exp.achievements, '']
        };
      }
      return exp;
    }));
    setIsDirty(true);
  };

  const removeAchievement = (experienceId, index) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        return {
          ...exp,
          achievements: exp.achievements.filter((_, i) => i !== index)
        };
      }
      return exp;
    }));
    setIsDirty(true);
  };

  const updateAchievement = (experienceId, index, value) => {
    setExperiences(prev => prev.map(exp => {
      if (exp.id === experienceId) {
        const newAchievements = [...exp.achievements];
        newAchievements[index] = value;
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (experiences.length === 0) {
      setError('Add at least one work experience');
      return false;
    }

    for (const exp of experiences) {
      if (!exp.company.trim()) {
        setError('Company name is required');
        return false;
      }
      if (!exp.position.trim()) {
        setError('Position is required');
        return false;
      }
      if (!exp.startDate) {
        setError('Start date is required');
        return false;
      }
      if (!exp.current && !exp.endDate) {
        setError('End date is required unless currently employed');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(experiences);
    }
  };

  return (
    <BaseSectionForm
      title="Work Experience"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="experiences-container">
        {experiences.map((experience, index) => (
          <div key={experience.id} className="experience-item">
            <div className="experience-header">
              <h3>Experience #{index + 1}</h3>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeExperience(experience.id)}
                aria-label={`Remove experience ${index + 1}`}
              >
                Remove
              </button>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor={`company-${experience.id}`}>Company *</label>
                <input
                  type="text"
                  id={`company-${experience.id}`}
                  value={experience.company}
                  onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`position-${experience.id}`}>Position *</label>
                <input
                  type="text"
                  id={`position-${experience.id}`}
                  value={experience.position}
                  onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`location-${experience.id}`}>Location</label>
                <input
                  type="text"
                  id={`location-${experience.id}`}
                  value={experience.location}
                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`startDate-${experience.id}`}>Start Date *</label>
                <input
                  type="date"
                  id={`startDate-${experience.id}`}
                  value={experience.startDate}
                  onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`endDate-${experience.id}`}>End Date</label>
                <input
                  type="date"
                  id={`endDate-${experience.id}`}
                  value={experience.endDate}
                  onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                  disabled={experience.current}
                />
              </div>

              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={experience.current}
                    onChange={(e) => {
                      updateExperience(experience.id, 'current', e.target.checked);
                      if (e.target.checked) {
                        updateExperience(experience.id, 'endDate', '');
                      }
                    }}
                  />
                  Currently Employed
                </label>
              </div>

              <div className="form-field full-width">
                <label htmlFor={`description-${experience.id}`}>Job Description</label>
                <textarea
                  id={`description-${experience.id}`}
                  value={experience.description}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  rows={3}
                  placeholder="Brief description of your role and responsibilities..."
                />
              </div>
            </div>

            <div className="achievements-section">
              <h4>Achievements</h4>
              {experience.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="achievement-item">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) => updateAchievement(experience.id, achievementIndex, e.target.value)}
                    placeholder="Enter an achievement..."
                  />
                  <button
                    type="button"
                    className="btn btn-icon"
                    onClick={() => removeAchievement(experience.id, achievementIndex)}
                    aria-label="Remove achievement"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addAchievement(experience.id)}
              >
                Add Achievement
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-experience"
          onClick={addExperience}
        >
          Add Experience
        </button>
      </div>
    </BaseSectionForm>
  );
};

WorkExperienceForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    company: PropTypes.string,
    position: PropTypes.string,
    location: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    current: PropTypes.bool,
    description: PropTypes.string,
    achievements: PropTypes.arrayOf(PropTypes.string)
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

WorkExperienceForm.defaultProps = {
  initialData: [],
  className: ''
};

export default WorkExperienceForm; 