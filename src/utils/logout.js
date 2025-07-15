// utils/logout.js - Fonction de déconnexion universelle JavaScript

/**
 * Fonction de déconnexion universelle qui nettoie le localStorage
 * @param {string} redirectUrl - URL de redirection après déconnexion (optionnel)
 * @param {boolean} showConfirm - Afficher la confirmation ou non (défaut: true)
 */
export const handleLogout = async (redirectUrl = '/', showConfirm = true) => {
  const shouldLogout = showConfirm ? window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?') : true;
  
  if (shouldLogout) {
    try {
      console.log("🚪 Début de la déconnexion...");
      
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log("✅ Déconnexion côté serveur réussie");
      } else {
        console.warn("⚠️ Erreur serveur lors de la déconnexion:", response.status);
      }
    } catch (error) {
      console.error('❌ Erreur réseau lors de la déconnexion:', error);
    } finally {
      // 🔧 NETTOYER LE LOCALSTORAGE DANS TOUS LES CAS
      console.log("🧹 Nettoyage du localStorage...");
      
      // Supprimer le type d'utilisateur choisi
      localStorage.removeItem('type_utilisateur');
      
      // Supprimer d'autres données utilisateur si nécessaire
      localStorage.removeItem('user_preferences');
      localStorage.removeItem('cart_items');
      localStorage.removeItem('favorites');
      localStorage.removeItem('recent_searches');
      
      console.log("✅ localStorage nettoyé complètement");
      
      // Redirection
      console.log(`🔄 Redirection vers: ${redirectUrl}`);
      window.location.href = redirectUrl;
    }
  }
};

// Fonction pour nettoyer seulement le type d'utilisateur (sans déconnexion)
export const clearUserType = () => {
  localStorage.removeItem('type_utilisateur');
  console.log("🗑️ Type d'utilisateur supprimé du localStorage");
};

// Fonction pour vérifier si un utilisateur a choisi son type
export const hasUserType = () => {
  const userType = localStorage.getItem('type_utilisateur');
  return userType !== null && userType !== '';
};

// Fonction pour obtenir le type d'utilisateur actuel
export const getUserType = () => {
  return localStorage.getItem('type_utilisateur');
};