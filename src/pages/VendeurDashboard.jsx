// src/pages/VendeurDashboard.jsx - VERSION CORRIGÉE avec modification complète
import { useState } from 'react';
import { Button, Alert } from '../components/ui';
import { PlusIcon } from '../components/icons';
import ProductFormExtended from '../components/products/ProductFormExtended';
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import ProductSearch from '../components/products/ProductSearch';
import ModernSidebar from '../components/layout/ModernSidebar';
import { useProducts, useModal } from '../hooks/useProducts';
import { useProductsExtended } from '../hooks/useProductsExtended';
import { theme } from '../styles/theme';

function VendeurDashboard() {
  const {
    products,
    loading,
    error,
    editProduct, // ✅ Garde pour les modifications simples si besoin
    removeProduct,
    filterProducts,
    clearError,
    loadProducts
  } = useProducts();

  const {
    loading: extendedLoading,
    error: extendedError,
    createProductWithDetails,
    updateProductWithDetails, // ✅ NOUVELLE FONCTION
    clearError: clearExtendedError
  } = useProductsExtended();

  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal();
  const { isOpen: isDetailsOpen, openModal: openDetails, closeModal: closeDetails } = useModal();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = filterProducts(products, searchTerm);

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

  // ✅ FONCTION CORRIGÉE pour gérer création ET modification complète
  const handleFormSubmit = async (formData) => {
    try {
      console.log('📝 Soumission formulaire avec données:', formData);
      
      if (editingProduct) {
        // ✅ MODE ÉDITION - Utiliser la nouvelle fonction complète
        console.log('🔄 Mode modification pour produit ID:', editingProduct.id);
        await updateProductWithDetails(editingProduct.id, formData);
        console.log('✅ Modification terminée avec succès');
      } else {
        // ✅ MODE CRÉATION - Utiliser la fonction de création
        console.log('🆕 Mode création avec méthode complète');
        await createProductWithDetails(formData);
        console.log('✅ Création terminée avec succès');
      }
      
      // Recharger la liste des produits pour voir les changements
      await loadProducts();
      
      // Fermer le formulaire et nettoyer
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
    clearExtendedError();
  };

  const handleEditFromDetails = (product) => {
    setEditingProduct(product);
    closeDetails();
    openForm();
  };

  const handleDeleteFromDetails = async (productId) => {
    try {
      await removeProduct(productId);
      closeDetails();
    } catch (error) {
      // L'erreur est gérée dans le hook
    }
  };

  const currentError = error || extendedError;
  const isLoading = loading || extendedLoading;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: theme.fonts.base
    }}>
      <ModernSidebar 
        onAddProductClick={handleAddProduct} 
        currentPage="products"
      />

      <div style={{ 
        flex: 1, 
        padding: theme.spacing.xl,
        backgroundColor: '#ffffff',
        margin: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: theme.spacing.xl,
          paddingBottom: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.gray[200]}`
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              marginBottom: theme.spacing.sm
            }}>
              <span style={{ fontSize: '24px' }}>📦</span>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: theme.colors.gray[800],
                margin: 0
              }}>
                All Products
              </h1>
            </div>
            
            <div style={{ 
              fontSize: '14px', 
              color: theme.colors.gray[500],
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}>
              <span style={{ 
                color: '#4f46e5', 
                fontWeight: '500',
                textDecoration: 'none',
                cursor: 'pointer'
              }}>
                Dashboard
              </span>
              <span>→</span>
              <span>All Products</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.md
          }}>
            <ProductSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search for products..."
            />
            
            <Button 
              onClick={handleAddProduct} 
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              <PlusIcon />
              Add Product
            </Button>
          </div>
        </div>

        {/* Alertes d'erreur */}
        {currentError && (
          <Alert 
            type="error" 
            onClose={() => {
              clearError();
              clearExtendedError();
            }}
          >
            {currentError}
          </Alert>
        )}

        {/* ✅ INDICATEUR DE CHARGEMENT pendant modification */}
        {isLoading && (
          <Alert type="warning">
            {editingProduct ? 
              '🔄 Modification du produit en cours...' : 
              '⏳ Traitement en cours...'
            }
          </Alert>
        )}

        {/* Barre de filtres */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.xl,
          padding: theme.spacing.lg,
          backgroundColor: '#f8fafc',
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.gray[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <Button 
              size="sm"
              style={{
                backgroundColor: '#4f46e5',
                color: theme.colors.white,
                border: 'none'
              }}
            >
              All Products
            </Button>
            
            <select style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: '14px',
              color: theme.colors.gray[600],
              outline: 'none',
              backgroundColor: theme.colors.white
            }}>
              <option>Sort by</option>
              <option>Name</option>
              <option>Date</option>
              <option>Price</option>
              <option>Stock</option>
            </select>

            <select style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.md,
              fontSize: '14px',
              color: theme.colors.gray[600],
              outline: 'none',
              backgroundColor: theme.colors.white
            }}>
              <option>Filter by Category</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
            </select>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: theme.spacing.lg,
            fontSize: '14px',
            color: theme.colors.gray[500]
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
              <span style={{ fontWeight: '600', color: theme.colors.gray[800] }}>
                {filteredProducts.length}
              </span>
              <span>Results on grid</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.md,
              fontSize: '12px' 
            }}>
              <span style={{ color: '#10b981' }}>
                📦 {filteredProducts.filter(p => p.specifications?.some(s => s.quantite_stock > 0)).length} In Stock
              </span>
              <span style={{ color: '#ef4444' }}>
                🚫 {filteredProducts.filter(p => p.specifications?.every(s => s.quantite_stock === 0)).length} Out of Stock
              </span>
            </div>
          </div>
        </div>

        {/* Grille de produits */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px',
            color: theme.colors.gray[500]
          }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: theme.spacing.lg,
              opacity: 0.5 
            }}>
              ⏳
            </div>
            <div style={{ fontSize: '18px', fontWeight: '500' }}>
              Loading products...
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: theme.spacing.xl
          }}>
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={removeProduct}
                onViewDetails={handleViewDetails}
              />
            ))}

            {filteredProducts.length === 0 && !loading && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '80px 20px',
                backgroundColor: '#f8fafc',
                borderRadius: theme.borderRadius.lg,
                border: `2px dashed ${theme.colors.gray[300]}`
              }}>
                <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg, opacity: 0.5 }}>
                  📦
                </div>
                <h3 style={{ 
                  fontSize: '20px', 
                  color: theme.colors.gray[800], 
                  marginBottom: theme.spacing.sm,
                  fontWeight: '600'
                }}>
                  {searchTerm ? 'No products found' : 'No products yet'}
                </h3>
                <p style={{ 
                  color: theme.colors.gray[500], 
                  marginBottom: theme.spacing.xl,
                  fontSize: '16px',
                  maxWidth: '400px',
                  margin: `0 auto ${theme.spacing.xl} auto`
                }}>
                  {searchTerm 
                    ? 'Try adjusting your search terms or filters' 
                    : 'Start by creating your first product with images and specifications'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={handleAddProduct}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      padding: `${theme.spacing.md} ${theme.spacing.xl}`
                    }}
                  >
                    <PlusIcon />
                    Create Your First Product
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ FORMULAIRE ÉTENDU avec support modification complète */}
        <ProductFormExtended
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingProduct} // ✅ Passe toutes les données du produit
          isLoading={isLoading}
        />

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