import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const InterestsForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [interests, setInterests] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setInterests(initialData);
    }
  }, [initialData]);

  const addInterest = () => {
    setInterests(prev => [...prev, {
      id: Date.now(),
      name: '',
      category: 'hobby',
      description: '',
      achievements: [],
      isProfessional: false
    }]);
    setIsDirty(true);
  };

  const removeInterest = (id) => {
    setInterests(prev => prev.filter(interest => interest.id !== id));
    setIsDirty(true);
  };

  const updateInterest = (id, field, value) => {
    setInterests(prev => prev.map(interest => {
      if (interest.id === id) {
        return { ...interest, [field]: value };
      }
      return interest;
    }));
    setIsDirty(true);
  };

  const addAchievement = (interestId) => {
    setInterests(prev => prev.map(interest => {
      if (interest.id === interestId) {
        return {
          ...interest,
          achievements: [...interest.achievements, { id: Date.now(), text: '' }]
        };
      }
      return interest;
    }));
    setIsDirty(true);
  };

  const removeAchievement = (interestId, achievementId) => {
    setInterests(prev => prev.map(interest => {
      if (interest.id === interestId) {
        return {
          ...interest,
          achievements: interest.achievements.filter(achievement => achievement.id !== achievementId)
        };
      }
      return interest;
    }));
    setIsDirty(true);
  };

  const updateAchievement = (interestId, achievementId, value) => {
    setInterests(prev => prev.map(interest => {
      if (interest.id === interestId) {
        return {
          ...interest,
          achievements: interest.achievements.map(achievement => {
            if (achievement.id === achievementId) {
              return { ...achievement, text: value };
            }
            return achievement;
          })
        };
      }
      return interest;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (interests.length === 0) {
      setError('Add at least one interest');
      return false;
    }

    for (const interest of interests) {
      if (!interest.name.trim()) {
        setError('Interest name is required');
        return false;
      }
      if (!interest.category) {
        setError('Category is required');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(interests);
    }
  };

  return (
    <BaseSectionForm
      title="Interests"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="interests-container">
        {interests.map((interest) => (
          <div key={interest.id} className="interest-item">
            <div className="interest-header">
              <h3>Interest Details</h3>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => removeInterest(interest.id)}
                aria-label="Remove interest"
              >
                ×
              </button>
            </div>

            <div className="interest-grid">
              <div className="form-field">
                <label htmlFor={`interest-name-${interest.id}`}>Interest Name *</label>
                <input
                  id={`interest-name-${interest.id}`}
                  type="text"
                  value={interest.name}
                  onChange={(e) => updateInterest(interest.id, 'name', e.target.value)}
                  required
                  aria-required="true"
                  placeholder="e.g., Photography, Chess"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`interest-category-${interest.id}`}>Category *</label>
                <select
                  id={`interest-category-${interest.id}`}
                  value={interest.category}
                  onChange={(e) => updateInterest(interest.id, 'category', e.target.value)}
                  required
                  aria-required="true"
                >
                  <option value="hobby">Hobby</option>
                  <option value="sport">Sport</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="reading">Reading</option>
                  <option value="travel">Travel</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor={`interest-professional-${interest.id}`}>
                  <input
                    id={`interest-professional-${interest.id}`}
                    type="checkbox"
                    checked={interest.isProfessional}
                    onChange={(e) => updateInterest(interest.id, 'isProfessional', e.target.checked)}
                  />
                  Professional Interest
                </label>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={`interest-description-${interest.id}`}>Description</label>
              <textarea
                id={`interest-description-${interest.id}`}
                value={interest.description}
                onChange={(e) => updateInterest(interest.id, 'description', e.target.value)}
                rows="3"
                placeholder="Describe your interest and involvement..."
              />
            </div>

            <div className="form-field">
              <label>Achievements & Accomplishments</label>
              <div className="achievements-list">
                {interest.achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <input
                      type="text"
                      value={achievement.text}
                      onChange={(e) => updateAchievement(interest.id, achievement.id, e.target.value)}
                      placeholder="e.g., Won local tournament, Published article"
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => removeAchievement(interest.id, achievement.id)}
                      aria-label="Remove achievement"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addAchievement(interest.id)}
                >
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-interest"
          onClick={addInterest}
        >
          Add Interest
        </button>
      </div>
    </BaseSectionForm>
  );
};

InterestsForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    category: PropTypes.oneOf(['hobby', 'sport', 'art', 'music', 'reading', 'travel', 'other']),
    description: PropTypes.string,
    achievements: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string
    })),
    isProfessional: PropTypes.bool
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

InterestsForm.defaultProps = {
  initialData: [],
  className: ''
};

export default InterestsForm; 