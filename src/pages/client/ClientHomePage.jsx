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

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
      fontWeight: '700',
      margin: '0 0 24px 0',
      lineHeight: '1.2'
    },
    heroSubtitle: {
      fontSize: '20px',
      margin: '0 auto 40px auto',
      opacity: 0.9,
      maxWidth: '600px',
      lineHeight: '1.5'
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none'
    },
    secondaryButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      color: '#6366f1',
      border: '2px solid #ffffff',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none'
    },
    section: {
      padding: '80px 24px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '48px'
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#1e293b',
      margin: '0 0 16px 0'
    },
    sectionSubtitle: {
      fontSize: '18px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.6'
    },
    categoriesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px'
    },
    categoryCard: {
      backgroundColor: '#ffffff',
      padding: '32px 24px',
      borderRadius: '12px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0'
    },
    categoryIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      display: 'block'
    },
    categoryName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    categoryDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: 0,
      lineHeight: '1.4'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px'
    },
    productCard: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0'
    },
    productImage: {
      height: '200px',
      backgroundColor: '#f1f5f9',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      color: '#94a3b8',
      position: 'relative'
    },
    productContent: {
      padding: '20px'
    },
    productName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0',
      lineHeight: '1.4'
    },
    productDescription: {
      fontSize: '14px',
      color: '#64748b',
      margin: '0 0 16px 0',
      lineHeight: '1.4',
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
      fontSize: '18px',
      fontWeight: '700',
      color: '#1e293b'
    },
    priceRange: {
      fontSize: '14px',
      color: '#64748b'
    },
    addToCartButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
      backgroundColor: '#6366f1',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      gap: '6px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 24px'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '16px',
      opacity: 0.5,
      display: 'block'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    emptyDescription: {
      fontSize: '16px',
      color: '#64748b',
      margin: '0 0 24px 0',
      lineHeight: '1.5'
    },
    loadingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px'
    },
    loadingCard: {
      height: '200px',
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    loadingProductGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px'
    },
    loadingProductCard: {
      height: '350px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    }
  };

  // Section Hero
  const HeroSection = () => (
    <section style={styles.heroSection}>
      <div style={styles.heroContainer}>
        <h1 style={styles.heroTitle}>
          Découvrez nos Produits Exceptionnels
        </h1>
        <p style={styles.heroSubtitle}>
          Une collection unique de produits soigneusement sélectionnés pour vous offrir le meilleur
        </p>
        <div style={styles.heroButtons}>
          <button
            onClick={() => navigate('/produits')}
            style={styles.ctaButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4f46e5';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6366f1';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🛍️ Parcourir le Catalogue
          </button>
          <button
            onClick={() => navigate('/categories')}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📂 Explorer les Catégories
          </button>
          <button
            onClick={() => navigate('/client-dashboard')}
            style={styles.secondaryButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            📊 Mon Dashboard
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
            <div key={i} style={styles.loadingCard} />
          ))}
        </div>
      ) : (
        <div style={styles.categoriesGrid}>
          {categories.length > 0 ? categories.map(category => {
            // Fonction pour obtenir l'icône basée sur le nom de la catégorie
            const getCategoryIcon = (categoryName) => {
              const name = categoryName.toLowerCase();
              if (name.includes('électronique') || name.includes('electronique') || name.includes('tech')) return '📱';
              if (name.includes('vêtement') || name.includes('vetement') || name.includes('mode') || name.includes('textile')) return '👕';
              if (name.includes('maison') || name.includes('jardin') || name.includes('déco') || name.includes('deco')) return '🏠';
              if (name.includes('sport') || name.includes('loisir') || name.includes('fitness')) return '⚽';
              if (name.includes('livre') || name.includes('éducation') || name.includes('education')) return '📚';
              if (name.includes('beauté') || name.includes('beaute') || name.includes('santé') || name.includes('sante') || name.includes('cosmétique')) return '💄';
              if (name.includes('alimentaire') || name.includes('nourriture') || name.includes('cuisine')) return '🍎';
              if (name.includes('automobile') || name.includes('voiture') || name.includes('auto')) return '🚗';
              if (name.includes('jouet') || name.includes('enfant') || name.includes('bébé') || name.includes('bebe')) return '🧸';
              if (name.includes('bijou') || name.includes('accessoire')) return '💎';
              return '📦'; // Icône par défaut
            };

            return (
              <div
                key={category.id}
                onClick={() => navigate(`/categories/${category.id}`)}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.categoryIcon}>
                  {getCategoryIcon(category.nom)}
                </span>
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
              { id: 1, nom: 'Électronique', icon: '📱' },
              { id: 2, nom: 'Vêtements', icon: '👕' },
              { id: 3, nom: 'Maison & Jardin', icon: '🏠' },
              { id: 4, nom: 'Sport & Loisirs', icon: '⚽' },
              { id: 5, nom: 'Livres', icon: '📚' },
              { id: 6, nom: 'Beauté & Santé', icon: '💄' }
            ].map(category => (
              <div
                key={category.id}
                onClick={() => navigate(`/categories/${category.id}`)}
                style={styles.categoryCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={styles.categoryIcon}>
                  {category.icon}
                </span>
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
    <section style={{ ...styles.section, backgroundColor: '#ffffff' }}>
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
            <div key={i} style={styles.loadingProductCard} />
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
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                ...styles.productImage,
                backgroundImage: product.image_principale ? `url(${product.image_principale})` : 'none'
              }}>
                {!product.image_principale && '📦'}
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
                      backgroundColor: addingToCart.has(product.id) ? '#94a3b8' : '#6366f1',
                      cursor: addingToCart.has(product.id) ? 'not-allowed' : 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!addingToCart.has(product.id)) {
                        e.target.style.backgroundColor = '#4f46e5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!addingToCart.has(product.id)) {
                        e.target.style.backgroundColor = '#6366f1';
                      }
                    }}
                  >
                    {addingToCart.has(product.id) ? '⏳' : '🛒'} Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>📦</span>
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
              e.target.style.backgroundColor = '#4f46e5';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6366f1';
            }}
          >
            🔍 Voir tous les produits
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