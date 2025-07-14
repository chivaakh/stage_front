// src/components/client/common/FavoritesDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, X } from 'lucide-react';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';
import { ajouterProduitAuPanier, formatApiError } from '../../../api/clientAPI';

const FavoritesDropdown = ({ isOpen, onClose, triggerRef }) => {
  const { favoris, removeFromFavorites, loading } = useFavoritesContext();
  const [actionLoading, setActionLoading] = useState({});
  const dropdownRef = useRef(null);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  const handleAddToCart = async (produitId, produitNom) => {
    try {
      setActionLoading(prev => ({ ...prev, [produitId]: 'adding' }));
      
      await ajouterProduitAuPanier(produitId, 1);
      
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(`"${produitNom}" ajouté au panier`, 'success');
      }
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(formatApiError(error), 'error');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [produitId]: null }));
    }
  };

  const handleRemoveFavorite = async (produitId, produitNom) => {
    try {
      setActionLoading(prev => ({ ...prev, [`remove_${produitId}`]: 'removing' }));
      
      const result = await removeFromFavorites(produitId);
      
      if (result.success) {
        if (typeof window !== 'undefined' && window.showToast) {
          window.showToast(`"${produitNom}" retiré des favoris`, 'success');
        }
      }
    } catch (error) {
      console.error('Erreur suppression favori:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [`remove_${produitId}`]: null }));
    }
  };

  if (!isOpen) return null;

  const maxDisplayItems = 5;
  const displayItems = favoris.slice(0, maxDisplayItems);
  const hasMore = favoris.length > maxDisplayItems;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Heart className="h-5 w-5 text-red-500 mr-2" />
          Mes Favoris ({favoris.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Chargement...</p>
          </div>
        ) : favoris.length === 0 ? (
          <div className="p-6 text-center">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun favori pour le moment</p>
            <a
              href="/produits"
              className="text-red-500 hover:text-red-600 text-sm font-medium mt-2 inline-block"
              onClick={onClose}
            >
              Découvrir nos produits
            </a>
          </div>
        ) : (
          <div className="py-2">
            {displayItems.map((favori) => (
              <div
                key={favori.id}
                className="flex items-center p-3 hover:bg-gray-50 transition-colors"
              >
                {/* Image */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {favori.produit_image ? (
                    <img
                      src={favori.produit_image}
                      alt={favori.produit_nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Pas d'image</span>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0 mx-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {favori.produit_nom}
                  </h4>
                  {favori.prix_min && (
                    <p className="text-sm text-gray-600">
                      {favori.prix_min === favori.prix_max
                        ? `${favori.prix_min.toLocaleString()} MRU`
                        : `${favori.prix_min.toLocaleString()} - ${favori.prix_max.toLocaleString()} MRU`
                      }
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={() => handleAddToCart(favori.produit, favori.produit_nom)}
                    disabled={actionLoading[favori.produit] === 'adding'}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Ajouter au panier"
                  >
                    {actionLoading[favori.produit] === 'adding' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border border-red-500 border-t-transparent"></div>
                    ) : (
                      <ShoppingCart className="h-4 w-4" />
                    )}
                  </button>

                  <a
                    href={`/produits/${favori.produit}`}
                    className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Voir le détail"
                    onClick={onClose}
                  >
                    <Eye className="h-4 w-4" />
                  </a>

                  <button
                    onClick={() => handleRemoveFavorite(favori.produit, favori.produit_nom)}
                    disabled={actionLoading[`remove_${favori.produit}`] === 'removing'}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Retirer des favoris"
                  >
                    {actionLoading[`remove_${favori.produit}`] === 'removing' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border border-red-500 border-t-transparent"></div>
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {favoris.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <a
            href="/favoris"
            className="block w-full text-center text-red-500 hover:text-red-600 font-medium text-sm py-2 transition-colors"
            onClick={onClose}
          >
            {hasMore ? `Voir tous les favoris (${favoris.length})` : 'Gérer mes favoris'}
          </a>
        </div>
      )}
    </div>
  );
};

export default FavoritesDropdown;