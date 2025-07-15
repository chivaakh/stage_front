import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Calendar, Edit, Save
} from 'lucide-react';

const AccountSettings = ({ showMessage }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accountSettings, setAccountSettings] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
        setAccountSettings({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          telephone: data.telephone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Paramètres du compte sauvegardés avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <User className="w-8 h-8 mr-3 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Mon Compte</h2>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
          </div>
        </div>
        <button className="p-2 bg-blue-100/50 rounded-xl hover:bg-blue-200/50 transition">
          <Edit className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {/* Section Profil Utilisateur */}
      <div className="bg-white/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Informations personnelles
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </div>

          <div className="space-y-4">
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
      </div>

      {/* Section Modification du compte */}
      <div className="bg-white/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Modifier les informations</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
            <input
              type="text"
              value={accountSettings.prenom}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, prenom: e.target.value }))}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input
              type="text"
              value={accountSettings.nom}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={accountSettings.email}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <div className="relative">
              <input
                type="tel"
                value={accountSettings.telephone}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Section Changer mot de passe */}
      <div className="bg-white/30 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Changer le mot de passe</h4>
        
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
            <input
              type="password"
              value={accountSettings.currentPassword}
              onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                value={accountSettings.newPassword}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer mot de passe</label>
              <input
                type="password"
                value={accountSettings.confirmPassword}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'action */}
      <div className="flex justify-start">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;