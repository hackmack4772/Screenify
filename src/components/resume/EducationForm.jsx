import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const EducationForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [educations, setEducations] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setEducations(initialData);
    }
  }, [initialData]);

  const addEducation = () => {
    setEducations(prev => [
      ...prev,
      {
        id: Date.now(),
        institution: '',
        degree: '',
        field: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        gpa: '',
        honors: [],
        relevantCoursework: []
      }
    ]);
    setIsDirty(true);
  };

  const removeEducation = (id) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
    setIsDirty(true);
  };

  const updateEducation = (id, field, value) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const addHonor = (educationId) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === educationId) {
        return {
          ...edu,
          honors: [...edu.honors, '']
        };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const removeHonor = (educationId, index) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === educationId) {
        return {
          ...edu,
          honors: edu.honors.filter((_, i) => i !== index)
        };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const updateHonor = (educationId, index, value) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === educationId) {
        const newHonors = [...edu.honors];
        newHonors[index] = value;
        return { ...edu, honors: newHonors };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const addCourse = (educationId) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === educationId) {
        return {
          ...edu,
          relevantCoursework: [...edu.relevantCoursework, '']
        };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const removeCourse = (educationId, index) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === educationId) {
        return {
          ...edu,
          relevantCoursework: edu.relevantCoursework.filter((_, i) => i !== index)
        };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const updateCourse = (educationId, index, value) => {
    setEducations(prev => prev.map(edu => {
      if (edu.id === educationId) {
        const newCourses = [...edu.relevantCoursework];
        newCourses[index] = value;
        return { ...edu, relevantCoursework: newCourses };
      }
      return edu;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (educations.length === 0) {
      setError('Add at least one education entry');
      return false;
    }

    for (const edu of educations) {
      if (!edu.institution.trim()) {
        setError('Institution name is required');
        return false;
      }
      if (!edu.degree.trim()) {
        setError('Degree is required');
        return false;
      }
      if (!edu.field.trim()) {
        setError('Field of study is required');
        return false;
      }
      if (!edu.startDate) {
        setError('Start date is required');
        return false;
      }
      if (!edu.current && !edu.endDate) {
        setError('End date is required unless currently enrolled');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(educations);
    }
  };

  return (
    <BaseSectionForm
      title="Education"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="educations-container">
        {educations.map((education, index) => (
          <div key={education.id} className="education-item">
            <div className="education-header">
              <h3>Education #{index + 1}</h3>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeEducation(education.id)}
                aria-label={`Remove education ${index + 1}`}
              >
                Remove
              </button>
            </div>

            <div className="form-grid">
              <div className="form-field">
                <label htmlFor={`institution-${education.id}`}>Institution *</label>
                <input
                  type="text"
                  id={`institution-${education.id}`}
                  value={education.institution}
                  onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`degree-${education.id}`}>Degree *</label>
                <input
                  type="text"
                  id={`degree-${education.id}`}
                  value={education.degree}
                  onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`field-${education.id}`}>Field of Study *</label>
                <input
                  type="text"
                  id={`field-${education.id}`}
                  value={education.field}
                  onChange={(e) => updateEducation(education.id, 'field', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`location-${education.id}`}>Location</label>
                <input
                  type="text"
                  id={`location-${education.id}`}
                  value={education.location}
                  onChange={(e) => updateEducation(education.id, 'location', e.target.value)}
                  placeholder="City, State"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`startDate-${education.id}`}>Start Date *</label>
                <input
                  type="date"
                  id={`startDate-${education.id}`}
                  value={education.startDate}
                  onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`endDate-${education.id}`}>End Date</label>
                <input
                  type="date"
                  id={`endDate-${education.id}`}
                  value={education.endDate}
                  onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                  disabled={education.current}
                />
              </div>

              <div className="form-field">
                <label htmlFor={`gpa-${education.id}`}>GPA</label>
                <input
                  type="text"
                  id={`gpa-${education.id}`}
                  value={education.gpa}
                  onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                  placeholder="e.g., 3.8"
                />
              </div>

              <div className="form-field checkbox-field">
                <label>
                  <input
                    type="checkbox"
                    checked={education.current}
                    onChange={(e) => {
                      updateEducation(education.id, 'current', e.target.checked);
                      if (e.target.checked) {
                        updateEducation(education.id, 'endDate', '');
                      }
                    }}
                  />
                  Currently Enrolled
                </label>
              </div>
            </div>

            <div className="honors-section">
              <h4>Honors & Awards</h4>
              {education.honors.map((honor, honorIndex) => (
                <div key={honorIndex} className="list-item">
                  <input
                    type="text"
                    value={honor}
                    onChange={(e) => updateHonor(education.id, honorIndex, e.target.value)}
                    placeholder="Enter an honor or award..."
                  />
                  <button
                    type="button"
                    className="btn btn-icon"
                    onClick={() => removeHonor(education.id, honorIndex)}
                    aria-label="Remove honor"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addHonor(education.id)}
              >
                Add Honor
              </button>
            </div>

            <div className="courses-section">
              <h4>Relevant Coursework</h4>
              {education.relevantCoursework.map((course, courseIndex) => (
                <div key={courseIndex} className="list-item">
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => updateCourse(education.id, courseIndex, e.target.value)}
                    placeholder="Enter a relevant course..."
                  />
                  <button
                    type="button"
                    className="btn btn-icon"
                    onClick={() => removeCourse(education.id, courseIndex)}
                    aria-label="Remove course"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addCourse(education.id)}
              >
                Add Course
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-education"
          onClick={addEducation}
        >
          Add Education
        </button>
      </div>
    </BaseSectionForm>
  );
};

EducationForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    institution: PropTypes.string,
    degree: PropTypes.string,
    field: PropTypes.string,
    location: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    current: PropTypes.bool,
    gpa: PropTypes.string,
    honors: PropTypes.arrayOf(PropTypes.string),
    relevantCoursework: PropTypes.arrayOf(PropTypes.string)
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

EducationForm.defaultProps = {
  initialData: [],
  className: ''
};

export default EducationForm; 