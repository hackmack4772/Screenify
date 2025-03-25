import React from 'react';
import PropTypes from 'prop-types';
import '../styles/BaseSectionForm.css';

const BaseSectionForm = ({
  title,
  children,
  onSave,
  onCancel,
  isDirty,
  error,
  className
}) => {
  return (
    <div className={`base-section-form ${className || ''}`}>
      <div className="form-header">
        <h2>{title}</h2>
        {error && <div className="form-error">{error}</div>}
      </div>

      <div className="form-content">
        {children}
      </div>

      <div className="form-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={!isDirty}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

BaseSectionForm.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
};

BaseSectionForm.defaultProps = {
  isDirty: false,
  error: null,
  className: ''
};

export default BaseSectionForm; 