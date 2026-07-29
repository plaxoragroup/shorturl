import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  fullWidth = true, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        className={`input-field ${error ? 'input-error' : ''}`} 
        {...props} 
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;
