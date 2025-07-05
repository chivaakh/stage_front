// src/pages/client/CategoryDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Search } from 'lucide-react';
import ClientLayout from '../../components/client/layout/ClientLayout';
import ProductCard from '../../components/client/product/ProductClientCard';
import { fetchCategories, fetchProduitsByCategorie, ajouterProduitAuPanier } from '../../api/clientAPI';

const CategoryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(new Set());
  

  useEffect(() => {
    loadCategoryData();
  }, [id]);

  const loadCategoryData = async () => {
    try {
      setLoading(true);
      
      // Charger les informations de la catégorie
      const categoriesResponse = await fetchCategories();
      let categoriesData = [];
      
      if (categoriesResponse.data) {
        if (categoriesResponse.data.results && Array.isArray(categoriesResponse.data.results)) {
          categoriesData = categoriesResponse.data.results;
        } else if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data;
        }
      }
      
      const foundCategory = categoriesData.find(cat => cat.id.toString() === id);
      
      if (!foundCategory) {
        setError('Catégorie non trouvée');
        return;
      }
      
      setCategory(foundCategory);
      
      // Charger les produits de cette catégorie
      try {
        const productsResponse = await fetchProduitsByCategorie(id);
        let productsData = [];
        
        if (productsResponse.data) {
          if (productsResponse.data.results && Array.isArray(productsResponse.data.results)) {
            productsData = productsResponse.data.results;
          } else if (Array.isArray(productsResponse.data)) {
            productsData = productsResponse.data;
          }
        }
        
        setProducts(productsData);
      } catch (productsError) {
        console.error('Erreur chargement produits:', productsError);
        setProducts([]);
      }
      
    } catch (error) {
      console.error('Erreur chargement catégorie:', error);
      setError('Erreur lors du chargement de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  // FIX: Handle both product ID and product object
  const handleAddToCart = async (productOrId) => {
    // Extract the product ID whether we receive an ID or a product object
    const produitId = typeof productOrId === 'object' ? productOrId.id : productOrId;
    
    console.log('Adding to cart - Product ID:', produitId); // Debug log
    
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

  const handleViewDetails = (product) => {
    navigate(`/produits/${product.id}`);
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    console.log('Toggle wishlist:', productId, isWishlisted);
    // Ici vous ajouteriez la logique des favoris
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error || !category) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="text-6xl mb-4">😞</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {error || 'Catégorie non trouvée'}
              </h1>
              <p className="text-gray-600 mb-6">
                La catégorie que vous recherchez n'existe pas ou a été supprimée.
              </p>
              <button
                onClick={() => navigate('/categories')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Retour aux catégories
              </button>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">
              Accueil
            </button>
            <span>/</span>
            <button onClick={() => navigate('/categories')} className="hover:text-blue-600">
              Catégories
            </button>
            <span>/</span>
            <span className="text-gray-900">{category.nom}</span>
          </nav>

          {/* En-tête de la catégorie */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {category.nom}
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                  {category.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Package size={16} />
                    <span>{products.length} produit{products.length > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/categories')}
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Retour
              </button>
            </div>
          </div>

          {/* Liste des produits */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit dans cette catégorie
              </h3>
              <p className="text-gray-600 mb-6">
                Cette catégorie ne contient pas encore de produits.
              </p>
              <button
                onClick={() => navigate('/produits')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search size={20} className="mr-2" />
                Voir tous les produits
              </button>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default CategoryDetailPage;