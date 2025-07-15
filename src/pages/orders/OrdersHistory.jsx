// src/pages/OrdersHistory.jsx
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

const OrdersHistory = () => {
  const [allTracking, setAllTracking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const navigate = useNavigate();

  const fetchAllTracking = async () => {
    setLoading(true);
    try {
      console.log('🔄 Début du chargement des commandes...');
      
      // Récupérer toutes les commandes
      const ordersResponse = await fetch('/api/commandes/');
      console.log('📡 Réponse commandes:', ordersResponse.status, ordersResponse.ok);
      
      if (!ordersResponse.ok) {
        throw new Error(`Erreur HTTP ${ordersResponse.status}: ${ordersResponse.statusText}`);
      }
      
      const ordersData = await ordersResponse.json();
      console.log('📋 Données commandes reçues:', ordersData);
      
      // Vérifier que ordersData est un tableau
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData?.results || []);
      console.log('✅ Commandes traitées:', orders.length, 'commandes');
      
      if (orders.length === 0) {
        console.warn('⚠️ Aucune commande trouvée - Création de données de test');
        // Créer des données de test si aucune commande n'est trouvée
        const mockOrders = createMockOrders();
        const mockTracking = [];
        mockOrders.forEach(order => {
          const tracking = createMockTracking(order);
          mockTracking.push(...tracking);
        });
        setAllTracking(mockTracking);
        return;
      }

      const allTrackingData = [];

      // Pour chaque commande, récupérer son historique
      for (const order of orders) {
        // ✅ FILTRER : Exclure les commandes livrées ou annulées de l'historique
        if (order.statut && ['livree', 'annulee'].includes(order.statut.toLowerCase())) {
          console.log(`⏭️ Commande ${order.id} ignorée (statut: ${order.statut}) - archivée`);
          continue; // Passer à la commande suivante
        }
        try {
          const trackingResponse = await fetch(`/api/commandes/${order.id}/tracking/`);
          if (trackingResponse.ok) {
            const trackingContentType = trackingResponse.headers.get('content-type');
            if (trackingContentType && trackingContentType.includes('application/json')) {
              const trackingData = await trackingResponse.json();
              
              // Vérifier que trackingData est un tableau
              const trackingArray = Array.isArray(trackingData) ? trackingData : [];
              
              // Ajouter les données de commande à chaque entrée de tracking
              const enrichedTracking = trackingArray.map(track => ({
                ...track,
                commande_id: order.id,
                client_nom: order.client_nom,
                montant_total: order.montant_total,
                date_commande: order.date_commande
              }));
              
              allTrackingData.push(...enrichedTracking);
            } else {
              // Créer un historique simulé si pas de données de tracking
              const mockTracking = createMockTracking(order);
              allTrackingData.push(...mockTracking);
            }
          } else {
            // Créer un historique simulé en cas d'erreur
            const mockTracking = createMockTracking(order);
            allTrackingData.push(...mockTracking);
          }
        } catch (error) {
          console.warn(`Erreur tracking pour commande ${order.id}:`, error);
          const mockTracking = createMockTracking(order);
          allTrackingData.push(...mockTracking);
        }
      }

      // Trier par date (plus récent en premier) - avec vérification de sécurité
      allTrackingData.sort((a, b) => {
        const dateA = new Date(a.date_modification || a.date_commande);
        const dateB = new Date(b.date_modification || b.date_commande);
        return dateB - dateA;
      });
      
      setAllTracking(allTrackingData);
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      setAllTracking([]); // S'assurer qu'on a toujours un tableau
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer des commandes de test
  const createMockOrders = () => {
    const now = new Date();
    return [
      {
        id: 101,
        client_nom: 'Alice Martin',
        montant_total: 1250.00,
        statut: 'expediee', // ✅ Statut actif (pas livree/annulee)
        date_commande: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 102,
        client_nom: 'Bob Durand',
        montant_total: 850.50,
        statut: 'confirmee', // ✅ Statut actif
        date_commande: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 103,
        client_nom: 'Claire Moreau',
        montant_total: 450.00,
        statut: 'en_attente', // ✅ Statut actif
        date_commande: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 104,
        client_nom: 'David Petit',
        montant_total: 320.75,
        statut: 'confirmee', // ✅ Statut actif
        date_commande: new Date(now.getTime() - 0.1 * 24 * 60 * 60 * 1000).toISOString()
      }
      // ❌ PAS de commandes avec statut 'livree' ou 'annulee' dans l'historique
    ];
  };

  // Fonction pour créer un tracking simulé
  const createMockTracking = (order) => {
    // ✅ S'assurer que les commandes archivées ne génèrent pas de tracking
    if (order.statut && ['livree', 'annulee'].includes(order.statut.toLowerCase())) {
      return []; // Pas de tracking pour les commandes archivées
    }

    const tracking = [{
      nouveau_statut: order.statut,
      ancien_statut: null,
      date_modification: order.date_commande,
      commentaire: 'Statut actuel',
      commande_id: order.id,
      client_nom: order.client_nom,
      montant_total: order.montant_total,
      date_commande: order.date_commande
    }];

    // Créer l'historique progressif uniquement pour les statuts actifs
    const orderDate = new Date(order.date_commande);
    
    if (order.statut !== 'en_attente') {
      tracking.push({
        nouveau_statut: 'en_attente',
        ancien_statut: null,
        date_modification: new Date(orderDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        commentaire: 'Commande créée',
        commande_id: order.id,
        client_nom: order.client_nom,
        montant_total: order.montant_total,
        date_commande: order.date_commande
      });
    }
    
    if (['confirmee', 'expediee'].includes(order.statut)) {
      tracking.push({
        nouveau_statut: 'confirmee',
        ancien_statut: 'en_attente',
        date_modification: new Date(orderDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        commentaire: 'Commande confirmée',
        commande_id: order.id,
        client_nom: order.client_nom,
        montant_total: order.montant_total,
        date_commande: order.date_commande
      });
    }
    
    if (order.statut === 'expediee') {
      tracking.push({
        nouveau_statut: 'expediee',
        ancien_statut: 'confirmee',
        date_modification: new Date(orderDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        commentaire: 'Commande expédiée',
        commande_id: order.id,
        client_nom: order.client_nom,
        montant_total: order.montant_total,
        date_commande: order.date_commande
      });
    }
    
    return tracking.reverse(); // Plus récent en premier
  };

  useEffect(() => {
    fetchAllTracking();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
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

  const filteredTracking = allTracking.filter(track => {
    // Vérifications de sécurité
    if (!track) return false;
    
    const commandeId = track.commande_id ? track.commande_id.toString() : '';
    const clientNom = track.client_nom ? track.client_nom.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = commandeId.includes(searchTerm) || clientNom.includes(searchLower);
    const matchesStatus = statusFilter === 'all' || track.nouveau_statut === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      try {
        const trackDate = new Date(track.date_modification || track.date_commande);
        const now = new Date();
        const diffTime = Math.abs(now - trackDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch(dateFilter) {
          case 'today': matchesDate = diffDays <= 1; break;
          case 'week': matchesDate = diffDays <= 7; break;
          case 'month': matchesDate = diffDays <= 30; break;
          default: matchesDate = true;
        }
      } catch (error) {
        console.warn('Erreur de parsing de date:', error);
        matchesDate = true; // En cas d'erreur, on inclut l'élément
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50] }}>
        <ModernSidebar currentPage="order-tracking" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: theme.colors.gray[500] }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Chargement de l'historique...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.colors.gray[50], fontFamily: theme.fonts.base }}>
      <ModernSidebar currentPage="order-tracking" />

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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: safeSpacing.md,
                borderRadius: theme?.borderRadius?.lg || '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ fontSize: 24, filter: 'brightness(0) invert(1)' }}>📈</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: theme?.colors?.gray?.[800] || '#1f2937',
                  margin: 0,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Historique Global
                </h1>
                <div style={{
                  fontSize: 14,
                  color: theme?.colors?.gray?.[500] || '#6b7280',
                  marginTop: safeSpacing.sm
                }}>
                  Suivi en temps réel des commandes actives • <span style={{ color: '#059669', fontWeight: 500 }}>Commandes archivées exclues</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate('/orders/archives')}
            style={{
              background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              border: 'none',
              color: 'white',
              padding: `${safeSpacing.md} ${safeSpacing.xl}`,
              fontSize: 15,
              fontWeight: 600,
              borderRadius: theme?.borderRadius?.lg || '12px',
              cursor: 'pointer',
            }}
          >
            📦 Voir Archives
          </Button>
        </div>

        {/* Filtres */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto auto auto',
          gap: safeSpacing.md,
          marginBottom: safeSpacing.xl,
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
              minWidth: 150
            }}
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="expediee">Expédiée</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
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
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>

          <div style={{
            fontSize: 14,
            color: theme.colors.gray[600],
            fontWeight: 500,
            textAlign: 'right'
          }}>
            {filteredTracking.length} entrée{filteredTracking.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Timeline de l'historique */}
        {filteredTracking.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: theme.spacing.xl * 2,
            color: theme.colors.gray[500]
          }}>
            <div style={{ fontSize: 48, marginBottom: theme.spacing.lg }}>📈</div>
            <div style={{ fontSize: 18, fontWeight: 500, marginBottom: theme.spacing.md }}>
              Aucun historique trouvé
            </div>
            <div style={{ fontSize: 14 }}>
              Essayez de modifier vos critères de recherche
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Ligne de temps principale */}
            <div style={{
              position: 'absolute',
              left: 30,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'linear-gradient(to bottom, #10b981, #e5e7eb)',
              borderRadius: 1,
              zIndex: 0
            }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
              {filteredTracking.map((track, index) => (
                <div key={`${track.commande_id}-${track.date_modification}-${index}`} style={{
                  position: 'relative',
                  paddingLeft: 70,
                  background: '#f8fafc',
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.lg,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => navigate(`/orders/tracking/${track.commande_id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                >
                  {/* Point sur la timeline */}
                  <div style={{
                    position: 'absolute',
                    left: 22,
                    top: theme.spacing.lg,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(track.nouveau_statut),
                    border: '3px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 1
                  }}></div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: theme.spacing.md
                  }}>
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md,
                        marginBottom: theme.spacing.sm
                      }}>
                        <div style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: theme.borderRadius.sm,
                          fontSize: 12,
                          fontWeight: 700
                        }}>
                          #{track.commande_id}
                        </div>
                        <div style={{ fontWeight: 600, color: theme.colors.gray[800] }}>
                          {track.client_nom || 'Client non spécifié'}
                        </div>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: theme.borderRadius.sm,
                          fontWeight: 600,
                          fontSize: 11,
                          color: '#fff',
                          backgroundColor: getStatusColor(track.nouveau_statut),
                        }}>
                          {getStatusIcon(track.nouveau_statut)} {getStatusLabel(track.nouveau_statut)}
                        </div>
                      </div>
                      
                      <div style={{
                        fontSize: 13,
                        color: theme.colors.gray[600],
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.md
                      }}>
                        <span>{formatDate(track.date_modification)}</span>
                        <span style={{ color: '#059669' }}>•</span>
                        <span>{getRelativeDate(track.date_modification)}</span>
                        {track.montant_total && (
                          <>
                            <span style={{ color: '#059669' }}>•</span>
                            <span style={{ color: '#059669', fontWeight: 600 }}>
                              {track.montant_total} MRU
                            </span>
                          </>
                        )}
                      </div>
                      
                      {track.commentaire && (
                        <div style={{
                          fontSize: 12,
                          color: theme.colors.gray[500],
                          marginTop: theme.spacing.xs,
                          fontStyle: 'italic'
                        }}>
                          {track.commentaire}
                        </div>
                      )}
                    </div>

                    <div style={{
                      fontSize: 12,
                      color: theme.colors.gray[400],
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.xs
                    }}>
                      📍 Voir détails
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;