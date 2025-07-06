// src/api/clientAPI.js - ENDPOINTS CORRIGÉS
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const clientAPI = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les erreurs
clientAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===== PRODUITS CLIENT =====
export const fetchProduits = (params = {}) =>
  clientAPI.get('/client/produits/', { params });

export const fetchProduitById = (id) =>
  clientAPI.get(`/client/produits/${id}/`);

export const fetchNouveautes = () =>
  clientAPI.get('/client/produits/nouveaute/');

export const fetchPopulaires = () =>
  clientAPI.get('/client/produits/populaires/');

export const rechercherProduits = (searchParams) =>
  clientAPI.get('/client/produits/recherche/', { params: searchParams });

// ===== CATÉGORIES CLIENT =====
export const fetchCategories = () =>
  clientAPI.get('/client/categories/');

export const fetchProduitsByCategorie = (id, params = {}) =>
  clientAPI.get(`/client/categories/${id}/produits/`, { params });

// ===== PANIER =====
export const fetchPanier = () =>
  clientAPI.get('/client/panier/');

export const ajouterAuPanier = (data) =>
  clientAPI.post('/client/panier/', data);

export const modifierQuantitePanier = (id, quantite) =>
  clientAPI.patch(`/client/panier/${id}/`, { quantite });

export const supprimerDuPanier = (id) =>
  clientAPI.delete(`/client/panier/${id}/`);

export const viderPanier = () =>
  clientAPI.post('/client/panier/vider/');

export const resumePanier = () =>
  clientAPI.get('/client/panier/resume/');

export const ajouterProduitAuPanier = (produitId, quantite = 1) =>
  clientAPI.post('/client/panier/ajouter_rapide/', { 
    produit_id: produitId, 
    quantite 
  });

// ===== FAVORIS =====
export const fetchFavoris = () =>
  clientAPI.get('/client/favoris/');

export const toggleFavori = (produitId) =>
  clientAPI.post('/client/favoris/toggle/', { produit_id: produitId });

// ===== COMMANDES =====
export const fetchMesCommandes = () =>
  clientAPI.get('/client/commandes/');

export const passerCommande = (adresseLivraison) =>
  clientAPI.post('/client/commandes/commander/', { adresse_livraison: adresseLivraison });

// ===== AVIS =====
export const ajouterAvis = (data) =>
  clientAPI.post('/client/avis/', data);

export const fetchAvisProduit = (produitId) =>
  clientAPI.get(`/client/produits/${produitId}/avis/`);

// ===== PROFIL =====
export const fetchMonProfil = () =>
  clientAPI.get('/client/profil/mon_profil/');

export const modifierProfil = (data) =>
  clientAPI.patch('/client/profil/mon_profil/', data);

export default clientAPI;