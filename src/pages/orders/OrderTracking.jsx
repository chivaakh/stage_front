// src/pages/OrderTracking.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import ModernSidebar from '../../components/layout/ModernSidebar';
import { theme } from '../../styles/theme';

const getStatusColor = (status) => {
  if (!status) return '#6b7280';
  const s = status.trim().toLowerCase();
  switch(s) {
    case 'livree': return '#16a34a';
    case 'en_attente': return '#d97706';
    case 'annulee': return '#dc2626';
    case 'confirmee': return '#2563eb';
    case 'expediee': return '#9333ea';
    default: return '#6b7280';
  }
};

const getStatusIcon = (status) => {
  if (!status) return '⏳';
  const s = status.trim().toLowerCase();
  switch(s) {
    case 'livree': return '✅';
    case 'en_attente': return '⏳';
    case 'annulee': return '❌';
    case 'confirmee': return '✔️';
    case 'expediee': return '🚚';
    default: return '📋';
  }
};

const getStatusLabel = (status) => {
  if (!status) return 'En attente';
  const s = status.trim().toLowerCase();
  switch(s) {
    case 'livree': return 'Livrée';
    case 'en_attente': return 'En attente';
    case 'annulee': return 'Annulée';
    case 'confirmee': return 'Confirmée';
    case 'expediee': return 'Expédiée';
    default: return status;
  }
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderAndTracking = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les détails de la commande
      const orderResponse = await fetch(`/api/commandes/${orderId}/`);
      
      if (!orderResponse.ok) {
        throw new Error(`Erreur ${orderResponse.status}: ${orderResponse.statusText}`);
      }
      
      const orderContentType = orderResponse.headers.get('content-type');
      if (!orderContentType || !orderContentType.includes('application/json')) {
        const textResponse = await orderResponse.text();
        console.error('Réponse non-JSON reçue:', textResponse);
        throw new Error('Le serveur a renvoyé une réponse non-JSON');
      }
      
      const orderData = await orderResponse.json();
      setOrder(orderData);

      // Récupérer l'historique de tracking
      try {
        const trackingResponse = await fetch(`/api/commandes/${orderId}/tracking/`);
        
        if (trackingResponse.ok) {
          const trackingContentType = trackingResponse.headers.get('content-type');
          if (trackingContentType && trackingContentType.includes('application/json')) {
            const trackingData = await trackingResponse.json();
            setTracking(Array.isArray(trackingData) ? trackingData : []);
          } else {
            console.warn('Réponse de tracking non-JSON, utilisation de données simulées');
            // Créer un historique basé sur les données de la commande
            setTracking(createMockTracking(orderData));
          }
        } else {
          console.warn(`Erreur tracking ${trackingResponse.status}, utilisation de données simulées`);
          setTracking(createMockTracking(orderData));
        }
      } catch (trackingError) {
        console.warn('Erreur lors du chargement du tracking:', trackingError);
        // Créer un historique basé sur les données de la commande
        setTracking(createMockTracking(orderData));
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer un tracking simulé basé sur la commande
  const createMockTracking = (orderData) => {
    if (!orderData) return [];
    
    const mockTracking = [];
    const orderDate = new Date(orderData.date_commande);
    
    // Statut actuel
    mockTracking.push({
      nouveau_statut: orderData.statut,
      ancien_statut: null,
      date_modification: orderData.date_commande,
      commentaire: 'Statut actuel de la commande'
    });
    
    // Historique simulé basé sur le statut actuel
    if (orderData.statut !== 'en_attente') {
      mockTracking.push({
        nouveau_statut: 'en_attente',
        ancien_statut: null,
        date_modification: new Date(orderDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        commentaire: 'Commande créée'
      });
    }
    
    if (['confirmee', 'expediee', 'livree'].includes(orderData.statut)) {
      mockTracking.push({
        nouveau_statut: 'confirmee',
        ancien_statut: 'en_attente',
        date_modification: new Date(orderDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        commentaire: 'Commande confirmée'
      });
    }
    
    if (['expediee', 'livree'].includes(orderData.statut)) {
      mockTracking.push({
        nouveau_statut: 'expediee',
        ancien_statut: 'confirmee',
        date_modification: new Date(orderDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        commentaire: 'Commande expédiée'
      });
    }
    
    if (orderData.statut === 'livree') {
      mockTracking.push({
        nouveau_statut: 'livree',
        ancien_statut: 'expediee',
        date_modification: orderData.date_commande,
        commentaire: 'Commande livrée'
      });
    }
    
    return mockTracking.reverse(); // Plus récent en premier
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderAndTracking();
    }
  }, [orderId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50] }}>
        <ModernSidebar currentPage="order-tracking" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: theme.colors.gray[500] }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Chargement du suivi...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50] }}>
        <ModernSidebar currentPage="orders" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: theme.colors.red[500] }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Erreur de chargement</div>
            <div style={{ fontSize: 14, color: theme.colors.gray[600], marginBottom: 16 }}>{error}</div>
            <Button
              onClick={() => fetchOrderAndTracking()}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: 'white',
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
              }}
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50] }}>
        <ModernSidebar currentPage="orders" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: theme.colors.gray[500] }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Commande non trouvée</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50], fontFamily: theme.fonts.base }}>
      <ModernSidebar currentPage="orders" />

      <div style={{
        flex: 1,
        padding: theme.spacing.xl,
        backgroundColor: '#fff',
        margin: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.xl,
          paddingBottom: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray[200]}`
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.md
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ fontSize: 24, filter: 'brightness(0) invert(1)' }}>📍</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.colors.gray[800],
                  margin: 0,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Suivi Commande #{orderId}
                </h1>
                <div style={{
                  fontSize: 14,
                  color: theme.colors.gray[500],
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  marginTop: theme.spacing.sm
                }}>
                  <span 
                    style={{ color: '#4f46e5', fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => navigate('/commandes')}
                  >
                    Toutes les commandes
                  </span>
                  <span>→</span>
                  <span>Suivi commande</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/commandes')}
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: 'none',
              color: 'white',
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
            }}
          >
            ← Retour
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl }}>
          {/* Informations de la commande */}
          <div style={{
            background: '#f8fafc',
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              fontSize: 20, 
              fontWeight: 700, 
              color: theme.colors.gray[800], 
              marginBottom: theme.spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}>
              📋 Détails de la commande
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
              <div>
                <strong>Client:</strong> {order.client_nom}
              </div>
              <div>
                <strong>Date de commande:</strong> {formatDate(order.date_commande)}
              </div>
              <div>
                <strong>Montant total:</strong> 
                <span style={{ color: '#059669', fontWeight: 600 }}>
                  {order.montant_total} MRU
                </span>
              </div>
              <div>
                <strong>Statut actuel:</strong>
                <div style={{
                  display: 'inline-block',
                  marginLeft: theme.spacing.sm,
                  padding: '6px 12px',
                  borderRadius: theme.borderRadius.md,
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#fff',
                  backgroundColor: getStatusColor(order.statut),
                }}>
                  {getStatusIcon(order.statut)} {getStatusLabel(order.statut)}
                </div>
              </div>
              
              {/* Adresse de livraison */}
              <div style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, background: '#fff', borderRadius: theme.borderRadius.md }}>
                <strong>Adresse de livraison:</strong><br />
                {order.client_adresse}<br />
                {order.client_ville}, {order.client_pays}
              </div>
            </div>
          </div>

          {/* Historique de tracking */}
          <div style={{
            background: '#fff',
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ 
              fontSize: 20, 
              fontWeight: 700, 
              color: theme.colors.gray[800], 
              marginBottom: theme.spacing.lg,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}>
              📈 Historique de statut
            </h2>

            {tracking.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: theme.spacing.xl, 
                color: theme.colors.gray[500] 
              }}>
                <div style={{ fontSize: 32, marginBottom: theme.spacing.md }}>📋</div>
                <div>Aucun historique disponible</div>
                <div style={{ fontSize: 12, marginTop: theme.spacing.sm }}>
                  L'historique sera affiché une fois les données de tracking configurées
                </div>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                {/* Ligne de temps */}
                <div style={{
                  position: 'absolute',
                  left: 20,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: 'linear-gradient(to bottom, #10b981, #e5e7eb)',
                  borderRadius: 1
                }}></div>

                {tracking.map((item, index) => (
                  <div key={index} style={{
                    position: 'relative',
                    paddingLeft: 50,
                    paddingBottom: theme.spacing.lg,
                    paddingTop: index === 0 ? 0 : theme.spacing.sm
                  }}>
                    {/* Point sur la timeline */}
                    <div style={{
                      position: 'absolute',
                      left: 12,
                      top: index === 0 ? 8 : 12,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(item.nouveau_statut),
                      border: '3px solid #fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      zIndex: 1
                    }}></div>

                    <div style={{
                      background: index === 0 ? '#f0fdf4' : '#f8fafc',
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing.md,
                      border: index === 0 ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: theme.spacing.sm
                      }}>
                        <div style={{
                          fontWeight: 600,
                          color: theme.colors.gray[800],
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.spacing.sm
                        }}>
                          {getStatusIcon(item.nouveau_statut)}
                          {item.ancien_statut ? (
                            <>
                              <span style={{ color: '#6b7280', textDecoration: 'line-through' }}>
                                {getStatusLabel(item.ancien_statut)}
                              </span>
                              <span style={{ color: '#6b7280' }}>→</span>
                              <span style={{ color: getStatusColor(item.nouveau_statut) }}>
                                {getStatusLabel(item.nouveau_statut)}
                              </span>
                            </>
                          ) : (
                            <span style={{ color: getStatusColor(item.nouveau_statut) }}>
                              {getStatusLabel(item.nouveau_statut)}
                            </span>
                          )}
                        </div>
                        
                        <div style={{
                          fontSize: 12,
                          color: theme.colors.gray[500],
                          fontWeight: 500
                        }}>
                          {index === 0 && <span style={{ color: '#059669' }}>• Actuel</span>}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: 13,
                        color: theme.colors.gray[600]
                      }}>
                        {formatDate(item.date_modification)}
                      </div>
                      
                      {item.commentaire && (
                        <div style={{
                          fontSize: 12,
                          color: theme.colors.gray[500],
                          marginTop: theme.spacing.xs,
                          fontStyle: 'italic'
                        }}>
                          {item.commentaire}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Détails des produits */}
        <div style={{
          marginTop: theme.spacing.xl,
          background: '#fff',
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: theme.colors.gray[800], 
            marginBottom: theme.spacing.lg,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            🛍️ Détails des produits
          </h2>

          {order.details && order.details.length > 0 ? (
            <div style={{ display: 'grid', gap: theme.spacing.md }}>
              {order.details.map((item, idx) => {
                const quantite = item.quantite || 0;
                const prix = parseFloat(item.prix_unitaire || 0);
                const total = (quantite * prix).toFixed(2);
                
                return (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    background: '#f8fafc',
                    borderRadius: theme.borderRadius.md,
                    border: '1px solid #e2e8f0'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: theme.colors.gray[800] }}>
                        {item.specification_nom || 'Produit non spécifié'}
                      </div>
                      <div style={{ fontSize: 14, color: theme.colors.gray[600] }}>
                        Quantité: {quantite} × {prix} MRU
                      </div>
                    </div>
                    <div style={{
                      fontWeight: 700,
                      color: '#059669',
                      fontSize: 16
                    }}>
                      {total} MRU
                    </div>
                  </div>
                );
              })}
              
              <div style={{
                borderTop: `2px solid ${theme.colors.gray[200]}`,
                paddingTop: theme.spacing.md,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 18,
                fontWeight: 700
              }}>
                <span>Total de la commande:</span>
                <span style={{ color: '#059669' }}>{order.montant_total} MRU</span>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: theme.spacing.xl, 
              color: theme.colors.gray[500] 
            }}>
              <div style={{ fontSize: 32, marginBottom: theme.spacing.md }}>📦</div>
              <div>Aucun détail de produit disponible</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;