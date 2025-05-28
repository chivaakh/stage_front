// src/pages/VendeurDashboardExtended.jsx
import { useState } from 'react';
import { Button, Alert } from '../components/ui';
import { PlusIcon } from '../components/icons';
import ProductFormExtended from '../components/products/ProductFormExtended';
import ProductCardExtended from '../components/products/ProductCardExtended';
import ProductSearch from '../components/products/ProductSearch';
import Sidebar from '../components/layout/Sidebar';
import { useProducts, useModal } from '../hooks/useProducts';
import { useProductsExtended } from '../hooks/useProductsExtended';
import { theme } from '../styles/theme';

function VendeurDashboardExtended() {
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
    clearError: clearExtendedError
  } = useProductsExtended();

  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  // Filtrer les produits selon le terme de recherche
  const filteredProducts = filterProducts(products, searchTerm);

  const handleAddProduct = () => {
    setEditingProduct(null);
    openForm();
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    openForm();
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        // Mode édition - utiliser l'ancienne méthode pour le moment
        await editProduct(editingProduct.id, {
          nom: formData.nom,
          description: formData.description,
          reference: formData.reference
        });
      } else {
        // Mode création - utiliser la nouvelle méthode étendue
        await createProductWithDetails(formData);
        // Recharger la liste des produits
        await loadProducts();
      }
      closeForm();
      setEditingProduct(null);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleCloseForm = () => {
    closeForm();
    setEditingProduct(null);
    clearError();
    clearExtendedError();
  };

  const currentError = error || extendedError;
  const isLoading = loading || extendedLoading;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: theme.colors.gray[50],
      fontFamily: theme.fonts.base
    }}>
      {/* Sidebar */}
      <Sidebar onAddProductClick={handleAddProduct} />

      {/* Contenu principal */}
      <div style={{ flex: 1, padding: theme.spacing.lg }}>
        {/* En-tête */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.xl
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: theme.colors.gray[800],
              margin: `0 0 ${theme.spacing.sm} 0`
            }}>
              Tous les produits
            </h1>
            <div style={{ fontSize: '14px', color: theme.colors.gray[500] }}>
              <span style={{ color: theme.colors.primary }}>Dashboard</span> → Tous les produits
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
              placeholder="Rechercher des produits..."
            />
            
            <Button onClick={handleAddProduct} disabled={isLoading}>
              <PlusIcon />
              Ajouter un produit
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

        {/* Filtres et statistiques */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.gray[300]}`
        }}>
          <Button size="sm">
            Tous les produits
          </Button>
          
          <select style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.gray[300]}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '14px',
            color: theme.colors.gray[500],
            outline: 'none'
          }}>
            <option>Trier par</option>
            <option>Nom</option>
            <option>Prix</option>
            <option>Stock</option>
            <option>Date</option>
          </select>

          <select style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.gray[300]}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '14px',
            color: theme.colors.gray[500],
            outline: 'none'
          }}>
            <option>Filtrer par stock</option>
            <option>En stock</option>
            <option>Stock faible</option>
            <option>Rupture</option>
          </select>

          <div style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: theme.spacing.md 
          }}>
            <div style={{ fontSize: '14px', color: theme.colors.gray[500] }}>
              {filteredProducts.length} produit(s)
            </div>
            
            {/* Statistiques rapides */}
            <div style={{
              display: 'flex',
              gap: theme.spacing.lg,
              fontSize: '12px',
              color: theme.colors.gray[400]
            }}>
              <span>
                📦 {filteredProducts.filter(p => p.specifications?.some(s => s.quantite_stock > 0)).length} en stock
              </span>
              <span>
                🚫 {filteredProducts.filter(p => p.specifications?.every(s => s.quantite_stock === 0)).length} rupture
              </span>
              <span>
                🖼️ {filteredProducts.filter(p => p.images?.length > 0).length} avec images
              </span>
            </div>
          </div>
        </div>

        {/* Grille de produits ou état de chargement */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px', 
            color: theme.colors.gray[500] 
          }}>
            <div style={{ fontSize: '24px', marginBottom: theme.spacing.md }}>⏳</div>
            Chargement des produits...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: theme.spacing.lg
          }}>
            {filteredProducts.map(product => (
              <ProductCardExtended
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={removeProduct}
              />
            ))}

            {/* État vide */}
            {filteredProducts.length === 0 && !loading && (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px',
                backgroundColor: theme.colors.white,
                borderRadius: theme.borderRadius.lg,
                border: `2px dashed ${theme.colors.gray[300]}`
              }}>
                <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>📦</div>
                <h3 style={{ 
                  fontSize: '18px', 
                  color: theme.colors.gray[800], 
                  marginBottom: theme.spacing.sm 
                }}>
                  {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit'}
                </h3>
                <p style={{ 
                  color: theme.colors.gray[500], 
                  marginBottom: theme.spacing.lg 
                }}>
                  {searchTerm 
                    ? 'Essayez avec d\'autres mots-clés' 
                    : 'Commencez par créer votre premier produit avec images et spécifications'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddProduct}>
                    <PlusIcon />
                    Créer un produit complet
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Formulaire d'ajout/modification étendu */}
        <ProductFormExtended
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default VendeurDashboardExtended;