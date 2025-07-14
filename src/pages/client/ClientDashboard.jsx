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

  // Composant d'icônes SVG
  const Icons = {
    ShoppingBag: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    ShoppingCart: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    ),
    Heart: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    FileText: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 3v4a1 1 0 001 1h4"/>
        <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/>
      </svg>
    ),
    Package: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    TrendingUp: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
        <polyline points="17,6 23,6 23,12"/>
      </svg>
    ),
    Calendar: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    ArrowRight: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12,5 19,12 12,19"/>
      </svg>
    ),
    Loader: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    Star: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    )
  };

  const quickActions = [
    {
      id: 'products',
      title: 'Parcourir les Produits',
      description: 'Découvrez notre catalogue complet',
      icon: <Icons.ShoppingBag />,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: () => navigate('/produits')
    },
    {
      id: 'cart',
      title: 'Mon Panier',
      description: `${stats.panier.total_items} articles - ${stats.panier.total_prix} MRU`,
      icon: <Icons.ShoppingCart />,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      action: () => navigate('/panier')
    },
    {
      id: 'favorites',
      title: 'Mes Favoris',
      description: `${stats.favoris} produits favoris`,
      icon: <Icons.Heart />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      action: () => navigate('/favoris')
    },
    {
      id: 'orders',
      title: 'Mes Commandes',
      description: `${stats.commandes} commandes`,
      icon: <Icons.FileText />,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      action: () => navigate('/mes-commandes')
    }
  ];

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      lineHeight: '1.6'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
      color: '#ffffff',
      padding: '80px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 2
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: '800',
      margin: '0 0 24px 0',
      lineHeight: '1.1',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    heroSubtitle: {
      fontSize: '20px',
      margin: '0 auto 0 auto',
      opacity: 0.95,
      maxWidth: '600px',
      lineHeight: '1.6',
      fontWeight: '400'
    },
    section: {
      padding: '60px 24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    quickActionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      marginBottom: '60px'
    },
    quickActionCard: {
      padding: '40px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
    },
    iconContainer: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px auto',
      color: '#ffffff',
      transition: 'all 0.3s ease'
    },
    actionTitle: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    actionDescription: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.5'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
      marginBottom: '60px'
    },
    statCard: {
      padding: '32px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      position: 'relative',
      overflow: 'hidden'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: '800',
      marginBottom: '12px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    statLabel: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    recentOrdersSection: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      padding: '40px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      position: 'relative',
      overflow: 'hidden'
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px'
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: 0
    },
    viewAllButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 20px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      gap: '8px',
      textDecoration: 'none'
    },
    ordersContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    orderCard: {
      padding: '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    orderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    orderInfo: {
      flex: 1
    },
    orderNumber: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '6px'
    },
    orderDate: {
      fontSize: '14px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    orderMeta: {
      textAlign: 'right'
    },
    statusBadge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#ffffff',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    orderAmount: {
      fontSize: '18px',
      fontWeight: '800',
      color: '#1e293b'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 24px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0'
    },
    emptyIconContainer: {
      width: '120px',
      height: '120px',
      backgroundColor: '#f8fafc',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px auto',
      color: '#94a3b8'
    },
    emptyTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    emptyDescription: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 32px 0',
      lineHeight: '1.6'
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      gap: '8px'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '60px 24px',
      color: '#64748b'
    },
    loadingIcon: {
      fontSize: '32px',
      marginBottom: '16px',
      animation: 'spin 1s linear infinite'
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'shimmer 1.5s infinite'
    }
  };

  // Animation CSS
  const keyframes = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `;

  // Section Hero
  const HeroSection = () => (
    <section style={styles.heroSection}>
      <style>{keyframes}</style>
      <div style={styles.heroContainer}>
        <h1 style={styles.heroTitle}>
          Tableau de Bord
        </h1>
        <p style={styles.heroSubtitle}>
          Bienvenue dans votre espace personnel. Gérez vos commandes, favoris et découvrez nos nouveautés.
        </p>
      </div>
    </section>
  );

  // Section Actions Rapides
  const QuickActionsSection = () => (
    <section style={styles.section}>
      <div style={styles.quickActionsGrid}>
        {quickActions.map(action => (
          <div
            key={action.id}
            onClick={action.action}
            style={styles.quickActionCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              const iconContainer = e.currentTarget.querySelector('.action-icon');
              if (iconContainer) {
                iconContainer.style.background = action.gradient;
                iconContainer.style.transform = 'scale(1.1) rotate(5deg)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              const iconContainer = e.currentTarget.querySelector('.action-icon');
              if (iconContainer) {
                iconContainer.style.background = action.gradient;
                iconContainer.style.transform = 'scale(1) rotate(0deg)';
              }
            }}
          >
            <div 
              className="action-icon" 
              style={{
                ...styles.iconContainer,
                background: action.gradient
              }}
            >
              {action.icon}
            </div>
            <h3 style={styles.actionTitle}>
              {action.title}
            </h3>
            <p style={styles.actionDescription}>
              {action.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );

  // Section Statistiques
  const StatsSection = () => (
    <section style={styles.section}>
      <div style={styles.statsGrid}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(168, 85, 247, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        >
          <div style={styles.statValue}>
            {stats.commandes}
          </div>
          <div style={styles.statLabel}>
            Total Commandes
          </div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        >
          <div style={styles.statValue}>
            {stats.favoris}
          </div>
          <div style={styles.statLabel}>
            Produits Favoris
          </div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        >
          <div style={styles.statValue}>
            {stats.panier.total_items}
          </div>
          <div style={styles.statLabel}>
            Articles au Panier
          </div>
        </div>

        <div 
          style={styles.statCard}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
          }}
        >
          <div style={{...styles.statValue, fontSize: '28px'}}>
            {stats.panier.total_prix} MRU
          </div>
          <div style={styles.statLabel}>
            Valeur du Panier
          </div>
        </div>
      </div>
    </section>
  );

  // Section Commandes Récentes
  const RecentOrdersSection = () => (
    <section style={styles.section}>
      <div style={styles.recentOrdersSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Commandes Récentes
          </h2>
          <button
            onClick={() => navigate('/mes-commandes')}
            style={styles.viewAllButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Voir toutes
            <Icons.ArrowRight />
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingIcon}>
              <Icons.Loader />
            </div>
            <p>Chargement des commandes...</p>
          </div>
        ) : recentCommandes.length > 0 ? (
          <div style={styles.ordersContainer}>
            {recentCommandes.map(commande => (
              <div
                key={commande.id}
                onClick={() => navigate(`/mes-commandes/${commande.id}`)}
                style={styles.orderCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.orderHeader}>
                  <div style={styles.orderInfo}>
                    <div style={styles.orderNumber}>
                      Commande #{commande.id}
                    </div>
                    <div style={styles.orderDate}>
                      <Icons.Calendar />
                      {new Date(commande.date_commande).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div style={styles.orderMeta}>
                    <div 
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(commande.statut)
                      }}
                    >
                      {getStatusLabel(commande.statut)}
                    </div>
                    <div style={styles.orderAmount}>
                      {commande.montant_total} MRU
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIconContainer}>
              <Icons.Package />
            </div>
            <h3 style={styles.emptyTitle}>
              Aucune commande pour le moment
            </h3>
            <p style={styles.emptyDescription}>
              Commencez vos achats dès maintenant et découvrez notre catalogue de produits exceptionnels.
            </p>
            <button
              onClick={() => navigate('/produits')}
              style={styles.ctaButton}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Icons.ShoppingBag />
              Commencer mes achats
            </button>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <ClientLayout currentPage="dashboard">
      <div style={styles.container}>
        <HeroSection />
        <QuickActionsSection />
        <StatsSection />
        <RecentOrdersSection />
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;