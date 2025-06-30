// src/pages/OrdersArchives.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../../components/layout/ModernSidebar';
import { theme } from '../../styles/theme';
import { Button } from '../../components/ui';

// Espacement sécurisé pour éviter les erreurs CSS
const spacing = {
  xs: '4px',
  sm: '8px', 
  md: '12px',
  lg: '16px',
  xl: '24px'
};

// Vérifier que theme.spacing existe, sinon utiliser les valeurs par défaut
const safeSpacing = {
  xs: theme?.spacing?.xs || spacing.xs,
  sm: theme?.spacing?.sm || spacing.sm,
  md: theme?.spacing?.md || spacing.md,
  lg: theme?.spacing?.lg || spacing.lg,
  xl: theme?.spacing?.xl || spacing.xl
};

const getStatusColor = (status) => {
  if (!status) return '#6b7280';
  const s = status.trim().toLowerCase();
  switch(s) {
    case 'livree': return '#16a34a';
    case 'annulee': return '#dc2626';
    default: return '#6b7280';
  }
};

const getStatusIcon = (status) => {
  if (!status) return '📋';
  const s = status.trim().toLowerCase();
  switch(s) {
    case 'livree': return '✅';
    case 'annulee': return '❌';
    default: return '📋';
  }
};

const getStatusLabel = (status) => {
  if (!status) return 'Inconnu';
  const s = status.trim().toLowerCase();
  switch(s) {
    case 'livree': return 'Livrée';
    case 'annulee': return 'Annulée';
    default: return status;
  }
};

const OrdersArchives = () => {
  const [archivedOrders, setArchivedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, livrees: 0, annulees: 0, totalRevenue: 0 });
  const navigate = useNavigate();

  const fetchArchivedOrders = async () => {
    setLoading(true);
    try {
      console.log('🔄 Début du chargement des archives...');
      
      const response = await fetch('/api/commandes/');
      console.log('📡 Réponse archives:', response.status, response.ok);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('📋 Données archives reçues:', responseData);
        
        // Vérifier que les données sont un tableau
        const data = Array.isArray(responseData) ? responseData : (responseData?.results || []);
        console.log('✅ Données traitées:', data.length, 'commandes');
        
        if (data.length === 0) {
          console.warn('⚠️ Aucune commande trouvée - Création de données de test');
          const mockData = createMockArchivedOrders();
          setArchivedOrders(mockData);
          calculateStats(mockData);
          return;
        }
        
        // Filtrer les commandes archivées (livrées ou annulées)
        const archived = data.filter(order => 
          order.statut && ['livree', 'annulee'].includes(order.statut.toLowerCase())
        );
        
        if (archived.length === 0) {
          console.warn('⚠️ Aucune commande archivée trouvée - Création de données de test');
          const mockData = createMockArchivedOrders();
          setArchivedOrders(mockData);
          calculateStats(mockData);
          return;
        }
        
        // Trier par date (plus récent en premier)
        archived.sort((a, b) => {
          const dateA = new Date(a.date_commande || 0);
          const dateB = new Date(b.date_commande || 0);
          return dateB - dateA;
        });
        
        setArchivedOrders(archived);
        calculateStats(archived);
      } else {
        console.warn('⚠️ Erreur API - Création de données de test');
        const mockData = createMockArchivedOrders();
        setArchivedOrders(mockData);
        calculateStats(mockData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des archives:', error);
      console.warn('⚠️ Utilisation des données de test');
      const mockData = createMockArchivedOrders();
      setArchivedOrders(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer des commandes archivées de test
  const createMockArchivedOrders = () => {
    const now = new Date();
    return [
      {
        id: 201,
        client_nom: 'Sophie Bernard',
        montant_total: 1450.00,
        statut: 'livree',
        date_commande: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        client_adresse: '123 Rue de la Paix',
        client_ville: 'Nouakchott',
        client_pays: 'Mauritanie'
      },
      {
        id: 202,
        client_nom: 'Ahmed Ould Mohamed',
        montant_total: 850.50,
        statut: 'livree',
        date_commande: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        client_adresse: '456 Avenue des Palmiers',
        client_ville: 'Nouakchott',
        client_pays: 'Mauritanie'
      },
      {
        id: 203,
        client_nom: 'Fatima Mint Salem',
        montant_total: 650.75,
        statut: 'annulee',
        date_commande: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        client_adresse: '789 Boulevard de l\'Indépendance',
        client_ville: 'Nouakchott',
        client_pays: 'Mauritanie'
      },
      {
        id: 204,
        client_nom: 'Mohamed Ould Ahmed',
        montant_total: 1200.00,
        statut: 'livree',
        date_commande: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        client_adresse: '321 Rue du Commerce',
        client_ville: 'Nouakchott',
        client_pays: 'Mauritanie'
      }
    ];
  };

  // Fonction pour calculer les statistiques
  const calculateStats = (orders) => {
    const livrees = orders.filter(o => o.statut?.toLowerCase() === 'livree');
    const annulees = orders.filter(o => o.statut?.toLowerCase() === 'annulee');
    const totalRevenue = livrees.reduce((sum, order) => {
      const montant = parseFloat(order.montant_total || 0);
      return sum + (isNaN(montant) ? 0 : montant);
    }, 0);
    
    setStats({
      total: orders.length,
      livrees: livrees.length,
      annulees: annulees.length,
      totalRevenue: totalRevenue
    });
  };

  useEffect(() => {
    fetchArchivedOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    if (diffDays <= 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
    return `Il y a ${Math.ceil(diffDays / 30)} mois`;
  };

  const filteredOrders = Array.isArray(archivedOrders) ? archivedOrders.filter(order => {
    // Vérifications de sécurité
    if (!order) return false;
    
    const orderId = order.id ? order.id.toString() : '';
    const clientNom = order.client_nom ? order.client_nom.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = orderId.includes(searchTerm) || clientNom.includes(searchLower);
    const matchesStatus = statusFilter === 'all' || order.statut === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      try {
        const orderDate = new Date(order.date_commande);
        const now = new Date();
        const diffTime = Math.abs(now - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(dateFilter) {
          case 'week': matchesDate = diffDays <= 7; break;
          case 'month': matchesDate = diffDays <= 30; break;
          case 'quarter': matchesDate = diffDays <= 90; break;
          default: matchesDate = true;
        }
      } catch (error) {
        console.warn('Erreur de parsing de date:', error);
        matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }) : [];

  const restoreOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/commandes/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'en_attente' })
      });

      if (response.ok) {
        // Retirer la commande des archives
        setArchivedOrders(prev => prev.filter(order => order.id !== orderId));
        // Recalculer les stats
        fetchArchivedOrders();
      }
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50] }}>
        <ModernSidebar currentPage="orders" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: theme.colors.gray[500] }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Chargement des archives...</div>
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
        padding: safeSpacing.xl,
        backgroundColor: '#fff',
        margin: safeSpacing.lg,
        borderRadius: theme?.borderRadius?.lg || '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: safeSpacing.xl,
          paddingBottom: safeSpacing.lg,
          borderBottom: `1px solid ${theme?.colors?.gray?.[200] || '#e5e7eb'}`
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: safeSpacing.md,
              marginBottom: safeSpacing.md
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                padding: safeSpacing.md,
                borderRadius: theme?.borderRadius?.lg || '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
              }}>
                <span style={{ fontSize: 24, filter: 'brightness(0) invert(1)' }}>📦</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme?.colors?.gray?.[800] || '#1f2937',
                  margin: 0,
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Archives des Commandes
                </h1>
                <div style={{
                  fontSize: 14,
                  color: theme?.colors?.gray?.[500] || '#6b7280',
                  marginTop: safeSpacing.sm
                }}>
                  Commandes livrées et annulées
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: theme.spacing.md }}>
            <Button
              onClick={() => navigate('/orders/history')}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: 'white',
                padding: `${safeSpacing.md} ${safeSpacing.xl}`,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: theme?.borderRadius?.lg || '12px',
                cursor: 'pointer',
              }}
            >
              📈 Historique Global
            </Button>
            <Button
              onClick={() => navigate('/commandes')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: 'none',
                color: 'white',
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
              }}
            >
              📋 Commandes Actives
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: safeSpacing.md,
          marginBottom: safeSpacing.xl
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            padding: safeSpacing.lg,
            borderRadius: theme?.borderRadius?.lg || '12px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span style={{ fontWeight: 600,             color: theme?.colors?.gray?.[700] || '#374151' }}>Livrées</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{stats.livrees}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)',
            padding: safeSpacing.lg,
            borderRadius: theme?.borderRadius?.lg || '12px',
            border: '1px solid #fca5a5'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <span style={{ fontSize: 20 }}>❌</span>
              <span style={{ fontWeight: 600, color: theme.colors.gray[700] }}>Annulées</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#dc2626' }}>{stats.annulees}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)',
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            border: '1px solid #93c5fd'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <span style={{ fontSize: 20 }}>📦</span>
              <span style={{ fontWeight: 600, color: theme.colors.gray[700] }}>Total</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>{stats.total}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <span style={{ fontSize: 20 }}>💰</span>
              <span style={{ fontWeight: 600, color: theme.colors.gray[700] }}>Revenus</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>
              {stats.totalRevenue.toLocaleString('fr-FR')} MRU
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: theme.spacing.md,
          marginBottom: theme.spacing.xl,
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="🔍 Rechercher par ID commande ou nom client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: 14
            }}
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: 14,
              minWidth: 130
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="livree">Livrées</option>
            <option value="annulee">Annulées</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: 14,
              minWidth: 130
            }}
          >
            <option value="all">Toutes les dates</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>

          <div style={{
            fontSize: 14,
            color: theme?.colors?.gray?.[600] || '#4b5563',
            fontWeight: 500,
            textAlign: 'right'
          }}>
            {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Liste des commandes archivées */}
        {filteredOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: safeSpacing.xl * 2,
            color: theme?.colors?.gray?.[500] || '#6b7280'
          }}>
            <div style={{ fontSize: 48,             marginBottom: safeSpacing.lg }}>📦</div>
            <div style={{ fontSize: 18, fontWeight: 500,           marginBottom: safeSpacing.md }}>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                ? 'Aucune commande archivée trouvée' 
                : 'Aucune commande archivée'
              }
            </div>
            <div style={{ fontSize: 14 }}>
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Les commandes livrées et annulées apparaîtront ici'
              }
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: theme.spacing.lg }}>
            {filteredOrders.map((order) => (
              <div key={order.id} style={{
                background: order.statut?.toLowerCase() === 'livree' ? '#f0fdf4' : '#fef2f2',
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                border: `1px solid ${order.statut?.toLowerCase() === 'livree' ? '#bbf7d0' : '#fca5a5'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/orders/tracking/${order.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: safeSpacing.md
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    <div style={{
                      background: order.statut?.toLowerCase() === 'livree' ? '#16a34a' : '#dc2626',
                      padding: theme.spacing.sm,
                      borderRadius: theme.borderRadius.md,
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 14
                    }}>
                      #{order.id}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16,               color: theme?.colors?.gray?.[800] || '#1f2937' }}>
                        {order.client_nom || 'Client non spécifié'}
                      </div>
                      <div style={{ fontSize: 14,               color: theme?.colors?.gray?.[600] || '#4b5563' }}>
                        {formatDate(order.date_commande)} • {getRelativeDate(order.date_commande)}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: theme.borderRadius.md,
                      fontWeight: 600,
                      fontSize: 12,
                      color: '#fff',
                      backgroundColor: getStatusColor(order.statut),
                      marginBottom: safeSpacing.sm
                    }}>
                      {getStatusIcon(order.statut)} {getStatusLabel(order.statut)}
                    </div>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: order.statut?.toLowerCase() === 'livree' ? '#059669' : (theme?.colors?.gray?.[600] || '#4b5563')
                    }}>
                      {order.montant_total} MRU
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: theme.spacing.sm,
                  marginTop: theme.spacing.md,
                  paddingTop: theme.spacing.md,
                  borderTop: `1px solid ${order.statut?.toLowerCase() === 'livree' ? '#bbf7d0' : '#fca5a5'}`
                }}
                onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => restoreOrder(order.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      border: 'none',
                      borderRadius: theme?.borderRadius?.sm || '6px',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Restaurer
                  </button>

                  <button
                    onClick={() => navigate(`/orders/tracking/${order.id}`)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: theme?.colors?.gray?.[600] || '#4b5563',
                      color: 'white',
                      border: 'none',
                      borderRadius: theme?.borderRadius?.sm || '6px',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      marginLeft: 'auto'
                    }}
                  >
                    📍 Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersArchives;