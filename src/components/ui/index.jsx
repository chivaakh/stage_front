// src/components/ui/index.jsx
import React from 'react';
import { theme } from '../../styles/theme';
export { default as ImageUpload } from './ImageUpload';

// Modal Component
export const Modal = ({ isOpen, onClose, children, maxWidth = '500px' }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth,
        margin: theme.spacing.lg
      }}>
        {children}
      </div>
    </div>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      border: 'none'
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.white,
      border: 'none'
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.white,
      border: 'none'
    },
    outline: {
      backgroundColor: theme.colors.gray[100],
      color: theme.colors.gray[600],
      border: `1px solid ${theme.colors.gray[300]}`
    }
  };

  const sizes = {
    sm: { padding: '8px 12px', fontSize: '12px' },
    md: { padding: '12px 20px', fontSize: '14px' },
    lg: { padding: '16px 24px', fontSize: '16px' }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: theme.borderRadius.md,
        fontWeight: '500',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        fontFamily: theme.fonts.base,
        outline: 'none',
        transition: 'all 0.2s',
        ...props.style
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  required = false,
  ...props 
}) => {
  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: theme.colors.gray[700],
          marginBottom: theme.spacing.sm
        }}>
          {label} {required && <span style={{ color: theme.colors.danger }}>*</span>}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: theme.spacing.md,
          border: `1px solid ${error ? theme.colors.danger : theme.colors.gray[300]}`,
          borderRadius: theme.borderRadius.md,
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: theme.fonts.base
        }}
        {...props}
      />
      {error && (
        <div style={{
          color: theme.colors.danger,
          fontSize: '12px',
          marginTop: theme.spacing.xs
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({ 
  label, 
  error, 
  required = false,
  rows = 4,
  ...props 
}) => {
  return (
    <div style={{ marginBottom: theme.spacing.lg }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: theme.colors.gray[700],
          marginBottom: theme.spacing.sm
        }}>
          {label} {required && <span style={{ color: theme.colors.danger }}>*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        style={{
          width: '100%',
          padding: theme.spacing.md,
          border: `1px solid ${error ? theme.colors.danger : theme.colors.gray[300]}`,
          borderRadius: theme.borderRadius.md,
          fontSize: '14px',
          outline: 'none',
          resize: 'vertical',
          boxSizing: 'border-box',
          fontFamily: theme.fonts.base
        }}
        {...props}
      />
      {error && (
        <div style={{
          color: theme.colors.danger,
          fontSize: '12px',
          marginTop: theme.spacing.xs
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// Alert Component
export const Alert = ({ type = 'error', children, onClose }) => {
  const types = {
    error: {
      backgroundColor: '#fed7d7',
      color: '#c53030',
      borderColor: '#feb2b2'
    },
    success: {
      backgroundColor: '#c6f6d5',
      color: '#22543d',
      borderColor: '#9ae6b4'
    },
    warning: {
      backgroundColor: '#fefcbf',
      color: '#744210',
      borderColor: '#f6e05e'
    }
  };

  return (
    <div style={{
      ...types[type],
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.lg,
      border: `1px solid ${types[type].borderColor}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: 'inherit'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};