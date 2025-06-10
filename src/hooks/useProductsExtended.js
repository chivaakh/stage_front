// src/hooks/useProductsExtended.js - VERSION CORRIGÉE avec modification complète
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
      
      // Filtrer les images valides
      const validImages = (productData.images || []).filter(img => 
        img.url_image && img.url_image.trim() !== ''
      );
      
      // Filtrer les spécifications valides
      const validSpecs = (productData.specifications || []).filter(spec => 
        spec.nom && spec.nom.trim() !== '' && spec.prix && parseFloat(spec.prix) > 0
      );
      
      console.log('✅ Images valides:', validImages);
      console.log('✅ Spécifications valides:', validSpecs);
      
      const completeData = {
        nom: productData.nom,
        description: productData.description,
        reference: productData.reference,
        images: validImages,
        specifications: validSpecs
      };
      
      console.log('📤 Données complètes envoyées au backend:', completeData);
      
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

  // ✅ NOUVELLE FONCTION pour modifier un produit complet
  const updateProductWithDetails = async (productId, productData) => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 DÉBUT - Modification produit avec détails:', productId, productData);
      
      // 1. Mettre à jour les informations de base du produit
      const basicData = {
        nom: productData.nom,
        description: productData.description,
        reference: productData.reference
      };
      
      console.log('📝 Mise à jour données de base:', basicData);
      const productResponse = await axios.put(`${API_URL}${productId}/`, basicData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Produit de base mis à jour:', productResponse.data);

      // 2. Gérer les images
      if (productData.images && productData.images.length > 0) {
        console.log('🖼️ Traitement des images...');
        
        // Supprimer toutes les anciennes images
        try {
          const existingImagesResponse = await axios.get(`${API_URL}${productId}/images/`);
          const existingImages = existingImagesResponse.data;
          
          console.log('🗑️ Suppression des anciennes images:', existingImages.length);
          for (const image of existingImages) {
            await axios.delete(`http://localhost:8000/api/images/${image.id}/`);
          }
        } catch (imageError) {
          console.warn('⚠️ Erreur suppression anciennes images:', imageError);
        }
        
        // Ajouter les nouvelles images
        const validImages = productData.images.filter(img => 
          img.url_image && img.url_image.trim() !== ''
        );
        
        console.log('➕ Ajout nouvelles images:', validImages.length);
        for (const imageData of validImages) {
          try {
            await axios.post(`${API_URL}${productId}/add_image/`, {
              url_image: imageData.url_image,
              est_principale: imageData.est_principale || false,
              ordre: imageData.ordre || 0
            });
          } catch (imageError) {
            console.error('❌ Erreur ajout image:', imageError);
          }
        }
      }

      // 3. Gérer les spécifications
      if (productData.specifications && productData.specifications.length > 0) {
        console.log('📋 Traitement des spécifications...');
        
        // Supprimer toutes les anciennes spécifications
        try {
          const existingSpecsResponse = await axios.get(`${API_URL}${productId}/specifications/`);
          const existingSpecs = existingSpecsResponse.data;
          
          console.log('🗑️ Suppression des anciennes spécifications:', existingSpecs.length);
          for (const spec of existingSpecs) {
            await axios.delete(`http://localhost:8000/api/specifications/${spec.id}/`);
          }
        } catch (specError) {
          console.warn('⚠️ Erreur suppression anciennes spécifications:', specError);
        }
        
        // Ajouter les nouvelles spécifications
        const validSpecs = productData.specifications.filter(spec => 
          spec.nom && spec.nom.trim() !== '' && spec.prix && parseFloat(spec.prix) > 0
        );
        
        console.log('➕ Ajout nouvelles spécifications:', validSpecs.length);
        for (const specData of validSpecs) {
          try {
            await axios.post(`${API_URL}${productId}/add_specification/`, {
              nom: specData.nom,
              description: specData.description || '',
              prix: parseFloat(specData.prix),
              prix_promo: specData.prix_promo ? parseFloat(specData.prix_promo) : null,
              quantite_stock: parseInt(specData.quantite_stock) || 0,
              est_defaut: specData.est_defaut || false,
              reference_specification: specData.reference_specification || ''
            });
          } catch (specError) {
            console.error('❌ Erreur ajout spécification:', specError);
          }
        }
      }

      console.log('✅ Modification complète terminée');
      return { data: productResponse.data };
      
    } catch (error) {
      console.error('❌ Erreur updateProductWithDetails:', error);
      console.error('❌ Détails erreur:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la modification';
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
    updateProductWithDetails, // ✅ NOUVELLE FONCTION
    addImageToProduct,
    addSpecificationToProduct,
    clearError: () => setError('')
  };
};