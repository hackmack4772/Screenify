import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const SkillsForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [skills, setSkills] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setSkills(initialData);
    }
  }, [initialData]);

  const addSkill = () => {
    setSkills(prev => [...prev, {
      id: Date.now(),
      name: '',
      category: 'technical',
      proficiency: 'intermediate',
      yearsExperience: '',
      description: '',
      keywords: []
    }]);
    setIsDirty(true);
  };

  const removeSkill = (id) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
    setIsDirty(true);
  };

  const updateSkill = (id, field, value) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === id) {
        return { ...skill, [field]: value };
      }
      return skill;
    }));
    setIsDirty(true);
  };

  const addKeyword = (skillId) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          keywords: [...skill.keywords, { id: Date.now(), name: '' }]
        };
      }
      return skill;
    }));
    setIsDirty(true);
  };

  const removeKeyword = (skillId, keywordId) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          keywords: skill.keywords.filter(keyword => keyword.id !== keywordId)
        };
      }
      return skill;
    }));
    setIsDirty(true);
  };

  const updateKeyword = (skillId, keywordId, value) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        return {
          ...skill,
          keywords: skill.keywords.map(keyword => {
            if (keyword.id === keywordId) {
              return { ...keyword, name: value };
            }
            return keyword;
          })
        };
      }
      return skill;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (skills.length === 0) {
      setError('Add at least one skill');
      return false;
    }

    for (const skill of skills) {
      if (!skill.name.trim()) {
        setError('Skill name is required');
        return false;
      }
      if (!skill.category) {
        setError('Skill category is required');
        return false;
      }
      if (!skill.proficiency) {
        setError('Proficiency level is required');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(skills);
    }
  };

  return (
    <BaseSectionForm
      title="Skills"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="skills-container">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <div className="skill-header">
              <h3>Skill Details</h3>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => removeSkill(skill.id)}
                aria-label="Remove skill"
              >
                ×
              </button>
            </div>

            <div className="skill-grid">
              <div className="form-field">
                <label htmlFor={`skill-name-${skill.id}`}>Skill Name *</label>
                <input
                  id={`skill-name-${skill.id}`}
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  required
                  aria-required="true"
                  placeholder="e.g., JavaScript, Project Management"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`skill-category-${skill.id}`}>Category *</label>
                <select
                  id={`skill-category-${skill.id}`}
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  required
                  aria-required="true"
                >
                  <option value="technical">Technical</option>
                  <option value="soft">Soft Skills</option>
                  <option value="language">Languages</option>
                  <option value="tools">Tools & Software</option>
                  <option value="methodologies">Methodologies</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor={`skill-proficiency-${skill.id}`}>Proficiency Level *</label>
                <select
                  id={`skill-proficiency-${skill.id}`}
                  value={skill.proficiency}
                  onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                  required
                  aria-required="true"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor={`skill-years-${skill.id}`}>Years of Experience</label>
                <input
                  id={`skill-years-${skill.id}`}
                  type="number"
                  min="0"
                  step="0.5"
                  value={skill.yearsExperience}
                  onChange={(e) => updateSkill(skill.id, 'yearsExperience', e.target.value)}
                  placeholder="e.g., 3.5"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={`skill-description-${skill.id}`}>Description</label>
              <textarea
                id={`skill-description-${skill.id}`}
                value={skill.description}
                onChange={(e) => updateSkill(skill.id, 'description', e.target.value)}
                rows="3"
                placeholder="Describe your experience and expertise with this skill..."
              />
            </div>

            <div className="form-field">
              <label>Related Keywords</label>
              <div className="keywords-list">
                {skill.keywords.map((keyword) => (
                  <div key={keyword.id} className="keyword-item">
                    <input
                      type="text"
                      value={keyword.name}
                      onChange={(e) => updateKeyword(skill.id, keyword.id, e.target.value)}
                      placeholder="e.g., React, Node.js, Agile"
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => removeKeyword(skill.id, keyword.id)}
                      aria-label="Remove keyword"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addKeyword(skill.id)}
                >
                  Add Keyword
                </button>
              </div>
            </div>

            <div className="proficiency-indicator">
              <div className={`level-bar ${skill.proficiency}`} />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-skill"
          onClick={addSkill}
        >
          Add Skill
        </button>
      </div>
    </BaseSectionForm>
  );
};

SkillsForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    category: PropTypes.oneOf(['technical', 'soft', 'language', 'tools', 'methodologies', 'other']),
    proficiency: PropTypes.oneOf(['beginner', 'intermediate', 'advanced', 'expert']),
    yearsExperience: PropTypes.string,
    description: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }))
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

SkillsForm.defaultProps = {
  initialData: [],
  className: ''
};

export default SkillsForm; 