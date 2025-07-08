// src/pages/VendeurDashboard.jsx - VERSION CORRIGÉE
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
import { useModal } from '../hooks/useModal'; // ✅ AJOUT DE L'IMPORT MANQUANT
import { theme } from '../styles/theme';

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

  // ✅ Gestion des filtres
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

  // ✅ Options de tri
  const sortOptions = [
    { value: '', label: 'Trier par...' },
    { value: 'nom', label: 'Nom (A-Z)' },
    { value: '-nom', label: 'Nom (Z-A)' },
    { value: 'date_creation', label: 'Plus anciens' },
    { value: '-date_creation', label: 'Plus récents' },
    { value: 'prix_min', label: 'Prix croissant' },
    { value: '-prix_min', label: 'Prix décroissant' }
  ];

  // ✅ Options de filtrage par stock
  const stockOptions = [
    { value: '', label: 'Tous les produits' },
    { value: 'in_stock', label: 'En stock' },
    { value: 'low_stock', label: 'Stock faible' },
    { value: 'out_of_stock', label: 'Rupture de stock' }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: theme.fonts?.base || 'system-ui'
    }}>
      <ModernSidebar 
        onAddProductClick={handleAddProduct} 
        currentPage="products"
      />

      <div style={{ 
        flex: 1, 
        padding: theme.spacing?.xl || '24px',
        backgroundColor: '#ffffff',
        margin: theme.spacing?.lg || '16px',
        borderRadius: theme.borderRadius?.lg || '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing?.xl || '24px',
          paddingBottom: theme.spacing?.lg || '16px',
          borderBottom: `1px solid ${theme.colors?.gray?.[200] || '#e5e7eb'}`
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: theme.colors?.gray?.[800] || '#1f2937',
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
              color: theme.colors?.gray?.[500] || '#6b7280',
              marginTop: '8px',
              
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
            gap: '16px'
          }}>
            <ProductSearch
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Rechercher des produits..."
            />
            
            <Button 
              onClick={handleAddProduct} 
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                padding: '12px 24px',
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: '8px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PlusIcon size={18} />
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

        {/* ✅ BARRE DE FILTRES */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <select 
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                outline: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                minWidth: '140px'
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
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                outline: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                minWidth: '160px'
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
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                outline: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                minWidth: '140px'
              }}
            >
              {stockOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Statistiques */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '24px',
            fontSize: '14px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontWeight: '700', color: '#1f2937', fontSize: '16px' }}>
                {pagination.totalItems}
              </span>
              <span style={{ color: '#6b7280' }}>Résultats</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              fontSize: '13px' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#dcfce7',
                borderRadius: '4px',
                color: '#16a34a',
                fontWeight: '500'
              }}>
                <span>🟢</span>
                <span>{stats.inStock} En stock</span>
              </div>
              
              {stats.lowStock > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  padding: '4px 8px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '4px',
                  color: '#d97706',
                  fontWeight: '500'
                }}>
                  <span>🟡</span>
                  <span>{stats.lowStock} Stock faible</span>
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: '#fecaca',
                borderRadius: '4px',
                color: '#dc2626',
                fontWeight: '500'
              }}>
                <span>🔴</span>
                <span>{stats.outOfStock} Rupture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            color: '#6b7280'
          }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              opacity: 0.5 
            }}>
              ⏳
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500' }}>
              Chargement des produits...
            </div>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px'
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
                  padding: '80px 20px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>
                    📦
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    color: '#1f2937', 
                    marginBottom: '8px',
                    fontWeight: '600'
                  }}>
                    {filters.search || filters.category || filters.stockFilter ? 'Aucun produit trouvé' : 'Aucun produit'}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    marginBottom: '24px',
                    fontSize: '16px',
                    maxWidth: '400px',
                    margin: '0 auto 24px auto'
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
                        padding: '12px 24px',
                        fontSize: '16px',
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
                gap: '16px',
                marginTop: '48px',
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
                    gap: '8px'
                  }}
                >
                  <ChevronLeftIcon size={16} />
                  Précédent
                </Button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === pagination.totalPages ||
                      (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
                    )
                    .map((page, index, array) => (
                      <div key={page} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span style={{ color: '#9ca3af' }}>...</span>
                        )}
                        <button
                          onClick={() => changePage(page)}
                          disabled={loading}
                          style={{
                            padding: '8px 12px',
                            border: `1px solid ${page === pagination.currentPage ? '#4f46e5' : '#d1d5db'}`,
                            backgroundColor: page === pagination.currentPage ? '#4f46e5' : 'white',
                            color: page === pagination.currentPage ? 'white' : '#374151',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: page === pagination.currentPage ? '600' : 'normal',
                            minWidth: '40px'
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
                    gap: '8px'
                  }}
                >
                  Suivant
                  <ChevronRightIcon size={16} />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Formulaire amélioré */}
        <ProductFormImproved
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          isLoading={loading}
        />

        {/* Modal de détails */}
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isDetailsOpen}
          onClose={closeDetails}
          onEdit={handleEditFromDetails}
          onDelete={handleDeleteFromDetails}
        />
      </div>
    </div>
  );
}

export default VendeurDashboard;