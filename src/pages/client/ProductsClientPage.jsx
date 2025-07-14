// src/pages/client/ProductsClientPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import ProductCard from '../../components/client/product/ProductClientCard';
import { fetchProduits, fetchCategories, rechercherProduits, ajouterProduitAuPanier } from '../../api/clientAPI';

const ProductsClientPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [addingToCart, setAddingToCart] = useState(new Set());
  
  // Filtres
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categorie: searchParams.get('categorie') || '',
    prix_min: searchParams.get('prix_min') || '',
    prix_max: searchParams.get('prix_max') || '',
    sort: searchParams.get('sort') || 'nom'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Composant d'icônes SVG
  const Icons = {
    Search: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
    Folder: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
    DollarSign: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    Diamond: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12l4 6-10 13L2 9l4-6z"/>
        <path d="M11 3L8 9l4 13 4-13-3-6"/>
        <path d="M2 9h20"/>
      </svg>
    ),
    BarChart: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="20" x2="12" y2="10"/>
        <line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
    ),
    Trash: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3,6 5,6 21,6"/>
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
      </svg>
    ),
    Filter: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
      </svg>
    ),
    Grid: () => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    ChevronLeft: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="15,18 9,12 15,6"/>
      </svg>
    ),
    ChevronRight: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9,18 15,12 9,6"/>
      </svg>
    ),
    SearchX: () => (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <line x1="8.5" y1="8.5" x2="13.5" y2="13.5"/>
        <line x1="13.5" y1="8.5" x2="8.5" y2="13.5"/>
      </svg>
    )
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    updateURL();
  }, [filters, currentPage]);

  const loadCategories = async () => {
    try {
      const response = await fetchCategories();
      console.log('Response catégories:', response);
      
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
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        page_size: itemsPerPage,
        ordering: filters.sort,
        ...(filters.search && { search: filters.search }),
        ...(filters.categorie && { categorie: filters.categorie }),
        ...(filters.prix_min && { prix_min: filters.prix_min }),
        ...(filters.prix_max && { prix_max: filters.prix_max })
      };

      const response = filters.search 
        ? await rechercherProduits(params)
        : await fetchProduits(params);
        
      console.log('Response produits:', response);
      
      let productsData = [];
      let totalCount = 0;
      
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          productsData = response.data.results;
          totalCount = response.data.count || 0;
        } else if (Array.isArray(response.data)) {
          productsData = response.data;
          totalCount = response.data.length;
        }
      }
      
      setProducts(productsData);
      setTotalResults(totalCount);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (currentPage > 1) params.set('page', currentPage);
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categorie: '',
      prix_min: '',
      prix_max: '',
      sort: 'nom'
    });
    setCurrentPage(1);
  };

  const handleAddToCart = async (produitId) => {
    setAddingToCart(prev => new Set(prev).add(produitId));
    
    try {
      await ajouterProduitAuPanier(produitId, 1);
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

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const handleViewDetails = (product) => {
    navigate(`/produits/${product.id}`);
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    console.log('Toggle wishlist:', productId, isWishlisted);
  };

  // Styles modernes
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    filtersCard: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
      padding: '32px',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
    },
    filtersHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px'
    },
    filtersTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      margin: 0
    },
    clearButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      alignItems: 'end'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    resultsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
      padding: '24px 32px',
      background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
    },
    resultsTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '28px',
      fontWeight: '800',
      color: '#1e293b',
      margin: '0 0 8px 0'
    },
    resultsCount: {
      fontSize: '16px',
      color: '#64748b',
      margin: 0,
      fontWeight: '500'
    },
    pageInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '15px',
      color: '#64748b',
      fontWeight: '500'
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      marginBottom: '48px'
    },
    loadingCard: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      position: 'relative'
    },
    loadingImage: {
      height: '220px',
      backgroundColor: '#f1f5f9',
      position: 'relative',
      overflow: 'hidden'
    },
    loadingContent: {
      padding: '20px'
    },
    loadingBar: {
      height: '16px',
      backgroundColor: '#f1f5f9',
      borderRadius: '8px',
      marginBottom: '12px',
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
      gridColumn: '1 / -1',
      textAlign: 'center',
      padding: '80px 40px',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      border: '2px dashed #e2e8f0'
    },
    emptyIcon: {
      color: '#94a3b8',
      marginBottom: '24px'
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
    emptyButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '16px 32px',
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      padding: '32px 0'
    },
    paginationButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '12px 20px',
      backgroundColor: '#ffffff',
      color: '#374151',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    paginationButtonActive: {
      background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
      color: '#ffffff',
      borderColor: 'transparent'
    },
    paginationButtonDisabled: {
      backgroundColor: '#f8fafc',
      color: '#94a3b8',
      cursor: 'not-allowed',
      borderColor: '#f1f5f9'
    }
  };

  // Animation CSS pour le shimmer
  const shimmerKeyframes = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  // Composant Filtres modernisé
  const FiltersSection = () => (
    <div style={styles.filtersCard}>
      <style>{shimmerKeyframes}</style>
      <div style={styles.filtersHeader}>
        <h3 style={styles.filtersTitle}>
          <Icons.Filter />
          Filtres de Recherche
        </h3>
        <button
          onClick={clearFilters}
          style={styles.clearButton}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #4b5563 0%, #374151 100%)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          <Icons.Trash />
          Effacer
        </button>
      </div>

      <div style={styles.filtersGrid}>
        {/* Recherche */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Search />
            Recherche
          </label>
          <input
            type="text"
            placeholder="Nom du produit..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
              e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Catégorie */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Folder />
            Catégorie
          </label>
          <select
            value={filters.categorie}
            onChange={(e) => handleFilterChange('categorie', e.target.value)}
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
              e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Toutes les catégories</option>
            {Array.isArray(categories) && categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Prix minimum */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.DollarSign />
            Prix min (MRU)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.prix_min}
            onChange={(e) => handleFilterChange('prix_min', e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
              e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Prix maximum */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Diamond />
            Prix max (MRU)
          </label>
          <input
            type="number"
            placeholder="∞"
            value={filters.prix_max}
            onChange={(e) => handleFilterChange('prix_max', e.target.value)}
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
              e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Tri */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.BarChart />
            Trier par
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={styles.select}
            onFocus={(e) => {
              e.target.style.borderColor = '#a855f7';
              e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="nom">Nom A-Z</option>
            <option value="-nom">Nom Z-A</option>
            <option value="prix_min">Prix croissant</option>
            <option value="-prix_min">Prix décroissant</option>
            <option value="-date_creation">Plus récents</option>
            <option value="date_creation">Plus anciens</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Composant En-tête résultats modernisé
  const ResultsHeader = () => (
    <div style={styles.resultsHeader}>
      <div>
        <h2 style={styles.resultsTitle}>
          <Icons.Grid />
          Catalogue Produits
        </h2>
        <p style={styles.resultsCount}>
          {loading ? 'Chargement...' : `${totalResults} produit${totalResults > 1 ? 's' : ''} trouvé${totalResults > 1 ? 's' : ''}`}
        </p>
      </div>
      
      {currentPage > 1 && (
        <div style={styles.pageInfo}>
          Page {currentPage} sur {totalPages}
        </div>
      )}
    </div>
  );

  // Composant Grille produits modernisé
  const ProductsGrid = () => (
    <div style={styles.productsGrid}>
      {loading ? (
        // Skeleton loading modernisé
        [...Array(12)].map((_, i) => (
          <div key={i} style={styles.loadingCard}>
            <div style={styles.loadingImage}>
              <div style={styles.shimmer} />
            </div>
            <div style={styles.loadingContent}>
              <div style={styles.loadingBar}>
                <div style={styles.shimmer} />
              </div>
              <div style={{...styles.loadingBar, width: '70%'}}>
                <div style={styles.shimmer} />
              </div>
              <div style={{...styles.loadingBar, width: '50%'}}>
                <div style={styles.shimmer} />
              </div>
            </div>
          </div>
        ))
      ) : products.length > 0 ? (
        products.map(product => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              image: product.image_principale,
              name: product.nom,
              price: product.prix_min,
              originalPrice: product.prix_max !== product.prix_min ? product.prix_max : null,
              rating: product.note_moyenne || 4.2,
              reviews: product.nombre_avis || 15,
              stock: 10
            }}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onToggleWishlist={handleToggleWishlist}
          />
        ))
      ) : (
        // État vide modernisé
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <Icons.SearchX />
          </div>
          <h3 style={styles.emptyTitle}>
            Aucun produit trouvé
          </h3>
          <p style={styles.emptyDescription}>
            Essayez d'ajuster vos filtres ou votre recherche pour découvrir nos produits
          </p>
          <button
            onClick={clearFilters}
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
            Effacer tous les filtres
          </button>
        </div>
      )}
    </div>
  );

  // Composant Pagination modernisé
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div style={styles.pagination}>
        {/* Bouton précédent */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            ...styles.paginationButton,
            ...(currentPage === 1 ? styles.paginationButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          <Icons.ChevronLeft />
          Précédent
        </button>

        {/* Numéros de page */}
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              ...styles.paginationButton,
              ...(page === currentPage ? styles.paginationButtonActive : {}),
              minWidth: '48px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (page !== currentPage) {
                e.target.style.backgroundColor = '#f8fafc';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            {page}
          </button>
        ))}

        {/* Bouton suivant */}
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          style={{
            ...styles.paginationButton,
            ...(currentPage === totalPages ? styles.paginationButtonDisabled : {})
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = '#f8fafc';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          Suivant
          <Icons.ChevronRight />
        </button>
      </div>
    );
  };

  return (
    <ClientLayout currentPage="products">
      <div style={styles.container}>
        <FiltersSection />
        <ResultsHeader />
        <ProductsGrid />
        <Pagination />
      </div>
    </ClientLayout>
  );
};

export default ProductsClientPage;