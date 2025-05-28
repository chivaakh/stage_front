// src/api/produitAPI.js - Version mise à jour
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/produits/';

// Configuration axios avec intercepteurs pour debug
axios.interceptors.request.use(request => {
  console.log('🚀 Requête:', request.method?.toUpperCase(), request.url);
  return request;
});

axios.interceptors.response.use(
  response => {
    console.log('✅ Réponse:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('❌ Erreur API:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export const getProduits = async () => {
  try {
    const response = await axios.get(API_URL);
    return {
      data: response.data.results || response.data || []
    };
  } catch (error) {
    console.error('❌ Erreur getProduits:', error);
    throw error;
  }
};

export const getProduit = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getProduit:', error);
    throw error;
  }
};

export const createProduit = async (produit) => {
  try {
    const cleanData = {
      nom: String(produit.nom || '').trim(),
      description: String(produit.description || '').trim(),
      reference: String(produit.reference || '').trim()
    };

    console.log('📤 Création produit:', cleanData);
    const response = await axios.post(API_URL, cleanData);
    return response;
  } catch (error) {
    console.error('❌ Erreur createProduit:', error);
    throw error;
  }
};

export const updateProduit = (id, produit) => {
  const cleanedData = {
    nom: produit.nom?.trim(),
    description: produit.description?.trim(),
    reference: produit.reference?.trim()
  };
  
  return axios.put(`${API_URL}${id}/`, cleanedData);
};

export const deleteProduit = (id) => {
  return axios.delete(`${API_URL}${id}/`);
};

// ✅ NOUVELLES FONCTIONS pour Images et Spécifications
export const addImageToProduit = async (produitId, imageData) => {
  try {
    console.log('📤 Ajout image au produit:', produitId, imageData);
    
    const response = await axios.post(`${API_URL}${produitId}/add_image/`, imageData);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur addImageToProduit:', error);
    throw error;
  }
};

export const addSpecificationToProduit = async (produitId, specData) => {
  try {
    console.log('📤 Ajout spécification au produit:', produitId, specData);
    
    const response = await axios.post(`${API_URL}${produitId}/add_specification/`, specData);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur addSpecificationToProduit:', error);
    throw error;
  }
};

export const getImagesProduit = async (produitId) => {
  try {
    const response = await axios.get(`${API_URL}${produitId}/images/`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getImagesProduit:', error);
    throw error;
  }
};

export const getSpecificationsProduit = async (produitId) => {
  try {
    const response = await axios.get(`${API_URL}${produitId}/specifications/`);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getSpecificationsProduit:', error);
    throw error;
  }
};