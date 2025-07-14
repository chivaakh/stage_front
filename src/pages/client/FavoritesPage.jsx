// src/pages/client/FavoritesPage.jsx
import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Eye, AlertCircle } from 'lucide-react';
import { ajouterProduitAuPanier, formatApiError } from '../../api/clientAPI';
import { useFavoritesContext } from '../../contexts/FavoritesContext';
import FavoriteButton from '../../components/client/common/FavoriteButton';
import ClientLayout from '../../components/client/layout/ClientLayout';

const FavoritesPage = () => {
  const [actionLoading, setActionLoading] = useState({});
  
  // Utiliser le contexte des favoris
  const { 
    favoris, 
    loading, 
    error, 
    removeFromFavorites,
    refreshFavorites
  } = useFavoritesContext();

  // Composant d'icônes SVG
  const Icons = {
    Heart: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    HeartBig: () => (
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    ShoppingCart: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    ),
    Eye: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    Trash: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      </svg>
    ),
    AlertCircle: () => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    Loader: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
    ),
    ShoppingBag: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    )
  };

  // Styles modernes
  const styles = {
    container: {
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: '40px 24px'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
      borderRadius: '16px',
      padding: '32px 24px',
      marginBottom: '32px',
      color: '#ffffff',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    heroIcon: {
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px auto',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    heroTitle: {
      fontSize: '28px',
      fontWeight: '700',
      margin: '0 0 12px 0',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    heroSubtitle: {
      fontSize: '16px',
      opacity: 0.95,
      margin: 0,
      fontWeight: '400'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 0',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0'
    },
    loadingSpinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #f3e8ff',
      borderTop: '4px solid #a855f7',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    loadingText: {
      marginLeft: '16px',
      fontSize: '18px',
      color: '#64748b',
      fontWeight: '500'
    },
    errorContainer: {
      backgroundColor: '#ffffff',
      border: '1px solid #fecaca',
      borderRadius: '20px',
      padding: '48px 40px',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)'
    },
    errorIcon: {
      color: '#ef4444',
      marginBottom: '24px'
    },
    errorTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#dc2626',
      margin: '0 0 12px 0'
    },
    errorText: {
      fontSize: '16px',
      color: '#991b1b',
      margin: '0 0 32px 0',
      lineHeight: '1.6'
    },
    errorButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 40px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0'
    },
    emptyIcon: {
      color: '#d1d5db',
      marginBottom: '24px'
    },
    emptyTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 16px 0'
    },
    emptyDescription: {
      fontSize: '18px',
      color: '#64748b',
      margin: '0 auto 40px auto',
      maxWidth: '500px',
      lineHeight: '1.6'
    },
    emptyButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '20px 40px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '16px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '32px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      position: 'relative'
    },
    imageContainer: {
      position: 'relative',
      aspectRatio: '1',
      backgroundColor: '#f8fafc',
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      fontSize: '16px',
      fontWeight: '500'
    },
    favoriteButton: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      zIndex: 1
    },
    content: {
      padding: '24px'
    },
    productName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0',
      lineHeight: '1.4',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    productRef: {
      fontSize: '13px',
      color: '#64748b',
      margin: '0 0 12px 0',
      fontWeight: '500'
    },
    productDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 20px 0',
      lineHeight: '1.5',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    priceContainer: {
      marginBottom: '20px'
    },
    price: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#a855f7',
      margin: 0
    },
    priceUnavailable: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#94a3b8',
      margin: 0
    },
    actions: {
      display: 'flex',
      gap: '12px',
      marginBottom: '16px'
    },
    cartButton: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 20px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.25)'
    },
    cartButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none'
    },
    viewButton: {
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #e2e8f0'
    },
    deleteButton: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca'
    },
    deleteButtonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    dateText: {
      fontSize: '12px',
      color: '#94a3b8',
      margin: 0,
      fontWeight: '500'
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Animation CSS
  const animations = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  const handleRemoveFavorite = async (produitId, produitNom) => {
    if (!confirm(`Retirer "${produitNom}" de vos favoris ?`)) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [produitId]: 'removing' }));
      
      const result = await removeFromFavorites(produitId);
      
      if (result.success && window.showToast) {
        window.showToast('Produit retiré des favoris', 'success');
      } else if (!result.success && window.showToast) {
        window.showToast(result.error || 'Erreur lors de la suppression', 'error');
      }
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      if (window.showToast) {
        window.showToast('Erreur lors de la suppression', 'error');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [produitId]: null }));
    }
  };

  const handleAddToCart = async (produitId, produitNom) => {
    try {
      setActionLoading(prev => ({ ...prev, [`cart_${produitId}`]: 'adding' }));
      
      await ajouterProduitAuPanier(produitId, 1);
      
      if (window.showToast) {
        window.showToast(`"${produitNom}" ajouté au panier`, 'success');
      }
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      if (window.showToast) {
        window.showToast(formatApiError(error), 'error');
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [`cart_${produitId}`]: null }));
    }
  };

  const handleFavoriteToggle = (produitId, isFavorite) => {
    console.log(`Produit ${produitId} ${isFavorite ? 'ajouté' : 'retiré'} des favoris`);
  };

  if (loading) {
    return (
      <ClientLayout currentPage="favorites">
        <div style={styles.container}>
          <style>{animations}</style>
          <div style={styles.maxWidth}>
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <span style={styles.loadingText}>Chargement de vos favoris...</span>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error) {
    return (
      <ClientLayout currentPage="favorites">
        <div style={styles.container}>
          <div style={styles.maxWidth}>
            <div style={styles.errorContainer}>
              <div style={styles.errorIcon}>
                <Icons.AlertCircle />
              </div>
              <h3 style={styles.errorTitle}>Erreur de chargement</h3>
              <p style={styles.errorText}>{error}</p>
              <button
                onClick={refreshFavorites}
                style={styles.errorButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout currentPage="favorites">
      <div style={styles.container}>
        <style>{animations}</style>
        <div style={styles.maxWidth}>
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <div style={styles.heroIcon}>
              <Icons.Heart />
            </div>
            <h1 style={styles.heroTitle}>Mes Favoris</h1>
            <p style={styles.heroSubtitle}>
              {favoris.length > 0 
                ? `${favoris.length} produit${favoris.length > 1 ? 's' : ''} dans vos favoris`
                : 'Aucun produit dans vos favoris'
              }
            </p>
          </div>

          {favoris.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <Icons.HeartBig />
              </div>
              <h3 style={styles.emptyTitle}>
                Aucun favori pour le moment
              </h3>
              <p style={styles.emptyDescription}>
                Explorez nos produits et ajoutez vos préférés à vos favoris en cliquant sur le cœur.
              </p>
              <a
                href="/produits"
                style={styles.emptyButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
                }}
              >
                <Icons.ShoppingBag />
                Découvrir nos produits
              </a>
            </div>
          ) : (
            <div style={styles.grid}>
              {favoris.map((favori) => (
                <div
                  key={favori.id}
                  style={styles.card}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                  }}
                >
                  {/* Image */}
                  <div style={styles.imageContainer}>
                    {favori.produit_image ? (
                      <img
                        src={favori.produit_image}
                        alt={favori.produit_nom}
                        style={styles.image}
                      />
                    ) : (
                      <div style={styles.imagePlaceholder}>
                        Pas d'image
                      </div>
                    )}
                    
                    {/* Bouton favori */}
                    <div style={styles.favoriteButton}>
                      <FavoriteButton
                        produitId={favori.produit}
                        initialIsFavorite={true}
                        size="md"
                        onToggle={handleFavoriteToggle}
                      />
                    </div>
                  </div>

                  {/* Contenu */}
                  <div style={styles.content}>
                    <h3 style={styles.productName}>
                      {favori.produit_nom}
                    </h3>
                    
                    {favori.produit_reference && (
                      <p style={styles.productRef}>
                        Réf: {favori.produit_reference}
                      </p>
                    )}

                    {favori.produit_description && (
                      <p style={styles.productDescription}>
                        {favori.produit_description}
                      </p>
                    )}

                    {/* Prix */}
                    <div style={styles.priceContainer}>
                      {favori.prix_min && favori.prix_max ? (
                        <div style={styles.price}>
                          {favori.prix_min === favori.prix_max ? (
                            `${favori.prix_min.toLocaleString()} MRU`
                          ) : (
                            `${favori.prix_min.toLocaleString()} - ${favori.prix_max.toLocaleString()} MRU`
                          )}
                        </div>
                      ) : (
                        <div style={styles.priceUnavailable}>
                          Prix non disponible
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={styles.actions}>
                      <button
                        onClick={() => handleAddToCart(favori.produit, favori.produit_nom)}
                        disabled={actionLoading[`cart_${favori.produit}`] === 'adding'}
                        style={{
                          ...styles.cartButton,
                          ...(actionLoading[`cart_${favori.produit}`] === 'adding' ? styles.cartButtonDisabled : {})
                        }}
                        onMouseEnter={(e) => {
                          if (!actionLoading[`cart_${favori.produit}`]) {
                            e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                            e.target.style.transform = 'scale(1.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!actionLoading[`cart_${favori.produit}`]) {
                            e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {actionLoading[`cart_${favori.produit}`] === 'adding' ? (
                          <div style={styles.spinner}></div>
                        ) : (
                          <>
                            <Icons.ShoppingCart />
                            Panier
                          </>
                        )}
                      </button>

                      <a
                        href={`/produits/${favori.produit}`}
                        style={{...styles.actionButton, ...styles.viewButton}}
                        title="Voir le détail"
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e2e8f0';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f1f5f9';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <Icons.Eye />
                      </a>

                      <button
                        onClick={() => handleRemoveFavorite(favori.produit, favori.produit_nom)}
                        disabled={actionLoading[favori.produit] === 'removing'}
                        style={{
                          ...styles.actionButton,
                          ...styles.deleteButton,
                          ...(actionLoading[favori.produit] === 'removing' ? styles.deleteButtonDisabled : {})
                        }}
                        title="Retirer des favoris"
                        onMouseEnter={(e) => {
                          if (!actionLoading[favori.produit]) {
                            e.target.style.backgroundColor = '#fee2e2';
                            e.target.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!actionLoading[favori.produit]) {
                            e.target.style.backgroundColor = '#fef2f2';
                            e.target.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        {actionLoading[favori.produit] === 'removing' ? (
                          <div style={styles.spinner}></div>
                        ) : (
                          <Icons.Trash />
                        )}
                      </button>
                    </div>

                    {/* Date d'ajout */}
                    <p style={styles.dateText}>
                      Ajouté le {new Date(favori.date_ajout).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default FavoritesPage;