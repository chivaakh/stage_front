import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Store, MapPin, Calendar, Star, TrendingUp, Edit, Settings, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserInfo();
  }, []);


  const getLogoUrl = (logoUrl) => {
  if (!logoUrl) return null;
  
  // Ajouter le domaine si l'URL est relative
  if (logoUrl.startsWith('/')) {
    return `http://localhost:8000${logoUrl}`;
  }
  return logoUrl;
  };







  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/vendeur-info/', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login';
          return;
        }
        throw new Error('Erreur lors de la récupération des informations');
      }

      const data = await response.json();
      setUserInfo(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <button 
            onClick={fetchUserInfo}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50 p-4 overflow-hidden relative">
      {/* Background bubbles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et de boutique</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informations personnelles */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Informations personnelles
              </h2>
              <button className="p-2 bg-blue-100/50 rounded-xl hover:bg-blue-200/50 transition">
                <Edit className="w-5 h-5 text-blue-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-white/30 rounded-xl">
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-semibold text-gray-800">
                    {userInfo?.prenom} {userInfo?.nom}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white/30 rounded-xl">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">
                    {userInfo?.email || 'Non renseigné'}
                  </p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white/30 rounded-xl">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-semibold text-gray-800">{userInfo?.telephone}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-white/30 rounded-xl">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(userInfo?.date_creation)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${userInfo?.est_verifie ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-sm text-gray-500">Statut du compte</p>
                    <p className="font-semibold text-gray-800">
                      {userInfo?.est_verifie ? 'Vérifié' : 'En attente de vérification'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-xl border border-blue-200/30">
                <p className="text-sm text-gray-600">Type de compte</p>
                <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 capitalize">
                  {userInfo?.type_utilisateur}
                </p>
              </div>
            </div>
          </div>

          {/* Informations boutique */}
          {userInfo?.type_utilisateur === 'vendeur' && (
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Store className="w-6 h-6 mr-2 text-purple-600" />
                  Ma Boutique
                </h2>
                <button className="p-2 bg-purple-100/50 rounded-xl hover:bg-purple-200/50 transition">
                  <Edit className="w-5 h-5 text-purple-600" />
                </button>
              </div>

              {userInfo?.boutique ? (
                <div className="space-y-4">
                  {userInfo.boutique.logo && (
                    <div className="flex justify-center mb-4">
                        <img 
                        src={getLogoUrl(userInfo.boutique.logo)}  // MODIFICATION ICI
                        alt="Logo boutique"
                        className="w-20 h-20 rounded-full object-cover border-4 border-white/50"
                        onError={(e) => {
                            console.log('Erreur chargement logo:', e.target.src);
                            e.target.style.display = 'none'; // Cacher l'image si erreur
                        }}
                        />
                    </div>
                    )}

                  <div className="text-center p-3 bg-white/30 rounded-xl">
                    <p className="text-sm text-gray-500">Nom de la boutique</p>
                    <p className="font-bold text-xl text-gray-800">
                      {userInfo.boutique.nom_boutique}
                    </p>
                  </div>

                  <div className="p-3 bg-white/30 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-700">
                      {userInfo.boutique.description || 'Aucune description'}
                    </p>
                  </div>

                  <div className="flex items-center p-3 bg-white/30 rounded-xl">
                    <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold text-gray-800">
                        {userInfo.boutique.ville}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gradient-to-r from-green-100/50 to-emerald-100/50 rounded-xl text-center">
                      <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Évaluation</p>
                      <p className="font-bold text-lg text-gray-800">
                        {userInfo.boutique.evaluation}/5
                      </p>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-blue-100/50 to-cyan-100/50 rounded-xl text-center">
                      <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Ventes totales</p>
                      <p className="font-bold text-lg text-gray-800">
                        {userInfo.boutique.total_ventes} MRU
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${userInfo.boutique.est_approuve ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <div>
                        <p className="text-sm text-gray-500">Statut boutique</p>
                        <p className="font-semibold text-gray-800">
                          {userInfo.boutique.est_approuve ? 'Approuvée' : 'En attente d\'approbation'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucune boutique créée</p>
                  <button 
                    onClick={() => window.location.href = '/creer-boutique'}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    Créer ma boutique
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions rapides */}
        <div className="mt-8 flex justify-center space-x-4">
          <button className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition">
            <Settings className="w-5 h-5 mr-2" />
            Paramètres
          </button>
          <button className="flex items-center px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition text-red-600">
            <LogOut className="w-5 h-5 mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;