import React from 'react';
import PropTypes from 'prop-types';

const FormSection = ({
  id,
  title,
  onRemove,
  children,
  className
}) => {
  return (
    <div className={`form-section ${className}`}>
      <div className="section-header">
        <h3>{title}</h3>
        <button
          type="button"
          className="btn btn-icon"
          onClick={onRemove}
          aria-label={`Remove ${title.toLowerCase()}`}
        >
          ×
        </button>
      </div>
      {children}
    </div>
  );
};

FormSection.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

FormSection.defaultProps = {
  className: ''
};

export default FormSection; 