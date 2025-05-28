// src/components/products/ProductDetailsModal.jsx
import { useState } from 'react';
import { Modal, Button } from '../ui';
import { DeleteIcon, EditIcon } from '../icons';
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

const ProductDetailsModal = ({ product, isOpen, onClose, onEdit, onDelete }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      onDelete(product.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(product);
    onClose();
  };

  const currentImage = product.images?.[activeImageIndex];
  const hasImages = product.images && product.images.length > 0;
  const hasSpecs = product.specifications && product.specifications.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="900px">
      <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.gray[300]}`
        }}>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: theme.colors.gray[800],
              margin: `0 0 ${theme.spacing.sm} 0`
            }}>
              {product.nom}
            </h2>
            <div style={{
              display: 'flex',
              gap: theme.spacing.md,
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '14px',
                color: theme.colors.gray[500]
              }}>
                Réf: {product.reference}
              </span>
              <span style={{
                backgroundColor: hasSpecs && product.specifications.some(s => s.quantite_stock > 0) ? '#c6f6d5' : '#fed7d7',
                color: hasSpecs && product.specifications.some(s => s.quantite_stock > 0) ? '#22543d' : '#c53030',
                padding: '4px 12px',
                borderRadius: theme.borderRadius.md,
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {hasSpecs && product.specifications.some(s => s.quantite_stock > 0) ? 'En stock' : 'Rupture'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: theme.spacing.sm }}>
            <Button variant="secondary" size="sm" onClick={handleEdit}>
              <EditIcon size={14} />
              Modifier
            </Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>
              <DeleteIcon size={14} />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: hasImages ? '1fr 1fr' : '1fr',
          gap: theme.spacing.xl
        }}>
          {/* Section Images */}
          {hasImages && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: theme.colors.gray[700],
                marginBottom: theme.spacing.md
              }}>
                Images ({product.images.length})
              </h3>

              {/* Image principale */}
              <div style={{
                width: '100%',
                height: '300px',
                backgroundColor: theme.colors.gray[100],
                borderRadius: theme.borderRadius.md,
                overflow: 'hidden',
                marginBottom: theme.spacing.md,
                position: 'relative'
              }}>
                {currentImage ? (
                  <img
                    src={currentImage.url_image}
                    alt={`${product.nom} - Image ${activeImageIndex + 1}`}
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
                
                <div style={{
                  display: currentImage ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  color: theme.colors.gray[400],
                  fontSize: '48px'
                }}>
                  📷
                </div>

                {/* Badge image principale */}
                {currentImage?.est_principale && (
                  <div style={{
                    position: 'absolute',
                    top: theme.spacing.sm,
                    left: theme.spacing.sm,
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.white,
                    padding: '4px 8px',
                    borderRadius: theme.borderRadius.sm,
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Image principale
                  </div>
                )}
              </div>

              {/* Miniatures */}
              {product.images.length > 1 && (
                <div style={{
                  display: 'flex',
                  gap: theme.spacing.sm,
                  flexWrap: 'wrap'
                }}>
                  {product.images.map((image, index) => (
                    <div
                      key={image.id || index}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: theme.borderRadius.sm,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: index === activeImageIndex ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.gray[300]}`,
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img
                        src={image.url_image}
                        alt={`Miniature ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section Informations */}
          <div>
            {/* Description */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: theme.colors.gray[700],
                marginBottom: theme.spacing.md
              }}>
                Description
              </h3>
              <p style={{
                fontSize: '14px',
                color: theme.colors.gray[600],
                lineHeight: '1.6',
                margin: 0
              }}>
                {product.description}
              </p>
            </div>

            {/* Informations du commerçant */}
            {product.commercant_info && (
              <div style={{
                backgroundColor: theme.colors.gray[50],
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: theme.colors.gray[700],
                  marginBottom: theme.spacing.sm
                }}>
                  Commerçant
                </h4>
                <div style={{ fontSize: '14px', color: theme.colors.gray[600] }}>
                  <div>📍 {product.commercant_info.nom_boutique}</div>
                  <div>🏙️ {product.commercant_info.ville}</div>
                </div>
              </div>
            )}

            {/* Spécifications */}
            {hasSpecs ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: theme.colors.gray[700],
                  marginBottom: theme.spacing.md
                }}>
                  Spécifications ({product.specifications.length})
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
                  {product.specifications.map((spec, index) => (
                    <div
                      key={spec.id || index}
                      style={{
                        border: `1px solid ${theme.colors.gray[300]}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing.md,
                        backgroundColor: spec.est_defaut ? theme.colors.gray[50] : theme.colors.white
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: theme.spacing.sm
                      }}>
                        <div>
                          <h4 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: theme.colors.gray[800],
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: theme.spacing.sm
                          }}>
                            {spec.nom}
                            {spec.est_defaut && (
                              <span style={{
                                backgroundColor: theme.colors.primary,
                                color: theme.colors.white,
                                padding: '2px 6px',
                                borderRadius: theme.borderRadius.sm,
                                fontSize: '10px',
                                fontWeight: '500'
                              }}>
                                DÉFAUT
                              </span>
                            )}
                          </h4>
                          {spec.reference_specification && (
                            <div style={{
                              fontSize: '12px',
                              color: theme.colors.gray[500],
                              marginTop: '2px'
                            }}>
                              Réf: {spec.reference_specification}
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: theme.spacing.sm
                          }}>
                            <span style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: theme.colors.primary
                            }}>
                              {spec.prix_promo || spec.prix} €
                            </span>
                            {spec.prix_promo && (
                              <span style={{
                                fontSize: '14px',
                                color: theme.colors.gray[500],
                                textDecoration: 'line-through'
                              }}>
                                {spec.prix} €
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: spec.quantite_stock > 0 ? theme.colors.success : theme.colors.danger,
                            fontWeight: '500'
                          }}>
                            Stock: {spec.quantite_stock}
                          </div>
                        </div>
                      </div>

                      {spec.description && (
                        <p style={{
                          fontSize: '13px',
                          color: theme.colors.gray[600],
                          margin: 0,
                          lineHeight: '1.4'
                        }}>
                          {spec.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: theme.spacing.xl,
                color: theme.colors.gray[500],
                border: `2px dashed ${theme.colors.gray[300]}`,
                borderRadius: theme.borderRadius.md
              }}>
                <div style={{ fontSize: '24px', marginBottom: theme.spacing.sm }}>📋</div>
                Aucune spécification définie
              </div>
            )}
          </div>
        </div>

        {/* Pied de modal */}
        <div style={{
          marginTop: theme.spacing.xl,
          paddingTop: theme.spacing.lg,
          borderTop: `1px solid ${theme.colors.gray[300]}`,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailsModal;