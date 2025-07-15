import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Store, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Search, 
  Download, 
  UserCheck, 
  UserX, 
  Eye,
  Phone,
  Mail,
  Calendar,
  Shield,
  Menu,
  X,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Package,
  Bell,
  LogOut  // 🔧 AJOUT DE L'ICÔNE LOGOUT
} from 'lucide-react';
import AdminBoutiquesView from './AdminBoutiquesView';
import AdminProduitsView from './AdminProduitsView';
import AdminCommandesView from './AdminCommandesView';
import AdminNotificationsView from './AdminNotificationsView';
import AdminAnalyticsView from './AdminAnalyticsView';
import { handleLogout } from '../../utils/logout.js'; // 🔧 CHEMIN CORRIGÉ

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminUsersApiOnly = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('users');
  
  // 🎉 NOUVELLE FONCTIONNALITÉ : État pour les notifications élégantes
  const [notification, setNotification] = useState(null);

  // 🎉 NOUVELLE FONCTIONNALITÉ : Fonction pour afficher une notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    
    // Auto-masquer après 4 secondes
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // 🔧 FONCTION DE DÉCONNEXION UTILISANT logout.js
  const logout = () => {
    handleLogout('/'); // Redirige vers la page d'accueil après déconnexion et nettoyage localStorage
  };

  // Service API utilisant VOS endpoints existants
  const apiService = {
    async getUsers() {
      const response = await fetch(`${API_BASE_URL}/admin/users/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    },

    async toggleUserStatus(userId) {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    },

    async getStats() {
      const response = await fetch(`${API_BASE_URL}/admin/stats/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    },

    // Utiliser vos endpoints existants
    async getOrders() {
      const response = await fetch(`${API_BASE_URL}/commandes/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    },

    async getProducts() {
      const response = await fetch(`${API_BASE_URL}/produits/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }
      
      return await response.json();
    }
  };

  useEffect(() => {
    if (currentView === 'users') {
      fetchUsersAndStats();
    }
  }, [currentView]);

  const fetchUsersAndStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Appels API parallèles pour optimiser les performances
      const [usersData, statsData] = await Promise.all([
        apiService.getUsers(),
        apiService.getStats()
      ]);
      
      // Traitement des utilisateurs
      const usersList = Array.isArray(usersData) ? usersData : usersData.results || [];
      setUsers(usersList);
      setFilteredUsers(usersList);
      
      // Traitement des statistiques
      setStats({
        totalClients: statsData.total_clients || 0,
        totalVendeurs: statsData.total_vendeurs || 0,
        actifs: statsData.actifs || 0,
        nouveaux: statsData.nouveaux || 0,
        totalCommandes: statsData.total_commandes || 0,
        commandesToday: statsData.commandes_today || 0
      });

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError(error);
      setUsers([]);
      setFilteredUsers([]);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telephone?.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(user => user.type_utilisateur === filterType);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(user => user.est_actif);
      } else if (filterStatus === 'inactive') {
        filtered = filtered.filter(user => !user.est_actif);
      } else if (filterStatus === 'verified') {
        filtered = filtered.filter(user => user.est_verifie);
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterType, filterStatus]);

  // 🎉 FONCTION MODIFIÉE : handleToggleStatus avec notifications élégantes
  const handleToggleStatus = async (user) => {
    try {
      setLoading(true);
      
      const result = await apiService.toggleUserStatus(user.id_utilisateur || user.id);
      
      if (result.success) {
        // Mettre à jour l'état local
        const updatedUsers = users.map(u =>
          (u.id_utilisateur || u.id) === (user.id_utilisateur || user.id)
            ? { ...u, est_actif: result.new_status }
            : u
        );
        setUsers(updatedUsers);
        
        // 🎉 NOTIFICATION ÉLÉGANTE au lieu d'alert()
        showNotification(
          'success', 
          result.message || `Utilisateur ${result.new_status ? 'activé' : 'suspendu'} avec succès`
        );
      } else {
        throw new Error(result.error || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // 🎉 NOTIFICATION D'ERREUR ÉLÉGANTE au lieu d'alert()
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 🎉 FONCTION MODIFIÉE : handleExport avec notification élégante
  const handleExport = () => {
    if (filteredUsers.length === 0) {
      // 🎉 NOTIFICATION ÉLÉGANTE au lieu d'alert()
      showNotification('warning', 'Aucune donnée à exporter');
      return;
    }

    const headers = 'ID,Prénom,Nom,Téléphone,Email,Type,Statut,Vérifié,Date création\n';
    const csv = headers + filteredUsers.map(user => 
      `${user.id_utilisateur || user.id},"${user.prenom || ''}","${user.nom || ''}","${user.telephone || ''}","${user.email || ''}","${user.type_utilisateur || ''}","${user.est_actif ? 'Actif' : 'Inactif'}","${user.est_verifie ? 'Oui' : 'Non'}","${user.date_creation ? new Date(user.date_creation).toLocaleDateString('fr-FR') : 'N/A'}"`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    // 🎉 NOTIFICATION DE SUCCÈS pour l'export
    showNotification('success', `Export réussi ! ${filteredUsers.length} utilisateur(s) exporté(s)`);
  };

  const getStatusBadge = (isActive, isVerified) => {
    if (isActive === undefined) {
      return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">Chargement...</span>;
    }
    if (!isActive) {
      return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Suspendu</span>;
    }
    if (isVerified) {
      return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Vérifié</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">En attente</span>;
  };

  const getTypeBadge = (type) => {
    const typeClasses = {
      client: "px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600",
      vendeur: "px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600",
      administrateur: "px-3 py-1 rounded-full text-xs bg-red-100 text-red-600"
    };
    const labels = { client: 'Client', vendeur: 'Vendeur', administrateur: 'Admin' };
    return <span className={typeClasses[type] || typeClasses.client}>{labels[type] || type}</span>;
  };

  const navigateToSection = (section) => {
    setCurrentView(section);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  // Page d'erreur si problème API
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur de connexion API</h3>
          <p className="text-gray-600 mb-2">Impossible de se connecter au serveur Django.</p>
          <p className="text-sm text-gray-500 mb-6">Détails: {error.message}</p>
          <div className="space-y-3">
            <button 
              onClick={() => {setError(null); fetchUsersAndStats();}}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all mx-auto"
            >
              <RefreshCw size={16} />
              Réessayer
            </button>
            <p className="text-xs text-gray-400">
              Vérifiez que votre serveur Django fonctionne sur http://127.0.0.1:8000
            </p>
          </div>
        </div>
      </div>
    );
  }

  const IshriliIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 200 200" 
      fill="white"
    >
      <circle cx="100" cy="40" r="15" fill="white" />
      <path d="M109.6,164.7c-5.9,6.3-15.9,7.7-22.8,2.8c-8.3-5.9-10.7-18.6-4.4-35.3c4.7-12.6,11.6-24.9,13.5-31.8 
               c2.2-7.9,0.7-13.6-4-17.2c-4.4-3.3-11.4-4.2-18.1-3.2c-5.7,0.9-9.4-2.2-9.6-7c-0.2-4.7,3.3-8.8,7.9-9.2
               c10.2-0.8,25.1-0.8,34.6,9.1c10.6,10.9,10.3,25.1,5.8,39.3c-2.4,7.4-5.9,15.3-8.4,22.2c-2.9,7.9-3.1,14.1,1.3,16.6
               c3.5,2,9.7,1.6,13.8-2.7C121.1,151.3,115.6,158.2,109.6,164.7z" fill="white"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex overflow-hidden" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      
      {/* 🎉 SYSTÈME DE NOTIFICATIONS ÉLÉGANTES */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`
            transform transition-all duration-500 ease-in-out
            ${notification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
            bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-4 shadow-2xl
            border-l-4 min-w-[320px] max-w-md
            ${notification.type === 'success' 
              ? 'border-green-500' 
              : notification.type === 'error' 
              ? 'border-red-500' 
              : notification.type === 'warning'
              ? 'border-yellow-500'
              : 'border-blue-500'
            }
          `}>
            <div className="flex items-start gap-3">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg
                ${notification.type === 'success' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600' 
                  : notification.type === 'error' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : notification.type === 'warning'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }
              `}>
                {notification.type === 'success' ? '✓' : 
                 notification.type === 'error' ? '✕' : 
                 notification.type === 'warning' ? '⚠' : 'ℹ'}
              </div>
              
              <div className="flex-1">
                <h4 className={`font-semibold text-sm
                  ${notification.type === 'success' ? 'text-green-800' : 
                    notification.type === 'error' ? 'text-red-800' : 
                    notification.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'}
                `}>
                  {notification.type === 'success' ? 'Succès' : 
                   notification.type === 'error' ? 'Erreur' : 
                   notification.type === 'warning' ? 'Attention' : 'Information'}
                </h4>
                <p className="text-gray-700 text-sm mt-1">
                  {notification.message}
                </p>
              </div>
              
              <button 
                onClick={() => setNotification(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>
            
            {/* Barre de progression animée */}
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
              <div className={`
                h-1 rounded-full
                ${notification.type === 'success' ? 'bg-green-500' : 
                  notification.type === 'error' ? 'bg-red-500' : 
                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}
              `} 
              style={{
                animation: 'progressBar 4s linear forwards'
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Fixed avec structure flex ET scroll */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white bg-opacity-95 backdrop-blur-lg shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:translate-x-0 flex flex-col h-screen`}>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            {/* Icône Ishrili dans un cercle élégant */}
            <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <IshriliIcon />
            </div>
            <h1 className="text-2xl font-bold">Ishrili Admin</h1>
          </div>
          <p className="text-sm opacity-90 ml-15">Interface Administrateur</p>
        </div>
        
        {/* Navigation principale - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Gestion Utilisateurs</h3>
              <button 
                onClick={() => navigateToSection('users')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border-r-4 ${
                  currentView === 'users' 
                    ? 'text-blue-600 bg-blue-50 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <Users size={20} />
                <span className="ml-3">Comptes Utilisateurs</span>
              </button>
              
              <button 
                onClick={() => navigateToSection('shops')}
                className={`w-full flex items-center px-4 py-3 rounded-lg mt-2 border-r-4 ${
                  currentView === 'shops' 
                    ? 'text-blue-600 bg-blue-50 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <Store size={20} />
                <span className="ml-3">Boutiques</span>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Commerce</h3>
              
              <button 
                onClick={() => navigateToSection('produits')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border-r-4 ${
                  currentView === 'produits' 
                    ? 'text-blue-600 bg-blue-50 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <Package size={20} />
                <span className="ml-3">Produits</span>
              </button>
              
              <button 
                onClick={() => navigateToSection('orders')}
                className={`w-full flex items-center px-4 py-3 rounded-lg mt-2 border-r-4 ${
                  currentView === 'orders' 
                    ? 'text-blue-600 bg-blue-50 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <ShoppingCart size={20} />
                <span className="ml-3">Commandes</span>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Communication</h3>
              
              <button 
                onClick={() => navigateToSection('notifications')}
                className={`w-full flex items-center px-4 py-3 rounded-lg border-r-4 ${
                  currentView === 'notifications' 
                    ? 'text-blue-600 bg-blue-50 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <Bell size={20} />
                <span className="ml-3">Notifications</span>
              </button>
              
             <button 
                onClick={() => navigateToSection('analytics')}
                className={`w-full flex items-center px-4 py-3 rounded-lg mt-2 border-r-4 ${
                  currentView === 'analytics' 
                    ? 'text-blue-600 bg-blue-50 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'
                }`}
              >
                <BarChart3 size={20} />
                <span className="ml-3">Analytics</span>
              </button>
            </div>
          </nav>
        </div>

        {/* 🔧 SECTION LOGOUT EN BAS DE LA SIDEBAR - TOUJOURS VISIBLE */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg group"
          >
            <LogOut size={20} className="mr-3 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold">Se déconnecter</span>
          </button>
        </div>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Contenu principal avec dimensions fixes */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden" style={{ marginLeft: '288px' }}>
        {/* Header Mobile */}
        <div className="lg:hidden flex items-center bg-white bg-opacity-95 backdrop-blur-lg rounded-xl p-4 m-4 shadow-lg">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="mr-4"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-blue-600">Ishrili Admin</h1>
        </div>

        {/* Zone de contenu scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6 max-w-full">
            {/* Contenu dynamique selon la vue actuelle */}
            {currentView === 'users' && (
              <>
                {/* Page Header */}
                <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-xl">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Comptes Utilisateurs</h2>
                  <p className="text-gray-600">
                    Consultez et gérez tous les comptes utilisateurs de la plateforme
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Users size={24} className="text-white" />
                        )}
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {loading ? '...' : stats.totalClients?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-600 text-sm">Total Clients</div>
                  </div>

                  <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Store size={24} className="text-white" />
                        )}
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {loading ? '...' : stats.totalVendeurs?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-600 text-sm">Total Vendeurs</div>
                  </div>

                  <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UserCheck size={24} className="text-white" />
                        )}
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {loading ? '...' : stats.nouveaux?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-600 text-sm">Nouveaux (7j)</div>
                  </div>

                  <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Shield size={24} className="text-white" />
                        )}
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">
                      {loading ? '...' : stats.actifs?.toLocaleString() || 0}
                    </div>
                    <div className="text-gray-600 text-sm">Utilisateurs Actifs</div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 lg:mb-0">Filtres et Recherche</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={fetchUsersAndStats} 
                        disabled={loading}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Actualiser
                      </button>
                      <button 
                        onClick={handleExport}
                        disabled={filteredUsers.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        <Download size={16} />
                        Exporter CSV ({filteredUsers.length})
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher par nom, téléphone, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    
                    <select 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="all">Tous les types</option>
                      <option value="client">Clients</option>
                      <option value="vendeur">Vendeurs</option>
                      <option value="administrateur">Administrateurs</option>
                    </select>
                    
                    <select 
                      value={filterStatus} 
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="active">Actifs</option>
                      <option value="inactive">Suspendus</option>
                      <option value="verified">Vérifiés</option>
                    </select>
                  </div>
                  
                  <p className="text-gray-600 text-sm">
                    {filteredUsers.length} utilisateur(s) trouvé(s) sur {users.length} total
                  </p>
                </div>

                {/* Table */}
                <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
                      <p className="text-gray-600">Chargement des utilisateurs depuis l'API...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Users size={48} className="text-gray-300 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun utilisateur trouvé</h3>
                      <p className="text-gray-500">
                        {users.length === 0 
                          ? 'Aucun utilisateur dans la base de données.' 
                          : 'Aucun utilisateur ne correspond à vos critères de recherche.'
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-4 text-left font-semibold text-gray-800">Utilisateur</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800">Contact</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800">Type</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800">Date d'inscription</th>
                            <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user, index) => (
                            <tr key={user.id_utilisateur || user.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {(user.prenom || user.nom || 'U')[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-800">
                                      {user.prenom} {user.nom || 'N/A'}
                                    </div>
                                    <div className="text-sm text-gray-500">ID: {user.id_utilisateur || user.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={14} />
                                    {user.telephone || 'N/A'}
                                  </div>
                                  {user.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <Mail size={14} />
                                      {user.email}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {getTypeBadge(user.type_utilisateur)}
                              </td>
                              <td className="px-6 py-4">
                                {getStatusBadge(user.est_actif, user.est_verifie)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar size={14} />
                                  {user.date_creation ? 
                                    new Date(user.date_creation).toLocaleDateString('fr-FR') : 
                                    'N/A'
                                  }
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleViewDetails(user)}
                                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                                    title="Voir détails"
                                  >
                                    <Eye size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleToggleStatus(user)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                      user.est_actif 
                                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                    }`}
                                    title={user.est_actif ? 'Suspendre' : 'Activer'}
                                    disabled={loading}
                                  >
                                    {user.est_actif ? <UserX size={16} /> : <UserCheck size={16} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Autres vues */}
            {currentView === 'shops' && (
              <AdminBoutiquesView showNotification={showNotification} />
            )}

            {currentView === 'produits' && (
              <AdminProduitsView showNotification={showNotification} />
            )}

            {currentView === 'orders' && (
              <AdminCommandesView showNotification={showNotification} />
            )}

            {currentView === 'notifications' && (
              <AdminNotificationsView showNotification={showNotification} />
            )}

            {currentView === 'analytics' && (
              <AdminAnalyticsView showNotification={showNotification} />
            )}
          </div>
        </div>
      </div>

        {/* Modal */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">Détails de l'utilisateur</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Informations personnelles</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom complet:</span>
                      <span className="font-medium">{selectedUser.prenom} {selectedUser.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{selectedUser.telephone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedUser.email || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type d'utilisateur:</span>
                      <span className="font-medium">{selectedUser.type_utilisateur}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Statut du compte</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compte actif:</span>
                      <span className={`font-medium ${selectedUser.est_actif ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.est_actif ? 'Oui' : 'Non'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compte vérifié:</span>
                      <span className={`font-medium ${selectedUser.est_verifie ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedUser.est_verifie ? 'Oui' : 'Non'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Méthode de vérification:</span>
                      <span className="font-medium">{selectedUser.methode_verification || 'Aucune'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Dates importantes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de création:</span>
                      <span className="font-medium">
                        {selectedUser.date_creation ? 
                          new Date(selectedUser.date_creation).toLocaleString('fr-FR') : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière modification:</span>
                      <span className="font-medium">
                        {selectedUser.date_modification ? 
                          new Date(selectedUser.date_modification).toLocaleString('fr-FR') : 
                          'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Fermer
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🎉 STYLES CSS POUR LES ANIMATIONS */}
        <style jsx>{`
          @keyframes progressBar {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    );
};

export default AdminUsersApiOnly;