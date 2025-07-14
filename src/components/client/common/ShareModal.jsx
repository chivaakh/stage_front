// src/components/client/common/ShareModal.jsx
import React, { useState } from 'react';
import { X, Copy, Facebook, MessageCircle, Mail, Link, Check, Share2 } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!isOpen || !product) return null;

  const productUrl = `${window.location.origin}/produits/${product.id}`;
  const productTitle = product.nom || product.name || 'Produit';
  const productDescription = product.description || `Découvrez ce produit exceptionnel : ${productTitle}`;
  const productImage = product.image_principale || product.image || '/api/placeholder/400/400';
  const productPrice = product.prix_min || product.price || 0;

  const shareText = `🛍️ ${productTitle}\n💰 À partir de ${productPrice.toLocaleString()} MRU\n\n${productDescription}\n\n👀 Voir le produit :`;

  const shareOptions = [
    {
      id: 'copy',
      name: 'Copier le lien',
      icon: copied ? Check : Copy,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      action: async () => {
        try {
          await navigator.clipboard.writeText(productUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          console.error('Erreur copie:', error);
          // Fallback pour les navigateurs qui ne supportent pas clipboard
          const textArea = document.createElement('textarea');
          textArea.value = productUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
        window.open(whatsappUrl, '_blank');
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      action: () => {
        const subject = `Découvrez ce produit : ${productTitle}`;
        const body = `${shareText}\n\n${productUrl}`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
      }
    },
    {
      id: 'native',
      name: 'Partager',
      icon: Share2,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      action: async () => {
        if (navigator.share) {
          try {
            setSharing(true);
            await navigator.share({
              title: productTitle,
              text: shareText,
              url: productUrl,
            });
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Erreur partage natif:', error);
            }
          } finally {
            setSharing(false);
          }
        }
      },
      condition: () => navigator.share // Seulement si le partage natif est supporté
    }
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredShareOptions = shareOptions.filter(option => 
    !option.condition || option.condition()
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Share2 size={24} className="text-purple-600" />
            Partager ce produit
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Aperçu du produit */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-4">
            <img
              src={productImage}
              alt={productTitle}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.src = '/api/placeholder/80/80';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {productTitle}
              </h4>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {productDescription}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-purple-600">
                  {productPrice.toLocaleString()} MRU
                </span>
                {product.prix_max && product.prix_max !== product.prix_min && (
                  <span className="text-sm text-gray-500">
                    - {product.prix_max.toLocaleString()} MRU
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Options de partage */}
        <div className="p-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Choisissez comment partager :
          </h4>
          
          <div className="grid grid-cols-2 gap-3">
            {filteredShareOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={option.action}
                  disabled={sharing && option.id === 'native'}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 transform hover:scale-105 ${option.color} ${option.hoverColor} text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {sharing && option.id === 'native' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <IconComponent size={20} />
                  )}
                  <span className="font-medium text-sm">
                    {option.id === 'copy' && copied ? 'Copié !' : option.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Lien direct */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ou copiez le lien directement :
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={productUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(productUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (error) {
                    console.error('Erreur copie:', error);
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">💡</span>
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-blue-900 mb-1">
                  Conseil de partage
                </h5>
                <p className="text-xs text-blue-700">
                  Partagez ce produit avec vos amis et famille pour leur faire découvrir nos meilleures offres !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;