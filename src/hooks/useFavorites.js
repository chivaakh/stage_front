// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchFavoris, 
  ajouterAuxFavoris, 
  supprimerFavori, 
  toggleFavori,
  formatApiError 
} from '../api/clientAPI';

const useFavorites = () => {
  const [favoris, setFavoris] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Charger les favoris initiaux
  const loadFavoris = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchFavoris();
      const favorisData = response.data.results || response.data || [];
      
      setFavoris(favorisData);
      
      // Créer un Set des IDs pour un accès rapide
      const ids = new Set(favorisData.map(f => f.produit));
      setFavoriteIds(ids);
      
      setInitialized(true);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
      setError(formatApiError(error));
      
      // Même en cas d'erreur, on marque comme initialisé pour éviter les boucles infinies
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les favoris au montage
  useEffect(() => {
    if (!initialized) {
      loadFavoris();
    }
  }, [initialized, loadFavoris]);

  // Vérifier si un produit est en favori
  const isFavorite = useCallback((produitId) => {
    return favoriteIds.has(produitId);
  }, [favoriteIds]);

  // Ajouter aux favoris
  const addToFavorites = useCallback(async (produitId) => {
    try {
      setError(null);
      
      const response = await ajouterAuxFavoris(produitId);
      const newFavori = response.data;
      
      // Mettre à jour l'état local
      setFavoris(prev => [newFavori, ...prev]);
      setFavoriteIds(prev => new Set([...prev, produitId]));
      
      return { success: true, data: newFavori };
    } catch (error) {
      console.error('Erreur ajout favori:', error);
      const errorMessage = formatApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Retirer des favoris
  const removeFromFavorites = useCallback(async (produitId) => {
    try {
      setError(null);
      
      // Trouver le favori à supprimer
      const favoriToRemove = favoris.find(f => f.produit === produitId);
      if (!favoriToRemove) {
        return { success: false, error: 'Favori non trouvé' };
      }
      
      await supprimerFavori(favoriToRemove.id);
      
      // Mettre à jour l'état local
      setFavoris(prev => prev.filter(f => f.produit !== produitId));
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression favori:', error);
      const errorMessage = formatApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [favoris]);

  // Toggle favori (ajouter ou retirer)
  const toggleFavorite = useCallback(async (produitId) => {
    try {
      setError(null);
      
      const response = await toggleFavori(produitId);
      const isNowFavorite = response.data.is_favori;
      
      if (isNowFavorite) {
        // Produit ajouté aux favoris
        setFavoriteIds(prev => new Set([...prev, produitId]));
        
        // Recharger la liste complète pour avoir les détails
        // (ou vous pouvez optimiser en créant un objet favori localement)
        setTimeout(() => loadFavoris(), 100);
      } else {
        // Produit retiré des favoris
        setFavoris(prev => prev.filter(f => f.produit !== produitId));
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(produitId);
          return newSet;
        });
      }
      
      return { 
        success: true, 
        isFavorite: isNowFavorite,
        message: isNowFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris'
      };
    } catch (error) {
      console.error('Erreur toggle favori:', error);
      const errorMessage = formatApiError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [loadFavoris]);

  // Obtenir un favori par ID produit
  const getFavoriteByProductId = useCallback((produitId) => {
    return favoris.find(f => f.produit === produitId);
  }, [favoris]);

  // Nettoyer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Actualiser les favoris
  const refreshFavorites = useCallback(() => {
    loadFavoris();
  }, [loadFavoris]);

  // Obtenir le nombre de favoris
  const getFavoritesCount = useCallback(() => {
    return favoris.length;
  }, [favoris]);

  // Vérifier si un produit spécifique est dans les favoris (avec détails)
  const getFavoriteDetails = useCallback((produitId) => {
    const favori = favoris.find(f => f.produit === produitId);
    return {
      isFavorite: favoriteIds.has(produitId),
      favoriteData: favori || null,
      dateAjout: favori?.date_ajout || null
    };
  }, [favoris, favoriteIds]);

  return {
    // État
    favoris,
    favoriteIds,
    loading,
    error,
    initialized,
    
    // Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    loadFavoris,
    refreshFavorites,
    clearError,
    
    // Getters
    isFavorite,
    getFavoriteByProductId,
    getFavoritesCount,
    getFavoriteDetails,
  };
};

export default useFavorites;