import React from 'react';
import PropTypes from 'prop-types';
import FormField from './FormField';

const FormListItem = ({
  id,
  value,
  onChange,
  onRemove,
  placeholder,
  error
}) => {
  return (
    <div className="list-item">
      <FormField
        id={`item-${id}`}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
      />
      <button
        type="button"
        className="btn btn-icon"
        onClick={onRemove}
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
};

FormListItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string
};

export default FormListItem; 