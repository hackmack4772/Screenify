import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const ReferencesForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [references, setReferences] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setReferences(initialData);
    }
  }, [initialData]);

  const addReference = () => {
    setReferences(prev => [...prev, {
      id: Date.now(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: '',
      yearsKnown: '',
      isAvailable: true,
      notes: ''
    }]);
    setIsDirty(true);
  };

  const removeReference = (id) => {
    setReferences(prev => prev.filter(ref => ref.id !== id));
    setIsDirty(true);
  };

  const updateReference = (id, field, value) => {
    setReferences(prev => prev.map(ref => {
      if (ref.id === id) {
        return { ...ref, [field]: value };
      }
      return ref;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (references.length === 0) {
      setError('Add at least one reference');
      return false;
    }

    for (const ref of references) {
      if (!ref.name.trim()) {
        setError('Reference name is required');
        return false;
      }
      if (!ref.title.trim()) {
        setError('Reference title is required');
        return false;
      }
      if (!ref.company.trim()) {
        setError('Company name is required');
        return false;
      }
      if (!ref.email.trim()) {
        setError('Email is required');
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref.email)) {
        setError('Invalid email format');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(references);
    }
  };

  return (
    <BaseSectionForm
      title="References"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="references-container">
        {references.map((ref) => (
          <div key={ref.id} className="reference-item">
            <div className="reference-header">
              <h3>Reference Details</h3>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => removeReference(ref.id)}
                aria-label="Remove reference"
              >
                ×
              </button>
            </div>

            <div className="reference-grid">
              <div className="form-field">
                <label htmlFor={`ref-name-${ref.id}`}>Full Name *</label>
                <input
                  id={`ref-name-${ref.id}`}
                  type="text"
                  value={ref.name}
                  onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-title-${ref.id}`}>Professional Title *</label>
                <input
                  id={`ref-title-${ref.id}`}
                  type="text"
                  value={ref.title}
                  onChange={(e) => updateReference(ref.id, 'title', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-company-${ref.id}`}>Company *</label>
                <input
                  id={`ref-company-${ref.id}`}
                  type="text"
                  value={ref.company}
                  onChange={(e) => updateReference(ref.id, 'company', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-email-${ref.id}`}>Email *</label>
                <input
                  id={`ref-email-${ref.id}`}
                  type="email"
                  value={ref.email}
                  onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-phone-${ref.id}`}>Phone Number</label>
                <input
                  id={`ref-phone-${ref.id}`}
                  type="tel"
                  value={ref.phone}
                  onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                  placeholder="+1 (555) 555-5555"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-relationship-${ref.id}`}>Professional Relationship</label>
                <input
                  id={`ref-relationship-${ref.id}`}
                  type="text"
                  value={ref.relationship}
                  onChange={(e) => updateReference(ref.id, 'relationship', e.target.value)}
                  placeholder="e.g., Former Manager, Mentor"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-years-${ref.id}`}>Years Known</label>
                <input
                  id={`ref-years-${ref.id}`}
                  type="text"
                  value={ref.yearsKnown}
                  onChange={(e) => updateReference(ref.id, 'yearsKnown', e.target.value)}
                  placeholder="e.g., 3 years"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`ref-available-${ref.id}`}>
                  <input
                    id={`ref-available-${ref.id}`}
                    type="checkbox"
                    checked={ref.isAvailable}
                    onChange={(e) => updateReference(ref.id, 'isAvailable', e.target.checked)}
                  />
                  Available for Contact
                </label>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={`ref-notes-${ref.id}`}>Additional Notes</label>
              <textarea
                id={`ref-notes-${ref.id}`}
                value={ref.notes}
                onChange={(e) => updateReference(ref.id, 'notes', e.target.value)}
                rows="3"
                placeholder="Any additional information about the reference..."
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-reference"
          onClick={addReference}
        >
          Add Reference
        </button>
      </div>
    </BaseSectionForm>
  );
};

ReferencesForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    relationship: PropTypes.string,
    yearsKnown: PropTypes.string,
    isAvailable: PropTypes.bool,
    notes: PropTypes.string
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

ReferencesForm.defaultProps = {
  initialData: [],
  className: ''
};

export default ReferencesForm; 