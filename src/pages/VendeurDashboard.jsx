import { useState } from 'react';
import { Button, Alert } from '../components/ui';
import { PlusIcon } from '../components/icons';
import ProductFormExtended from '../components/products/ProductFormExtended'; // ✅ CHANGÉ ICI
import ProductCard from '../components/products/ProductCard';
import ProductDetailsModal from '../components/products/ProductDetailsModal';
import ProductSearch from '../components/products/ProductSearch';
import { useProducts, useModal } from '../hooks/useProducts';
import { useProductsExtended } from '../hooks/useProductsExtended'; // ✅ AJOUTÉ
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

  // ✅ AJOUTÉ : Hook pour les produits étendus
  const {
    loading: extendedLoading,
    error: extendedError,
    createProductWithDetails,
    clearError: clearExtendedError
  } = useProductsExtended();

  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal();
  const { isOpen: isDetailsOpen, openModal: openDetails, closeModal: closeDetails } = useModal();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    openDetails();
  };

  // ✅ MISE À JOUR : Gestion des formulaires avec images et spécifications
  const handleFormSubmit = async (formData) => {
  try {
    console.log('📝 Soumission formulaire avec données:', formData);
    
    if (editingProduct) {
      // Mode édition - utiliser l'ancienne méthode pour le moment
      await editProduct(editingProduct.id, {
        nom: formData.nom,
        description: formData.description,
        reference: formData.reference
      });
    } else {
      // ✅ Mode création - utiliser la nouvelle méthode qui envoie TOUT
      console.log('🆕 Création avec méthode complète');
      await createProductWithDetails(formData);
      // Recharger la liste des produits
      await loadProducts();
    }
    closeForm();
    setEditingProduct(null);
  } catch (error) {
    console.error('❌ Erreur lors de la soumission:', error);
  }
};

// 3. ✅ TEST RAPIDE - Vérifiez que les images sont bien dans formData
// Ajoutez ceci temporairement dans ProductFormExtended, dans handleSubmit :

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  // ✅ DEBUG : Vérifier les données avant envoi
  console.log('🔍 DEBUG - FormData au moment de la soumission:');
  console.log('📝 Nom:', formData.nom);
  console.log('🖼️ Images:', formData.images);
  console.log('📋 Spécifications:', formData.specifications);
  
  // Vérifier spécifiquement les images
  formData.images.forEach((img, index) => {
    console.log(`Image ${index + 1}:`, {
      url: img.url_image,
      principale: img.est_principale,
      ordre: img.ordre
    });
  });

  try {
    await onSubmit(formData);
    handleClose();
  } catch (error) {
    console.error('Erreur lors de la soumission:', error);
  }
};

  const handleCloseForm = () => {
    closeForm();
    setEditingProduct(null);
    clearError();
    clearExtendedError(); // ✅ AJOUTÉ
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

  // ✅ MISE À JOUR : Gestion des erreurs étendues
  const currentError = error || extendedError;
  const isLoading = loading || extendedLoading;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: theme.colors.gray[50],
      fontFamily: theme.fonts.base
    }}>
      {/* Sidebar - identique */}
      <div style={{
        width: '280px',
        backgroundColor: theme.colors.white,
        borderRight: `1px solid ${theme.colors.gray[300]}`,
        padding: `${theme.spacing.lg} 0`
      }}>
        <div style={{ padding: `0 ${theme.spacing.lg}`, marginBottom: theme.spacing.xl }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: theme.colors.gray[800],
            margin: 0
          }}>
            E-Commerce
          </h1>
        </div>

        <nav style={{ padding: `0 ${theme.spacing.md}` }}>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              backgroundColor: theme.colors.gray[200],
              borderRadius: theme.borderRadius.md,
              color: theme.colors.gray[700],
              fontWeight: '500'
            }}>
              📊 Dashboard
            </div>
          </div>
          
          <div style={{ marginBottom: theme.spacing.sm }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              color: theme.colors.gray[500],
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer'
            }}>
              🛒 Commandes
            </div>
          </div>

          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              backgroundColor: theme.colors.primary,
              color: theme.colors.white,
              borderRadius: theme.borderRadius.md,
              fontWeight: '500'
            }}>
              📦 Produits
            </div>
            <div style={{ marginLeft: '20px', marginTop: theme.spacing.sm }}>
              <div style={{ 
                padding: `${theme.spacing.sm} ${theme.spacing.md}`, 
                color: theme.colors.primary, 
                fontSize: '14px' 
              }}>
                Tous les produits
              </div>
              <div style={{ 
                padding: `${theme.spacing.sm} ${theme.spacing.md}`, 
                color: theme.colors.gray[500], 
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={handleAddProduct}
              >
                Ajouter un produit
              </div>
            </div>
          </div>

          <div style={{ marginBottom: theme.spacing.sm }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              color: theme.colors.gray[500],
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer'
            }}>
              👥 Clients
            </div>
          </div>

          <div style={{ marginBottom: theme.spacing.sm }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              color: theme.colors.gray[500],
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer'
            }}>
              💬 Messages
            </div>
          </div>
        </nav>

        <div style={{ 
          position: 'absolute', 
          bottom: theme.spacing.lg, 
          left: theme.spacing.lg, 
          right: theme.spacing.lg,
          borderTop: `1px solid ${theme.colors.gray[300]}`,
          paddingTop: theme.spacing.lg
        }}>
          <div style={{ 
            color: theme.colors.gray[500], 
            fontSize: '14px', 
            marginBottom: theme.spacing.sm,
            cursor: 'pointer'
          }}>
            🔧 Paramètres
          </div>
          <div style={{ 
            color: theme.colors.gray[500], 
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            🚪 Déconnexion
          </div>
        </div>
      </div>

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

        {/* ✅ MISE À JOUR : Alertes d'erreur étendues */}
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

        {/* Filtres - identique */}
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
            <option>Date</option>
            <option>Prix</option>
          </select>

          <select style={{
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            border: `1px solid ${theme.colors.gray[300]}`,
            borderRadius: theme.borderRadius.sm,
            fontSize: '14px',
            color: theme.colors.gray[500],
            outline: 'none'
          }}>
            <option>Filtrer par catégorie</option>
            <option>Électronique</option>
            <option>Vêtements</option>
            <option>Livres</option>
          </select>

          <div style={{ 
            marginLeft: 'auto', 
            display: 'flex', 
            alignItems: 'center', 
            gap: theme.spacing.sm 
          }}>
            <span style={{ fontSize: '14px', color: theme.colors.gray[500] }}>
              {filteredProducts.length} résultat(s)
            </span>
          </div>
        </div>

        {/* Grille de produits - identique */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px', 
            color: theme.colors.gray[500] 
          }}>
            Chargement des produits...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: theme.spacing.lg
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
                    Créer un produit complet
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ✅ CHANGÉ : Formulaire étendu avec onglets */}
        <ProductFormExtended
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          isLoading={isLoading}
        />

        {/* Modal de détails du produit - identique */}
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