// src/api/clientAPI.js - Mise à jour avec toutes les fonctionnalités

import axios from 'axios';

// Configuration de base
const API_BASE_URL = (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter des headers personnalisés
api.interceptors.request.use(
  (config) => {
    // Ajouter token d'authentification si disponible
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log pour debug
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status || 'Network'} ${error.config?.url}`, error.response?.data);
    
    // Gestion des erreurs globales
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      // Rediriger vers login si nécessaire
    }
    
    return Promise.reject(error);
  }
);

// ===========================
// PRODUITS
// ===========================

export const fetchProduits = async (params = {}) => {
  try {
    return await api.get('/client/produits/', { params });
  } catch (error) {
    console.error('Erreur fetchProduits:', error);
    throw error;
  }
};

export const fetchProduitById = async (id) => {
  try {
    return await api.get(`/client/produits/${id}/`);
  } catch (error) {
    console.error('Erreur fetchProduitById:', error);
    throw error;
  }
};

export const rechercherProduits = async (params = {}) => {
  try {
    return await api.get('/client/produits/recherche/', { params });
  } catch (error) {
    console.error('Erreur rechercherProduits:', error);
    throw error;
  }
};

export const fetchNouveautes = async (params = {}) => {
  try {
    return await api.get('/client/produits/nouveaute/', { params });
  } catch (error) {
    console.error('Erreur fetchNouveautes:', error);
    throw error;
  }
};

export const fetchPopulaires = async (params = {}) => {
  try {
    return await api.get('/client/produits/populaires/', { params });
  } catch (error) {
    console.error('Erreur fetchPopulaires:', error);
    throw error;
  }
};

// ===========================
// CATÉGORIES
// ===========================

export const fetchCategories = async (params = {}) => {
  try {
    return await api.get('/client/categories/', { params });
  } catch (error) {
    console.error('Erreur fetchCategories:', error);
    throw error;
  }
};

export const fetchProduitsByCategorie = async (categorieId, params = {}) => {
  try {
    return await api.get(`/client/categories/${categorieId}/produits/`, { params });
  } catch (error) {
    console.error('Erreur fetchProduitsByCategorie:', error);
    throw error;
  }
};

// ===========================
// PANIER
// ===========================

export const fetchPanier = async () => {
  try {
    return await api.get('/client/panier/');
  } catch (error) {
    console.error('Erreur fetchPanier:', error);
    throw error;
  }
};

export const resumePanier = async () => {
  try {
    return await api.get('/client/panier/resume/');
  } catch (error) {
    console.error('Erreur resumePanier:', error);
    throw error;
  }
};

export const ajouterProduitAuPanier = async (produitId, quantite = 1) => {
  try {
    return await api.post('/client/panier/ajouter_rapide/', {
      produit_id: produitId,
      quantite: quantite
    });
  } catch (error) {
    console.error('Erreur ajouterProduitAuPanier:', error);
    throw error;
  }
};

export const modifierQuantitePanier = async (itemId, quantite) => {
  try {
    return await api.patch(`/client/panier/${itemId}/`, { quantite });
  } catch (error) {
    console.error('Erreur modifierQuantitePanier:', error);
    throw error;
  }
};

export const supprimerDuPanier = async (itemId) => {
  try {
    return await api.delete(`/client/panier/${itemId}/`);
  } catch (error) {
    console.error('Erreur supprimerDuPanier:', error);
    throw error;
  }
};

export const viderPanier = async () => {
  try {
    return await api.post('/client/panier/vider/');
  } catch (error) {
    console.error('Erreur viderPanier:', error);
    throw error;
  }
};

// ===========================
// FAVORIS
// ===========================

export const fetchFavoris = async () => {
  try {
    return await api.get('/client/favoris/');
  } catch (error) {
    console.error('Erreur fetchFavoris:', error);
    throw error;
  }
};

export const ajouterAuxFavoris = async (produitId) => {
  try {
    return await api.post('/client/favoris/', { produit: produitId });
  } catch (error) {
    console.error('Erreur ajouterAuxFavoris:', error);
    throw error;
  }
};

export const supprimerFavori = async (favoriId) => {
  try {
    return await api.delete(`/client/favoris/${favoriId}/`);
  } catch (error) {
    console.error('Erreur supprimerFavori:', error);
    throw error;
  }
};

export const toggleFavori = async (produitId) => {
  try {
    return await api.post('/client/favoris/toggle/', { produit_id: produitId });
  } catch (error) {
    console.error('Erreur toggleFavori:', error);
    throw error;
  }
};

// ===========================
// COMMANDES
// ===========================

export const fetchMesCommandes = async (params = {}) => {
  try {
    return await api.get('/client/commandes/', { params });
  } catch (error) {
    console.error('Erreur fetchMesCommandes:', error);
    throw error;
  }
};

export const fetchCommandeById = async (commandeId) => {
  try {
    return await api.get(`/client/commandes/${commandeId}/`);
  } catch (error) {
    console.error('Erreur fetchCommandeById:', error);
    throw error;
  }
};

export const creerCommande = async (commandeData) => {
  try {
    return await api.post('/client/commandes/commander/', commandeData);
  } catch (error) {
    console.error('Erreur creerCommande:', error);
    throw error;
  }
};

export const fetchTrackingCommande = async (commandeId) => {
  try {
    return await api.get(`/commandes/${commandeId}/tracking/`);
  } catch (error) {
    console.error('Erreur fetchTrackingCommande:', error);
    throw error;
  }
};

// ===========================
// AVIS ET ÉVALUATIONS
// ===========================

export const fetchAvisProduit = async (produitId) => {
  try {
    return await api.get(`/client/produits/${produitId}/avis/`);
  } catch (error) {
    console.error('Erreur fetchAvisProduit:', error);
    throw error;
  }
};

export const ajouterAvis = async (avisData) => {
  try {
    return await api.post('/client/avis/', avisData);
  } catch (error) {
    console.error('Erreur ajouterAvis:', error);
    throw error;
  }
};

export const modifierAvis = async (avisId, avisData) => {
  try {
    return await api.patch(`/client/avis/${avisId}/`, avisData);
  } catch (error) {
    console.error('Erreur modifierAvis:', error);
    throw error;
  }
};

export const supprimerAvis = async (avisId) => {
  try {
    return await api.delete(`/client/avis/${avisId}/`);
  } catch (error) {
    console.error('Erreur supprimerAvis:', error);
    throw error;
  }
};

// ===========================
// AUTHENTIFICATION
// ===========================

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/login/', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Erreur login:', error);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    return await api.post('/api/signup/', userData);
  } catch (error) {
    console.error('Erreur signup:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem('authToken');
    return { success: true };
  } catch (error) {
    console.error('Erreur logout:', error);
    throw error;
  }
};

// ===========================
// PROFIL CLIENT
// ===========================

export const fetchProfilClient = async () => {
  try {
    return await api.get('/client/profil/mon_profil/');
  } catch (error) {
    console.error('Erreur fetchProfilClient:', error);
    throw error;
  }
};

export const modifierProfilClient = async (profilData) => {
  try {
    return await api.patch('/client/profil/mon_profil/', profilData);
  } catch (error) {
    console.error('Erreur modifierProfilClient:', error);
    throw error;
  }
};

// ===========================
// CHECKOUT ET PAIEMENT
// ===========================

export const calculerFraisLivraison = async (adresse, modeLivraison) => {
  try {
    return await api.post('/api/calculer-frais-livraison/', {
      adresse,
      mode_livraison: modeLivraison
    });
  } catch (error) {
    console.error('Erreur calculerFraisLivraison:', error);
    throw error;
  }
};

export const validerAdresseLivraison = async (adresse) => {
  try {
    return await api.post('/api/valider-adresse/', { adresse });
  } catch (error) {
    console.error('Erreur validerAdresseLivraison:', error);
    throw error;
  }
};

export const initierPaiement = async (paiementData) => {
  try {
    return await api.post('/api/initier-paiement/', paiementData);
  } catch (error) {
    console.error('Erreur initierPaiement:', error);
    throw error;
  }
};

export const confirmerPaiement = async (paiementId, confirmationData) => {
  try {
    return await api.post(`/api/confirmer-paiement/${paiementId}/`, confirmationData);
  } catch (error) {
    console.error('Erreur confirmerPaiement:', error);
    throw error;
  }
};

// ===========================
// NOTIFICATIONS
// ===========================

export const fetchNotifications = async () => {
  try {
    return await api.get('/notifications/');
  } catch (error) {
    console.error('Erreur fetchNotifications:', error);
    throw error;
  }
};

export const marquerNotificationLue = async (notificationId) => {
  try {
    return await api.patch(`/notifications/${notificationId}/`, { est_lue: true });
  } catch (error) {
    console.error('Erreur marquerNotificationLue:', error);
    throw error;
  }
};

// ===========================
// SUPPORT CLIENT
// ===========================

export const envoyerMessageSupport = async (message) => {
  try {
    return await api.post('/api/support/message/', message);
  } catch (error) {
    console.error('Erreur envoyerMessageSupport:', error);
    throw error;
  }
};

export const fetchConversationsSupport = async () => {
  try {
    return await api.get('/api/support/conversations/');
  } catch (error) {
    console.error('Erreur fetchConversationsSupport:', error);
    throw error;
  }
};

// ===========================
// UTILITAIRES
// ===========================

export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return await api.post('/upload-image/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Erreur uploadImage:', error);
    throw error;
  }
};

export const rechercheGlobale = async (query, filters = {}) => {
  try {
    return await api.get('/api/recherche-globale/', {
      params: { q: query, ...filters }
    });
  } catch (error) {
    console.error('Erreur rechercheGlobale:', error);
    throw error;
  }
};

export const fetchStatistiquesClient = async () => {
  try {
    return await api.get('/api/client/statistiques/');
  } catch (error) {
    console.error('Erreur fetchStatistiquesClient:', error);
    throw error;
  }
};

// ===========================
// FONCTIONS D'AIDE
// ===========================

// Fonction pour formater les erreurs API
export const formatApiError = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.response?.status === 404) {
    return 'Ressource non trouvée';
  }
  
  if (error.response?.status === 500) {
    return 'Erreur serveur. Veuillez réessayer plus tard.';
  }
  
  if (error.code === 'ECONNABORTED') {
    return 'Délai d\'attente dépassé. Vérifiez votre connexion.';
  }
  
  return 'Une erreur inattendue est survenue';
};

// Fonction pour vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Fonction pour obtenir les informations de l'utilisateur connecté
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Erreur parsing userInfo:', error);
    return null;
  }
};

// Fonction pour sauvegarder les informations utilisateur
export const saveUserInfo = (userInfo) => {
  try {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.error('Erreur sauvegarde userInfo:', error);
  }
};

// Fonction pour nettoyer les données utilisateur
export const clearUserData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
};

// ===========================
// CACHE ET OPTIMISATIONS
// ===========================

// Cache simple pour les catégories (données qui changent peu)
let categoriesCache = null;
let categoriesCacheTime = null;
const CATEGORIES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchCategoriesWithCache = async () => {
  const now = Date.now();
  
  // Vérifier si le cache est encore valide
  if (categoriesCache && categoriesCacheTime && (now - categoriesCacheTime) < CATEGORIES_CACHE_DURATION) {
    console.log('📂 Utilisation du cache pour les catégories');
    return { data: categoriesCache };
  }
  
  try {
    const response = await fetchCategories();
    categoriesCache = response.data;
    categoriesCacheTime = now;
    console.log('📂 Catégories mises en cache');
    return response;
  } catch (error) {
    // En cas d'erreur, utiliser le cache si disponible
    if (categoriesCache) {
      console.log('📂 Utilisation du cache suite à une erreur');
      return { data: categoriesCache };
    }
    throw error;
  }
};

// Fonction pour invalider le cache des catégories
export const invalidateCategoriesCache = () => {
  categoriesCache = null;
  categoriesCacheTime = null;
  console.log('📂 Cache catégories invalidé');
};

// ===========================
// GESTION HORS LIGNE
// ===========================

// Fonction pour vérifier la connectivité
export const checkConnectivity = async () => {
  try {
    await api.get('/api/health-check/', { timeout: 3000 });
    return true;
  } catch (error) {
    return false;
  }
};

// Fonction pour synchroniser les données hors ligne
export const syncOfflineData = async () => {
  try {
    const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    
    if (offlineActions.length === 0) {
      return { success: true, synced: 0 };
    }
    
    let syncedCount = 0;
    const failedActions = [];
    
    for (const action of offlineActions) {
      try {
        switch (action.type) {
          case 'ADD_TO_CART':
            await ajouterProduitAuPanier(action.data.produitId, action.data.quantite);
            break;
          case 'ADD_TO_FAVORITES':
            await ajouterAuxFavoris(action.data.produitId);
            break;
          case 'REMOVE_FROM_FAVORITES':
            await supprimerFavori(action.data.favoriId);
            break;
          default:
            console.warn('Type d\'action hors ligne non géré:', action.type);
        }
        syncedCount++;
      } catch (error) {
        console.error('Erreur sync action:', action, error);
        failedActions.push(action);
      }
    }
    
    // Sauvegarder les actions qui ont échoué
    localStorage.setItem('offlineActions', JSON.stringify(failedActions));
    
    return { 
      success: true, 
      synced: syncedCount, 
      failed: failedActions.length 
    };
    
  } catch (error) {
    console.error('Erreur sync données hors ligne:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour ajouter une action à la queue hors ligne
export const addOfflineAction = (type, data) => {
  try {
    const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    const newAction = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    offlineActions.push(newAction);
    localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
    
    console.log('📱 Action ajoutée à la queue hors ligne:', newAction);
  } catch (error) {
    console.error('Erreur ajout action hors ligne:', error);
  }
};

// ===========================
// ANALYTICS ET TRACKING
// ===========================

// Fonction pour tracker les événements utilisateur
export const trackEvent = async (eventName, eventData = {}) => {
  try {
    const trackingData = {
      event: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href
    };
    
    // En mode développement, juste logger
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.log('📊 Event tracked:', trackingData);
      return;
    }
    
    // En production, envoyer au serveur
    await api.post('/api/analytics/track/', trackingData);
  } catch (error) {
    console.error('Erreur tracking:', error);
    // Ne pas faire échouer l'application si le tracking échoue
  }
};

// Fonction pour tracker les vues de produits
export const trackProductView = (produitId, produitNom) => {
  trackEvent('product_view', {
    produit_id: produitId,
    produit_nom: produitNom
  });
};

// Fonction pour tracker les ajouts au panier
export const trackAddToCart = (produitId, produitNom, quantite, prix) => {
  trackEvent('add_to_cart', {
    produit_id: produitId,
    produit_nom: produitNom,
    quantite,
    prix,
    valeur: prix * quantite
  });
};

// Fonction pour tracker les recherches
export const trackSearch = (query, resultCount) => {
  trackEvent('search', {
    query,
    result_count: resultCount
  });
};

// ===========================
// EXPORT PAR DÉFAUT
// ===========================

export default {
  // Produits
  fetchProduits,
  fetchProduitById,
  rechercherProduits,
  fetchNouveautes,
  fetchPopulaires,
  
  // Catégories
  fetchCategories,
  fetchCategoriesWithCache,
  fetchProduitsByCategorie,
  
  // Panier
  fetchPanier,
  resumePanier,
  ajouterProduitAuPanier,
  modifierQuantitePanier,
  supprimerDuPanier,
  viderPanier,
  
  // Favoris
  fetchFavoris,
  ajouterAuxFavoris,
  supprimerFavori,
  toggleFavori,
  
  // Commandes
  fetchMesCommandes,
  fetchCommandeById,
  creerCommande,
  fetchTrackingCommande,
  
  // Avis
  fetchAvisProduit,
  ajouterAvis,
  modifierAvis,
  supprimerAvis,
  
  // Auth
  login,
  signup,
  logout,
  isAuthenticated,
  
  // Profil
  fetchProfilClient,
  modifierProfilClient,
  
  // Checkout
  calculerFraisLivraison,
  validerAdresseLivraison,
  initierPaiement,
  confirmerPaiement,
  
  // Utilitaires
  uploadImage,
  formatApiError,
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackSearch,
  
  // Hors ligne
  checkConnectivity,
  syncOfflineData,
  addOfflineAction
};