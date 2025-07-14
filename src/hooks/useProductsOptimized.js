// src/hooks/useProductsOptimized.js - VERSION CORRIGÉE AVEC PROXY

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

      if (filters.search?.trim()) {
        params.append('search', filters.search.trim());
      }
      if (filters.category) {
        params.append('categorie', filters.category);
      }
      if (filters.sortBy) {
        params.append('ordering', filters.sortBy);
      }
      if (filters.stockFilter) {
        params.append('stock_filter', filters.stockFilter);
      }

      console.log('🔍 URL chargée:', `/api/produits/?${params}`);

      const response = await fetch(`/api/produits/?${params}`, {
        credentials: 'include' // essentiel pour les sessions
      });
      
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (data.results && Array.isArray(data.results)) {
        setProducts(data.results);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          totalPages: data.total_pages || Math.ceil(data.count / prev.itemsPerPage),
          totalItems: data.count || data.results.length
        }));
      } else if (Array.isArray(data)) {
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
      console.error('❌ Erreur chargement produits:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.itemsPerPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => loadProducts(1), 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  useEffect(() => {
    loadProducts(1);
  }, []);

  const updateFilters = (newFilters) => {
    console.log('🔧 Filtres mis à jour:', newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const changePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages && !loading) {
      console.log('📄 Page changée vers:', page);
      loadProducts(page);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🆕 Création produit:', productData);

      const response = await fetch('/api/produits/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Erreur création produit');
      }

      const newProduct = await response.json();
      console.log('✅ Produit créé:', newProduct);
      await loadProducts(1);
      return newProduct;

    } catch (err) {
      console.error('❌ Erreur création:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Mise à jour produit:', productId, updatedData);

      const response = await fetch(`/api/produits/${productId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.error || 'Erreur mise à jour produit');
      }

      const updatedProduct = await response.json();
      console.log('✅ Produit mis à jour:', updatedProduct);
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

  const deleteProduct = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🗑️ Suppression produit:', productId);

      const response = await fetch(`/api/produits/${productId}/`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Erreur suppression produit');

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

  const clearError = () => setError(null);

  const stats = {
    total: pagination.totalItems,
    inStock: products.filter(p => (p.stock_total || 0) > 5).length,
    lowStock: products.filter(p => (p.stock_total || 0) > 0 && (p.stock_total || 0) <= 5).length,
    outOfStock: products.filter(p => (p.stock_total || 0) === 0).length,
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
