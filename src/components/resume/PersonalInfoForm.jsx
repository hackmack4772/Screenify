import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const PersonalInfoForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  });
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <BaseSectionForm
      title="Personal Information"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error === 'First name is required'}
            aria-describedby={error === 'First name is required' ? 'firstName-error' : undefined}
          />
          {error === 'First name is required' && (
            <div id="firstName-error" className="error-message" role="alert">
              First name is required
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error === 'Last name is required'}
            aria-describedby={error === 'Last name is required' ? 'lastName-error' : undefined}
          />
          {error === 'Last name is required' && (
            <div id="lastName-error" className="error-message" role="alert">
              Last name is required
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={error === 'Email is required' || error === 'Please enter a valid email address'}
            aria-describedby={error?.includes('email') ? 'email-error' : undefined}
          />
          {error?.includes('email') && (
            <div id="email-error" className="error-message" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(123) 456-7890"
          />
        </div>

        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
          />
        </div>

        <div className="form-field">
          <label htmlFor="website">Personal Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://"
          />
        </div>

        <div className="form-field">
          <label htmlFor="linkedin">LinkedIn Profile</label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/"
          />
        </div>

        <div className="form-field">
          <label htmlFor="github">GitHub Profile</label>
          <input
            type="url"
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="https://github.com/"
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="summary">Professional Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            placeholder="Write a brief summary of your professional background and career objectives..."
            rows={4}
          />
        </div>
      </div>
    </BaseSectionForm>
  );
};

PersonalInfoForm.propTypes = {
  initialData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    website: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
    summary: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

PersonalInfoForm.defaultProps = {
  initialData: null,
  className: ''
};

export default PersonalInfoForm; 