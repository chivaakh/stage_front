// src/hooks/useProductsExtended.js - VERSION CORRIGÉE avec imports

// ✅ IMPORT MANQUANT - C'est ça le problème !
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/produits/';

export const useProductsExtended = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createProductWithDetails = async (productData) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🚀 DÉBUT - Création produit avec détails:', productData);
      
      // Vérification : Les images sont-elles bien présentes ?
      console.log('🖼️ Images à traiter:', productData.images);
      console.log('📋 Spécifications à traiter:', productData.specifications);
      
      // Filtrer les images valides (avec URL non vide)
      const validImages = (productData.images || []).filter(img => 
        img.url_image && img.url_image.trim() !== ''
      );
      
      // Filtrer les spécifications valides
      const validSpecs = (productData.specifications || []).filter(spec => 
        spec.nom && spec.nom.trim() !== '' && spec.prix && parseFloat(spec.prix) > 0
      );
      
      console.log('✅ Images valides:', validImages);
      console.log('✅ Spécifications valides:', validSpecs);
      
      // Préparer les données complètes pour l'envoi
      const completeData = {
        nom: productData.nom,
        description: productData.description,
        reference: productData.reference,
        images: validImages,
        specifications: validSpecs
      };
      
      console.log('📤 Données complètes envoyées au backend:', completeData);
      
      // Envoyer TOUTES les données en une fois au backend
      const response = await axios.post(API_URL, completeData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Réponse du backend:', response.data);
      return { data: response.data };
      
    } catch (error) {
      console.error('❌ Erreur createProductWithDetails:', error);
      console.error('❌ Détails erreur:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la création';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addImageToProduct = async (productId, imageData) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}${productId}/add_image/`, imageData);
      return response.data;
    } catch (error) {
      const errorMessage = `Erreur ajout image: ${error.message}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addSpecificationToProduct = async (productId, specData) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}${productId}/add_specification/`, specData);
      return response.data;
    } catch (error) {
      const errorMessage = `Erreur ajout spécification: ${error.message}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    loading,
    error,
    createProductWithDetails,
    addImageToProduct,
    addSpecificationToProduct,
    clearError: () => setError('')
  };
};