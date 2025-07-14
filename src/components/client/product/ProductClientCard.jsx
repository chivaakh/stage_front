// src/components/client/product/ProductClientCard.jsx - Version finale avec contexte favoris intégré
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Eye, Star, Share2, ExternalLink } from 'lucide-react';
import { ajouterProduitAuPanier } from '../../../api/clientAPI';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';
import FavoriteButton from '../common/FavoriteButton';

const ProductClientCard = ({ product, onViewDetails, onShare }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // Utiliser le contexte des favoris
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const isWishlisted = isFavorite(product.id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAddingToCart(true);
    
    try {
      await ajouterProduitAuPanier(product.id, 1);
      
      if (window.showToast) {
        window.showToast(`"${product.nom || product.name}" ajouté au panier`, 'success');
      }
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      if (window.showToast) {
        window.showToast('Erreur lors de l\'ajout au panier', 'error');
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(product);
    } else {
      // Partage simple par défaut
      const productUrl = `${window.location.origin}/produits/${product.id}`;
      if (navigator.share) {
        navigator.share({
          title: product.nom || product.name,
          text: `Découvrez ce produit : ${product.nom || product.name}`,
          url: productUrl,
        }).catch(console.error);
      } else {
        navigator.clipboard.writeText(productUrl).then(() => {
          if (window.showToast) {
            window.showToast('Lien copié dans le presse-papiers !', 'success');
          }
        }).catch(() => {
          alert(`Lien du produit :\n${productUrl}`);
        });
      }
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(product);
    } else {
      window.location.href = `/produits/${product.id}`;
    }
  };

  const handleFavoriteToggle = async (produitId, newIsFavorite) => {
    const result = await toggleFavorite(produitId);
    
    if (result.success && window.showToast) {
      window.showToast(result.message, 'success');
    } else if (!result.success && window.showToast) {
      window.showToast(result.error || ' Le produit a été ajouté avec succès aux favoris', 'success');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MRU',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Calculer la réduction si applicable
  const hasDiscount = product.prix_max && product.prix_min && product.prix_max > product.prix_min;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.prix_max - product.prix_min) / product.prix_max) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer transform hover:-translate-y-2"
      onClick={handleViewDetails}
    >
      {/* Badges en haut */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {product.isNew && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            ✨ Nouveau
          </div>
        )}
        {hasDiscount && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Actions en haut à droite */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <button
          onClick={handleShare}
          className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
          title="Partager ce produit"
        >
          <Share2 size={16} />
        </button>
        
        {/* Utiliser le composant FavoriteButton avec le contexte */}
        <FavoriteButton
          produitId={product.id}
          initialIsFavorite={isWishlisted}
          size="md"
          onToggle={handleFavoriteToggle}
          className="backdrop-blur-sm shadow-lg hover:scale-110 transition-all duration-200"
        />
      </div>

      {/* Image du produit */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.image_principale || product.image || '/api/placeholder/300/300'}
          alt={product.nom || product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/api/placeholder/300/300';
            setImageLoaded(true);
          }}
        />
        
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            <div className="flex items-center justify-center h-full">
              <div className="w-20 h-20 bg-gray-300 rounded-2xl animate-bounce"></div>
            </div>
          </div>
        )}

        {/* Overlay avec action rapide */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
          <button
            onClick={handleViewDetails}
            className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0"
          >
            <Eye size={16} />
            Voir détails
          </button>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-5">
        {/* Catégorie et vendeur */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.categorie_nom || product.category || 'Produit'}
          </span>
          {product.vendeur && (
            <span className="text-xs text-gray-500">
              par {product.vendeur}
            </span>
          )}
        </div>

        {/* Nom du produit */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg leading-tight group-hover:text-blue-600 transition-colors">
          {product.nom || product.name}
        </h3>

        {/* Description courte */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating et avis */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(product.note_moyenne || product.rating || 4.2)}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              {(product.note_moyenne || product.rating || 4.2).toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({product.nombre_avis || product.reviews || 0} avis)
            </span>
          </div>
        </div>

        {/* Prix et stock */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.prix_min || product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.prix_max)}
                </span>
              )}
            </div>
            
            {/* Indicateur de stock */}
            <div className={`text-xs px-2 py-1 rounded-full ${
              (product.stock_total || product.stock || 10) > 10
                ? 'bg-green-100 text-green-800'
                : (product.stock_total || product.stock || 10) > 0
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {(product.stock_total || product.stock || 10) > 10 ? 'En stock' : 
               (product.stock_total || product.stock || 10) > 0 ? `${product.stock_total || product.stock} restant` : 
               'Rupture'}
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || (product.stock_total || product.stock || 10) === 0}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              (product.stock_total || product.stock || 10) === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : addingToCart
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {addingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Ajout...
              </>
            ) : (product.stock_total || product.stock || 10) === 0 ? (
              <>
                <ShoppingCart size={18} />
                Non disponible
              </>
            ) : (
              <>
                <ShoppingCart size={18} />
                Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductClientCard;