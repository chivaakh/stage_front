// src/contexts/FavoritesContext.jsx - Version DEBUG COMPLÈTE
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchFavoris, toggleFavori } from '../api/clientAPI';

const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugMode] = useState(process.env.NODE_ENV === 'development');
  
  const toggleInProgressRef = useRef(new Set());
  const lastToggleTimeRef = useRef(new Map());

  // Debug logger détaillé
  const debugLog = useCallback((level, message, data = null) => {
    if (debugMode) {
      const time = new Date().toLocaleTimeString();
      const colors = {
        info: 'color: #2196F3',
        success: 'color: #4CAF50', 
        warning: 'color: #FF9800',
        error: 'color: #F44336'
      };
      
      console.log(
        `%c[${time}] [FavoritesContext] ${message}`,
        colors[level] || 'color: #333',
        data || ''
      );
    }
  }, [debugMode]);

  // Cache des IDs
  const favoriteIds = useMemo(() => {
    const ids = new Set();
    
    favoris.forEach(favori => {
      const id = favori.produit || favori.produit_id || favori.id;
      if (id) {
        ids.add(parseInt(id));
      }
    });
    
    debugLog('info', `Cache mis à jour: ${ids.size} favoris`, Array.from(ids));
    return ids;
  }, [favoris, debugLog]);

  // Charger favoris avec debug complet
  const loadFavorites = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        debugLog('info', '🔄 DÉBUT chargement favoris');
        setLoading(true);
      }
      setError(null);
      
      debugLog('info', '📡 Appel fetchFavoris()...');
      const response = await fetchFavoris();
      
      debugLog('info', '📥 Réponse fetchFavoris reçue:', {
        status: response?.status,
        data: response?.data,
        dataType: typeof response?.data,
        hasResults: !!response?.data?.results,
        isArray: Array.isArray(response?.data)
      });
      
      let favoritesData = [];
      if (response?.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          favoritesData = response.data.results;
          debugLog('info', '📊 Format détecté: paginated results');
        } else if (Array.isArray(response.data)) {
          favoritesData = response.data;
          debugLog('info', '📊 Format détecté: array direct');
        } else {
          debugLog('warning', '⚠️ Format de données inattendu:', response.data);
        }
      }
      
      debugLog('success', `✅ ${favoritesData.length} favoris chargés`, {
        count: favoritesData.length,
        sample: favoritesData[0] || null
      });
      
      setFavoris(favoritesData);
      
    } catch (error) {
      debugLog('error', '❌ Erreur chargement favoris:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      if (!silent) {
        setError('Erreur de chargement favoris');
        setFavoris([]);
      }
    } finally {
      if (!silent) {
        setLoading(false);
        debugLog('info', '🏁 FIN chargement favoris');
      }
    }
  }, [debugLog]);

  // Initialisation
  useEffect(() => {
    debugLog('info', '🚀 INITIALISATION contexte favoris');
    loadFavorites();
  }, [loadFavorites, debugLog]);

  // Vérifier favori
  const isFavorite = useCallback((produitId) => {
    const id = parseInt(produitId);
    const result = favoriteIds.has(id);
    
    if (debugMode && result) {
      debugLog('info', `✓ Produit ${id} trouvé en favoris`);
    }
    
    return result;
  }, [favoriteIds, debugMode, debugLog]);

  // ✅ TOGGLE avec DEBUG COMPLET
  const toggleFavorite = useCallback(async (produitId) => {
    const id = parseInt(produitId);
    const now = Date.now();
    
    console.group(`🔍 [CONTEXT] TOGGLE FAVORI ${id}`);
    
    try {
      // Protection simple
      if (toggleInProgressRef.current.has(id)) {
        debugLog('warning', `⚠️ Toggle ${id} déjà en cours, skip`);
        console.groupEnd();
        return {
          success: false,
          error: null,
          silent: true
        };
      }
      
      const lastTime = lastToggleTimeRef.current.get(id) || 0;
      if (now - lastTime < 50) {
        debugLog('warning', `⚠️ Toggle ${id} trop rapide (${now - lastTime}ms)`);
        console.groupEnd();
        return {
          success: false,
          error: null,
          silent: true
        };
      }

      // Marquer en cours
      toggleInProgressRef.current.add(id);
      lastToggleTimeRef.current.set(id, now);
      
      debugLog('info', `🔄 DÉBUT toggle ${id}`, {
        currentState: favoriteIds.has(id),
        timestamp: now
      });
      
      debugLog('info', '📡 Appel toggleFavori API...');
      const response = await toggleFavori(id);
      
      debugLog('info', '📥 Réponse API reçue:', {
        response,
        status: response?.status,
        data: response?.data,
        dataType: typeof response?.data,
        keys: Object.keys(response?.data || {})
      });
      
      // ✅ VÉRIFICATION STRICTE de la réponse
      if (!response) {
        debugLog('error', '❌ Réponse null/undefined');
        console.groupEnd();
        return {
          success: false,
          error: 'Aucune réponse du serveur'
        };
      }
      
      if (!response.data) {
        debugLog('error', '❌ response.data null/undefined');
        console.groupEnd();
        return {
          success: false,
          error: 'Données de réponse manquantes'
        };
      }
      
      const { is_favori, message, success, debug_info, error: apiError } = response.data;
      
      debugLog('info', '🔍 Analyse des données:', {
        is_favori,
        message,
        success,
        debug_info,
        apiError,
        successType: typeof success
      });
      
      if (debug_info) {
        debugLog('info', '🔧 Debug serveur:', debug_info);
      }
      
      // ✅ GESTION STRICTE DU SUCCÈS
      if (success === true) {
        debugLog('success', `✅ Toggle réussi: ${message}`, {
          produitId: id,
          newState: is_favori,
          message
        });
        
        // Mise à jour locale immédiate
        debugLog('info', '🔄 Mise à jour locale...');
        setFavoris(prev => {
          if (is_favori) {
            // Ajouter si pas présent
            const exists = prev.find(f => parseInt(f.produit || f.produit_id) === id);
            if (!exists) {
              const newFav = { 
                produit: id, 
                id: `temp_${id}_${Date.now()}`,
                produit_nom: `Produit ${id}`,
                date_ajout: new Date().toISOString()
              };
              debugLog('info', '➕ Ajout local:', newFav);
              return [...prev, newFav];
            }
            return prev;
          } else {
            // Retirer
            const filtered = prev.filter(f => parseInt(f.produit || f.produit_id) !== id);
            debugLog('info', `➖ Suppression locale: ${prev.length} -> ${filtered.length}`);
            return filtered;
          }
        });
        
        // Sync serveur en background
        debugLog('info', '🔄 Lancement sync background...');
        setTimeout(() => {
          debugLog('info', '🔄 Sync background...');
          loadFavorites(true);
        }, 100);
        
        console.groupEnd();
        return {
          success: true,
          message: message || (is_favori ? 'Ajouté aux favoris' : 'Retiré des favoris'),
          isFavorite: is_favori
        };
        
      } else if (success === false) {
        debugLog('error', `❌ Toggle échoué: ${apiError || message}`);
        console.groupEnd();
        return {
          success: false,
          error: apiError || message || 'Erreur serveur'
        };
        
      } else {
        debugLog('error', '❌ Success non défini ou invalide:', {
          success,
          successType: typeof success,
          fullData: response.data
        });
        console.groupEnd();
        return {
          success: false,
          error: 'Réponse serveur invalide (success manquant)'
        };
      }
      
    } catch (error) {
      debugLog('error', '💥 Exception dans toggleFavorite:', {
        error,
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response?.data
      });
      
      console.groupEnd();
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur de connexion'
      };
      
    } finally {
      // Libération du verrou
      setTimeout(() => {
        toggleInProgressRef.current.delete(id);
        debugLog('info', `🔓 Verrou ${id} libéré`);
      }, 50);
    }
  }, [favoriteIds, loadFavorites, debugLog]);

  // Autres fonctions
  const removeFromFavorites = useCallback(async (produitId) => {
    debugLog('info', `🗑️ Suppression favori ${produitId}`);
    return await toggleFavorite(produitId);
  }, [toggleFavorite, debugLog]);

  const refreshFavorites = useCallback(() => {
    debugLog('info', '🔄 Refresh manuel favoris');
    loadFavorites();
  }, [loadFavorites, debugLog]);

  const getFavoritesCount = useCallback(() => {
    return favoris.length;
  }, [favoris.length]);

  const getFavoriteById = useCallback((produitId) => {
    const id = parseInt(produitId);
    return favoris.find(f => 
      parseInt(f.produit || f.produit_id || f.id) === id
    );
  }, [favoris]);

  // Nettoyage
  useEffect(() => {
    return () => {
      toggleInProgressRef.current.clear();
      lastToggleTimeRef.current.clear();
    };
  }, []);

  // Debug state complet
  const dumpState = useCallback(() => {
    console.group('🔍 ÉTAT COMPLET CONTEXTE FAVORIS');
    console.log('📊 Favoris array:', favoris);
    console.log('🆔 IDs cache:', Array.from(favoriteIds));
    console.log('🔒 En cours:', Array.from(toggleInProgressRef.current));
    console.log('⏱️ Derniers toggles:', Object.fromEntries(lastToggleTimeRef.current));
    console.log('📡 Loading:', loading);
    console.log('❌ Error:', error);
    console.groupEnd();
  }, [favoris, favoriteIds, loading, error]);

  // Test API direct
  const testApiDirect = useCallback(async (produitId) => {
    console.group(`🧪 TEST API DIRECT ${produitId}`);
    
    try {
      debugLog('info', 'Test direct toggleFavori...');
      const response = await toggleFavori(produitId);
      
      console.log('Response complète:', response);
      console.log('Response.data:', response.data);
      console.log('Type response.data:', typeof response.data);
      console.log('Keys response.data:', Object.keys(response.data || {}));
      
      return response;
    } catch (error) {
      console.error('Erreur test direct:', error);
      return { error };
    } finally {
      console.groupEnd();
    }
  }, [debugLog]);

  // Debug tools
  useEffect(() => {
    if (debugMode && typeof window !== 'undefined') {
      window.dumpFavoritesState = dumpState;
      window.testFavorisApi = testApiDirect;
      window.favorisContext = {
        favoris,
        favoriteIds: Array.from(favoriteIds),
        togglesInProgress: Array.from(toggleInProgressRef.current),
        loading,
        error
      };
      
      debugLog('info', '🛠️ Debug tools installés');
      console.log('🛠️ Available debug tools:');
      console.log('  - window.dumpFavoritesState()');
      console.log('  - window.testFavorisApi(produitId)');
      console.log('  - window.favorisContext');
    }
  }, [dumpState, testApiDirect, debugMode, favoris, favoriteIds, loading, error, debugLog]);

  const value = useMemo(() => ({
    // État
    favoris,
    loading,
    error,
    
    // Fonctions
    isFavorite,
    getFavoritesCount,
    getFavoriteById,
    toggleFavorite,
    removeFromFavorites,
    refreshFavorites,
    loadFavorites,
    
    // Debug (dev only)
    ...(debugMode && {
      dumpState,
      testApiDirect,
      debugLog,
      favoriteIds: Array.from(favoriteIds),
      togglesInProgress: Array.from(toggleInProgressRef.current)
    })
  }), [
    favoris,
    loading,
    error,
    isFavorite,
    getFavoritesCount,
    getFavoriteById,
    toggleFavorite,
    removeFromFavorites,
    refreshFavorites,
    loadFavorites,
    debugMode,
    dumpState,
    testApiDirect,
    debugLog,
    favoriteIds
  ]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};