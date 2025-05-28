// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { getProduits, createProduit, updateProduit, deleteProduit } from '../api/produitAPI';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getProduits();
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    try {
      setError('');
      await createProduit(productData);
      await loadProducts(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError('Erreur lors de la création du produit');
      throw error;
    }
  };

  const editProduct = async (id, productData) => {
    try {
      setError('');
      await updateProduit(id, productData);
      await loadProducts(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      setError('Erreur lors de la modification du produit');
      throw error;
    }
  };

  const removeProduct = async (id) => {
    try {
      setError('');
      await deleteProduit(id);
      await loadProducts(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression du produit');
      throw error;
    }
  };

  const filterProducts = (products, searchTerm) => {
    if (!searchTerm) return products;
    
    return products.filter(product =>
      product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    editProduct,
    removeProduct,
    filterProducts,
    clearError: () => setError('')
  };
};

// Hook pour gérer l'état des modales
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen(!isOpen);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  };
};