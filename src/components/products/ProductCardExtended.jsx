// src/components/products/ProductCardExtended.jsx
import { useState } from 'react';
import { Button } from '../ui';
import { EditIcon, DeleteIcon } from '../icons';
import { theme } from '../../styles/theme';

const ProductCardExtended = ({ product, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(0);

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      onDelete(product.id);
    }
  };

  // Récupérer l'image principale ou la première image
  const getMainImage = () => {
    if (product.images?.length > 0) {
      const mainImage = product.images.find(img => img.est_principale);
      return mainImage?.url_image || product.images[0]?.url_image;
    }
    return null;
  };

  // Récupérer la spécification sélectionnée ou par défaut
  const getCurrentSpec = () => {
    if (product.specifications?.length > 0) {
      if (selectedSpec < product.specifications.length) {
        return product.specifications[selectedSpec];
      }
      const defaultSpec = product.specifications.find(spec => spec.est_defaut);
      return defaultSpec || product.specifications[0];
    }
    return null;
  };

  const mainImage = getMainImage();
  const currentSpec = getCurrentSpec();
  const hasMultipleSpecs = product.specifications?.length > 1;

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
            onError={(e) => {
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
          fontSize: '48px'
        }}>
          📦
        </div>

        {/* Badge du nombre d'images */}
        {product.images?.length > 1 && (
          <div style={{
            position: 'absolute',
            top: theme.spacing.sm,
            right: theme.spacing.sm,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: theme.colors.white,
            padding: '4px 8px',
            borderRadius: theme.borderRadius.sm,
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {product.images.length} photos
          </div>
        )}
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
            backgroundColor: currentSpec?.quantite_stock > 0 ? '#c6f6d5' : '#fed7d7',
            color: currentSpec?.quantite_stock > 0 ? '#22543d' : '#c53030',
            padding: '4px 8px',
            borderRadius: theme.borderRadius.sm,
            fontSize: '12px',
            fontWeight: '500',
            marginLeft: theme.spacing.sm
          }}>
            {currentSpec?.quantite_stock > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>

        {/* Prix */}
        <div style={{ marginBottom: theme.spacing.sm }}>
          {currentSpec ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: theme.spacing.sm }}>
              <span style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.colors.primary
              }}>
                {currentSpec.prix_promo ? currentSpec.prix_promo : currentSpec.prix} €
              </span>
              {currentSpec.prix_promo && (
                <span style={{
                  fontSize: '16px',
                  color: theme.colors.gray[500],
                  textDecoration: 'line-through'
                }}>
                  {currentSpec.prix} €
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

        {/* Sélecteur de spécifications */}
        {hasMultipleSpecs && (
          <div style={{ marginBottom: theme.spacing.md }}>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: theme.spacing.sm,
                border: `1px solid ${theme.colors.gray[300]}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: '14px',
                backgroundColor: theme.colors.white
              }}
            >
              {product.specifications.map((spec, index) => (
                <option key={spec.id || index} value={index}>
                  {spec.nom} - {spec.prix_promo || spec.prix}€
                  {spec.quantite_stock === 0 ? ' (Rupture)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}

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
          {currentSpec && (
            <span>Stock: {currentSpec.quantite_stock}</span>
          )}
        </div>

        {/* Informations du commerçant */}
        {product.commercant_info && (
          <div style={{
            fontSize: '12px',
            color: theme.colors.gray[500],
            marginBottom: theme.spacing.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.gray[50],
            borderRadius: theme.borderRadius.sm
          }}>
            📍 {product.commercant_info.nom_boutique} - {product.commercant_info.ville}
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          justifyContent: 'flex-end'
        }}>
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

export default ProductCardExtended;