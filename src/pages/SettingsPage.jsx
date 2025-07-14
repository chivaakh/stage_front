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
  LogOut
} from 'lucide-react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // États pour les différents paramètres
  const [accountSettings, setAccountSettings] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [shopSettings, setShopSettings] = useState({
    nom_boutique: '',
    description: '',
    ville: '',
    telephone_professionnel: '',
    logo: null
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailCommandes: true,
    emailPromotions: false,
    smsCommandes: true,
    pushCommandes: true,
    pushMessages: true,
    pushPromotions: false
  });

  const [deliverySettings, setDeliverySettings] = useState({
    zonesLivraison: ['Nouakchott', 'Nouadhibou'],
    fraisLivraison: 500,
    delaiLivraison: '2-3 jours',
    livraisonGratuite: 5000
  });

  const [generalSettings, setGeneralSettings] = useState({
    langue: 'fr',
    devise: 'MRU',
    theme: 'light',
    autoSave: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilPublic: true,
    afficherTelephone: false,
    afficherEmail: false,
    statistiquesPubliques: true
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
        
        if (data.boutique) {
          setShopSettings({
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

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      // Simulation d'une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Paramètres sauvegardés avec succès');
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const settingsSections = [
    { id: 'account', label: 'Compte', icon: User },
    { id: 'shop', label: 'Boutique', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Paiements', icon: CreditCard },
    { id: 'delivery', label: 'Livraison', icon: Truck },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'privacy', label: 'Confidentialité', icon: Eye },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle }
  ];

  const getLogoUrl = (logoUrl) => {
    if (!logoUrl) return null;
    
    // Ajouter le domaine si l'URL est relative
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

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Section Profil Vendeur */}
      <div className="bg-white/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <User className="w-6 h-6 mr-2 text-blue-600" />
            Informations personnelles
          </h3>
          <button className="p-2 bg-blue-100/50 rounded-xl hover:bg-blue-200/50 transition">
            <Edit className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles en lecture seule d'abord */}
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

      {/* Section Boutique */}
      {userInfo?.type_utilisateur === 'vendeur' && (
        <div className="bg-white/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <Store className="w-6 h-6 mr-2 text-purple-600" />
              Ma Boutique
            </h3>
            <button className="p-2 bg-purple-100/50 rounded-xl hover:bg-purple-200/50 transition">
              <Edit className="w-5 h-5 text-purple-600" />
            </button>
          </div>

          {userInfo?.boutique ? (
            <div className="space-y-4">
              {userInfo.boutique.logo && (
                <div className="flex justify-center mb-4">
                  <img 
                    src={getLogoUrl(userInfo.boutique.logo)}
                    alt="Logo boutique"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/50"
                    onError={(e) => {
                      console.log('Erreur chargement logo:', e.target.src);
                      e.target.style.display = 'none';
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

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleSave('account')}
          disabled={saving}
          className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
        >
          <Save className="w-5 h-5 mr-2" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>

        <button
          onClick={() => {
            if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
              fetch('http://localhost:8000/api/logout/', {
                method: 'POST',
                credentials: 'include'
              }).finally(() => {
                window.location.href = '/login';
              });
            }
          }}
          className="flex items-center justify-center px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-105"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Se déconnecter
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Préférences de notification</h3>
      
      <div className="space-y-4">
        <div className="bg-white/30 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">Notifications Email</h4>
          <div className="space-y-3">
            {[
              { key: 'emailCommandes', label: 'Nouvelles commandes' },
              { key: 'emailPromotions', label: 'Promotions et offres spéciales' }
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{item.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${notificationSettings[item.key] ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">Notifications SMS</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Nouvelles commandes</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notificationSettings.smsCommandes}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsCommandes: e.target.checked }))}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.smsCommandes ? 'bg-blue-500' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationSettings.smsCommandes ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">Notifications Push</h4>
          <div className="space-y-3">
            {[
              { key: 'pushCommandes', label: 'Nouvelles commandes' },
              { key: 'pushMessages', label: 'Messages clients' },
              { key: 'pushPromotions', label: 'Promotions' }
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{item.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${notificationSettings[item.key] ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleSave('notifications')}
        disabled={saving}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
      >
        <Save className="w-5 h-5 mr-2" />
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Paramètres généraux</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
          <select
            value={generalSettings.langue}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, langue: e.target.value }))}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
          <select
            value={generalSettings.devise}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, devise: e.target.value }))}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="MRU">Ouguiya (MRU)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar US (USD)</option>
          </select>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setGeneralSettings(prev => ({ ...prev, theme: 'light' }))}
              className={`flex items-center px-4 py-2 rounded-xl transition-all ${generalSettings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-700'}`}
            >
              <Sun className="w-4 h-4 mr-2" />
              Clair
            </button>
            <button
              onClick={() => setGeneralSettings(prev => ({ ...prev, theme: 'dark' }))}
              className={`flex items-center px-4 py-2 rounded-xl transition-all ${generalSettings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-700'}`}
            >
              <Moon className="w-4 h-4 mr-2" />
              Sombre
            </button>
          </div>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-medium text-gray-800">Sauvegarde automatique</span>
              <p className="text-sm text-gray-600">Sauvegarder automatiquement les modifications</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={generalSettings.autoSave}
                onChange={(e) => setGeneralSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${generalSettings.autoSave ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${generalSettings.autoSave ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={() => handleSave('general')}
        disabled={saving}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
      >
        <Save className="w-5 h-5 mr-2" />
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );

  const renderHelpSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Aide & Support</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <Phone className="w-6 h-6 text-blue-500 mr-3" />
            <h4 className="font-semibold text-gray-800">WhatsApp Support</h4>
          </div>
          <p className="text-gray-600 mb-3">Contactez-nous directement via WhatsApp</p>
          <p className="text-blue-600 font-medium">+222 38393738</p>
        </div>

        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-purple-500 mr-3" />
            <h4 className="font-semibold text-gray-800">Email Support</h4>
          </div>
          <p className="text-gray-600 mb-3">Envoyez-nous un email</p>
          <p className="text-purple-600 font-medium">info@ishrili.com</p>
        </div>

        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <HelpCircle className="w-6 h-6 text-green-500 mr-3" />
            <h4 className="font-semibold text-gray-800">FAQ</h4>
          </div>
          <p className="text-gray-600 mb-3">Questions fréquemment posées</p>
          <div className="flex items-center text-green-600 font-medium">
            Voir la FAQ <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-orange-500 mr-3" />
            <h4 className="font-semibold text-gray-800">Conditions d'utilisation</h4>
          </div>
          <p className="text-gray-600 mb-3">Consultez nos termes et conditions</p>
          <div className="flex items-center text-orange-600 font-medium">
            Lire les conditions <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-xl p-6 border border-blue-200/30">
        <h4 className="font-semibold text-gray-800 mb-2">À propos d'Ishrili</h4>
        <p className="text-gray-600 mb-4">
          Ishrili est la plateforme de e-commerce dédiée au marché mauritanien. 
          Nous permettons aux vendeurs mauritaniens de créer facilement leur boutique en ligne 
          et d'atteindre plus de clients à travers la Mauritanie.
        </p>
        <p className="text-sm text-gray-500">Version 1.0.0 - Mai 2025</p>
      </div>
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
        return (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Paramètres de boutique</h3>
            <p className="text-gray-500">Cette section sera disponible bientôt</p>
          </div>
        );
      case 'payment':
        return (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Paramètres de paiement</h3>
            <p className="text-gray-500">Configuration des méthodes de paiement</p>
          </div>
        );
      case 'delivery':
        return (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Paramètres de livraison</h3>
            <p className="text-gray-500">Zones et tarifs de livraison</p>
          </div>
        );
      case 'security':
        return (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Sécurité</h3>
            <p className="text-gray-500">Authentification à deux facteurs et sécurité</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Confidentialité</h3>
            <p className="text-gray-500">Paramètres de confidentialité et données</p>
          </div>
        );
      default:
        return renderAccountSettings();
    }
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
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Paramètres</h1>
          <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
        </div>

        {/* Message de notification */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-100/80 border-green-300/50 text-green-700' 
              : 'bg-red-100/80 border-red-300/50 text-red-700'
          } backdrop-blur-sm flex items-center`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Paramètres</h2>
              <nav className="space-y-2">
                {settingsSections.map(section => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-white/30'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3" />
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:w-3/4">
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;2