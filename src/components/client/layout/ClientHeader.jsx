// src/components/client/layout/ClientHeader.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';
import FavoritesCounter from '../common/FavoritesCounter';
import FavoritesDropdown from '../common/FavoritesDropdown';

const ClientHeader = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesDropdownOpen, setIsFavoritesDropdownOpen] = useState(false);
  
  const favoritesButtonRef = useRef(null);
  const { getFavoritesCount } = useFavoritesContext();

  // Composant d'icônes SVG
  const Icons = {
    Home: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    Package: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    Folder: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
    Heart: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    FileText: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    Search: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    Settings: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
    BarChart: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
    Zap: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
      </svg>
    )
  };

  const menuItems = [
    { id: 'home', label: 'Accueil', path: '/', icon: <Icons.Home /> },
    { id: 'products', label: 'Produits', path: '/produits', icon: <Icons.Package /> },
    { id: 'categories', label: 'Catégories', path: '/categories', icon: <Icons.Folder /> },
    { id: 'favorites', label: 'Favoris', path: '/favoris', icon: <Icons.Heart /> },
    { id: 'cart', label: 'Panier', path: '/panier', icon: <Icons.ShoppingCart />, badge: 3 },
    { id: 'orders', label: 'Mes Commandes', path: '/mes-commandes', icon: <Icons.FileText /> }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleFavoritesDropdown = () => {
    setIsFavoritesDropdownOpen(!isFavoritesDropdownOpen);
  };

  const closeFavoritesDropdown = () => {
    setIsFavoritesDropdownOpen(false);
  };

  // Styles modernes
  const styles = {
    header: {
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #f1f5f9'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px'
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '80px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer'
    },
    logoIcon: {
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      padding: '10px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '800',
      margin: 0,
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    searchForm: {
      flex: 1,
      maxWidth: '500px',
      margin: '0 32px',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '14px 50px 14px 20px',
      borderRadius: '12px',
      border: '2px solid #e2e8f0',
      fontSize: '15px',
      outline: 'none',
      backgroundColor: '#ffffff',
      transition: 'all 0.3s ease',
      color: '#1e293b',
      fontFamily: 'inherit'
    },
    searchButton: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    },
    userActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    adminButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '13px',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600'
    },
    favoriteButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      color: currentPage === 'favorites' ? '#ec4899' : '#64748b',
      position: 'relative'
    },
    cartButton: {
      position: 'relative',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '10px',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
      color: currentPage === 'cart' ? '#a855f7' : '#64748b'
    },
    dashboardButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      background: currentPage === 'dashboard' ? 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: `1px solid ${currentPage === 'dashboard' ? '#e879f9' : '#e2e8f0'}`,
      borderRadius: '10px',
      fontSize: '13px',
      color: currentPage === 'dashboard' ? '#a855f7' : '#475569',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600'
    },
    profileButton: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '700',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid #ffffff',
      boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
    },
    badge: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '10px',
      minWidth: '18px',
      textAlign: 'center',
      border: '2px solid #ffffff'
    },
    navigation: {
      borderTop: '1px solid #f1f5f9',
      paddingTop: '16px',
      paddingBottom: '16px'
    },
    navList: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto'
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      whiteSpace: 'nowrap',
      position: 'relative'
    },
    navItemActive: {
      background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
      color: '#a855f7',
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.15)'
    },
    navItemInactive: {
      color: '#64748b'
    },
    navBadge: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      fontSize: '10px',
      fontWeight: '700',
      padding: '2px 6px',
      borderRadius: '10px',
      minWidth: '18px',
      textAlign: 'center',
      marginLeft: '4px'
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Barre principale */}
        <div style={styles.topBar}>
          {/* Logo */}
          <div 
            style={styles.logo}
            onClick={() => navigate('/')}
          >
            <div style={styles.logoIcon}>
              <Icons.Zap />
            </div>
            <h1 style={styles.logoText}>
              E-Commerce
            </h1>
          </div>

          {/* Barre de recherche */}
          <form 
            onSubmit={handleSearch}
            style={styles.searchForm}
          >
            <input
              type="search"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => {
                e.target.style.borderColor = '#a855f7';
                e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              style={styles.searchButton}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                e.target.style.transform = 'translateY(-50%) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                e.target.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <Icons.Search />
            </button>
          </form>

          {/* Actions utilisateur */}
          <div style={styles.userActions}>
            {/* Bouton Dashboard Admin */}
            <button
              onClick={() => navigate('/dashboard')}
              style={styles.adminButton}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Icons.Settings />
              Admin
            </button>

            {/* Favoris avec dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                ref={favoritesButtonRef}
                onClick={toggleFavoritesDropdown}
                style={styles.favoriteButton}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FavoritesCounter 
                  showCounter={true} 
                  iconSize={20}
                  className="transition-colors duration-200"
                />
              </button>
              
              <FavoritesDropdown
                isOpen={isFavoritesDropdownOpen}
                onClose={closeFavoritesDropdown}
                triggerRef={favoritesButtonRef}
              />
            </div>

            {/* Panier */}
            <button
              onClick={() => navigate('/panier')}
              style={styles.cartButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <Icons.ShoppingCart />
              <span style={styles.badge}>
                
              </span>
            </button>

            {/* Dashboard Client */}
            <button
              onClick={() => navigate('/client-dashboard')}
              style={styles.dashboardButton}
              onMouseEnter={(e) => {
                if (currentPage !== 'dashboard') {
                  e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'dashboard') {
                  e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <Icons.BarChart />
              Dashboard
            </button>

            {/* Profil */}
            <div 
              style={styles.profileButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08)';
                e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                e.target.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
              }}
              onClick={() => navigate('/client-dashboard')}
            >
              JD
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav style={styles.navigation}>
          <div style={styles.navList}>
            {menuItems.slice(0, -2).map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.navItem,
                  ...(currentPage === item.id ? styles.navItemActive : styles.navItemInactive)
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.backgroundColor = '#f8fafc';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
                
                {/* Badge pour favoris avec compteur dynamique */}
                {item.id === 'favorites' && getFavoritesCount() > 0 && (
                  <span style={styles.navBadge}>
                    {getFavoritesCount()}
                  </span>
                )}
                
                {/* Badge pour autres items */}
                {item.badge && item.id !== 'favorites' && (
                  <span style={styles.navBadge}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ClientHeader;