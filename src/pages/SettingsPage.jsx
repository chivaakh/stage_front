import React, { useState, useEffect } from 'react';
import { 
  User, 
  Store, 
  Bell, 
  CreditCard, 
  Truck, 
  Shield, 
  Globe, 
  Eye, 
  HelpCircle,
  Edit,
  Save,
  Phone,
  Mail,
  MapPin,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  Star,
  TrendingUp,
  LogOut,
  Settings
} from 'lucide-react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [userInfo, setUserInfo] = useState({
    nom: 'Khteira',
    prenom: 'Iemmeye',
    email: '',
    telephone: '46460500',
    date_creation: '2025-07-08',
    est_verifie: false,
    type_utilisateur: 'vendeur',
    boutique: {
      nom_boutique: 'Ma Super Boutique',
      description: 'Une boutique moderne et innovante',
      ville: 'Nouakchott',
      evaluation: 4.5,
      total_ventes: 125000,
      est_approuve: true,
      logo: null
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // États pour les différents paramètres
  const [accountSettings, setAccountSettings] = useState({
    nom: 'Khteira',
    prenom: 'Iemmeye',
    email: '',
    telephone: '46460500',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailCommandes: true,
    emailPromotions: false,
    smsCommandes: true,
    pushCommandes: true,
    pushMessages: true,
    pushPromotions: false
  });

  const [generalSettings, setGeneralSettings] = useState({
    langue: 'fr',
    devise: 'MRU',
    theme: 'light',
    autoSave: true
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Paramètres sauvegardés avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const settingsSections = [
    { id: 'account', label: 'Compte', icon: User, color: 'from-blue-500 to-cyan-500' },
    { id: 'shop', label: 'Boutique', icon: Store, color: 'from-purple-500 to-pink-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-green-500 to-emerald-500' },
    { id: 'payment', label: 'Paiements', icon: CreditCard, color: 'from-orange-500 to-red-500' },
    { id: 'delivery', label: 'Livraison', icon: Truck, color: 'from-indigo-500 to-purple-500' },
    { id: 'security', label: 'Sécurité', icon: Shield, color: 'from-red-500 to-pink-500' },
    { id: 'general', label: 'Général', icon: Globe, color: 'from-teal-500 to-cyan-500' },
    { id: 'privacy', label: 'Confidentialité', icon: Eye, color: 'from-violet-500 to-purple-500' },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle, color: 'from-amber-500 to-orange-500' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include', // Très important pour gérer la session Django
      });

      if (response.ok) {
        // Redirige vers la page de login ou d'accueil
        window.location.href = '/login';
      } else {
        console.error('Erreur lors de la déconnexion');
        alert('Erreur lors de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      alert('Erreur réseau');
    }
  };

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Section Profil Vendeur avec nouveau design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full filter blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Informations personnelles</h3>
                <p className="text-gray-600">Gérez vos informations de profil</p>
              </div>
            </div>
            <button className="group p-3 bg-white/40 backdrop-blur-sm rounded-2xl hover:bg-white/60 transition-all duration-300 shadow-lg hover:shadow-xl">
              <Edit className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <div className="space-y-6">
              <div className="group relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Nom complet</p>
                    <p className="text-lg font-bold text-gray-800">
                      {userInfo?.prenom} {userInfo?.nom}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {userInfo?.email || 'Non renseigné'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Téléphone</p>
                    <p className="text-lg font-semibold text-gray-800">{userInfo?.telephone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="group relative overflow-hidden bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Membre depuis</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {formatDate(userInfo?.date_creation)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-4 ${userInfo?.est_verifie ? 'bg-green-500' : 'bg-orange-500'} shadow-lg`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Statut du compte</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {userInfo?.est_verifie ? 'Vérifié' : 'En attente de vérification'}
                      </p>
                    </div>
                  </div>
                  {userInfo?.est_verifie && (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  )}
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 mb-2">Type de compte</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 capitalize">
                    {userInfo?.type_utilisateur}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Boutique améliorée */}
      {userInfo?.type_utilisateur === 'vendeur' && userInfo?.boutique && (
        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full filter blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Ma Boutique</h3>
                  <p className="text-gray-600">Informations de votre boutique</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white/50">
                  <Store className="w-12 h-12 text-purple-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mt-4">{userInfo.boutique.nom_boutique}</h4>
              <p className="text-gray-600 mt-2">{userInfo.boutique.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-100/80 to-orange-100/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Évaluation</p>
                <p className="text-2xl font-bold text-gray-800">{userInfo.boutique.evaluation}/5</p>
              </div>

              <div className="bg-gradient-to-br from-blue-100/80 to-cyan-100/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Ventes totales</p>
                <p className="text-2xl font-bold text-gray-800">{userInfo.boutique.total_ventes.toLocaleString()} MRU</p>
              </div>

              <div className="bg-gradient-to-br from-green-100/80 to-emerald-100/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <MapPin className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Localisation</p>
                <p className="text-2xl font-bold text-gray-800">{userInfo.boutique.ville}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section modification avec design moderne */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <Edit className="w-6 h-6 mr-3 text-blue-600" />
          Modifier les informations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Prénom</label>
              <input
                type="text"
                value={accountSettings.prenom}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, prenom: e.target.value }))}
                className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
              />
            </div>
            
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={accountSettings.email}
                  onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-4 pr-14 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Nom</label>
              <input
                type="text"
                value={accountSettings.nom}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Téléphone</label>
              <div className="relative">
                <input
                  type="tel"
                  value={accountSettings.telephone}
                  onChange={(e) => setAccountSettings(prev => ({ ...prev, telephone: e.target.value }))}
                  className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-4 pr-14 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-300"
                />
                <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action avec nouveau style */}
      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={() => handleSave('account')}
          disabled={saving}
          className="group flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 font-semibold"
        >
          <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '24px',
          }}
        >
          Se déconnecter
        </button>

      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Préférences de notification</h3>
        <p className="text-gray-600">Gérez vos notifications selon vos préférences</p>
      </div>
      
      <div className="space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Notifications Email</h4>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'emailCommandes', label: 'Nouvelles commandes', desc: 'Recevez un email pour chaque nouvelle commande' },
              { key: 'emailPromotions', label: 'Promotions et offres spéciales', desc: 'Soyez informé des dernières promotions' }
            ].map(item => (
              <label key={item.key} className="group flex items-center justify-between cursor-pointer p-4 bg-white/30 rounded-2xl hover:bg-white/40 transition-all duration-300">
                <div className="flex-1">
                  <span className="text-gray-800 font-semibold block">{item.label}</span>
                  <span className="text-gray-600 text-sm">{item.desc}</span>
                </div>
                <div className="relative ml-6">
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-all duration-300 ${notificationSettings[item.key] ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${notificationSettings[item.key] ? 'translate-x-7 mt-1' : 'translate-x-1 mt-1'}`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Notifications Push</h4>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'pushCommandes', label: 'Nouvelles commandes', desc: 'Notifications instantanées sur votre appareil' },
              { key: 'pushMessages', label: 'Messages clients', desc: 'Soyez alerté des nouveaux messages' },
              { key: 'pushPromotions', label: 'Promotions', desc: 'Recevez les offres promotionnelles' }
            ].map(item => (
              <label key={item.key} className="group flex items-center justify-between cursor-pointer p-4 bg-white/30 rounded-2xl hover:bg-white/40 transition-all duration-300">
                <div className="flex-1">
                  <span className="text-gray-800 font-semibold block">{item.label}</span>
                  <span className="text-gray-600 text-sm">{item.desc}</span>
                </div>
                <div className="relative ml-6">
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-14 h-8 rounded-full transition-all duration-300 ${notificationSettings[item.key] ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${notificationSettings[item.key] ? 'translate-x-7 mt-1' : 'translate-x-1 mt-1'}`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => handleSave('notifications')}
          disabled={saving}
          className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 font-semibold"
        >
          <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder les préférences'}
        </button>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Paramètres généraux</h3>
        <p className="text-gray-600">Personnalisez votre expérience utilisateur</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Langue</h4>
          </div>
          <select
            value={generalSettings.langue}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, langue: e.target.value }))}
            className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-teal-400/50 focus:border-teal-400 transition-all duration-300 font-semibold"
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="ar">🇲🇷 العربية</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Devise</h4>
          </div>
          <select
            value={generalSettings.devise}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, devise: e.target.value }))}
            className="w-full bg-white/50 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-green-400/50 focus:border-green-400 transition-all duration-300 font-semibold"
          >
            <option value="MRU">💰 Ouguiya (MRU)</option>
            <option value="EUR">💶 Euro (EUR)</option>
            <option value="USD">💵 Dollar US (USD)</option>
          </select>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl md:col-span-2">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">Thème d'affichage</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setGeneralSettings(prev => ({ ...prev, theme: 'light' }))}
              className={`flex-1 flex items-center justify-center px-6 py-4 rounded-2xl transition-all duration-300 font-semibold ${
                generalSettings.theme === 'light' 
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg transform scale-105' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <Sun className="w-6 h-6 mr-3" />
              Mode Clair
            </button>
            <button
              onClick={() => setGeneralSettings(prev => ({ ...prev, theme: 'dark' }))}
              className={`flex-1 flex items-center justify-center px-6 py-4 rounded-2xl transition-all duration-300 font-semibold ${
                generalSettings.theme === 'dark' 
                  ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white shadow-lg transform scale-105' 
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              <Moon className="w-6 h-6 mr-3" />
              Mode Sombre
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl md:col-span-2">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800 block">Sauvegarde automatique</span>
                <p className="text-gray-600">Sauvegarder automatiquement vos modifications</p>
              </div>
            </div>
            <div className="relative ml-6">
              <input
                type="checkbox"
                checked={generalSettings.autoSave}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                className="sr-only"
              />
              <div className={`w-16 h-9 rounded-full transition-all duration-300 ${generalSettings.autoSave ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' : 'bg-gray-300'}`}>
                <div className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-all duration-300 ${generalSettings.autoSave ? 'translate-x-8 mt-1' : 'translate-x-1 mt-1'}`}></div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => handleSave('general')}
          disabled={saving}
          className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 font-semibold"
        >
          <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </button>
      </div>
    </div>
  );

  const renderHelpSettings = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">Aide & Support</h3>
        <p className="text-gray-600">Nous sommes là pour vous aider</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-full filter blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">WhatsApp Support</h4>
            </div>
            <p className="text-gray-600 mb-4">Contactez-nous directement via WhatsApp pour une assistance rapide</p>
            <div className="flex items-center text-green-600 font-bold text-lg">
              <span>+222 38393738</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full filter blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Email Support</h4>
            </div>
            <p className="text-gray-600 mb-4">Envoyez-nous vos questions par email, nous répondons sous 24h</p>
            <div className="flex items-center text-purple-600 font-bold text-lg">
              <span>info@ishrili.com</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full filter blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">FAQ</h4>
            </div>
            <p className="text-gray-600 mb-4">Trouvez rapidement des réponses aux questions les plus fréquentes</p>
            <div className="flex items-center text-blue-600 font-bold text-lg">
              <span>Consulter la FAQ</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full filter blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800">Conditions d'utilisation</h4>
            </div>
            <p className="text-gray-600 mb-4">Consultez nos termes et conditions d'utilisation</p>
            <div className="flex items-center text-orange-600 font-bold text-lg">
              <span>Lire les conditions</span>
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-100/60 via-purple-100/60 to-pink-100/60 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full filter blur-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-2xl font-bold text-gray-800 mb-4">À propos d'Ishrili</h4>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
            Ishrili est la plateforme de e-commerce dédiée au marché mauritanien. 
            Nous permettons aux vendeurs mauritaniens de créer facilement leur boutique en ligne 
            et d'atteindre plus de clients à travers la Mauritanie.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
            <span className="text-gray-600 font-medium">Version 1.0.0 - Mai 2025</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholderSection = (title, icon, description) => (
    <div className="text-center py-16">
      <div className="inline-block relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center shadow-lg">
          {React.createElement(icon, { className: "w-12 h-12 text-gray-500" })}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-600 mb-4">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto">{description}</p>
    </div>
  );

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'general':
        return renderGeneralSettings();
      case 'help':
        return renderHelpSettings();
      case 'shop':
        return renderPlaceholderSection(
          'Paramètres de boutique',
          Store,
          'Configuration avancée de votre boutique en ligne - Disponible bientôt'
        );
      case 'payment':
        return renderPlaceholderSection(
          'Paramètres de paiement',
          CreditCard,
          'Gérez vos méthodes de paiement et commissions - En développement'
        );
      case 'delivery':
        return renderPlaceholderSection(
          'Paramètres de livraison',
          Truck,
          'Configurez vos zones et tarifs de livraison - Bientôt disponible'
        );
      case 'security':
        return renderPlaceholderSection(
          'Sécurité avancée',
          Shield,
          'Authentification à deux facteurs et paramètres de sécurité - À venir'
        );
      case 'privacy':
        return renderPlaceholderSection(
          'Confidentialité',
          Eye,
          'Gérez vos paramètres de confidentialité et données personnelles - En cours'
        );
      default:
        return renderAccountSettings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <div className="absolute inset-0 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Chargement de vos paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background elements améliorés */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-40 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 p-6 max-w-8xl mx-auto">
        {/* Header amélioré */}
        <div className="text-center mb-12">
          <div className="inline-block relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Paramètres
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Personnalisez votre expérience et gérez vos préférences de compte
          </p>
        </div>

        {/* Message de notification amélioré */}
        {message.text && (
          <div className={`mb-8 p-6 rounded-3xl border backdrop-blur-xl transform transition-all duration-500 ${
            message.type === 'success' 
              ? 'bg-green-100/80 border-green-300/50 text-green-800 shadow-green-200/50' 
              : 'bg-red-100/80 border-red-300/50 text-red-800 shadow-red-200/50'
          } shadow-2xl flex items-center max-w-2xl mx-auto`}>
            <div className="flex-shrink-0 mr-4">
              {message.type === 'success' ? (
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{message.text}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-12rem)]">
          {/* Sidebar redesignée */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="h-full">
              <div className="relative overflow-hidden bg-white/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl h-full min-h-[600px]">
                {/* Gradient decoratif */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                
                <div className="relative z-10 p-8 h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Navigation</h2>
                  
                  <nav className="space-y-3 flex-1">
                    {settingsSections.map((section, index) => {
                      const IconComponent = section.icon;
                      const isActive = activeSection === section.id;
                      
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`group w-full flex items-center px-6 py-4 rounded-2xl transition-all duration-300 transform ${
                            isActive
                              ? `bg-gradient-to-r ${section.color} text-white shadow-xl scale-105`
                              : 'text-gray-600 hover:bg-white/40 hover:text-gray-800 hover:scale-102'
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                            isActive 
                              ? 'bg-white/20 shadow-lg' 
                              : 'bg-white/30 group-hover:bg-white/50'
                          }`}>
                            <IconComponent className={`w-5 h-5 transition-all duration-300 ${
                              isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                            }`} />
                          </div>
                          <span className={`font-semibold transition-all duration-300 ${
                            isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-800'
                          }`}>
                            {section.label}
                          </span>
                          {isActive && (
                            <ChevronRight className="w-5 h-5 ml-auto text-white animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                  
                  {/* Footer de la sidebar */}
                  <div className="mt-auto pt-6 border-t border-white/20">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Ishrili Settings</p>
                      <p className="text-xs text-gray-500">v1.0.0</p>
                    </div>
                  </div>
                </div>
                
                {/* Effet de bordure animé */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-h-0">
            <div className="relative overflow-hidden bg-white/30 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl h-full min-h-[600px]">
              {/* Gradient decoratif pour le contenu */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/5"></div>
              
              <div className="relative z-10 p-8 h-full overflow-y-auto">
                {renderSettingsContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;