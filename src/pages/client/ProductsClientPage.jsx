// src/pages/client/ProductsClientPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react'; // Added missing import
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
      console.log('Response catégories:', response); // Debug
      
      // ✅ CORRECTION: Votre backend retourne { count: 0, results: [] }
      let categoriesData = [];
      
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          // Format avec pagination: { count: X, results: [...] }
          categoriesData = response.data.results;
        } else if (Array.isArray(response.data)) {
          // Format direct: [...]
          categoriesData = response.data;
        }
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      setCategories([]); // Toujours un tableau vide en cas d'erreur
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
        
      console.log('Response produits:', response); // Debug
      
      // ✅ CORRECTION: Gérer le format de votre backend
      let productsData = [];
      let totalCount = 0;
      
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          // Format avec pagination: { count: X, results: [...] }
          productsData = response.data.results;
          totalCount = response.data.count || 0;
        } else if (Array.isArray(response.data)) {
          // Format direct: [...]
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

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const handleViewDetails = (product) => {
    navigate(`/produits/${product.id}`);
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    console.log('Toggle wishlist:', productId, isWishlisted);
    // Ici vous ajouteriez la logique des favoris
  };
  
  // Composant Filtres
  const FiltersSection = () => (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1f2937',
          margin: 0
        }}>
          Filtres
        </h3>
        <button
          onClick={clearFilters}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6b7280';
          }}
        >
          🗑️ Effacer
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        alignItems: 'end'
      }}>
        {/* Recherche */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            🔍 Recherche
          </label>
          <input
            type="text"
            placeholder="Nom du produit..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            📂 Catégorie
          </label>
          <select
            value={filters.categorie}
            onChange={(e) => handleFilterChange('categorie', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#ffffff'
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
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            💰 Prix min (MRU)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.prix_min}
            onChange={(e) => handleFilterChange('prix_min', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Prix maximum */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            💎 Prix max (MRU)
          </label>
          <input
            type="number"
            placeholder="∞"
            value={filters.prix_max}
            onChange={(e) => handleFilterChange('prix_max', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        {/* Tri */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '6px'
          }}>
            📊 Trier par
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#ffffff'
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

  // Composant En-tête résultats
  const ResultsHeader = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      padding: '16px 24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb'
    }}>
      <div>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 4px 0'
        }}>
          Catalogue Produits
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: 0
        }}>
          {loading ? 'Chargement...' : `${totalResults} produit${totalResults > 1 ? 's' : ''} trouvé${totalResults > 1 ? 's' : ''}`}
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
        color: '#6b7280'
      }}>
        {currentPage > 1 && (
          <span>
            Page {currentPage} sur {totalPages}
          </span>
        )}
      </div>
    </div>
  );

  // Composant Grille produits
  const ProductsGrid = () => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    }}>
      {loading ? (
        // Skeleton loading
        [...Array(12)].map((_, i) => (
          <div key={i} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '200px',
              backgroundColor: '#f3f4f6',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{ padding: '16px' }}>
              <div style={{
                height: '20px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                marginBottom: '8px',
                animation: 'pulse 2s infinite'
              }} />
              <div style={{
                height: '16px',
                backgroundColor: '#f3f4f6',
                borderRadius: '4px',
                animation: 'pulse 2s infinite'
              }} />
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
              stock: 10 // Valeur par défaut
            }}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onToggleWishlist={handleToggleWishlist}
          />
        ))
      ) : (
        // État vide
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: '80px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '2px dashed #e5e7eb'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>
            🔍
          </div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Aucun produit trouvé
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 24px 0'
          }}>
            Essayez d'ajuster vos filtres ou votre recherche
          </p>
          <button
            onClick={clearFilters}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            🗑️ Effacer tous les filtres
          </button>
        </div>
      )}
    </div>
  );

  // Composant Pagination
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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        padding: '24px 0'
      }}>
        {/* Bouton précédent */}
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: currentPage === 1 ? '#f3f4f6' : '#3b82f6',
            color: currentPage === 1 ? '#9ca3af' : '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          ← Précédent
        </button>

        {/* Numéros de page */}
        {pages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              minWidth: '40px',
              backgroundColor: page === currentPage ? '#3b82f6' : '#ffffff',
              color: page === currentPage ? '#ffffff' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (page !== currentPage) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                e.target.style.backgroundColor = '#ffffff';
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
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#3b82f6',
            color: currentPage === totalPages ? '#9ca3af' : '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          Suivant →
        </button>
      </div>
    );
  };

  return (
    <ClientLayout currentPage="products">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        <FiltersSection />
        <ResultsHeader />
        <ProductsGrid />
        <Pagination />
      </div>
    </ClientLayout>
  );
};

export default ProductsClientPage;