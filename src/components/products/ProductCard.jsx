// src/components/products/ProductCard.jsx - VERSION CORRIGÉE avec MRU
import { useState } from 'react';
import { Button } from '../ui';
import { EditIcon, DeleteIcon } from '../icons';
import { theme } from '../../styles/theme';

// Icône Eye pour voir les détails
export const EyeIcon = ({ size = 16, ...props }) => (
  <svg 
    style={{ width: `${size}px`, height: `${size}px` }} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
    />
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
    />
  </svg>
);

const ProductCard = ({ product, onEdit, onDelete, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      onDelete(product.id);
    }
  };

  // ✅ CORRECTION : Récupérer l'image principale ou la première image
  const getMainImage = () => {
    console.log('🖼️ Images du produit:', product.images); // Debug
    
    if (product.images && product.images.length > 0) {
      const mainImage = product.images.find(img => img.est_principale);
      const imageUrl = mainImage?.url_image || product.images[0]?.url_image;
      console.log('🎯 Image sélectionnée:', imageUrl); // Debug
      return imageUrl;
    }
    
    // Fallback : essayer image_principale du backend
    if (product.image_principale) {
      console.log('🎯 Image principale backend:', product.image_principale); // Debug
      return product.image_principale;
    }
    
    console.log('❌ Aucune image trouvée'); // Debug
    return null;
  };

  // Récupérer la première spécification ou par défaut
  const getDefaultSpec = () => {
    if (product.specifications && product.specifications.length > 0) {
      const defaultSpec = product.specifications.find(spec => spec.est_defaut);
      return defaultSpec || product.specifications[0];
    }
    return null;
  };

  const mainImage = getMainImage();
  const defaultSpec = getDefaultSpec();

  // ✅ FONCTION pour formater le prix en MRU
  const formatPrice = (price) => {
    if (!price) return 'Prix non défini';
    
    // Convertir en nombre si c'est une string
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Formater avec séparateurs de milliers
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(numPrice) + ' MRU';
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.gray[300]}`,
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? theme.shadows.lg : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image du produit */}
      <div style={{
        height: '200px',
        backgroundColor: theme.colors.gray[100],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.nom}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onLoad={() => {
              console.log('✅ Image chargée avec succès:', mainImage);
            }}
            onError={(e) => {
              console.error('❌ Erreur chargement image:', mainImage);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback si pas d'image ou erreur de chargement */}
        <div style={{
          display: mainImage ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: theme.colors.gray[400],
          fontSize: '48px',
          flexDirection: 'column'
        }}>
          <div>📦</div>
          <div style={{ fontSize: '12px', marginTop: theme.spacing.sm }}>
            Aucune image
          </div>
        </div>

        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: theme.spacing.sm,
          right: theme.spacing.sm,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing.xs
        }}>
          {/* Badge nombre d'images */}
          {product.images && product.images.length > 1 && (
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: theme.colors.white,
              padding: '4px 8px',
              borderRadius: theme.borderRadius.sm,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              📷 {product.images.length}
            </div>
          )}
          
          {/* Badge nombre de spécifications */}
          {product.specifications && product.specifications.length > 1 && (
            <div style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: theme.colors.white,
              padding: '4px 8px',
              borderRadius: theme.borderRadius.sm,
              fontSize: '12px',
              fontWeight: '500'
            }}>
              📋 {product.specifications.length}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: theme.spacing.lg }}>
        {/* En-tête avec nom et statut stock */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.md
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: theme.colors.gray[800],
            margin: 0,
            flex: 1
          }}>
            {product.nom}
          </h3>
          <span style={{
            backgroundColor: defaultSpec?.quantite_stock > 0 ? '#c6f6d5' : '#fed7d7',
            color: defaultSpec?.quantite_stock > 0 ? '#22543d' : '#c53030',
            padding: '4px 8px',
            borderRadius: theme.borderRadius.sm,
            fontSize: '12px',
            fontWeight: '500',
            marginLeft: theme.spacing.sm
          }}>
            {defaultSpec?.quantite_stock > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>

        {/* ✅ PRIX EN MRU */}
        <div style={{ marginBottom: theme.spacing.sm }}>
          {defaultSpec ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing.sm }}>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.colors.primary
              }}>
                {formatPrice(defaultSpec.prix_promo || defaultSpec.prix)}
              </span>
              {defaultSpec.prix_promo && (
                <span style={{
                  fontSize: '16px',
                  color: theme.colors.gray[500],
                  textDecoration: 'line-through'
                }}>
                  {formatPrice(defaultSpec.prix)}
                </span>
              )}
            </div>
          ) : (
            <div style={{
              fontSize: '16px',
              color: theme.colors.gray[500],
              fontStyle: 'italic'
            }}>
              Prix non défini
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{
          fontSize: '14px',
          color: theme.colors.gray[500],
          margin: `0 0 ${theme.spacing.md} 0`,
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>

        {/* Informations supplémentaires */}
        <div style={{
          fontSize: '12px',
          color: theme.colors.gray[400],
          marginBottom: theme.spacing.md,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Réf: {product.reference}</span>
          {defaultSpec && (
            <span>Stock: {defaultSpec.quantite_stock}</span>
          )}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          justifyContent: 'flex-end'
        }}>
          {/* Bouton Voir détails */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(product)}
            style={{
              color: theme.colors.primary,
              borderColor: theme.colors.primary
            }}
          >
            <EyeIcon size={14} />
            Détails
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(product)}
          >
            <EditIcon size={14} />
            Modifier
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
          >
            <DeleteIcon size={14} />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;