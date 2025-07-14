// src/components/client/common/FavoritesCounter.jsx
import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';

const FavoritesCounter = ({ 
  showText = false, 
  showCounter = true,
  className = '',
  linkClassName = '',
  iconSize = 20 
}) => {
  const { getFavoritesCount, loading } = useFavoritesContext();
  
  const count = getFavoritesCount();

  return (
    <a
      href="/favoris" // ✅ CORRECTION: Utiliser /favoris au lieu de /favorites
      className={`
        relative inline-flex items-center transition-colors duration-200
        hover:text-red-500
        ${linkClassName}
      `}
    >
      <div className={`relative ${className}`}>
        <Heart 
          size={iconSize} 
          className="transition-colors duration-200" 
        />
        
        {showCounter && count > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {count > 99 ? '99+' : count}
          </span>
        )}
        
        {loading && (
          <div className="absolute -top-1 -right-1">
            <div className="animate-spin rounded-full h-3 w-3 border border-red-500 border-t-transparent"></div>
          </div>
        )}
      </div>
      
      {showText && (
        <span className="ml-2 hidden sm:inline">
          Favoris {showCounter && count > 0 && `(${count})`}
        </span>
      )}
    </a>
  );
};

export default FavoritesCounter;