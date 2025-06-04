import React from 'react';
import { theme } from '../../styles/theme';

const Select = ({ 
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Sélectionner une option",
  disabled = false,
  required = false,
  error = false,
  className = "",
  ...props 
}) => {
  const baseStyles = {
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${error ? theme.colors.error : theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '16px',
    backgroundColor: disabled ? theme.colors.gray[100] : theme.colors.white,
    color: disabled ? theme.colors.gray[500] : theme.colors.gray[900],
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px'
  };

  const focusStyles = {
    borderColor: error ? theme.colors.error : theme.colors.primary,
    boxShadow: `0 0 0 3px ${error ? theme.colors.error + '20' : theme.colors.primary + '20'}`,
  };

  const handleFocus = (e) => {
    Object.assign(e.target.style, focusStyles);
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = error ? theme.colors.error : theme.colors.border;
    e.target.style.boxShadow = 'none';
  };

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      style={baseStyles}
      className={className}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option 
          key={option.value || index} 
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Composant SelectGroup pour les options groupées
const SelectGroup = ({ label, children }) => (
  <optgroup label={label}>
    {children}
  </optgroup>
);

// Hook pour gérer l'état du select
const useSelect = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    setValue,
    handleChange,
    isOpen,
    setIsOpen,
    reset
  };
};

export { Select as default, SelectGroup, useSelect };