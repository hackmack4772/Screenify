import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/BaseSectionForm.css';

const BaseSectionForm = ({
  title,
  onSave,
  onCancel,
  isDirty,
  error,
  className,
  children
}) => {
  return (
    <div className={`base-section-form ${className}`}>
      <div className="base-section-header">
        <h2>{title}</h2>
      </div>

      {error && (
        <div className="base-section-error" role="alert">
          {error}
        </div>
      )}

      <div className="base-section-content">
        {children}
      </div>

      <div className="base-section-footer">
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
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isDirty: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

BaseSectionForm.defaultProps = {
  isDirty: false,
  error: null,
  className: ''
};

export default BaseSectionForm; 