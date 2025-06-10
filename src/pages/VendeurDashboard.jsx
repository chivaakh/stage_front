// src/pages/VendeurDashboard.jsx - VERSION FRANÇAISE AMÉLIORÉE
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
    editProduct,
    removeProduct,
    filterProducts,
    clearError,
    loadProducts
  } = useProducts();

  const {
    loading: extendedLoading,
    error: extendedError,
    createProductWithDetails,
    updateProductWithDetails,
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

  const handleFormSubmit = async (formData) => {
    try {
      console.log('📝 Soumission formulaire avec données:', formData);
      
      if (editingProduct) {
        console.log('🔄 Mode modification pour produit ID:', editingProduct.id);
        await updateProductWithDetails(editingProduct.id, formData);
        console.log('✅ Modification terminée avec succès');
      } else {
        console.log('🆕 Mode création avec méthode complète');
        await createProductWithDetails(formData);
        console.log('✅ Création terminée avec succès');
      }
      
      await loadProducts();
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

  // Statistiques pour l'affichage
  const inStockCount = filteredProducts.filter(p => 
    p.specifications?.some(s => s.quantite_stock > 0)
  ).length;
  
  const outOfStockCount = filteredProducts.filter(p => 
    p.specifications?.every(s => s.quantite_stock === 0)
  ).length;

  const lowStockCount = filteredProducts.filter(p => 
    p.specifications?.some(s => s.quantite_stock <= 5 && s.quantite_stock > 0)
  ).length;

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
        {/* ✅ EN-TÊTE AMÉLIORÉ EN FRANÇAIS */}
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
              gap: theme.spacing.md,
              marginBottom: theme.spacing.md
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.lg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}>
                <span style={{ fontSize: '24px', filter: 'brightness(0) invert(1)' }}>📦</span>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: theme.colors.gray[800],
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
                  color: theme.colors.gray[500],
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  marginTop: theme.spacing.sm
                }}>
                  <span style={{ 
                    color: '#4f46e5', 
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}>
                    Tableau de bord
                  </span>
                  <span>→</span>
                  <span>Tous les produits</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.lg
          }}>
            <ProductSearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher des produits..."
            />
            
            {/* ✅ BOUTON AJOUTER AMÉLIORÉ */}
            <Button 
              onClick={handleAddProduct} 
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                fontSize: '15px',
                fontWeight: '600',
                borderRadius: theme.borderRadius.lg,
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
            >
              <PlusIcon size={18} />
              Ajouter un Produit
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

        {isLoading && (
          <Alert type="warning">
            {editingProduct ? 
              '🔄 Modification du produit en cours...' : 
              '⏳ Traitement en cours...'
            }
          </Alert>
        )}

        {/* ✅ BARRE DE FILTRES AMÉLIORÉE EN FRANÇAIS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.xl,
          padding: theme.spacing.xl,
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.gray[200]}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.lg }}>
            {/* ✅ BOUTON TOUS LES PRODUITS AMÉLIORÉ */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.lg,
              color: theme.colors.white,
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}>
              <span>📦</span>
              Tous les Produits
            </div>
            
            <select style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: '14px',
              color: theme.colors.gray[600],
              outline: 'none',
              backgroundColor: theme.colors.white,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              minWidth: '140px'
            }}>
              <option>Trier par</option>
              <option>Nom</option>
              <option>Date</option>
              <option>Prix</option>
              <option>Stock</option>
            </select>

            <select style={{
              padding: `${theme.spacing.md} ${theme.spacing.lg}`,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.lg,
              fontSize: '14px',
              color: theme.colors.gray[600],
              outline: 'none',
              backgroundColor: theme.colors.white,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              minWidth: '160px'
            }}>
              <option>Filtrer par catégorie</option>
              <option>Électronique</option>
              <option>Vêtements</option>
              <option>Livres</option>
              <option>Maison</option>
            </select>
          </div>

          {/* ✅ STATISTIQUES AMÉLIORÉES EN FRANÇAIS */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: theme.spacing.xl,
            fontSize: '14px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.sm,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius.md,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontWeight: '700', color: theme.colors.gray[800], fontSize: '16px' }}>
                {filteredProducts.length}
              </span>
              <span style={{ color: theme.colors.gray[500] }}>Résultats</span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: theme.spacing.lg,
              fontSize: '13px' 
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: theme.spacing.xs,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                backgroundColor: '#dcfce7',
                borderRadius: theme.borderRadius.sm,
                color: '#16a34a',
                fontWeight: '500'
              }}>
                <span>🟢</span>
                <span>{inStockCount} En stock</span>
              </div>
              
              {lowStockCount > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: theme.spacing.xs,
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  backgroundColor: '#fef3c7',
                  borderRadius: theme.borderRadius.sm,
                  color: '#d97706',
                  fontWeight: '500'
                }}>
                  <span>🟡</span>
                  <span>{lowStockCount} Stock faible</span>
                </div>
              )}
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: theme.spacing.xs,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                backgroundColor: '#fecaca',
                borderRadius: theme.borderRadius.sm,
                color: '#dc2626',
                fontWeight: '500'
              }}>
                <span>🔴</span>
                <span>{outOfStockCount} Rupture</span>
              </div>
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
              Chargement des produits...
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
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
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
                  {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit'}
                </h3>
                <p style={{ 
                  color: theme.colors.gray[500], 
                  marginBottom: theme.spacing.xl,
                  fontSize: '16px',
                  maxWidth: '400px',
                  margin: `0 auto ${theme.spacing.xl} auto`
                }}>
                  {searchTerm 
                    ? 'Essayez d\'ajuster vos termes de recherche ou filtres' 
                    : 'Commencez par créer votre premier produit avec images et spécifications'
                  }
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={handleAddProduct}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    <PlusIcon />
                    Créer votre Premier Produit
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <ProductFormExtended
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
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