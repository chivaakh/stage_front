// src/pages/OrdersList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui';
import { PlusIcon } from '../../components/icons';
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

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/commandes/')
      .then(res => res.json())
      .then(data => setOrders(data.results || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.client_nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (orderId) => {
      console.log('ID envoyé pour édition:', orderId); // 👈 à ajouter
    navigate(`/orders/edit/${orderId}`);
  };

const handleDelete = (orderId) => {
    if (window.confirm(`Confirmez-vous la suppression de la commande #${orderId} ?`)) {
      fetch(`/api/commandes/${orderId}/`, {  // ✅ Utiliser l'URL relative au lieu de l'absolue
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',  // ✅ Ajouter les headers
        },
      })
        .then(res => {
          if (res.ok) {
            alert('Commande supprimée avec succès');
            fetchOrders();
          } else {
            alert(`Erreur lors de la suppression: ${res.status}`);
          }
        })
        .catch((error) => {
          console.error('Erreur réseau:', error);
          alert('Erreur réseau');
        });
    }
  };

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
        {/* Header et recherche */}
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                <span style={{ fontSize: 24, filter: 'brightness(0) invert(1)' }}>🛒</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme.colors.gray[800],
                  margin: 0,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Toutes les Commandes
                </h1>
                <div style={{
                  fontSize: 14,
                  color: theme.colors.gray[500],
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  marginTop: theme.spacing.sm
                }}>
                  <span style={{ color: '#4f46e5', fontWeight: 500, cursor: 'pointer', textDecoration: 'none' }}>
                    Tableau de bord
                  </span>
                  <span>→</span>
                  <span>Toutes les commandes</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
            <input
              type="search"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.gray[300]}`,
                fontSize: 14,
                color: theme.colors.gray[700],
                outline: 'none',
                width: 220,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            />

            <Button
              onClick={fetchOrders}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <PlusIcon size={18} />
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
        ) : filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: theme.colors.gray[500], fontSize: 18 }}>
            Aucune commande trouvée.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: theme.spacing.xl }}>
            {filteredOrders.map(order => (
              <div key={order.id} style={{
                background: '#F8FAFC',
                borderRadius: theme.borderRadius.lg,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                padding: theme.spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: theme.spacing.sm,
              }}>
                
                <div style={{ fontWeight: 700, fontSize: 16, color: theme.colors.gray[900] }}>
                  {order.client_nom} - {order.date_commande}
                </div>
                   <div style={{ fontSize: 14, color: theme.colors.gray[700], marginTop: 6 }}>
          <strong>Client :</strong> {order.client_nom || 'Non spécifié'} <br />
      <strong>Adresse :</strong> {order.client_adresse || 'Non spécifiée'} <br />
      <strong>Ville :</strong> {order.client_ville || 'Non spécifiée'} <br />
      <strong>Pays :</strong> {order.client_pays || 'Non spécifié'}
    </div>
                <div style={{ fontSize: 14, color: theme.colors.gray[700] }}>
                  Montant total : <strong>{order.montant_total} MRU</strong>
                </div>
                <div style={{
                  marginTop: 'auto',
                  alignSelf: 'flex-start',
                  padding: '4px 12px',
                  borderRadius: theme.borderRadius.md,
                  fontWeight: 600,
                  fontSize: 12,
                  color: '#fff',
                  backgroundColor: getStatusColor(order.statut),
                  userSelect: 'none'
                }}>
                    Statut : {order.statut}
                </div>

                {/* Détails de la commande */}
           <div style={{ marginTop: theme.spacing.md, fontSize: 14, color: theme.colors.gray[700] }}>
  <strong>Détails de la commande:</strong>
  <ul style={{ paddingLeft: 20 }}>
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
       

                {/* Boutons Modifier / Supprimer */}
             <div
  style={{
    display: 'flex',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    flexWrap: 'wrap',
  }}
>
  <Button
    onClick={() => handleEdit(order.id)}
    style={{
      flex: 1,
      minWidth: 120,
      backgroundColor: '#ED8936',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: 8,
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Modifier
  </Button>

  <Button
    onClick={() => handleDelete(order.id)}
    style={{
      flex: 1,
      minWidth: 120,
      backgroundColor: '#E53E3E',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: 8,
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Supprimer
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

export default OrdersList;