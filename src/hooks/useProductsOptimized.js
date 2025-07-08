// src/hooks/useProductsOptimized.js - VERSION FINALE CORRIGÉE

import { useState, useEffect, useCallback } from 'react';

export const useProductsOptimized = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // ✅ États pour filtrage et tri
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: '',
    stockFilter: ''
  });

  const loadProducts = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pagination.itemsPerPage.toString()
      });

      // ✅ Ajouter les filtres seulement s'ils sont définis
      if (filters.search?.trim()) {
        params.append('search', filters.search.trim());
      }
      
      if (filters.category && filters.category !== '') {
        params.append('categorie', filters.category);
      }
      
      if (filters.sortBy && filters.sortBy !== '') {
        params.append('ordering', filters.sortBy);
      }
      
      if (filters.stockFilter && filters.stockFilter !== '') {
        params.append('stock_filter', filters.stockFilter);
      }

      console.log('🔍 Chargement des produits avec URL:', `http://localhost:8000/api/produits/?${params}`);

      const response = await fetch(`http://localhost:8000/api/produits/?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Données reçues:', data);
      
      // ✅ Gestion flexible de la réponse (avec ou sans pagination)
      if (data.results && Array.isArray(data.results)) {
        // Format paginé de Django REST Framework
        setProducts(data.results);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalPages: data.total_pages || Math.ceil(data.count / prev.itemsPerPage),
          totalItems: data.count || data.results.length
        }));
      } else if (Array.isArray(data)) {
        // Format direct (tableau)
        setProducts(data);
        setPagination(prev => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: data.length
        }));
      } else {
        throw new Error('Format de réponse inattendu');
      }

    } catch (err) {
      console.error('❌ Erreur lors du chargement des produits:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.itemsPerPage]);

  // ✅ Recharger quand les filtres changent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProducts(1);
    }, 300); // Debounce de 300ms pour éviter trop de requêtes

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // ✅ Chargement initial
  useEffect(() => {
    loadProducts(1);
  }, []); // Seulement au mount

  // ✅ Fonction pour mettre à jour les filtres
  const updateFilters = (newFilters) => {
    console.log('🔧 Mise à jour des filtres:', newFilters);
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  // ✅ Fonction pour changer de page
  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages && !loading) {
      console.log('📄 Changement de page vers:', page);
      loadProducts(page);
    }
  };

  // ✅ Fonction pour créer un produit
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🆕 Création produit avec données:', productData);
      
      const response = await fetch('http://localhost:8000/api/produits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        throw new Error(errorData.detail || errorData.error || 'Erreur lors de la création du produit');
      }

      const newProduct = await response.json();
      console.log('✅ Produit créé:', newProduct);

      // Recharger la liste actuelle
      await loadProducts(pagination.currentPage);
      return newProduct;

    } catch (err) {
      console.error('❌ Erreur lors de la création:', err);
      setError(err.message);
      throw err; // Relancer l'erreur pour que le composant puisse la gérer
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour modifier un produit
  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Modification produit ID:', productId, 'avec données:', updatedData);
      
      const response = await fetch(`http://localhost:8000/api/produits/${productId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        throw new Error(errorData.detail || errorData.error || 'Erreur lors de la modification du produit');
      }

      const updatedProduct = await response.json();
      console.log('✅ Produit modifié:', updatedProduct);

      await loadProducts(pagination.currentPage);
      return updatedProduct;
    } catch (err) {
      console.error('❌ Erreur updateProduct:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour supprimer un produit
  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🗑️ Suppression produit ID:', productId);
      
      const response = await fetch(`http://localhost:8000/api/produits/${productId}/`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }

      console.log('✅ Produit supprimé');
      await loadProducts(pagination.currentPage);
    } catch (err) {
      console.error('❌ Erreur deleteProduct:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour effacer les erreurs
  const clearError = () => {
    setError(null);
  };

  // ✅ Calcul des statistiques basé sur les produits actuels
  const stats = {
    total: pagination.totalItems,
    inStock: products.filter(p => {
      const stockTotal = p.stock_total || 0;
      return stockTotal > 5;
    }).length,
    lowStock: products.filter(p => {
      const stockTotal = p.stock_total || 0;
      return stockTotal > 0 && stockTotal <= 5;
    }).length,
    outOfStock: products.filter(p => {
      const stockTotal = p.stock_total || 0;
      return stockTotal === 0;
    }).length,
    withImages: products.filter(p => p.images?.length > 0).length
  };

  return {
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
    clearError,
    reload: () => loadProducts(pagination.currentPage),
  };
};