// src/pages/TodayOrders.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const TodayOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todayDate, setTodayDate] = useState('');
  const navigate = useNavigate();

  const fetchTodayOrders = () => {
    setLoading(true);
    fetch('/api/commandes/commandes_du_jour/')
      .then(res => res.json())
      .then(data => {
        setOrders(data.results || []);
        setTodayDate(data.date || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const handleViewTracking = (orderId) => {
    navigate(`/orders/tracking/${orderId}`);
  };

  const handleEdit = (orderId) => {
    navigate(`/orders/edit/${orderId}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50], fontFamily: theme.fonts.base }}>
      <ModernSidebar currentPage="today-orders" />

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
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <span style={{ fontSize: 24, filter: 'brightness(0) invert(1)' }}>📅</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.colors.gray[800],
                  margin: 0,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Commandes du Jour
                </h1>
                <div style={{
                  fontSize: 14,
                  color: theme.colors.gray[500],
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  marginTop: theme.spacing.sm
                }}>
                  <span style={{ color: '#4f46e5', fontWeight: 500 }}>Tableau de bord</span>
                  <span>→</span>
                  <span>Commandes du {todayDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.lg,
              fontWeight: 600,
              fontSize: 14,
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
            }}>
              {orders.length} commande{orders.length !== 1 ? 's' : ''} aujourd'hui
            </div>

            <Button
              onClick={fetchTodayOrders}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Rafraîchir
            </Button>
          </div>
        </div>

        {/* Liste des commandes */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: theme.colors.gray[500] }}>
            <div style={{ fontSize: 48, marginBottom: theme.spacing.lg, opacity: 0.5 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Chargement des commandes...</div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.colors.gray[500] }}>
            <div style={{ fontSize: 48, marginBottom: theme.spacing.lg, opacity: 0.5 }}>📋</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Aucune commande aujourd'hui</div>
            <div style={{ fontSize: 14, marginTop: theme.spacing.sm }}>
              Les nouvelles commandes apparaîtront ici automatiquement
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: theme.spacing.xl }}>
            {orders.map(order => (
              <div key={order.id} style={{
                background: '#fff',
                borderRadius: theme.borderRadius.lg,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: theme.spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
                border: '1px solid #f3f4f6',
                transition: 'all 0.3s ease',
              }}>
                
                <div style={{ fontWeight: 700, fontSize: 16, color: theme.colors.gray[900] }}>
                  Commande #{order.id} - {new Date(order.date_commande).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                
                <div style={{ fontSize: 14, color: theme.colors.gray[700], marginTop: 6 }}>
                  <strong>Client :</strong> {order.client_nom || 'Non spécifié'} <br />
                  <strong>Adresse :</strong> {order.client_adresse || 'Non spécifiée'} <br />
                  <strong>Ville :</strong> {order.client_ville || 'Non spécifiée'} <br />
                  <strong>Pays :</strong> {order.client_pays || 'Non spécifié'}
                </div>
                
                <div style={{ fontSize: 14, color: theme.colors.gray[700] }}>
                  Montant total : <strong style={{ color: '#059669' }}>{order.montant_total} MRU</strong>
                </div>
                
                <div style={{
                  alignSelf: 'flex-start',
                  padding: '6px 12px',
                  borderRadius: theme.borderRadius.md,
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#fff',
                  backgroundColor: getStatusColor(order.statut),
                  userSelect: 'none'
                }}>
                  {order.statut}
                </div>

                {/* Détails de la commande */}
                <div style={{ marginTop: theme.spacing.md, fontSize: 14, color: theme.colors.gray[700] }}>
                  <strong>Détails de la commande:</strong>
                  <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
                    {order.details && order.details.length > 0 ? (
                      order.details.map((item, idx) => {
                        const quantite = item.quantite || 0;
                        const prix = parseFloat(item.prix_unitaire || 0);
                        const total = (quantite * prix).toFixed(2);
                        
                        return (
                          <li key={idx} style={{ marginBottom: 4 }}>
                            <span style={{ fontWeight: 500 }}>
                               {item.specification_nom || 'N/A'}
                            </span> - 
                            Qté: <strong>{quantite}</strong> × <strong>{prix}</strong> MRU = 
                            <span style={{ color: '#2563eb', fontWeight: 600 }}>
                              {total} MRU
                            </span>
                          </li>
                        );
                      })
                    ) : (
                      <li style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                        Aucun détail disponible
                      </li>
                    )}
                  </ul>
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
                  <Button 
                    onClick={() => handleViewTracking(order.id)} 
                    style={{ 
                      flex: 1, 
                      background: '#10b981', 
                      color: '#fff',
                      fontSize: 13,
                      padding: '8px 12px'
                    }}
                  >
                    📍 Tracking
                  </Button>
                  <Button 
                    onClick={() => handleEdit(order.id)} 
                    style={{ 
                      flex: 1, 
                      background: '#f59e0b', 
                      color: '#fff',
                      fontSize: 13,
                      padding: '8px 12px'
                    }}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayOrders;