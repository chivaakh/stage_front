// src/pages/client/ClientDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { fetchMesCommandes, fetchFavoris, resumePanier } from '../../api/clientAPI';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    commandes: 0,
    favoris: 0,
    panier: { total_items: 0, total_prix: 0 }
  });
  const [recentCommandes, setRecentCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger les données en parallèle avec gestion d'erreur
      const [commandesRes, favorisRes, panierRes] = await Promise.all([
        fetchMesCommandes().catch(() => ({ data: [] })),
        fetchFavoris().catch(() => ({ data: [] })),
        resumePanier().catch(() => ({ data: { total_items: 0, total_prix: 0 } }))
      ]);

      setStats({
        commandes: commandesRes.data?.length || 0,
        favoris: favorisRes.data?.length || 0,
        panier: panierRes.data || { total_items: 0, total_prix: 0 }
      });

      setRecentCommandes(commandesRes.data?.slice(0, 5) || []);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'en_attente': '#f59e0b',
      'confirmee': '#3b82f6',
      'expediee': '#8b5cf6',
      'livree': '#10b981',
      'annulee': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'expediee': 'Expédiée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return labels[status] || status;
  };

  const quickActions = [
    {
      id: 'products',
      title: 'Parcourir les Produits',
      description: 'Découvrez notre catalogue complet',
      icon: '🛍️',
      color: '#667eea',
      action: () => navigate('/produits')
    },
    {
      id: 'cart',
      title: 'Mon Panier',
      description: `${stats.panier.total_items} articles - ${stats.panier.total_prix} MRU`,
      icon: '🛒',
      color: '#10b981',
      action: () => navigate('/panier')
    },
    {
      id: 'favorites',
      title: 'Mes Favoris',
      description: `${stats.favoris} produits favoris`,
      icon: '❤️',
      color: '#ef4444',
      action: () => navigate('/favoris')
    },
    {
      id: 'orders',
      title: 'Mes Commandes',
      description: `${stats.commandes} commandes`,
      icon: '📋',
      color: '#8b5cf6',
      action: () => navigate('/mes-commandes')
    }
  ];

  return (
    <ClientLayout currentPage="dashboard">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        {/* En-tête */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Tableau de Bord
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: 0
          }}>
            Bienvenue dans votre espace personnel
          </p>
        </div>

        {/* Actions rapides */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {quickActions.map(action => (
            <div
              key={action.id}
              onClick={action.action}
              style={{
                padding: '32px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: `${action.color}20`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                fontSize: '24px'
              }}>
                {action.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                {action.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                {action.description}
              </p>
            </div>
          ))}
        </div>

        {/* Statistiques détaillées */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              {stats.commandes}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Total Commandes
            </div>
          </div>

          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#ef4444',
              marginBottom: '8px'
            }}>
              {stats.favoris}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Produits Favoris
            </div>
          </div>

          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              {stats.panier.total_items}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Articles au Panier
            </div>
          </div>

          <div style={{
            padding: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#8b5cf6',
              marginBottom: '8px'
            }}>
              {stats.panier.total_prix} MRU
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Valeur du Panier
            </div>
          </div>
        </div>

        {/* Commandes récentes */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Commandes Récentes
            </h2>
            <button
              onClick={() => navigate('/mes-commandes')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#667eea',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Voir toutes →
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
              Chargement...
            </div>
          ) : recentCommandes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recentCommandes.map(commande => (
                <div
                  key={commande.id}
                  onClick={() => navigate(`/mes-commandes/${commande.id}`)}
                  style={{
                    padding: '20px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '4px'
                      }}>
                        Commande #{commande.id}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {new Date(commande.date_commande).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: getStatusColor(commande.statut),
                        color: '#ffffff',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}>
                        {getStatusLabel(commande.statut)}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        {commande.montant_total} MRU
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6b7280'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
              <p style={{ margin: '0 0 16px 0' }}>Aucune commande pour le moment</p>
              <button
                onClick={() => navigate('/produits')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#667eea',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🛍️ Commencer mes achats
              </button>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;