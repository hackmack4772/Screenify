import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseSectionForm from './BaseSectionForm';

const CertificationsForm = ({
  initialData,
  onSave,
  onCancel,
  className
}) => {
  const [certifications, setCertifications] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setCertifications(initialData);
    }
  }, [initialData]);

  const addCertification = () => {
    setCertifications(prev => [...prev, {
      id: Date.now(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      isExpired: false,
      isPermanent: false,
      description: '',
      skills: []
    }]);
    setIsDirty(true);
  };

  const removeCertification = (id) => {
    setCertifications(prev => prev.filter(cert => cert.id !== id));
    setIsDirty(true);
  };

  const updateCertification = (id, field, value) => {
    setCertifications(prev => prev.map(cert => {
      if (cert.id === id) {
        return { ...cert, [field]: value };
      }
      return cert;
    }));
    setIsDirty(true);
  };

  const addSkill = (certId) => {
    setCertifications(prev => prev.map(cert => {
      if (cert.id === certId) {
        return {
          ...cert,
          skills: [...cert.skills, { id: Date.now(), name: '' }]
        };
      }
      return cert;
    }));
    setIsDirty(true);
  };

  const removeSkill = (certId, skillId) => {
    setCertifications(prev => prev.map(cert => {
      if (cert.id === certId) {
        return {
          ...cert,
          skills: cert.skills.filter(skill => skill.id !== skillId)
        };
      }
      return cert;
    }));
    setIsDirty(true);
  };

  const updateSkill = (certId, skillId, value) => {
    setCertifications(prev => prev.map(cert => {
      if (cert.id === certId) {
        return {
          ...cert,
          skills: cert.skills.map(skill => {
            if (skill.id === skillId) {
              return { ...skill, name: value };
            }
            return skill;
          })
        };
      }
      return cert;
    }));
    setIsDirty(true);
  };

  const validateForm = () => {
    if (certifications.length === 0) {
      setError('Add at least one certification');
      return false;
    }

    for (const cert of certifications) {
      if (!cert.name.trim()) {
        setError('Certification name is required');
        return false;
      }
      if (!cert.issuer.trim()) {
        setError('Issuing organization is required');
        return false;
      }
      if (!cert.issueDate) {
        setError('Issue date is required');
        return false;
      }
      if (!cert.isPermanent && !cert.isExpired && !cert.expiryDate) {
        setError('Expiry date is required for non-permanent certifications');
        return false;
      }
      if (cert.credentialUrl && !/^https?:\/\/.+/.test(cert.credentialUrl)) {
        setError('Invalid credential URL format');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(certifications);
    }
  };

  return (
    <BaseSectionForm
      title="Certifications"
      onSave={handleSave}
      onCancel={onCancel}
      isDirty={isDirty}
      error={error}
      className={className}
    >
      <div className="certifications-container">
        {certifications.map((cert) => (
          <div key={cert.id} className="certification-item">
            <div className="certification-header">
              <h3>Certification Details</h3>
              <button
                type="button"
                className="btn btn-icon"
                onClick={() => removeCertification(cert.id)}
                aria-label="Remove certification"
              >
                ×
              </button>
            </div>

            <div className="certification-grid">
              <div className="form-field">
                <label htmlFor={`cert-name-${cert.id}`}>Certification Name *</label>
                <input
                  id={`cert-name-${cert.id}`}
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                  required
                  aria-required="true"
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization *</label>
                <input
                  id={`cert-issuer-${cert.id}`}
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                  required
                  aria-required="true"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`cert-issue-date-${cert.id}`}>Issue Date *</label>
                <input
                  id={`cert-issue-date-${cert.id}`}
                  type="date"
                  value={cert.issueDate}
                  onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`cert-expiry-date-${cert.id}`}>Expiry Date</label>
                <input
                  id={`cert-expiry-date-${cert.id}`}
                  type="date"
                  value={cert.expiryDate}
                  onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  disabled={cert.isPermanent || cert.isExpired}
                />
              </div>

              <div className="form-field">
                <label htmlFor={`cert-permanent-${cert.id}`}>
                  <input
                    id={`cert-permanent-${cert.id}`}
                    type="checkbox"
                    checked={cert.isPermanent}
                    onChange={(e) => {
                      updateCertification(cert.id, 'isPermanent', e.target.checked);
                      if (e.target.checked) {
                        updateCertification(cert.id, 'isExpired', false);
                        updateCertification(cert.id, 'expiryDate', '');
                      }
                    }}
                  />
                  No Expiry Date
                </label>
              </div>

              <div className="form-field">
                <label htmlFor={`cert-expired-${cert.id}`}>
                  <input
                    id={`cert-expired-${cert.id}`}
                    type="checkbox"
                    checked={cert.isExpired}
                    onChange={(e) => {
                      updateCertification(cert.id, 'isExpired', e.target.checked);
                      if (e.target.checked) {
                        updateCertification(cert.id, 'isPermanent', false);
                      }
                    }}
                  />
                  Expired
                </label>
              </div>

              <div className="form-field">
                <label htmlFor={`cert-credential-id-${cert.id}`}>Credential ID</label>
                <input
                  id={`cert-credential-id-${cert.id}`}
                  type="text"
                  value={cert.credentialId}
                  onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                  placeholder="e.g., AWS-123456"
                />
              </div>

              <div className="form-field">
                <label htmlFor={`cert-credential-url-${cert.id}`}>Credential URL</label>
                <input
                  id={`cert-credential-url-${cert.id}`}
                  type="url"
                  value={cert.credentialUrl}
                  onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)}
                  placeholder="https://credential-url.com"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor={`cert-description-${cert.id}`}>Description</label>
              <textarea
                id={`cert-description-${cert.id}`}
                value={cert.description}
                onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                rows="3"
                placeholder="Brief description of the certification and its significance..."
              />
            </div>

            <div className="form-field">
              <label>Related Skills</label>
              <div className="skills-list">
                {cert.skills.map((skill) => (
                  <div key={skill.id} className="skill-item">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(cert.id, skill.id, e.target.value)}
                      placeholder="e.g., Cloud Architecture, Security"
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => removeSkill(cert.id, skill.id)}
                      aria-label="Remove skill"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => addSkill(cert.id)}
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary add-certification"
          onClick={addCertification}
        >
          Add Certification
        </button>
      </div>
    </BaseSectionForm>
  );
};

CertificationsForm.propTypes = {
  initialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    issuer: PropTypes.string,
    issueDate: PropTypes.string,
    expiryDate: PropTypes.string,
    credentialId: PropTypes.string,
    credentialUrl: PropTypes.string,
    isExpired: PropTypes.bool,
    isPermanent: PropTypes.bool,
    description: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }))
  })),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  className: PropTypes.string
};

CertificationsForm.defaultProps = {
  initialData: [],
  className: ''
};

export default CertificationsForm; 