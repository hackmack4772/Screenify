import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const LanguagesForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [languages, setLanguages] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setLanguages(initialData);
    }
  }, [initialData]);

  const addLanguage = () => {
    setLanguages(prev => [...prev, {
      id: Date.now(),
      name: '',
      proficiency: 'intermediate',
      isNative: false,
      certificates: []
    }]);
    setIsDirty(true);
  };

  const removeLanguage = (id) => {
    setLanguages(prev => prev.filter(lang => lang.id !== id));
    setIsDirty(true);
  };

  const updateLanguage = (id, field, value) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.id === id) {
        return { ...lang, [field]: value };
      }
      return lang;
    }));
    setIsDirty(true);
  };

  const addCertificate = (langId) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.id === langId) {
        return {
          ...lang,
          certificates: [...lang.certificates, { id: Date.now(), name: '', date: '' }]
        };
      }
      return lang;
    }));
    setIsDirty(true);
  };

  const removeCertificate = (langId, certId) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.id === langId) {
        return {
          ...lang,
          certificates: lang.certificates.filter(cert => cert.id !== certId)
        };
      }
      return lang;
    }));
    setIsDirty(true);
  };

  const updateCertificate = (langId, certId, field, value) => {
    setLanguages(prev => prev.map(lang => {
      if (lang.id === langId) {
        return {
          ...lang,
          certificates: lang.certificates.map(cert => {
            if (cert.id === certId) {
              return { ...cert, [field]: value };
            }
            return cert;
          })
        };
      }
      return lang;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (languages.length === 0) {
      setError('Add at least one language');
      return false;
    }

    for (const lang of languages) {
      if (!lang.name.trim()) {
        setError('Language name is required');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(languages);
    }
  };

  return (
    <BaseSectionForm
      title="Languages"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="languages-container">
        {languages.map((lang) => (
          <div key={lang.id} className="language-item">
            <div className="language-header">
              <h3>Language Details</h3>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => removeLanguage(lang.id)}
                aria-label="Remove language"
              >
                ×
              </button>
            </div>

            <div className="form-field">
              <label htmlFor={`lang-name-${lang.id}`}>Language Name *</label>
              <input
                id={`lang-name-${lang.id}`}
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div className="form-field">
              <label htmlFor={`lang-proficiency-${lang.id}`}>Proficiency Level</label>
              <select
                id={`lang-proficiency-${lang.id}`}
                value={lang.proficiency}
                onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor={`lang-native-${lang.id}`}>
                <input
                  id={`lang-native-${lang.id}`}
                  type="checkbox"
                  checked={lang.isNative}
                  onChange={(e) => updateLanguage(lang.id, 'isNative', e.target.checked)}
                />
                Native Language
              </label>
            </div>

            <div className="form-field">
              <label>Language Certificates</label>
              <div className="certificates-list">
                {lang.certificates.map((cert) => (
                  <div key={cert.id} className="certificate-item">
                    <div className="certificate-inputs">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateCertificate(lang.id, cert.id, 'name', e.target.value)}
                        placeholder="Certificate name..."
                      />
                      <input
                        type="date"
                        value={cert.date}
                        onChange={(e) => updateCertificate(lang.id, cert.id, 'date', e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-icon"
                        onClick={() => removeCertificate(lang.id, cert.id)}
                        aria-label="Remove certificate"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addCertificate(lang.id)}
                >
                  Add Certificate
                </button>
              </div>
            </div>

            <div className="proficiency-indicator">
              <div className={`level-bar ${lang.proficiency}`} />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-language"
          onClick={addLanguage}
        >
          Add Language
        </button>
      </div>
    </BaseSectionForm>
  );
};

LanguagesForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    proficiency: PropTypes.oneOf(['beginner', 'intermediate', 'advanced', 'fluent', 'native']),
    isNative: PropTypes.bool,
    certificates: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      date: PropTypes.string
    }))
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

LanguagesForm.defaultProps = {
  initialData: [],
  className: ''
};

export default LanguagesForm; 