import React, { useState } from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';

const ProductClientCard = ({ product, onAddToCart, onViewDetails, onToggleWishlist }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onToggleWishlist?.(product.id, !isWishlisted);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Badge de statut */}
      {product.isNew && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Nouveau
        </div>
      )}
      
      {product.isOnSale && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          -{product.discount}%
        </div>
      )}

      {/* Image du produit */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails?.(product)}
              className="bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Voir les détails"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isWishlisted
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
              title={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-4">
        {/* Catégorie */}
        <div className="text-sm text-gray-500 mb-1 font-medium">
          {product.category}
        </div>

        {/* Nom du produit */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating || 0)}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Prix */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Stock indicator */}
          <div className={`text-xs px-2 py-1 rounded-full ${
            product.stock > 10
              ? 'bg-green-100 text-green-800'
              : product.stock > 0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 10 ? 'En stock' : product.stock > 0 ? `${product.stock} restant` : 'Rupture'}
          </div>
        </div>

        {/* Bouton d'action */}
        <button
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
          className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          <ShoppingCart size={18} />
          <span>
            {product.stock === 0 ? 'Non disponible' : 'Ajouter au panier'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductClientCard;