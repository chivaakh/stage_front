// src/components/client/common/FavoriteButton.jsx - Version DEBUG COMPLÈTE
import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';

const FavoriteButton = ({ 
  produitId, 
  size = 'md',
  showText = false,
  onToggle = null,
  className = ''
}) => {
  const { isFavorite, toggleFavorite, loading: contextLoading } = useFavoritesContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastResult, setLastResult] = useState(null); // Pour debug
  
  const lastClickRef = useRef(0);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!contextLoading) {
      setIsInitialized(true);
    }
  }, [contextLoading]);

  const isCurrentlyFavorite = isInitialized ? isFavorite(produitId) : false;

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Protection basique
    const now = Date.now();
    if (now - lastClickRef.current < 100) {
      console.log(`⚡ [Button-${produitId}] Clic trop rapide, ignoré`);
      return;
    }

    if (isProcessingRef.current) {
      console.log(`⚡ [Button-${produitId}] Déjà en traitement, ignoré`);
      return;
    }

    if (isLoading || !isInitialized) {
      console.log(`⚡ [Button-${produitId}] Non prêt, ignoré`);
      return;
    }

    lastClickRef.current = now;
    isProcessingRef.current = true;

    console.group(`🔍 [BUTTON-${produitId}] DÉBUT TOGGLE`);
    console.log('État initial:', {
      produitId,
      isCurrentlyFavorite,
      timestamp: new Date().toISOString()
    });

    setIsLoading(true);
    setError(null);
    setLastResult(null);

    try {
      console.log('📤 Appel toggleFavorite...');
      
      const result = await toggleFavorite(produitId);
      
      console.log('📥 Résultat reçu:', {
        result,
        type: typeof result,
        keys: Object.keys(result || {}),
        success: result?.success,
        message: result?.message,
        error: result?.error
      });
      
      setLastResult(result); // Sauvegarder pour debug

      // ✅ VÉRIFICATION STRICTE du résultat
      if (result && typeof result === 'object') {
        if (result.success === true) {
          console.log('✅ Succès confirmé:', result.message);
          
          // Callback parent
          if (onToggle) {
            try {
              onToggle(produitId, result.isFavorite);
              console.log('📞 Callback parent appelé avec succès');
            } catch (callbackError) {
              console.error('❌ Erreur callback parent:', callbackError);
            }
          }

          // Toast avec vérification
          if (typeof window !== 'undefined' && window.showToast) {
            try {
              const icon = result.isFavorite ? '❤️' : '💔';
              const message = result.message || (result.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris');
              window.showToast(`${icon} ${message}`, 'success');
              console.log('🍞 Toast succès affiché');
            } catch (toastError) {
              console.error('❌ Erreur toast succès:', toastError);
            }
          }
          
        } else if (result.success === false) {
          console.log('❌ Échec confirmé:', result.error);
          
          const errorMessage = result.error || 'Erreur lors de la modification des favoris';
          setError(errorMessage);
          
          // Toast d'erreur seulement si c'est une vraie erreur
          if (errorMessage && !errorMessage.includes('cours') && !errorMessage.includes('patienter')) {
            if (typeof window !== 'undefined' && window.showToast) {
              try {
                window.showToast(`❌ ${errorMessage}`, 'error');
                console.log('🍞 Toast erreur affiché:', errorMessage);
              } catch (toastError) {
                console.error('❌ Erreur toast erreur:', toastError);
              }
            }
          }
          
        } else {
          console.warn('⚠️ Résultat inattendu - success non défini:', result);
          setError('Réponse inattendue du serveur');
          
          if (typeof window !== 'undefined' && window.showToast) {
            window.showToast('❌ Réponse inattendue du serveur', 'error');
          }
        }
      } else {
        console.error('❌ Résultat invalide - pas un objet:', result);
        setError('Réponse serveur invalide');
        
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast('❌ Réponse serveur invalide', 'error');
        }
      }
      
    } catch (error) {
      console.error('💥 Exception dans handleToggleFavorite:', {
        error,
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      const errorMessage = 'Erreur de connexion';
      setError(errorMessage);
      
      if (typeof window !== 'undefined' && window.showToast) {
        try {
          window.showToast(`❌ ${errorMessage}`, 'error');
          console.log('🍞 Toast exception affiché');
        } catch (toastError) {
          console.error('❌ Erreur toast exception:', toastError);
        }
      }
      
    } finally {
      console.log('🏁 Fin du traitement');
      console.groupEnd();
      
      setIsLoading(false);
      
      setTimeout(() => {
        isProcessingRef.current = false;
        console.log(`🔓 [Button-${produitId}] Verrou libéré`);
      }, 50);
    }
  };

  // Nettoyage
  useEffect(() => {
    return () => {
      isProcessingRef.current = false;
    };
  }, []);

  // Loader
  if (!isInitialized) {
    return (
      <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-gray-100 ${className}`}>
        <Heart size={iconSizes[size]} className="text-gray-300 animate-pulse" />
      </div>
    );
  }

  const isDisabled = isLoading || contextLoading;

  return (
    <div className="relative">
      <button
        onClick={handleToggleFavorite}
        disabled={isDisabled}
        className={`
          ${sizes[size]}
          flex items-center justify-center
          rounded-full
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
          ${isCurrentlyFavorite 
            ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg' 
            : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-95'}
          ${className}
        `}
        title={
          isDisabled 
            ? 'Chargement...' 
            : isCurrentlyFavorite 
              ? 'Retirer des favoris' 
              : 'Ajouter aux favoris'
        }
        data-product-id={produitId}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
        ) : (
          <Heart 
            size={iconSizes[size]} 
            fill={isCurrentlyFavorite ? 'currentColor' : 'none'}
            className="transition-all duration-200"
          />
        )}
      </button>

      {showText && (
        <span className={`
          ml-2 text-sm font-medium transition-colors duration-200
          ${isCurrentlyFavorite ? 'text-red-500' : 'text-gray-600'}
          ${isDisabled ? 'opacity-50' : ''}
        `}>
          {isLoading 
            ? 'Sauvegarde...' 
            : isCurrentlyFavorite 
              ? 'Favoris ❤️' 
              : 'Ajouter'
          }
        </span>
      )}

      {/* Indicateur de traitement */}
      {isLoading && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping" />
      )}

      {/* Erreur */}
      {error && (
        <div className="absolute top-full left-0 mt-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded shadow-sm z-10 whitespace-nowrap">
          {error}
        </div>
      )}

      {/* Debug complet en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute -bottom-12 left-0 text-xs bg-white border rounded p-1 shadow-sm z-20 min-w-max">
          <div>ID: {produitId} | État: {isCurrentlyFavorite ? '❤️' : '🤍'}</div>
          <div>Loading: {isLoading ? '⚡' : '✅'} | Processing: {isProcessingRef.current ? '🔒' : '🔓'}</div>
          {lastResult && (
            <div>Last: {lastResult.success ? '✅' : '❌'} {lastResult.message || lastResult.error}</div>
          )}
          {error && <div className="text-red-600">Error: {error}</div>}
        </div>
      )}
    </div>
  );
};

export default FavoriteButton;