// src/api/clientAPI.js - FIXED VERSION FOR ID FIELD ERROR
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const clientAPI = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter l'authentification si nécessaire
clientAPI.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('authToken') || localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de la requête pour debug
    console.log('🔄 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les erreurs avec gestion améliorée
clientAPI.interceptors.response.use(
  (response) => {
    console.log('✅ API Success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const errorInfo = {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    };
    
    console.error('❌ API Error:', errorInfo);
    return Promise.reject(error);
  }
);

// ===== FONCTION POUR NETTOYER ET VALIDER LES IDs =====
const validateAndCleanId = (id) => {
  // Si c'est déjà un nombre, le retourner
  if (typeof id === 'number' && !isNaN(id) && id > 0) {
    return id;
  }
  
  // Si c'est une chaîne, essayer de la convertir
  if (typeof id === 'string') {
    const numId = parseInt(id, 10);
    if (!isNaN(numId) && numId > 0) {
      return numId;
    }
  }
  
  // Si c'est un objet avec une propriété id
  if (typeof id === 'object' && id !== null && id.id) {
    return validateAndCleanId(id.id);
  }
  
  console.error('❌ ID invalide:', id);
  throw new Error(`ID invalide: ${JSON.stringify(id)}. Un ID numérique valide est requis.`);
};

// ===== PRODUITS CLIENT =====
export const fetchProduits = (params = {}) =>
  clientAPI.get('/client/produits/', { params });

export const fetchProduitById = (id) => {
  const cleanId = validateAndCleanId(id);
  return clientAPI.get(`/client/produits/${cleanId}/`);
};

export const fetchNouveautes = () =>
  clientAPI.get('/client/produits/nouveaute/');

export const fetchPopulaires = () =>
  clientAPI.get('/client/produits/populaires/');

export const rechercherProduits = (searchParams) =>
  clientAPI.get('/client/produits/recherche/', { params: searchParams });

// ===== CATÉGORIES CLIENT =====
export const fetchCategories = () =>
  clientAPI.get('/client/categories/');

export const fetchProduitsByCategorie = (id, params = {}) => {
  const cleanId = validateAndCleanId(id);
  return clientAPI.get(`/client/categories/${cleanId}/produits/`, { params });
};

// ===== PANIER - ENDPOINTS FIXES =====
export const fetchPanier = () =>
  clientAPI.get('/client/panier/');

export const ajouterAuPanier = (data) =>
  clientAPI.post('/client/panier/', data);

export const modifierQuantitePanier = (id, quantite) => {
  const cleanId = validateAndCleanId(id);
  const cleanQuantite = parseInt(quantite, 10);
  
  if (isNaN(cleanQuantite) || cleanQuantite < 1) {
    throw new Error('La quantité doit être un nombre positif');
  }
  
  return clientAPI.patch(`/client/panier/${cleanId}/`, { quantite: cleanQuantite });
};

export const supprimerDuPanier = (id) => {
  const cleanId = validateAndCleanId(id);
  return clientAPI.delete(`/client/panier/${cleanId}/`);
};

export const viderPanier = () =>
  clientAPI.post('/client/panier/vider/');

export const resumePanier = () =>
  clientAPI.get('/client/panier/resume/');

// ===== FONCTION D'AJOUT AU PANIER CORRIGÉE =====
export const ajouterProduitAuPanier = async (produitId, quantite = 1, specificationId = null) => {
  console.log('🛒 Tentative d\'ajout au panier avec:', { produitId, quantite, specificationId });
  
  // Nettoyer et valider les paramètres
  let cleanProduitId;
  try {
    cleanProduitId = validateAndCleanId(produitId);
  } catch (error) {
    console.error('❌ Erreur validation ID produit:', error.message);
    throw new Error('ID du produit invalide');
  }
  
  const cleanQuantite = parseInt(quantite, 10);
  if (isNaN(cleanQuantite) || cleanQuantite < 1) {
    throw new Error('La quantité doit être un nombre positif');
  }
  
  let cleanSpecificationId = null;
  if (specificationId) {
    try {
      cleanSpecificationId = validateAndCleanId(specificationId);
    } catch (error) {
      console.warn('⚠️ ID spécification invalide, ignoré:', specificationId);
      cleanSpecificationId = null;
    }
  }
  
  console.log('🔄 Paramètres nettoyés:', { 
    cleanProduitId, 
    cleanQuantite, 
    cleanSpecificationId 
  });

  // Strategy 1: Ajout rapide avec paramètres nettoyés
  try {
    console.log('🔄 Stratégie 1: Ajout rapide');
    const data = { 
      produit_id: cleanProduitId, 
      quantite: cleanQuantite 
    };
    
    if (cleanSpecificationId) {
      data.specification_id = cleanSpecificationId;
    }
    
    console.log('📤 Données envoyées (Stratégie 1):', data);
    const response = await clientAPI.post('/client/panier/ajouter_rapide/', data);
    console.log('✅ Stratégie 1 réussie');
    return response;
  } catch (error) {
    console.warn('❌ Stratégie 1 échouée:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }

  // Strategy 2: Ajout standard
  try {
    console.log('🔄 Stratégie 2: Ajout standard');
    const data = {
      produit: cleanProduitId,
      quantite: cleanQuantite
    };
    
    if (cleanSpecificationId) {
      data.specification = cleanSpecificationId;
    }
    
    console.log('📤 Données envoyées (Stratégie 2):', data);
    const response = await clientAPI.post('/client/panier/', data);
    console.log('✅ Stratégie 2 réussie');
    return response;
  } catch (error) {
    console.warn('❌ Stratégie 2 échouée:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }

  // Strategy 3: Ajout avec spécification seulement
  if (cleanSpecificationId) {
    try {
      console.log('🔄 Stratégie 3: Ajout avec spécification uniquement');
      const data = {
        specification: cleanSpecificationId,
        quantite: cleanQuantite
      };
      
      console.log('📤 Données envoyées (Stratégie 3):', data);
      const response = await clientAPI.post('/client/panier/', data);
      console.log('✅ Stratégie 3 réussie');
      return response;
    } catch (error) {
      console.warn('❌ Stratégie 3 échouée:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
  }

  // Strategy 4: Format minimal
  try {
    console.log('🔄 Stratégie 4: Format minimal');
    const data = {
      produit_id: cleanProduitId,
      quantite: cleanQuantite
    };
    
    console.log('📤 Données envoyées (Stratégie 4):', data);
    const response = await clientAPI.post('/client/panier/', data);
    console.log('✅ Stratégie 4 réussie');
    return response;
  } catch (error) {
    console.warn('❌ Stratégie 4 échouée:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
  }

  // Si toutes les stratégies échouent
  console.error('❌ Toutes les stratégies d\'ajout au panier ont échoué');
  throw new Error('Impossible d\'ajouter le produit au panier. Vérifiez que le produit existe et que le serveur est correctement configuré.');
};

// ===== FAVORIS =====
export const fetchFavoris = () =>
  clientAPI.get('/client/favoris/');

export const toggleFavori = (produitId) => {
  const cleanId = validateAndCleanId(produitId);
  return clientAPI.post('/client/favoris/toggle/', { produit_id: cleanId });
};

// ===== COMMANDES =====
export const fetchMesCommandes = () =>
  clientAPI.get('/client/commandes/');

export const passerCommande = (adresseLivraison) =>
  clientAPI.post('/client/commandes/commander/', { adresse_livraison: adresseLivraison });

// ===== AVIS =====
export const ajouterAvis = (data) => {
  // Nettoyer l'ID du produit dans les données d'avis
  if (data.produit) {
    data.produit = validateAndCleanId(data.produit);
  }
  return clientAPI.post('/client/avis/', data);
};

export const fetchAvisProduit = (produitId) => {
  const cleanId = validateAndCleanId(produitId);
  return clientAPI.get(`/client/produits/${cleanId}/avis/`);
};

// ===== PROFIL =====
export const fetchMonProfil = () =>
  clientAPI.get('/client/profil/mon_profil/');

export const modifierProfil = (data) =>
  clientAPI.patch('/client/profil/mon_profil/', data);

// ===== FONCTIONS DE DEBUG =====
export const debugCartAPI = {
  // Tester la validation des IDs
  testIdValidation() {
    console.log('🔄 Test de validation des IDs...');
    
    const testCases = [
      { input: 1, expected: 1 },
      { input: "2", expected: 2 },
      { input: { id: 3 }, expected: 3 },
      { input: "invalid", expected: "error" },
      { input: null, expected: "error" },
      { input: undefined, expected: "error" },
      { input: { rating: 4.2, reviews: 15 }, expected: "error" }
    ];
    
    const results = {};
    
    testCases.forEach(({ input, expected }) => {
      try {
        const result = validateAndCleanId(input);
        results[JSON.stringify(input)] = {
          expected: expected === "error" ? "error" : expected,
          actual: result,
          success: result === expected
        };
      } catch (error) {
        results[JSON.stringify(input)] = {
          expected: expected,
          actual: "error",
          success: expected === "error",
          error: error.message
        };
      }
    });
    
    console.log('📊 Résultats validation IDs:', results);
    return results;
  },

  // Test avec un produit spécifique
  async testAddProductSafe(produitId, quantite = 1) {
    console.log(`🔄 Test d'ajout sécurisé du produit ${produitId}...`);
    
    try {
      // D'abord vérifier que le produit existe
      const productResponse = await fetchProduitById(produitId);
      console.log('✅ Produit trouvé:', productResponse.data);
      
      // Puis essayer de l'ajouter au panier
      const cartResponse = await ajouterProduitAuPanier(produitId, quantite);
      console.log('✅ Produit ajouté au panier');
      
      return { 
        success: true, 
        product: productResponse.data, 
        cartResult: cartResponse.data 
      };
    } catch (error) {
      console.error('❌ Échec test ajout:', error.message);
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data
      };
    }
  }
};

// ===== GESTION D'ERREUR AMÉLIORÉE =====
export const handleCartError = (error) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    // Erreur spécifique pour le champ ID
    if (data.error && data.error.includes("Field 'id' expected a number")) {
      return 'Erreur de format de données. Vérifiez que les IDs des produits sont des nombres valides.';
    }
    
    switch (status) {
      case 400:
        if (data.produit) return `Produit invalide: ${JSON.stringify(data.produit)}`;
        if (data.quantite) return `Quantité invalide: ${JSON.stringify(data.quantite)}`;
        if (data.specification) return `Spécification invalide: ${JSON.stringify(data.specification)}`;
        return `Données invalides: ${JSON.stringify(data)}`;
      
      case 401:
        return 'Connexion requise pour ajouter au panier';
      
      case 403:
        return 'Permission refusée';
      
      case 404:
        return 'Produit non trouvé';
      
      case 409:
        return 'Produit déjà dans le panier';
      
      case 422:
        return 'Stock insuffisant';
      
      case 500:
        if (data.error) {
          return `Erreur serveur: ${data.error}`;
        }
        return 'Erreur serveur. Vérifiez les logs Django';
      
      default:
        return `Erreur ${status}: ${data.detail || data.message || JSON.stringify(data)}`;
    }
  }
  
  if (error.message.includes('ID invalide')) {
    return error.message;
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return 'Erreur réseau. Vérifiez que le serveur Django est démarré';
  }
  
  return error.message || 'Erreur inconnue';
};

export default clientAPI;