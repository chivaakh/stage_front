// src/components/products/ProductSearch.jsx
import React from 'react';
import { SearchIcon } from '../icons';
import { theme } from '../../styles/theme';

const ProductSearch = ({ value, onChange, placeholder = "Rechercher des produits..." }) => {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '300px',
          padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 44px`,
          border: `1px solid ${theme.colors.gray[300]}`,
          borderRadius: theme.borderRadius.md,
          fontSize: '14px',
          outline: 'none',
          fontFamily: theme.fonts.base,
          transition: 'border-color 0.2s',
          ':focus': {
            borderColor: theme.colors.primary
          }
        }}
        onFocus={(e) => {
          e.target.style.borderColor = theme.colors.primary;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = theme.colors.gray[300];
        }}
      />
      <div style={{
        position: 'absolute',
        left: theme.spacing.md,
        top: '50%',
        transform: 'translateY(-50%)',
        color: theme.colors.gray[400]
      }}>
        <SearchIcon />
      </div>
    </div>
  );
};

export default ProductSearch;