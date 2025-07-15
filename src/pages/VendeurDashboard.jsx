// src/pages/VendeurDashboard.jsx - VERSION AVEC ICÔNES SVG
import { useState } from 'react';
import { Button, Alert } from '../components/ui';
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import ProductFormImproved from '../components/products/ProductFormImproved';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import ProductSearch from '../components/products/ProductSearch';
import ModernSidebar from '../components/layout/ModernSidebar';
import { useProductsOptimized } from '../hooks/useProductsOptimized';
import { useCategories } from '../hooks/useCategories';
import { useModal } from '../hooks/useModal';
import { theme } from '../styles/theme';

// Icônes SVG personnalisées
const Icons = {
  // Icône pour stock disponible (vert)
  InStock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#16a34a"/>
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  // Icône pour stock faible (jaune)
  LowStock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" fill="#d97706"/>
      <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  // Icône pour rupture de stock (rouge)
  OutOfStock: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#dc2626"/>
      <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  // Icône pour boîte/package
  Package: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  
  // Icône pour chargement
  Loading: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12a9 9 0 11-6.219-8.56"/>
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        dur="1s"
        from="0 12 12"
        to="360 12 12"
        repeatCount="indefinite"
      />
    </svg>
  )
};

function VendeurDashboard() {
  const {
    products,
    loading,
    error,
    pagination,
    filters,
    stats,
    updateFilters,
    changePage,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError
  } = useProductsOptimized();

  const { categories } = useCategories();
  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal();
  const { isOpen: isDetailsOpen, openModal: openDetails, closeModal: closeDetails } = useModal();
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    openForm();
  };

  const handleEditProduct = (product) => {
    console.log('🔧 Mode édition activé pour:', product);
    setEditingProduct(product);
    openForm();
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    openDetails();
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log('📝 Soumission formulaire avec données:', formData);
      
      if (editingProduct) {
        console.log('🔄 Mode modification pour produit ID:', editingProduct.id);
        await updateProduct(editingProduct.id, formData);
        console.log('✅ Modification terminée avec succès');
      } else {
        console.log('🆕 Mode création avec méthode complète');
        await createProduct(formData);
        console.log('✅ Création terminée avec succès');
      }
      
      closeForm();
      setEditingProduct(null);
      
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
    }
  };

  const handleCloseForm = () => {
    closeForm();
    setEditingProduct(null);
    clearError();
  };

  const handleEditFromDetails = (product) => {
    setEditingProduct(product);
    closeDetails();
    openForm();
  };

  const handleDeleteFromDetails = async (productId) => {
    try {
      await deleteProduct(productId);
      closeDetails();
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  // Gestion des filtres
  const handleSearchChange = (value) => {
    updateFilters({ search: value });
  };

  const handleCategoryFilter = (categoryId) => {
    updateFilters({ category: categoryId });
  };

  const handleSortChange = (sortBy) => {
    updateFilters({ sortBy });
  };

  const handleStockFilter = (stockFilter) => {
    updateFilters({ stockFilter });
  };

  // Options de tri
  const sortOptions = [
    { value: '', label: 'Trier par...' },
    { value: 'nom', label: 'Nom (A-Z)' },
    { value: '-nom', label: 'Nom (Z-A)' },
    { value: 'date_creation', label: 'Plus anciens' },
    { value: '-date_creation', label: 'Plus récents' },
    { value: 'prix_min', label: 'Prix croissant' },
    { value: '-prix_min', label: 'Prix décroissant' }
  ];

  // Options de filtrage par stock
  const stockOptions = [
    { value: '', label: 'Tous les produits' },
    { value: 'in_stock', label: 'En stock' },
    { value: 'low_stock', label: 'Stock faible' },
    { value: 'out_of_stock', label: 'Rupture de stock' }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', // Hauteur fixe 100vh
      backgroundColor: '#f8fafc',
      fontFamily: theme.fonts?.base || 'system-ui',
      overflow: 'hidden' // Empêche le scroll global
    }}>
      <ModernSidebar 
        onAddProductClick={handleAddProduct} 
        currentPage="products"
      />

      {/* Contenu principal avec scroll interne */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        marginLeft: '25px', // Même largeur que la sidebar
        overflow: 'hidden', // Empêche le débordement
        backgroundColor: '#f8fafc' // Background pour tout l'espace
      }}>
        
        {/* Container principal avec scroll */}
        <div style={{
          flex: 1,
          overflowY: 'auto', // Scroll vertical uniquement
          overflowX: 'hidden', // Pas de scroll horizontal
          padding: '24px',
          backgroundColor: '#ffffff',
          // Supprimer margin et borderRadius pour occuper tout l'espace
        }}>

          {/* En-tête fixe */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ minWidth: '200px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: '#1f2937',
                margin: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Tous les Produits
              </h1>
              <div style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                marginTop: '4px'
              }}>
                <span style={{ color: '#4f46e5', fontWeight: '500' }}>
                  Tableau de bord
                </span>
                <span> → Tous les produits</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ minWidth: '250px' }}>
                <ProductSearch
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Rechercher des produits..."
                />
              </div>
              
              <Button 
                onClick={handleAddProduct} 
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <PlusIcon size={16} />
                Ajouter un Produit
              </Button>
            </div>
          </div>

          {/* Alertes d'erreur */}
          {error && (
            <Alert type="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          {loading && (
            <Alert type="warning">
              {editingProduct ? 
                '🔄 Modification du produit en cours...' : 
                '⏳ Chargement des produits...'
              }
            </Alert>
          )}

          {/* Barre de filtres compacte */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            padding: '16px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <select 
                value={filters.sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#374151',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '120px'
                }}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select 
                value={filters.category}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#374151',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '140px'
                }}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>

              <select 
                value={filters.stockFilter}
                onChange={(e) => handleStockFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#374151',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  minWidth: '120px'
                }}
              >
                {stockOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Statistiques compactes avec icônes SVG */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              fontSize: '13px',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                padding: '6px 10px',
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '15px' }}>
                  {pagination.totalItems}
                </span>
                <span style={{ color: '#6b7280' }}>Résultats</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                fontSize: '12px' 
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '6px 8px',
                  backgroundColor: '#dcfce7',
                  borderRadius: '6px',
                  color: '#16a34a',
                  fontWeight: '600'
                }}>
                  <Icons.InStock />
                  <span>{stats.inStock}</span>
                </div>
                
                {stats.lowStock > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '6px 8px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '6px',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    <Icons.LowStock />
                    <span>{stats.lowStock}</span>
                  </div>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '6px 8px',
                  backgroundColor: '#fecaca',
                  borderRadius: '6px',
                  color: '#dc2626',
                  fontWeight: '600'
                }}>
                  <Icons.OutOfStock />
                  <span>{stats.outOfStock}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grille de produits responsive */}
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#6b7280'
            }}>
              <div style={{ 
                marginBottom: '16px',
                opacity: 0.6,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Icons.Loading />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>
                Chargement des produits...
              </div>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                padding: '0 4px' // Petit padding pour éviter le débordement
              }}>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={deleteProduct}
                    onViewDetails={handleViewDetails}
                  />
                ))}

                {products.length === 0 && !loading && (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 20px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '8px',
                    border: '2px dashed #d1d5db'
                  }}>
                    <div style={{ 
                      marginBottom: '16px', 
                      opacity: 0.4,
                      color: '#9ca3af',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      <Icons.Package />
                    </div>
                    <h3 style={{ 
                      fontSize: '18px', 
                      color: '#1f2937', 
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      {filters.search || filters.category || filters.stockFilter ? 'Aucun produit trouvé' : 'Aucun produit'}
                    </h3>
                    <p style={{ 
                      color: '#6b7280', 
                      marginBottom: '20px',
                      fontSize: '14px',
                      maxWidth: '350px',
                      margin: '0 auto 20px auto'
                    }}>
                      {filters.search || filters.category || filters.stockFilter
                        ? 'Essayez d\'ajuster vos termes de recherche ou filtres' 
                        : 'Commencez par créer votre premier produit avec images et spécifications'
                      }
                    </p>
                    {!filters.search && !filters.category && !filters.stockFilter && (
                      <Button 
                        onClick={handleAddProduct}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          padding: '10px 20px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <PlusIcon />
                        Créer votre Premier Produit
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '32px',
                  padding: '16px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px'
                    }}
                  >
                    <ChevronLeftIcon size={14} />
                    Précédent
                  </Button>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages ||
                        (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
                      )
                      .map((page, index, array) => (
                        <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>...</span>
                          )}
                          <button
                            onClick={() => changePage(page)}
                            disabled={loading}
                            style={{
                              padding: '6px 10px',
                              border: `1px solid ${page === pagination.currentPage ? '#4f46e5' : '#d1d5db'}`,
                              backgroundColor: page === pagination.currentPage ? '#4f46e5' : 'white',
                              color: page === pagination.currentPage ? 'white' : '#374151',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: page === pagination.currentPage ? '600' : 'normal',
                              minWidth: '32px',
                              fontSize: '13px'
                            }}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages || loading}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px'
                    }}
                  >
                    Suivant
                    <ChevronRightIcon size={14} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Formulaire et modales */}
      <ProductFormImproved
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
        isLoading={loading}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
      />
    </div>
  );
}

export default VendeurDashboard;