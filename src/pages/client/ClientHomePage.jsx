// src/pages/client/ClientHomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { fetchCategories, fetchNouveautes, fetchPopulaires, ajouterProduitAuPanier } from '../../api/clientAPI';
import { theme } from '../../styles/theme';

const ClientHomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [nouveautes, setNouveautes] = useState([]);
  const [populaires, setPopulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, nouveautesRes, populairesRes] = await Promise.all([
        fetchCategories().catch(() => ({ data: { results: [] } })),
        fetchNouveautes().catch(() => ({ data: { results: [] } })),
        fetchPopulaires().catch(() => ({ data: { results: [] } }))
      ]);

      // ✅ CORRECTION: Gérer le format {count: X, results: [...]}
      
      // Catégories
      let categoriesData = [];
      if (categoriesRes.data) {
        if (categoriesRes.data.results && Array.isArray(categoriesRes.data.results)) {
          categoriesData = categoriesRes.data.results;
        } else if (Array.isArray(categoriesRes.data)) {
          categoriesData = categoriesRes.data;
        }
      }
      setCategories(categoriesData.slice(0, 6));

      // Nouveautés
      let nouveautesData = [];
      if (nouveautesRes.data) {
        if (nouveautesRes.data.results && Array.isArray(nouveautesRes.data.results)) {
          nouveautesData = nouveautesRes.data.results;
        } else if (Array.isArray(nouveautesRes.data)) {
          nouveautesData = nouveautesRes.data;
        }
      }
      setNouveautes(nouveautesData.slice(0, 8));

      // Populaires
      let populairesData = [];
      if (populairesRes.data) {
        if (populairesRes.data.results && Array.isArray(populairesRes.data.results)) {
          populairesData = populairesRes.data.results;
        } else if (Array.isArray(populairesRes.data)) {
          populairesData = populairesRes.data;
        }
      }
      setPopulaires(populairesData.slice(0, 8));

    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Définir des valeurs par défaut en cas d'erreur
      setCategories([]);
      setNouveautes([]);
      setPopulaires([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (produitId) => {
    setAddingToCart(prev => new Set(prev).add(produitId));
    
    try {
      await ajouterProduitAuPanier(produitId, 1);
      // Rediriger vers le panier après ajout réussi
      navigate('/panier');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
    }
  };

  // Composant d'icônes SVG
  const Icons = {
    ShoppingBag: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    Folder: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
    BarChart: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
    Smartphone: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    ShirtIcon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
      </svg>
    ),
    Home: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    Activity: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    BookOpen: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
    Heart: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    Apple: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3a6 6 0 00-6 6v8a6 6 0 006 6h0a6 6 0 006-6V9a6 6 0 00-6-6z"/>
        <path d="M12 3c0-1.5 1.5-3 4-3"/>
      </svg>
    ),
    Car: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 21h8m-4-4v4m-4-4h8l-1-7H9l-1 7z"/>
        <path d="M7 17h10l-1-7H8l-1 7z"/>
      </svg>
    ),
    Gift: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20,12 20,22 4,22 4,12"/>
        <rect x="2" y="7" width="20" height="5"/>
        <line x1="12" y1="22" x2="12" y2="7"/>
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    Diamond: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
        <path d="M11 3L8 9l4 13 4-13-3-6"/>
        <path d="M2 9h20"/>
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
    ShoppingCart: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
    ),
    Loader: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    Search: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    Star: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    )
  };

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
      padding: '100px 24px',
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
      fontSize: '56px',
      fontWeight: '800',
      margin: '0 0 32px 0',
      lineHeight: '1.1',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    heroSubtitle: {
      fontSize: '22px',
      margin: '0 auto 48px auto',
      opacity: 0.95,
      maxWidth: '700px',
      lineHeight: '1.6',
      fontWeight: '400'
    },
    heroButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
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
      boxShadow: '0 4px 12px rgba(168, 85, 247, 0.4)',
      gap: '8px'
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      color: '#ffffff',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      backdropFilter: 'blur(10px)',
      gap: '8px'
    },
    section: {
      padding: '80px 24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '64px'
    },
    sectionTitle: {
      fontSize: '42px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 20px 0',
      position: 'relative'
    },
    sectionSubtitle: {
      fontSize: '20px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.6',
      fontWeight: '400'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '32px'
    },
    categoryCard: {
      backgroundColor: '#ffffff',
      padding: '40px 32px',
      borderRadius: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      position: 'relative',
      overflow: 'hidden'
    },
    categoryIconContainer: {
      width: '80px',
      height: '80px',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px auto',
      color: '#a855f7',
      transition: 'all 0.3s ease'
    },
    categoryName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0'
    },
    categoryDescription: {
      fontSize: '15px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.5'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '32px'
    },
    productCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      position: 'relative'
    },
    productImage: {
      height: '220px',
      backgroundColor: '#f8fafc',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#94a3b8',
      position: 'relative',
      overflow: 'hidden'
    },
    productContent: {
      padding: '24px'
    },
    productName: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 12px 0',
      lineHeight: '1.4'
    },
    productDescription: {
      fontSize: '15px',
      color: '#64748b',
      margin: '0 0 20px 0',
      lineHeight: '1.5',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    productFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    productPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    priceMain: {
      fontSize: '20px',
      fontWeight: '800',
      color: '#a855f7'
    },
    priceRange: {
      fontSize: '16px',
      color: '#64748b',
      fontWeight: '500'
    },
    addToCartButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      boxShadow: '0 2px 8px rgba(168, 85, 247, 0.3)'
    },
    emptyState: {
      textAlign: 'center',
      padding: '80px 24px',
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
      fontSize: '18px',
      color: '#64748b',
      margin: '0 0 32px 0',
      lineHeight: '1.6'
    },
    loadingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '32px'
    },
    loadingCard: {
      height: '240px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden'
    },
    loadingProductGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '32px'
    },
    loadingProductCard: {
      height: '400px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
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
    badge: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600'
    }
  };

  // Animation CSS pour le shimmer
  const shimmerKeyframes = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  // Section Hero
  const HeroSection = () => (
    <section style={styles.heroSection}>
      <style>{shimmerKeyframes}</style>
      <div style={styles.heroContainer}>
        <h1 style={styles.heroTitle}>
          Découvrez nos Produits Exceptionnels
        </h1>
        <p style={styles.heroSubtitle}>
          Une collection unique de produits soigneusement sélectionnés pour vous offrir le meilleur de l'e-commerce moderne
        </p>
        <div style={styles.heroButtons}>
          <button
            onClick={() => navigate('/produits')}
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(168, 85, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.4)';
            }}
          >
            <Icons.ShoppingBag />
            Parcourir le Catalogue
          </button>
          <button
            onClick={() => navigate('/categories')}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            <Icons.Folder />
            Explorer les Catégories
          </button>
          <button
            onClick={() => navigate('/client-dashboard')}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            <Icons.BarChart />
            Mon Dashboard
          </button>
        </div>
      </div>
    </section>
  );

  // Section Catégories
  const CategoriesSection = () => (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          Nos Catégories
        </h2>
        <p style={styles.sectionSubtitle}>
          Explorez notre large gamme de produits organisés par catégories
        </p>
      </div>

      {loading ? (
        <div style={styles.loadingGrid}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={styles.loadingCard}>
              <div style={styles.shimmer} />
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.categoriesGrid}>
          {categories.length > 0 ? categories.map(category => {
            // Fonction pour obtenir l'icône basée sur le nom de la catégorie
            const getCategoryIcon = (categoryName) => {
              const name = categoryName.toLowerCase();
              if (name.includes('électronique') || name.includes('electronique') || name.includes('tech')) return <Icons.Smartphone />;
              if (name.includes('vêtement') || name.includes('vetement') || name.includes('mode') || name.includes('textile')) return <Icons.ShirtIcon />;
              if (name.includes('maison') || name.includes('jardin') || name.includes('déco') || name.includes('deco')) return <Icons.Home />;
              if (name.includes('sport') || name.includes('loisir') || name.includes('fitness')) return <Icons.Activity />;
              if (name.includes('livre') || name.includes('éducation') || name.includes('education')) return <Icons.BookOpen />;
              if (name.includes('beauté') || name.includes('beaute') || name.includes('santé') || name.includes('sante') || name.includes('cosmétique')) return <Icons.Heart />;
              if (name.includes('alimentaire') || name.includes('nourriture') || name.includes('cuisine')) return <Icons.Apple />;
              if (name.includes('automobile') || name.includes('voiture') || name.includes('auto')) return <Icons.Car />;
              if (name.includes('jouet') || name.includes('enfant') || name.includes('bébé') || name.includes('bebe')) return <Icons.Gift />;
              if (name.includes('bijou') || name.includes('accessoire')) return <Icons.Diamond />;
              return <Icons.Package />;
            };

            return (
              <div
                key={category.id}
                onClick={() => navigate(`/categories/${category.id}`)}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  const iconContainer = e.currentTarget.querySelector('.category-icon');
                  if (iconContainer) {
                    iconContainer.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                    iconContainer.style.color = '#ffffff';
                    iconContainer.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  const iconContainer = e.currentTarget.querySelector('.category-icon');
                  if (iconContainer) {
                    iconContainer.style.background = 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)';
                    iconContainer.style.color = '#a855f7';
                    iconContainer.style.transform = 'scale(1)';
                  }
                }}
              >
                <div className="category-icon" style={styles.categoryIconContainer}>
                  {getCategoryIcon(category.nom)}
                </div>
                <h3 style={styles.categoryName}>
                  {category.nom}
                </h3>
                <p style={styles.categoryDescription}>
                  {category.description || 'Découvrez cette catégorie'}
                </p>
              </div>
            );
          }) : (
            // Catégories par défaut si pas de données
            [
              { id: 1, nom: 'Électronique', icon: <Icons.Smartphone /> },
              { id: 2, nom: 'Vêtements', icon: <Icons.ShirtIcon /> },
              { id: 3, nom: 'Maison & Jardin', icon: <Icons.Home /> },
              { id: 4, nom: 'Sport & Loisirs', icon: <Icons.Activity /> },
              { id: 5, nom: 'Livres', icon: <Icons.BookOpen /> },
              { id: 6, nom: 'Beauté & Santé', icon: <Icons.Heart /> }
            ].map(category => (
              <div
                key={category.id}
                onClick={() => navigate(`/categories/${category.id}`)}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-12px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  const iconContainer = e.currentTarget.querySelector('.category-icon');
                  if (iconContainer) {
                    iconContainer.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                    iconContainer.style.color = '#ffffff';
                    iconContainer.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  const iconContainer = e.currentTarget.querySelector('.category-icon');
                  if (iconContainer) {
                    iconContainer.style.background = 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)';
                    iconContainer.style.color = '#a855f7';
                    iconContainer.style.transform = 'scale(1)';
                  }
                }}
              >
                <div className="category-icon" style={styles.categoryIconContainer}>
                  {category.icon}
                </div>
                <h3 style={styles.categoryName}>
                  {category.nom}
                </h3>
                <p style={styles.categoryDescription}>
                  Découvrez cette catégorie
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );

  // Section Produits (réutilisable)
  const ProductsSection = ({ title, products, emptyMessage }) => (
    <section style={{ ...styles.section, backgroundColor: '#ffffff', borderRadius: '24px', margin: '40px auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)' }}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          {title}
        </h2>
        <p style={styles.sectionSubtitle}>
          {emptyMessage}
        </p>
      </div>

      {loading ? (
        <div style={styles.loadingProductGrid}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={styles.loadingProductCard}>
              <div style={styles.shimmer} />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div style={styles.productsGrid}>
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/produits/${product.id}`)}
              style={styles.productCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Badge Nouveau/Populaire */}
              {title.includes('Nouveautés') && (
                <div style={{ ...styles.badge, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  Nouveau
                </div>
              )}
              {title.includes('Populaires') && (
                <div style={{ ...styles.badge, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icons.Star />
                  Top
                </div>
              )}
              
              <div style={{
                ...styles.productImage,
                backgroundImage: product.image_principale ? `url(${product.image_principale})` : 'none'
              }}>
                {!product.image_principale && (
                  <div style={{ color: '#94a3b8', fontSize: '48px' }}>
                    <Icons.Package />
                  </div>
                )}
              </div>
              <div style={styles.productContent}>
                <h3 style={styles.productName}>
                  {product.nom}
                </h3>
                <p style={styles.productDescription}>
                  {product.description}
                </p>
                <div style={styles.productFooter}>
                  <div style={styles.productPrice}>
                    <span style={styles.priceMain}>
                      {product.prix_min} MRU
                    </span>
                    {product.prix_max !== product.prix_min && (
                      <span style={styles.priceRange}>
                        - {product.prix_max} MRU
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={addingToCart.has(product.id)}
                    style={{
                      ...styles.addToCartButton,
                      background: addingToCart.has(product.id) ? '#94a3b8' : 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                      cursor: addingToCart.has(product.id) ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!addingToCart.has(product.id)) {
                        e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!addingToCart.has(product.id)) {
                        e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    {addingToCart.has(product.id) ? (
                      <>
                        <Icons.Loader />
                        Ajout...
                      </>
                    ) : (
                      <>
                        <Icons.ShoppingCart />
                        Ajouter
                      </>
                    )}
                  </button>
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
            Aucun produit disponible
          </h3>
          <p style={styles.emptyDescription}>
            Cette section ne contient pas encore de produits.
          </p>
          <button
            onClick={() => navigate('/produits')}
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Icons.Search />
            Voir tous les produits
          </button>
        </div>
      )}
    </section>
  );

  return (
    <ClientLayout currentPage="home">
      <div style={styles.container}>
        <HeroSection />
        <CategoriesSection />
        <ProductsSection 
          title="Nouveautés" 
          products={nouveautes}
          emptyMessage="Découvrez nos derniers produits ajoutés à notre catalogue"
        />
        <ProductsSection 
          title="Produits Populaires" 
          products={populaires}
          emptyMessage="Les produits les plus appréciés par nos clients"
        />
      </div>
    </ClientLayout>
  );
};

export default ClientHomePage;