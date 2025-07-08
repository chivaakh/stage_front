import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { 
  Home, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  MessageCircle, 
  BarChart3, 
  Tag, 
  User, 
  Settings, 
  LogOut,
  Plus,
  ChevronRight,
  ChevronDown,
  Zap
} from 'lucide-react';

const theme = {
  colors: {
    primary: '#6366f1',
    primaryLight: '#a5b4fc',
    primaryDark: '#4f46e5',
    secondary: '#f1f5f9',
    white: '#ffffff',
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px'
  }
};

const ModernSidebar = ({ children, onAddProductClick, currentPage = 'products' }) => {
  //  Ajout des états pour les données du vendeur
  const [vendeurInfo, setVendeurInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoError, setLogoError] = useState(false); //  Nouvel état pour gérer l'erreur de logo

  const [expandedMenus, setExpandedMenus] = useState({ 
    products: false, 
    orders: false, 
    account: false 
  });

  //  useEffect pour charger les données du vendeur
  useEffect(() => {
    const fetchVendeurInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/vendeur-info/', {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Session expirée, rediriger vers login
            window.location.href = '/login';
            return;
          }
          throw new Error(`Erreur ${response.status}`);
        }

        const data = await response.json();
        setVendeurInfo(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des infos vendeur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendeurInfo();
  }, []);

  //  Fonction pour obtenir les initiales du nom (fallback si pas de logo)
  const getInitials = () => {
    if (!vendeurInfo) return 'JD';
    
    const prenom = vendeurInfo.prenom || '';
    const nom = vendeurInfo.nom || '';
    
    if (prenom && nom) {
      return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
    } else if (prenom) {
      return prenom.substring(0, 2).toUpperCase();
    } else if (nom) {
      return nom.substring(0, 2).toUpperCase();
    }
    return 'VE'; // Vendor par défaut
  };

  //  Fonction pour obtenir le nom de la boutique (affiché en haut)
  const getBoutiqueName = () => {
    if (!vendeurInfo) return 'Ma Boutique';
    
    if (vendeurInfo.boutique && vendeurInfo.boutique.nom_boutique) {
      return vendeurInfo.boutique.nom_boutique;
    }
    
    return 'Ma Boutique';
  };

  //  Fonction pour obtenir le nom du vendeur avec son rôle (affiché en bas)
  const getVendeurNameWithRole = () => {
    if (!vendeurInfo) return 'John Doe (Vendeur)';
    
    const prenom = vendeurInfo.prenom || '';
    const nom = vendeurInfo.nom || '';
    
    let fullName = '';
    if (prenom && nom) {
      fullName = `${prenom} ${nom}`;
    } else if (prenom) {
      fullName = prenom;
    } else if (nom) {
      fullName = nom;
    } else {
      fullName = vendeurInfo.telephone || 'Vendeur';
    }
    
    // Capitaliser le rôle
    const role = vendeurInfo.type_utilisateur || 'vendeur';
    const roleCapitalized = role.charAt(0).toUpperCase() + role.slice(1);
    
    return `${fullName} (${roleCapitalized})`;
  };

  //  Fonction pour vérifier si on a un logo et qu'il n'y a pas d'erreur
  const hasLogo = () => {
    return vendeurInfo && vendeurInfo.boutique && vendeurInfo.boutique.logo && !logoError;
  };

  //  Fonction pour obtenir l'URL du logo
  const getLogoUrl = () => {
    if (hasLogo()) {
      // Ajouter le domaine si l'URL est relative
      const logoUrl = vendeurInfo.boutique.logo;
      if (logoUrl.startsWith('/')) {
        return `http://localhost:8000${logoUrl}`;
      }
      return logoUrl;
    }
    return null;
  };

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      icon: Home,
      label: 'Dashboard',
      active: currentPage === 'dashboard',
      onClick: () => console.log('Navigate to Dashboard')
    },
    {
      id: 'orders',
      icon: ShoppingCart,
      label: 'Commandes',
      active: ['orders', 'all-orders', 'today-orders', 'order-tracking', 'archives'].includes(currentPage),
      expandable: true, 
      expanded: expandedMenus.orders, 
      submenu: [
        {
          id: 'all-orders',
          label: 'Toutes les commandes',
          active: currentPage === 'all-orders' || currentPage === 'orders',
          onClick: () => navigate('/commandes') 
        },
        {
          id: 'today-orders',
          label: 'Commandes du jour',
          active: currentPage === 'today-orders',
          onClick: () => navigate('/today-orders')
        },
        {
          id: 'order-tracking',
          label: 'Historique global',
          active: currentPage === 'order-tracking',
          onClick: () => navigate('/orders/history')  //  Vers la nouvelle page d'historique
        },
        {
          id: 'archives',
          label: 'Archives',
          active: currentPage === 'archives',
          onClick: () => navigate('/orders/archives')  //  Vers la page d'archives
        }
      ]
    },
    {
      id: 'products',
      icon: Package,
      label: 'Products',
      active: currentPage === 'products',
      expandable: true,
      expanded: expandedMenus.products,
      submenu: [
        {
          id: 'all-products',
          // label: 'All Products',
          // active: true,
          // onClick: () => console.log('Navigate to All Products')
          label: 'Tous les produits',
          active: currentPage === 'products',
          onClick: () => navigate('/products')
        },
        {
          id: 'add-product',
          label: 'Ajouter produit',
          onClick: onAddProductClick
        },
        {
          id: 'categories',
          label: 'Catégories',
          onClick: () => console.log('Navigate to Categories')
        }
      ]
    },
    {
      id: 'stock',
      icon: Warehouse,
      label: 'Gestion Stock',
      active: ['stock', 'stock-dashboard', 'stock-history', 'stock-report', 'stock-notifications'].includes(currentPage),
      expandable: true,
      expanded: expandedMenus.stock,
      submenu: [
        {
          id: 'stock-dashboard',
          label: 'Dashboard Stock',
          active: currentPage === 'stock' || currentPage === 'stock-dashboard',
          onClick: () => navigate('/stock')
        },
        {
          id: 'stock-history',
          label: 'Historique mouvements',
          active: currentPage === 'stock-history',
          onClick: () => navigate('/stock/historique')
        },
        {
          id: 'stock-report',
          label: 'Rapports',
          active: currentPage === 'stock-report',
          onClick: () => navigate('/stock/rapport')
        },
        {
          id: 'stock-notifications',
          label: 'Notifications',
          active: currentPage === 'stock-notifications',
          onClick: () => navigate('/stock/notifications')
        }
      ]
    },
    {
      id: 'client',
      icon: User,
      label: 'Vue Client',
      active: currentPage === 'client',
      onClick: () => navigate('/client')
    },
    {
      id: 'chats',
      icon: MessageCircle,
      label: 'Messages',
      active: currentPage === 'chats',
      badge: '3',
      onClick: () => console.log('Navigate to Chats')
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
      active: currentPage === 'analytics',
      onClick: () => console.log('Navigate to Analytics')
    },
    {
      id: 'promotions',
      icon: Tag,
      label: 'Promotions',
      active: currentPage === 'promotions',
      onClick: () => console.log('Navigate to Promotions')
    },
    {
      id: 'settings',
      icon: Settings, // Assure-toi d'importer "Settings" de lucide-react
      label: 'Settings',
      active: currentPage === 'settings',
      onClick: () => window.location.href = '/settings'
    }

  ];

  const sidebarStyles = {
    container: {
      display: 'flex',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px',
      height: '100vh',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      borderRight: `1px solid ${theme.colors.gray[200]}`,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 10
    },
    header: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${theme.colors.gray[200]}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
      color: theme.colors.gray[800]
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm
    },
    logoIcon: {
      width: '30px',
      height: '30px',
      color: theme.colors.primary
    },
    logoText: {
      fontSize: '18px',
      fontWeight: '600',
      margin: 0,
      color: theme.colors.gray[800]
    },
    subtitle: {
      fontSize: '12px',
      fontWeight: '500',
      color: theme.colors.gray[500],
      marginTop: theme.spacing.xs
    },
    nav: {
      flex: 1,
      padding: `${theme.spacing.md} 0`,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    },
    sectionTitle: {
      fontSize: '11px',
      fontWeight: '600',
      color: theme.colors.gray[400],
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      marginBottom: theme.spacing.md,
      paddingLeft: theme.spacing.xl
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      margin: `0 ${theme.spacing.md} 2px ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.lg,
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '14px',
      fontWeight: '500',
      position: 'relative',
      border: '1px solid transparent'
    },
    menuItemContent: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md
    },
    menuItemRight: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm
    },
    badge: {
      backgroundColor: theme.colors.danger,
      color: theme.colors.white,
      fontSize: '10px',
      fontWeight: '600',
      padding: '3px 7px',
      borderRadius: '12px',
      minWidth: '18px',
      textAlign: 'center'
    },
    submenu: {
      marginTop: theme.spacing.xs,
      marginLeft: theme.spacing.xxl,
      paddingLeft: theme.spacing.md,
      borderLeft: `2px solid ${theme.colors.gray[100]}`,
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },
    submenuItem: {
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      margin: `2px 0`,
      transition: 'all 0.2s ease',
      position: 'relative'
    },
    bottomSection: {
      borderTop: `1px solid ${theme.colors.gray[100]}`,
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      backgroundColor: theme.colors.gray[50],
      flexShrink: 0
    },
    userCard: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.gray[100]}`,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.colors.white,
      fontWeight: '600',
      fontSize: '13px',
      overflow: 'hidden',
      border: `2px solid ${theme.colors.gray[200]}`
    },
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%'
    },
    userDetails: {
      flex: 1
    },
    userName: {
      fontSize: '14px',
      fontWeight: '600',
      color: theme.colors.gray[800],
      margin: 0
    },
    userRole: {
      fontSize: '12px',
      color: theme.colors.gray[500],
      margin: 0
    },
    statusIndicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: vendeurInfo?.boutique?.est_approuve ? theme.colors.success : theme.colors.warning
    },
    //  Nouveau style pour l'état de chargement
    loadingCard: {
      marginTop: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.xl,
      border: `1px solid ${theme.colors.gray[100]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60px'
    },
    loadingText: {
      fontSize: '12px',
      color: theme.colors.gray[500]
    }
  };

  const IshriliIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="40" 
      height="40" 
      viewBox="0 0 200 200" 
      fill="linear-gradient(135deg, rgb(102, 126, 234) 0%, rgb(118, 75, 162) 100%);"
    >
      <circle cx="100" cy="40" r="15" />
      <path d="M109.6,164.7c-5.9,6.3-15.9,7.7-22.8,2.8c-8.3-5.9-10.7-18.6-4.4-35.3c4.7-12.6,11.6-24.9,13.5-31.8 
               c2.2-7.9,0.7-13.6-4-17.2c-4.4-3.3-11.4-4.2-18.1-3.2c-5.7,0.9-9.4-2.2-9.6-7c-0.2-4.7,3.3-8.8,7.9-9.2
               c10.2-0.8,25.1-0.8,34.6,9.1c10.6,10.9,10.3,25.1,5.8,39.3c-2.4,7.4-5.9,15.3-8.4,22.2c-2.9,7.9-3.1,14.1,1.3,16.6
               c3.5,2,9.7,1.6,13.8-2.7C121.1,151.3,115.6,158.2,109.6,164.7z"/>
    </svg>
  );

  return (
    <div style={sidebarStyles.container}>
      <div style={sidebarStyles.sidebar}>
        {/* Header */}
        <div style={sidebarStyles.header}>
          <div style={sidebarStyles.logo}>
            <IshriliIcon />
            <h1 style={sidebarStyles.logoText}>Ishrili E-Commerce</h1>
          </div>
          <p style={sidebarStyles.subtitle}>
            {vendeurInfo?.boutique?.nom_boutique || 'Vendor Dashboard'}
          </p>
        </div>

        {/* Navigation */}
        <nav style={sidebarStyles.nav}>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            <div style={sidebarStyles.sectionTitle}>Main Menu</div>
            
            {menuItems.map(item => {
              const IconComponent = item.icon;
              const isActive = item.active;
              
              return (
                <div key={item.id}>
                  <div
                    style={{
                      ...sidebarStyles.menuItem,
                      backgroundColor: isActive ? theme.colors.primary : 'transparent',
                      color: isActive ? theme.colors.white : theme.colors.gray[600],
                      fontWeight: isActive ? '600' : '500',
                      transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                      boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
                    }}
                    onClick={() => {
                      if (item.expandable) {
                        toggleMenu(item.id);
                      } else if (item.onClick) {
                        item.onClick();
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                        e.currentTarget.style.transform = 'translateX(2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    <div style={sidebarStyles.menuItemContent}>
                      <IconComponent size={18} />
                      <span>{item.label}</span>
                    </div>

                    <div style={sidebarStyles.menuItemRight}>
                      {item.badge && (
                        <span style={sidebarStyles.badge}>{item.badge}</span>
                      )}
                      {item.expandable && (
                        item.expanded ? 
                          <ChevronDown size={14} /> : 
                          <ChevronRight size={14} />
                      )}
                    </div>
                  </div>

                  {item.expandable && item.expanded && item.submenu && (
                    <div style={sidebarStyles.submenu}>
                      {item.submenu.map(subItem => (
                        <div
                          key={subItem.id}
                          style={{
                            ...sidebarStyles.submenuItem,
                            color: subItem.active ? theme.colors.primary : theme.colors.gray[500],
                            backgroundColor: subItem.active ? `${theme.colors.primary}15` : 'transparent',
                            fontWeight: subItem.active ? '600' : '500'
                          }}
                          onClick={subItem.onClick}
                          onMouseEnter={(e) => {
                            if (!subItem.active) {
                              e.currentTarget.style.backgroundColor = theme.colors.gray[50];
                              e.currentTarget.style.color = theme.colors.gray[700];
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!subItem.active) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = theme.colors.gray[500];
                            }
                          }}
                        >
                          {subItem.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div style={sidebarStyles.bottomSection}>
          {/*  User Card avec données réelles */}
          {loading ? (
            <div style={sidebarStyles.loadingCard}>
              <div style={sidebarStyles.loadingText}>Chargement...</div>
            </div>
          ) : error ? (
            <div style={sidebarStyles.loadingCard}>
              <div style={{ ...sidebarStyles.loadingText, color: theme.colors.danger }}>
                Erreur de chargement
              </div>
            </div>
          ) : (
            <div style={sidebarStyles.userCard}>
              <div style={sidebarStyles.userInfo}>
                <div style={{
                  ...sidebarStyles.avatar,
                  //  Supprimer le background coloré quand on affiche un logo
                  background: hasLogo() ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: hasLogo() ? `2px solid ${theme.colors.gray[200]}` : 'none'
                }}>
                  {/*  Afficher le logo s'il existe, sinon les initiales */}
                  {hasLogo() ? (
                    <img 
                      src={getLogoUrl()} 
                      alt="Logo boutique"
                      style={sidebarStyles.logoImage}
                      onError={() => setLogoError(true)}
                    />
                  ) : (
                    getInitials()
                  )}
                </div>
                <div style={sidebarStyles.userDetails}>
                  {/*  Nom de la boutique en haut */}
                  <div style={sidebarStyles.userName}>{getBoutiqueName()}</div>
                  {/*  Nom du vendeur avec rôle en bas */}
                  <div style={sidebarStyles.userRole}>{getVendeurNameWithRole()}</div>
                </div>
                <div style={sidebarStyles.statusIndicator} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        backgroundColor: theme.colors.gray[50], 
        marginLeft: '230px',
        height: '100vh',
        padding: '24px'
      }}>
        {children}
      </div>
    </div>
  );
};

export default ModernSidebar;