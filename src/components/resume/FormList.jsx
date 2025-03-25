import React from 'react';
import PropTypes from 'prop-types';
import FormListItem from './FormListItem';

const FormList = ({
  items,
  onAdd,
  onUpdate,
  onRemove,
  label,
  addButtonText,
  placeholder,
  error
}) => {
  return (
    <div className="form-list">
      {label && <label>{label}</label>}
      <div className="list-items">
        {items.map((item) => (
          <FormListItem
            key={item.id}
            id={item.id}
            value={item.name || item.text}
            onChange={(e) => onUpdate(item.id, e.target.value)}
            onRemove={() => onRemove(item.id)}
            placeholder={placeholder}
            error={error}
          />
        ))}
      </div>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onAdd}
      >
        {addButtonText}
      </button>
    </div>
  );
};

FormList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    text: PropTypes.string
  })).isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  label: PropTypes.string,
  addButtonText: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string
};

export default FormList; 