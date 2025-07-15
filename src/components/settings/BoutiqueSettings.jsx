import React, { useState, useEffect } from 'react';
import { 
  Store, MapPin, Star, TrendingUp, Edit, Save, Camera, 
  CheckCircle, AlertCircle, Eye, EyeOff, Phone, Mail
} from 'lucide-react';

const BoutiqueSettings = ({ showMessage }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const [boutiqueSettings, setBoutiqueSettings] = useState({
    nom_boutique: '',
    description: '',
    ville: '',
    telephone_professionnel: '',
    logo: null
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/vendeur-info/', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
        
        if (data.boutique) {
          setBoutiqueSettings({
            nom_boutique: data.boutique.nom_boutique || '',
            description: data.boutique.description || '',
            ville: data.boutique.ville || '',
            telephone_professionnel: data.boutique.telephone_professionnel || '',
            logo: null
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulation d'une sauvegarde - remplacer par votre API
      await new Promise(resolve => setTimeout(resolve, 1500));
      showMessage('success', 'Informations de boutique sauvegardées avec succès');
      setEditMode(false);
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const getLogoUrl = (logoUrl) => {
    if (!logoUrl) return null;
    if (logoUrl.startsWith('/')) {
      return `http://localhost:8000${logoUrl}`;
    }
    return logoUrl;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header avec titre et bouton d'édition */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Store className="w-8 h-8 mr-3 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ma Boutique</h2>
            <p className="text-gray-600">Gérez les informations de votre boutique</p>
          </div>
        </div>
        <button 
          onClick={() => setEditMode(!editMode)}
          className="flex items-center px-4 py-2 bg-purple-100/50 text-purple-600 rounded-xl hover:bg-purple-200/50 transition-all"
        >
          <Edit className="w-4 h-4 mr-2" />
          {editMode ? 'Annuler' : 'Modifier'}
        </button>
      </div>

      {userInfo?.boutique ? (
        <div className="space-y-6">
          {/* Logo et informations principales */}
          <div className="bg-white/30 rounded-xl p-6">
            <div className="text-center mb-6">
              {/* Logo */}
              <div className="relative inline-block mb-4">
                {userInfo.boutique.logo ? (
                  <img 
                    src={getLogoUrl(userInfo.boutique.logo)}
                    alt="Logo boutique"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/50 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                    <Store className="w-12 h-12 text-white" />
                  </div>
                )}
                
                {editMode && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-all shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Nom de boutique */}
              {editMode ? (
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique</label>
                  <input
                    type="text"
                    value={boutiqueSettings.nom_boutique}
                    onChange={(e) => setBoutiqueSettings(prev => ({ ...prev, nom_boutique: e.target.value }))}
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-center text-xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {userInfo.boutique.nom_boutique}
                </h3>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              {editMode ? (
                <textarea
                  value={boutiqueSettings.description}
                  onChange={(e) => setBoutiqueSettings(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Décrivez votre boutique..."
                />
              ) : (
                <p className="text-gray-700 bg-white/30 rounded-xl p-4">
                  {userInfo.boutique.description || 'Aucune description'}
                </p>
              )}
            </div>

            {/* Localisation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              {editMode ? (
                <div className="relative">
                  <select
                    value={boutiqueSettings.ville}
                    onChange={(e) => setBoutiqueSettings(prev => ({ ...prev, ville: e.target.value }))}
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value="">Sélectionner une ville</option>
                    <option value="Nouakchott">Nouakchott</option>
                    <option value="Nouadhibou">Nouadhibou</option>
                    <option value="Kaédi">Kaédi</option>
                    <option value="Rosso">Rosso</option>
                    <option value="Zouérate">Zouérate</option>
                  </select>
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              ) : (
                <div className="flex items-center p-3 bg-white/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="font-semibold text-gray-800">
                    {userInfo.boutique.ville}
                  </span>
                </div>
              )}
            </div>

            {/* Téléphone professionnel */}
            {editMode && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone professionnel</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={boutiqueSettings.telephone_professionnel}
                    onChange={(e) => setBoutiqueSettings(prev => ({ ...prev, telephone_professionnel: e.target.value }))}
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="+222 XX XX XX XX"
                  />
                  <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-xl p-6 text-center">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-1">Évaluation</p>
              <p className="font-bold text-2xl text-gray-800">
                {userInfo.boutique.evaluation}/5
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-xl p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-1">Ventes totales</p>
              <p className="font-bold text-2xl text-gray-800">
                {userInfo.boutique.total_ventes} MRU
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-100/50 to-pink-100/50 rounded-xl p-6 text-center">
              <Eye className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-1">Vues boutique</p>
              <p className="font-bold text-2xl text-gray-800">
                {userInfo.boutique.vues || 0}
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-100/50 to-red-100/50 rounded-xl p-6 text-center">
              <Store className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-1">Produits</p>
              <p className="font-bold text-2xl text-gray-800">
                {userInfo.boutique.nombre_produits || 0}
              </p>
            </div>
          </div>

          {/* Statut */}
          <div className="bg-white/30 rounded-xl p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Statut de la boutique</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${userInfo.boutique.est_approuve ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {userInfo.boutique.est_approuve ? 'Boutique approuvée' : 'En attente d\'approbation'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userInfo.boutique.est_approuve 
                      ? 'Votre boutique est active et visible aux clients'
                      : 'Votre boutique est en cours de validation par notre équipe'
                    }
                  </p>
                </div>
              </div>
              {userInfo.boutique.est_approuve ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-orange-500" />
              )}
            </div>

            <div className="mt-4 p-3 bg-blue-50/50 rounded-xl">
              <p className="text-sm text-gray-600">
                <strong>Date de création :</strong> {formatDate(userInfo.boutique.date_creation || userInfo.date_creation)}
              </p>
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          {editMode && (
            <div className="flex justify-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Aucune boutique créée */
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Store className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-4">Aucune boutique créée</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Créez votre boutique en ligne pour commencer à vendre vos produits sur Ishrili
          </p>
          <button 
            onClick={() => window.location.href = '/creer-boutique'}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Créer ma boutique
          </button>
        </div>
      )}
    </div>
  );
};

export default BoutiqueSettings;