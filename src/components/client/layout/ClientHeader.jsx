// src/components/client/layout/ClientHeader.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavoritesContext } from '../../../contexts/FavoritesContext';
import FavoritesCounter from '../common/FavoritesCounter';
import FavoritesDropdown from '../common/FavoritesDropdown';
import { handleLogout } from '../../../utils/logout.js'; // 🔧 IMPORT DE LA FONCTION UNIVERSELLE

const ClientHeader = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavoritesDropdownOpen, setIsFavoritesDropdownOpen] = useState(false);
  
  // NOUVEAU : États pour les informations client
  const [clientInfo, setClientInfo] = useState({
    initiales: 'CL',
    nom_complet: 'Client Ishrili',
    email: '',
    loading: true
  });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const favoritesButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const { getFavoritesCount } = useFavoritesContext();

  // NOUVEAU : Récupérer les informations du client au montage
  useEffect(() => {
    fetchClientInfo();
  }, []);

  const fetchClientInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/client-info/', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setClientInfo({
          initiales: data.initiales || 'CL',
          nom_complet: data.nom_complet || 'Client Ishrili',
          email: data.email || '',
          type_utilisateur: data.type_utilisateur || 'client',
          est_verifie: data.est_verifie || false,
          loading: false
        });
      } else {
        // En cas d'erreur, utiliser les valeurs par défaut
        setClientInfo({
          initiales: 'CL',
          nom_complet: 'Client Ishrili',
          email: '',
          loading: false
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des infos client:', error);
      setClientInfo({
        initiales: 'CL',
        nom_complet: 'Client Ishrili',
        email: '',
        loading: false
      });
    }
  };

  // 🔧 FONCTION DE DÉCONNEXION SIMPLIFIÉE - UTILISE logout.js
  const logout = () => {
    handleLogout('/'); // Redirige vers la page d'accueil après déconnexion et nettoyage
  };

  // NOUVEAU : Gestion du dropdown profil
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileButtonRef.current && !profileButtonRef.current.contains(event.target)) {
        closeProfileDropdown();
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  // Composant SVG Ishrili
  const IshriliIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 200 200" 
      fill="white"
    >
      <circle cx="100" cy="40" r="15" fill="white" />
      <path d="M109.6,164.7c-5.9,6.3-15.9,7.7-22.8,2.8c-8.3-5.9-10.7-18.6-4.4-35.3c4.7-12.6,11.6-24.9,13.5-31.8 
               c2.2-7.9,0.7-13.6-4-17.2c-4.4-3.3-11.4-4.2-18.1-3.2c-5.7,0.9-9.4-2.2-9.6-7c-0.2-4.7,3.3-8.8,7.9-9.2
               c10.2-0.8,25.1-0.8,34.6,9.1c10.6,10.9,10.3,25.1,5.8,39.3c-2.4,7.4-5.9,15.3-8.4,22.2c-2.9,7.9-3.1,14.1,1.3,16.6
               c3.5,2,9.7,1.6,13.8-2.7C121.1,151.3,115.6,158.2,109.6,164.7z" fill="white"/>
    </svg>
  );

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
    BarChart: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
    LogOut: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16,17 21,12 16,7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    User: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    Settings: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
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

  // Styles modernes (styles existants + nouveaux styles pour le dropdown)
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
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 16px',
      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      fontSize: '13px',
      color: '#dc2626',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '600'
    },
    // NOUVEAU : Container pour le profil avec dropdown
    profileContainer: {
      position: 'relative',
      display: 'inline-block'
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
      boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
      userSelect: 'none'
    },
    // NOUVEAU : Styles pour le dropdown
    profileDropdown: {
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e2e8f0',
      minWidth: '280px',
      overflow: 'hidden',
      opacity: isProfileDropdownOpen ? 1 : 0,
      visibility: isProfileDropdownOpen ? 'visible' : 'hidden',
      transform: isProfileDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000
    },
    dropdownHeader: {
      padding: '20px 20px 16px',
      borderBottom: '1px solid #f1f5f9',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    },
    dropdownUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    dropdownAvatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '700',
      fontSize: '18px'
    },
    dropdownUserDetails: {
      flex: 1
    },
    dropdownUserName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 4px 0'
    },
    dropdownUserEmail: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0
    },
    dropdownUserBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 8px',
      background: clientInfo.est_verifie ? '#dcfce7' : '#fef3c7',
      color: clientInfo.est_verifie ? '#166534' : '#92400e',
      fontSize: '12px',
      fontWeight: '500',
      borderRadius: '6px',
      marginTop: '4px'
    },
    dropdownBody: {
      padding: '8px'
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      color: '#475569',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left'
    },
    dropdownItemHover: {
      background: '#f8fafc',
      color: '#1e293b'
    },
    dropdownSeparator: {
      height: '1px',
      background: '#f1f5f9',
      margin: '8px 16px'
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
              <IshriliIcon />
            </div>
            <h1 style={styles.logoText}>
              Ishrili E-Commerce
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

            {/* 🔧 BOUTON DÉCONNEXION SIMPLIFIÉ - UTILISE logout.js */}
            <button
              onClick={logout} // 🔧 UTILISE LA FONCTION UNIVERSELLE
              style={styles.logoutButton}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.color = '#b91c1c';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.color = '#dc2626';
              }}
            >
              <Icons.LogOut />
              Déconnexion
            </button>

            {/* NOUVEAU : Profil avec dropdown */}
            <div 
              style={styles.profileContainer}
              ref={profileButtonRef}
            >
              <div 
                style={styles.profileButton}
                onMouseEnter={(e) => {
                  if (!isProfileDropdownOpen) {
                    e.target.style.transform = 'scale(1.08)';
                    e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                    e.target.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.4)';
                    setIsProfileDropdownOpen(true);
                  }
                }}
                onMouseLeave={(e) => {
                  // Le dropdown se fermera via l'effet useEffect
                  setTimeout(() => {
                    if (!profileButtonRef.current?.matches(':hover') && 
                        !document.querySelector('[data-dropdown="profile"]:hover')) {
                      setIsProfileDropdownOpen(false);
                      e.target.style.transform = 'scale(1)';
                      e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                      e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.3)';
                    }
                  }, 100);
                }}
                onClick={toggleProfileDropdown}
              >
                {clientInfo.loading ? '...' : clientInfo.initiales}
              </div>
              
              {/* NOUVEAU : Dropdown profil */}
              <div 
                style={styles.profileDropdown}
                data-dropdown="profile"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => {
                  setTimeout(() => {
                    setIsProfileDropdownOpen(false);
                  }, 100);
                }}
              >
                {/* Header du dropdown */}
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownUserInfo}>
                    <div style={styles.dropdownAvatar}>
                      {clientInfo.initiales}
                    </div>
                    <div style={styles.dropdownUserDetails}>
                      <h4 style={styles.dropdownUserName}>
                        {clientInfo.nom_complet}
                      </h4>
                      <p style={styles.dropdownUserEmail}>
                        {clientInfo.email || 'Client Ishrili'}
                      </p>
                      <span style={styles.dropdownUserBadge}>
                        {clientInfo.est_verifie ? '✓ Vérifié' : '⏳ En attente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Corps du dropdown */}
                <div style={styles.dropdownBody}>
                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate('/client-dashboard');
                      setIsProfileDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = styles.dropdownItemHover.background;
                      e.target.style.color = styles.dropdownItemHover.color;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#475569';
                    }}
                  >
                    <Icons.BarChart />
                    Mon Dashboard
                  </button>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate('/mon-profil');
                      setIsProfileDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = styles.dropdownItemHover.background;
                      e.target.style.color = styles.dropdownItemHover.color;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#475569';
                    }}
                  >
                    <Icons.User />
                    Mon Profil
                  </button>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate('/mes-commandes');
                      setIsProfileDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = styles.dropdownItemHover.background;
                      e.target.style.color = styles.dropdownItemHover.color;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#475569';
                    }}
                  >
                    <Icons.FileText />
                    Mes Commandes
                  </button>

                  <button
                    style={styles.dropdownItem}
                    onClick={() => {
                      navigate('/parametres');
                      setIsProfileDropdownOpen(false);
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = styles.dropdownItemHover.background;
                      e.target.style.color = styles.dropdownItemHover.color;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#475569';
                    }}
                  >
                    <Icons.Settings />
                    Paramètres
                  </button>

                  <div style={styles.dropdownSeparator}></div>

                  {/* 🔧 ITEM DE DÉCONNEXION DANS LE DROPDOWN - UTILISE logout.js */}
                  <button
                    style={{
                      ...styles.dropdownItem,
                      color: '#dc2626'
                    }}
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      logout(); // 🔧 UTILISE LA FONCTION UNIVERSELLE
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#fef2f2';
                      e.target.style.color = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#dc2626';
                    }}
                  >
                    <Icons.LogOut />
                    Se déconnecter
                  </button>
                </div>
              </div>
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