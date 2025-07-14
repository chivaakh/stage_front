{/* CSS pour le placeholder visible */}
              <style>{`
                input::placeholder {
                  color: #64748b !important;
                  opacity: 1 !important;
                }
                input::-webkit-input-placeholder {
                  color: #64748b !important;
                }
                input::-moz-placeholder {
                  color: #64748b !important;
                  opacity: 1 !important;
                }
                input:-ms-input-placeholder {
                  color: #64748b !important;
                }
              `}</style>  // Fonction pour obtenir l'icône et la couleur d'une catégorie
  const getCategoryStyle = (categoryName, index) => {
    const name = categoryName.toLowerCase();
    
    // Assignation basée sur le nom
    if (name.includes('électronique') || name.includes('electronique') || name.includes('tech')) {
      return { bg: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)', icon: <Icons.Smartphone /> };
    }
    if (name.includes('vêtement') || name.includes('vetement') || name.includes('mode') || name.includes('textile')) {
      return { bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', icon: <Icons.ShirtIcon /> };
    }
    if (name.includes('maison') || name.includes('jardin') || name.includes('déco') || name.includes('deco')) {
      return { bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', icon: <Icons.HomeIcon /> };
    }
    if (name.includes('sport') || name.includes('loisir') || name.includes('fitness')) {
      return { bg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', icon: <Icons.Activity /> };
    }
    if (name.includes('livre') || name.includes('éducation') || name.includes('education')) {
      return { bg: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', icon: <Icons.BookOpen /> };
    }
    if (name.includes('beauté') || name.includes('beaute') || name.includes('santé') || name.includes('sante') || name.includes('cosmétique')) {
      return { bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', icon: <Icons.Heart /> };
    }
    if (name.includes('alimentaire') || name.includes('nourriture') || name.includes('cuisine')) {
      return { bg: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)', icon: <Icons.Apple /> };
    }
    if (name.includes('automobile') || name.includes('voiture') || name.includes('auto')) {
      return { bg: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)', icon: <Icons.Car /> };
    }
    if (name.includes('jouet') || name.includes('enfant') || name.includes('bébé') || name.includes('bebe')) {
      return { bg: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', icon: <Icons.Gift /> };
    }
    if (name.includes('bijou') || name.includes('accessoire')) {
      return { bg: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', icon: <Icons.Diamond /> };
    }
    
    // Fallback avec rotation de couleurs
    return categoryColors[index % categoryColors.length];
  };// src/pages/client/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { fetchCategories } from '../../api/clientAPI';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  // Composant d'icônes SVG
  const Icons = {
    Folder: () => (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
    Search: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    Grid: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
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
    Eye: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    Filter: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
      </svg>
    ),
    ArrowRight: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12,5 19,12 12,19"/>
      </svg>
    ),
    ShoppingBag: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    Home: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    SearchX: () => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <line x1="8.5" y1="8.5" x2="13.5" y2="13.5"/>
        <line x1="13.5" y1="8.5" x2="8.5" y2="13.5"/>
      </svg>
    ),
    Trash: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      </svg>
    ),
    // Icônes pour les catégories
    Smartphone: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    ShirtIcon: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
      </svg>
    ),
    HomeIcon: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    Activity: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    BookOpen: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
    Heart: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    Apple: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3a6 6 0 00-6 6v8a6 6 0 006 6h0a6 6 0 006-6V9a6 6 0 00-6-6z"/>
        <path d="M12 3c0-1.5 1.5-3 4-3"/>
      </svg>
    ),
    Car: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 21h8m-4-4v4m-4-4h8l-1-7H9l-1 7z"/>
        <path d="M7 17h10l-1-7H8l-1 7z"/>
      </svg>
    ),
    Gift: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,12 20,22 4,22 4,12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    Diamond: () => (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
        <path d="M11 3L8 9l4 13 4-13-3-6"/>
        <path d="M2 9h20"/>
      </svg>
    )
  };

  // Fonction qui charge les catégories
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      console.log('Categories response:', response);
      
      let categoriesData = [];
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          categoriesData = response.data.results;
        } else if (Array.isArray(response.data)) {
          categoriesData = response.data;
        }
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = Array.isArray(categories)
    ? categories.filter(category =>
        category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  const totalProduits = Array.isArray(categories)
    ? categories.reduce((sum, cat) => sum + (cat.nombre_produits || 0), 0)
    : 0;

  // Styles modernes
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    heroSection: {
      textAlign: 'center',
      marginBottom: '48px',
      padding: '48px 32px',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)',
      borderRadius: '16px',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    },
    heroContent: {
      position: 'relative',
      zIndex: 2
    },
    heroIcon: {
      width: '60px',
      height: '60px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px auto',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    heroTitle: {
      fontSize: '36px',
      fontWeight: '700',
      margin: '0 0 16px 0',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    heroSubtitle: {
      fontSize: '18px',
      margin: '0 auto 32px auto',
      opacity: 0.95,
      maxWidth: '600px',
      lineHeight: '1.6'
    },
    searchContainer: {
      maxWidth: '500px',
      margin: '0 auto',
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      padding: '16px 50px 16px 20px',
      borderRadius: '12px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      color: '#1e293b',
      transition: 'all 0.3s ease'
    },
    searchIcon: {
      position: 'absolute',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
      marginBottom: '48px'
    },
    statCard: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      transition: 'all 0.3s ease'
    },
    statNumber: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '8px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    statLabel: {
      fontSize: '14px',
      color: '#64748b',
      fontWeight: '500'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '48px'
    },
    categoryCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
    },
    categoryHeader: {
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      position: 'relative',
      color: '#ffffff'
    },
    categoryBadge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'rgba(255, 255, 255, 0.95)',
      color: '#1e293b',
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '11px',
      fontWeight: '600',
      backdropFilter: 'blur(10px)'
    },
    categoryContent: {
      padding: '20px'
    },
    categoryName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    categoryDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 16px 0',
      lineHeight: '1.5'
    },
    categoryFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    filterButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#475569',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500'
    },
    categoryArrow: {
      color: '#a855f7',
      transition: 'all 0.3s ease'
    },
    loadingCard: {
      height: '240px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    },
    shimmer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: 'shimmer 1.5s infinite'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 32px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '2px dashed #e2e8f0'
    },
    emptyIcon: {
      color: '#94a3b8',
      marginBottom: '16px'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    emptyDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 24px 0'
    },
    emptyButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    actionsSection: {
      marginTop: '64px',
      textAlign: 'center',
      padding: '48px 40px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      borderRadius: '16px',
      border: '1px solid #e2e8f0'
    },
    actionsTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    actionsDescription: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 32px 0',
      lineHeight: '1.6'
    },
    actionsButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    primaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.25)'
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      backgroundColor: 'transparent',
      color: '#a855f7',
      border: '2px solid #a855f7',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  // Animation CSS
  const shimmerKeyframes = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  // Palette de couleurs harmonieuse pour les catégories
  const categoryColors = [
    { bg: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)', icon: <Icons.Smartphone /> }, // Violet
    { bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', icon: <Icons.ShirtIcon /> }, // Vert
    { bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', icon: <Icons.HomeIcon /> }, // Orange
    { bg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', icon: <Icons.Activity /> }, // Rouge
    { bg: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', icon: <Icons.BookOpen /> }, // Violet clair
    { bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', icon: <Icons.Heart /> }, // Rose
    { bg: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)', icon: <Icons.Apple /> }, // Cyan
    { bg: 'linear-gradient(135deg, #84cc16 0%, #a3e635 100%)', icon: <Icons.Car /> }, // Vert lime
    { bg: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)', icon: <Icons.Gift /> }, // Orange foncé
    { bg: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', icon: <Icons.Diamond /> } // Indigo
  ];

  return (
    <ClientLayout currentPage="categories">
      <div style={styles.container}>
        <style>{shimmerKeyframes}</style>

        {/* Section Hero modernisée */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.heroIcon}>
              <Icons.Folder />
            </div>
            <h1 style={styles.heroTitle}>
              Toutes les Catégories
            </h1>
            <p style={styles.heroSubtitle}>
              Explorez notre large gamme de produits organisés par catégories pour trouver exactement ce que vous cherchez
            </p>

            {/* Barre de recherche modernisée */}
            <div style={styles.searchContainer}>
              <input
                type="search"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  ...styles.searchInput
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.borderColor = '#a855f7';
                  e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={styles.searchIcon}>
                <Icons.Search />
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques modernisées */}
        <div style={styles.statsGrid}>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={styles.statNumber}>
              {categories.length}
            </div>
            <div style={styles.statLabel}>
              Catégories Disponibles
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{...styles.statNumber, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {totalProduits.toLocaleString()}
            </div>
            <div style={styles.statLabel}>
              Produits au Total
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
            }}
          >
            <div style={{...styles.statNumber, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {filteredCategories.length}
            </div>
            <div style={styles.statLabel}>
              {searchTerm ? 'Résultats Trouvés' : 'Catégories Affichées'}
            </div>
          </div>
        </div>

        {/* Grille des catégories modernisée */}
        {loading ? (
          <div style={styles.categoriesGrid}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={styles.loadingCard}>
                <div style={styles.shimmer} />
              </div>
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div style={styles.categoriesGrid}>
            {filteredCategories.map((category, index) => {
              const colorScheme = categoryColors[index % categoryColors.length];
              
              return (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  style={styles.categoryCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                    const arrow = e.currentTarget.querySelector('.category-arrow');
                    if (arrow) arrow.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
                    const arrow = e.currentTarget.querySelector('.category-arrow');
                    if (arrow) arrow.style.transform = 'translateX(0)';
                  }}
                >
                  {/* En-tête coloré */}
                  <div style={{
                    ...styles.categoryHeader,
                    background: colorScheme.bg
                  }}>
                    {/* Badge nombre de produits */}
                    <div style={styles.categoryBadge}>
                      {category.nombre_produits || 0} produits
                    </div>
                  </div>

                  {/* Contenu */}
                  <div style={styles.categoryContent}>
                    <h3 style={styles.categoryName}>
                      {category.nom}
                    </h3>
                    <p style={styles.categoryDescription}>
                      {category.description || 'Découvrez tous les produits de cette catégorie'}
                    </p>
                    
                    <div style={styles.categoryFooter}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/produits?categorie=${category.id}`);
                        }}
                        style={styles.filterButton}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <Icons.Filter />
                        Filtrer
                      </button>
                      
                      <div className="category-arrow" style={styles.categoryArrow}>
                        <Icons.ArrowRight />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Icons.SearchX />
            </div>
            <h3 style={styles.emptyTitle}>
              Aucune catégorie trouvée
            </h3>
            <p style={styles.emptyDescription}>
              Essayez avec d'autres termes de recherche
            </p>
            <button
              onClick={() => setSearchTerm('')}
              style={styles.emptyButton}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <Icons.Trash />
              Effacer
            </button>
          </div>
        )}

        {/* Section d'actions modernisée */}
        <div style={styles.actionsSection}>
          <h2 style={styles.actionsTitle}>
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p style={styles.actionsDescription}>
            Parcourez notre catalogue complet ou retournez à l'accueil
          </p>
          <div style={styles.actionsButtons}>
            <button
              onClick={() => navigate('/produits')}
              style={styles.primaryButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.35)';
                e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(168, 85, 247, 0.25)';
                e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
              }}
            >
              <Icons.ShoppingBag />
              Voir Tous les Produits
            </button>
            <button
              onClick={() => navigate('/')}
              style={styles.secondaryButton}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#a855f7';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#a855f7';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <Icons.Home />
              Retour à l'Accueil
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CategoriesPage;