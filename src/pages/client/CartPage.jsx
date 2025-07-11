// src/pages/client/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { 
  fetchPanier, 
  resumePanier, 
  modifierQuantitePanier, 
  supprimerDuPanier, 
  viderPanier
} from '../../api/clientAPI';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    total_items: 0,
    total_prix: 0,
    nombre_articles: 0
  });
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Charger les données du panier avec gestion d'erreur améliorée
      const [cartResponse, summaryResponse] = await Promise.allSettled([
        fetchPanier(),
        resumePanier()
      ]);

      // Traiter la réponse du panier
      let cartData = [];
      if (cartResponse.status === 'fulfilled' && cartResponse.value?.data) {
        const responseData = cartResponse.value.data;
        if (responseData.results && Array.isArray(responseData.results)) {
          cartData = responseData.results;
        } else if (Array.isArray(responseData)) {
          cartData = responseData;
        }
      } else {
        console.warn('Échec du chargement du panier:', cartResponse.reason);
      }

      // Traiter la réponse du résumé
      let summaryData = { total_items: 0, total_prix: 0, nombre_articles: 0 };
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value?.data) {
        summaryData = summaryResponse.value.data;
      } else {
        console.warn('Échec du chargement du résumé:', summaryResponse.reason);
        // Calculer le résumé à partir des articles si disponibles
        if (cartData.length > 0) {
          summaryData = {
            total_items: cartData.length,
            total_prix: cartData.reduce((sum, item) => sum + (parseFloat(item.prix_total) || 0), 0),
            nombre_articles: cartData.reduce((sum, item) => sum + (item.quantite || 0), 0)
          };
        }
      }

      setCartItems(cartData);
      setCartSummary(summaryData);
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setError('Impossible de charger votre panier. Veuillez réessayer.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await modifierQuantitePanier(itemId, newQuantity);
      await loadCartData();
    } catch (error) {
      console.error('Erreur modification quantité:', error);
      
      // Messages d'erreur plus spécifiques
      let errorMessage = 'Erreur lors de la modification de la quantité';
      if (error.response?.status === 400) {
        errorMessage = 'Quantité invalide ou stock insuffisant';
      } else if (error.response?.status === 404) {
        errorMessage = 'Article non trouvé dans le panier';
      }
      
      alert(errorMessage);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const removeItem = async (itemId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    setUpdatingItems(prev => new Set(prev).add(itemId));
    
    try {
      await supprimerDuPanier(itemId);
      await loadCartData();
    } catch (error) {
      console.error('Erreur suppression article:', error);
      
      let errorMessage = 'Erreur lors de la suppression';
      if (error.response?.status === 404) {
        errorMessage = 'Article déjà supprimé du panier';
      }
      
      alert(errorMessage);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const clearCart = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vider votre panier ?')) return;
    
    try {
      setLoading(true);
      await viderPanier();
      await loadCartData();
    } catch (error) {
      console.error('Erreur vidage panier:', error);
      alert('Erreur lors du vidage du panier');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0' : numPrice.toLocaleString();
  };

  // Composant d'article du panier
  const CartItem = ({ item }) => {
    const isUpdating = updatingItems.has(item.id);
    
    return (
      <div style={{
        display: 'flex',
        gap: '16px',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        opacity: isUpdating ? 0.6 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        {/* Image produit */}
        <div 
          style={{
            width: '120px',
            height: '120px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            backgroundImage: item.produit_image ? `url(${item.produit_image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: '#9ca3af',
            flexShrink: 0,
            cursor: 'pointer'
          }}
          onClick={() => item.produit_id && navigate(`/produits/${item.produit_id}`)}
        >
          {!item.produit_image && '📦'}
        </div>

        {/* Informations produit */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0',
            cursor: 'pointer'
          }}
          onClick={() => item.produit_id && navigate(`/produits/${item.produit_id}`)}
          >
            {item.produit_nom || 'Produit sans nom'}
          </h3>
          
          {item.specification_nom && (
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}>
              Variante: {item.specification_nom}
            </p>
          )}
          
          <p style={{
            fontSize: '14px',
            color: item.stock_disponible > 0 ? '#10b981' : '#ef4444',
            margin: '0 0 16px 0',
            fontWeight: '500'
          }}>
            {item.stock_disponible > 0 ? 
              `Stock disponible: ${item.stock_disponible}` : 
              'Rupture de stock'
            }
          </p>

          {/* Contrôles quantité */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={() => updateQuantity(item.id, item.quantite - 1)}
              disabled={isUpdating || item.quantite <= 1}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: (item.quantite <= 1 || isUpdating) ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (item.quantite <= 1 || isUpdating) ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (item.quantite > 1 && !isUpdating) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (item.quantite > 1 && !isUpdating) {
                  e.target.style.backgroundColor = '#ffffff';
                }
              }}
            >
              −
            </button>
            
            <span style={{
              minWidth: '40px',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937'
            }}>
              {item.quantite}
            </span>
            
            <button
              onClick={() => updateQuantity(item.id, item.quantite + 1)}
              disabled={isUpdating || item.quantite >= item.stock_disponible}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
                color: '#374151',
                cursor: (item.quantite >= item.stock_disponible || isUpdating) ? 'not-allowed' : 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: (item.quantite >= item.stock_disponible || isUpdating) ? 0.5 : 1,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (item.quantite < item.stock_disponible && !isUpdating) {
                  e.target.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                if (item.quantite < item.stock_disponible && !isUpdating) {
                  e.target.style.backgroundColor = '#ffffff';
                }
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Prix et actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          minWidth: '120px'
        }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '4px'
            }}>
              {formatPrice(item.prix_total)} MRU
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              {formatPrice(item.prix_unitaire)} MRU × {item.quantite}
            </div>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            disabled={isUpdating}
            style={{
              padding: '8px 12px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: isUpdating ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isUpdating) {
                e.target.style.backgroundColor = '#fee2e2';
              }
            }}
            onMouseLeave={(e) => {
              if (!isUpdating) {
                e.target.style.backgroundColor = '#fef2f2';
              }
            }}
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    );
  };

  // Composant résumé du panier
  const CartSummary = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      position: 'sticky',
      top: '24px'
    }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#1f2937',
        margin: '0 0 24px 0'
      }}>
        Résumé de la commande
      </h3>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{ color: '#6b7280' }}>
          Articles ({cartSummary.nombre_articles})
        </span>
        <span style={{ fontWeight: '600' }}>
          {formatPrice(cartSummary.total_prix)} MRU
        </span>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{ color: '#6b7280' }}>Livraison</span>
        <span style={{ color: '#10b981' }}>Gratuite</span>
      </div>

      <hr style={{
        border: 'none',
        borderTop: '1px solid #e5e7eb',
        margin: '16px 0'
      }} />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <span style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937'
        }}>
          Total
        </span>
        <span style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#3b82f6'
        }}>
          {formatPrice(cartSummary.total_prix)} MRU
        </span>
      </div>

      <button
        onClick={() => navigate('/checkout')}
        disabled={cartItems.length === 0}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: cartItems.length === 0 ? '#d1d5db' : '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
          marginBottom: '12px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          if (cartItems.length > 0) {
            e.target.style.backgroundColor = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (cartItems.length > 0) {
            e.target.style.backgroundColor = '#3b82f6';
          }
        }}
      >
        {cartItems.length === 0 ? 'Panier vide' : '🛒 Commander'}
      </button>

      <button
        onClick={() => navigate('/produits')}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'transparent',
          color: '#3b82f6',
          border: '1px solid #3b82f6',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f0f4ff';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        ← Continuer vos achats
      </button>
    </div>
  );

  return (
    <ClientLayout currentPage="cart">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              🛒 Mon Panier
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }}>
              {loading ? 'Chargement...' : 
               error ? 'Erreur de chargement' :
               `${cartSummary.nombre_articles} article${cartSummary.nombre_articles > 1 ? 's' : ''} dans votre panier`}
            </p>
          </div>

          {cartItems.length > 0 && !loading && (
            <button
              onClick={clearCart}
              style={{
                padding: '12px 16px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fee2e2';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fef2f2';
              }}
            >
              🗑️ Vider le panier
            </button>
          )}
        </div>

        {/* Affichage d'erreur */}
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ color: '#dc2626', fontWeight: '500' }}>{error}</span>
            </div>
            <button
              onClick={() => {
                setError(null);
                loadCartData();
              }}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {loading ? (
          // État de chargement
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  height: '168px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '12px',
                  backgroundImage: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite'
                }} />
              ))}
            </div>
            <div style={{
              height: '300px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              backgroundImage: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite'
            }} />
          </div>
        ) : cartItems.length === 0 && !error ? (
          // Panier vide
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px dashed #e5e7eb'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>
              🛒
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Votre panier est vide
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '0 0 32px 0'
            }}>
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <button
              onClick={() => navigate('/produits')}
              style={{
                padding: '16px 32px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              🛍️ Parcourir le catalogue
            </button>
          </div>
        ) : (
          // Panier avec articles
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Liste des articles */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Résumé */}
            <CartSummary />
          </div>
        )}
      </div>

      {/* Styles CSS pour l'animation de chargement */}
      <style jsx>{`
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </ClientLayout>
  );
};

export default CartPage;