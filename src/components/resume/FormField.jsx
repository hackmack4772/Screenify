import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  className,
  children,
  error
}) => {
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={error ? 'error' : ''}
          />
        );
      case 'select':
        return (
          <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className={error ? 'error' : ''}
          >
            {children}
          </select>
        );
      case 'checkbox':
        return (
          <input
            id={id}
            type="checkbox"
            checked={value}
            onChange={onChange}
            className={error ? 'error' : ''}
          />
        );
      default:
        return (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className={error ? 'error' : ''}
          />
        );
    }
  };

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {renderField()}
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'tel', 'url', 'date', 'number', 'textarea', 'select', 'checkbox']),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.string
};

FormField.defaultProps = {
  type: 'text',
  required: false,
  className: ''
};

export default FormField; 