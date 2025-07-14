import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Download, 
  Eye,
  Calendar,
  Users,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  Filter,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  Mail,
  Smartphone,
  Settings,
  BarChart3,
  Target,
  Zap,
  Globe,
  Volume2,
  FileText,
  Timer,
  UserCheck
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminNotificationsView = ({ showNotification }) => {
  const [currentTab, setCurrentTab] = useState('notifications');
  const [notifications, setNotifications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // ✅ FormData complet adapté à vos modèles
  const [formData, setFormData] = useState({
    type: 'notification',
    title: '',
    message: '',        // Pour notifications
    content: '',        // Pour campagnes (votre champ Campaign.content)
    description: '',    // Pour alertes (votre champ SystemAlert.description)
    target_users: 'all',
    channel: 'In-App',   // Défaut email selon votre modèle
    scheduled_date: '',
    priority: 'medium',
    campaign_type: 'promotional',
    alert_type: 'system',
    severity: 'info',
    affected_users: 0
  });

  // ✅ Service API 100% connecté au backend
  const notificationsAPI = {
    // Notifications - utilise votre endpoint existant
    async getNotifications() {
      try {
        console.log('🔍 GET /api/notifications/');
        const response = await fetch(`${API_BASE_URL}/notifications/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const data = await response.json();
        console.log('✅ Notifications récupérées:', data.length || data.results?.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur notifications:', error);
        return [];
      }
    },

    // ✅ Stats depuis le backend
    async getStats() {
      try {
        console.log('🔍 GET /api/notifications/stats/');
        const response = await fetch(`${API_BASE_URL}/notifications/stats/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const data = await response.json();
        console.log('✅ Stats récupérées:', data);
        return data;
      } catch (error) {
        console.error('❌ Erreur stats:', error);
        return {
          total_notifications: 0, sent_today: 0, pending: 0, delivered: 0,
          campaigns_active: 0, open_rate: 0, click_rate: 0
        };
      }
    },

    // Créer notification - utilise votre endpoint existant
    async createNotification(data) {
      try {
        console.log('🚀 POST /api/notifications/');
        console.log('📤 Données:', data);
        
        const response = await fetch(`${API_BASE_URL}/notifications/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: data.message,
            produit: data.produit_id || null
          })
        });
        
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const result = await response.json();
        console.log('✅ Notification créée:', result);
        
        return { 
          success: true, 
          message: 'Notification créée avec succès' 
        };
      } catch (error) {
        console.error('❌ Erreur création notification:', error);
        return { success: false, error: error.message };
      }
    },

    // ✅ Campagnes depuis le backend
    async getCampaigns() {
      try {
        console.log('🔍 GET /api/campaigns/');
        const response = await fetch(`${API_BASE_URL}/campaigns/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const data = await response.json();
        console.log('✅ Campagnes récupérées:', data.length || data.results?.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur campagnes:', error);
        return [];
      }
    },

    // ✅ Envoyer campagne vers le backend
    async sendCampaign(data) {
      try {
        console.log('🚀 POST /api/campaigns/');
        console.log('📤 Données campagne:', data);
        
        const response = await fetch(`${API_BASE_URL}/campaigns/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            content: data.content,
            type: data.type,
            target_users: data.target_users,
            channel: data.channel,
            scheduled_date: data.scheduled_date || null
          })
        });
        
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const result = await response.json();
        console.log('✅ Campagne créée:', result);
        
        return { 
          success: true, 
          message: `Campagne "${data.title}" ${data.scheduled_date ? 'programmée' : 'envoyée'} avec succès`
        };
      } catch (error) {
        console.error('❌ Erreur création campagne:', error);
        return { success: false, error: error.message };
      }
    },

    // ✅ Alertes depuis le backend
    async getAlerts() {
      try {
        console.log('🔍 GET /api/alerts/');
        const response = await fetch(`${API_BASE_URL}/alerts/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const data = await response.json();
        console.log('✅ Alertes récupérées:', data.length || data.results?.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur alertes:', error);
        return [];
      }
    },

    // ✅ Créer alerte vers le backend
    async createAlert(data) {
      try {
        console.log('🚀 POST /api/alerts/');
        console.log('📤 Données alerte:', data);
        
        const response = await fetch(`${API_BASE_URL}/alerts/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            type: data.type,
            severity: data.severity,
            affected_users: data.affected_users
          })
        });
        
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const result = await response.json();
        console.log('✅ Alerte créée:', result);
        
        return { 
          success: true, 
          message: 'Alerte créée avec succès',
          alert: result
        };
      } catch (error) {
        console.error('❌ Erreur création alerte:', error);
        return { success: false, error: error.message };
      }
    },

    // ✅ Résoudre alerte vers le backend
    async resolveAlert(alertId) {
      try {
        console.log('🚀 POST /api/alerts/{id}/resolve/');
        const response = await fetch(`${API_BASE_URL}/alerts/${alertId}/resolve/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
        const result = await response.json();
        console.log('✅ Alerte résolue:', result);
        
        return { 
          success: true, 
          message: 'Alerte marquée comme résolue'
        };
      } catch (error) {
        console.error('❌ Erreur résolution alerte:', error);
        return { success: false, error: error.message };
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Charger toutes les données depuis le backend
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des données depuis le backend...');
      
      const [notificationsData, campaignsData, alertsData, statsData] = await Promise.all([
        notificationsAPI.getNotifications(),
        notificationsAPI.getCampaigns(),
        notificationsAPI.getAlerts(),
        notificationsAPI.getStats()
      ]);
      
      setNotifications(notificationsData);
      setCampaigns(campaignsData);
      setAlerts(alertsData);
      setStats(statsData);
      
      console.log('✅ Toutes les données chargées depuis le backend:', {
        notifications: notificationsData.length,
        campaigns: campaignsData.length,
        alerts: alertsData.length,
        stats: statsData
      });

    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      showNotification && showNotification('error', 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction handleCreateSubmit adaptée
  const handleCreateSubmit = async () => {
    try {
      setLoading(true);
      
      let result;
      if (formData.type === 'campaign') {
        result = await notificationsAPI.sendCampaign({
          title: formData.title,
          content: formData.content,
          type: formData.campaign_type,
          target_users: formData.target_users,
          channel: formData.channel,
          scheduled_date: formData.scheduled_date
        });
      } else if (formData.type === 'alert') {
        result = await notificationsAPI.createAlert({
          title: formData.title,
          description: formData.description,
          type: formData.alert_type,
          severity: formData.severity,
          affected_users: parseInt(formData.affected_users) || 0
        });
      } else {
        result = await notificationsAPI.createNotification({
          message: formData.message,
          produit_id: null
        });
      }
      
      if (result.success) {
        showNotification && showNotification('success', result.message);
        setIsCreateModalOpen(false);
        // Reset form
        setFormData({
          type: 'notification',
          title: '',
          message: '',
          content: '',
          description: '',
          target_users: 'all',
          channel: 'In-App',
          scheduled_date: '',
          priority: 'medium',
          campaign_type: 'promotional',
          alert_type: 'system',
          severity: 'info',
          affected_users: 0
        });
        fetchData(); // Recharger les données
      } else {
        throw new Error(result.error || 'Erreur lors de la création');
      }
    } catch (error) {
      showNotification && showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fonction pour résoudre une alerte
  const handleResolveAlert = async (alertId) => {
    try {
      const result = await notificationsAPI.resolveAlert(alertId);
      if (result.success) {
        showNotification && showNotification('success', result.message);
        fetchData(); // Recharger les données
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      showNotification && showNotification('error', `Erreur: ${error.message}`);
    }
  };

  const getStatusBadge = (status, type = 'notification') => {
    const badges = {
      // Notifications
      pending: <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">En attente</span>,
      delivered: <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Délivré</span>,
      failed: <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Échec</span>,
      
      // Campagnes
      draft: <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Brouillon</span>,
      active: <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">Active</span>,
      scheduled: <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600">Programmée</span>,
      completed: <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Terminée</span>,
      cancelled: <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Annulée</span>,
      
      // Alertes
      resolved: <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Résolue</span>,
      investigating: <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-600">En cours</span>
    };
    
    return badges[status] || badges['pending'];
  };

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Critique</span>,
      warning: <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">Attention</span>,
      info: <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">Info</span>
    };
    
    return badges[severity] || badges['info'];
  };

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.total_notifications?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Total Notifications</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Send size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.sent_today?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Envoyées Aujourd'hui</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <AlertTriangle size={16} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.pending?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">En Attente</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : `${stats.open_rate || 0}%`}
          </div>
          <div className="text-gray-600 text-sm">Taux d'Ouverture</div>
        </div>
      </div>

      {/* Table Notifications */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Notifications Push</h3>
          <button 
            onClick={() => {setFormData({...formData, type: 'notification'}); setIsCreateModalOpen(true);}}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            Nouvelle Notification
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw size={48} className="text-gray-300 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Chargement...</h3>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune notification</h3>
            <p className="text-gray-500">Créez votre première notification push</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Message</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Produit</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr key={notification.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                          <Bell size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{notification.message}</div>
                          <div className="text-sm text-gray-500">ID: {notification.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{notification.produit || 'Général'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {notification.date_notification ? 
                          new Date(notification.date_notification).toLocaleDateString('fr-FR') : 
                          'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(notification.est_lue ? 'delivered' : 'pending')}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {setSelectedItem(notification); setIsDetailModalOpen(true);}}
                        className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderCampaignsTab = () => (
    <div className="space-y-6">
      {/* Stats Cards Campagnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{stats.campaigns_active || 0}</div>
          <div className="text-gray-600 text-sm">Campagnes Actives</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Mail size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{(stats.open_rate || 0).toFixed(1)}%</div>
          <div className="text-gray-600 text-sm">Taux d'Ouverture</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">{(stats.click_rate || 0).toFixed(1)}%</div>
          <div className="text-gray-600 text-sm">Taux de Clic</div>
        </div>
      </div>

      {/* Table Campagnes */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Campagnes Marketing</h3>
          <button 
            onClick={() => {setFormData({...formData, type: 'campaign'}); setIsCreateModalOpen(true);}}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            Nouvelle Campagne
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Campagne</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Performance</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={campaign.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                        <Target size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{campaign.title}</div>
                        <div className="text-sm text-gray-500">
                          {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      campaign.type === 'promotional' ? 'bg-red-100 text-red-600' :
                      campaign.type === 'newsletter' ? 'bg-blue-100 text-blue-600' :
                      campaign.type === 'announcement' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {campaign.type === 'promotional' ? 'Promotion' :
                       campaign.type === 'newsletter' ? 'Newsletter' : 
                       campaign.type === 'announcement' ? 'Annonce' : 'Autre'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {campaign.sent_count > 0 && (
                        <div className="text-sm">Envoyées: {campaign.sent_count.toLocaleString()}</div>
                      )}
                      {campaign.open_rate > 0 && (
                        <div className="text-sm text-green-600">Ouverture: {campaign.open_rate.toFixed(1)}%</div>
                      )}
                      {campaign.click_rate > 0 && (
                        <div className="text-sm text-blue-600">Clic: {campaign.click_rate.toFixed(1)}%</div>
                      )}
                      {campaign.scheduled_date && campaign.status === 'scheduled' && (
                        <div className="text-sm text-purple-600">
                          Programmée: {new Date(campaign.scheduled_date).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(campaign.status, 'campaign')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {setSelectedItem(campaign); setIsDetailModalOpen(true);}}
                        className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                      >
                        <BarChart3 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlertsTab = () => (
    <div className="space-y-6">
      {/* Table Alertes Système */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Alertes Système</h3>
          <button 
            onClick={() => {setFormData({...formData, type: 'alert'}); setIsCreateModalOpen(true);}}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            Nouvelle Alerte
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Alerte</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Sévérité</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Impact</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={alert.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                        alert.severity === 'critical' ? 'bg-red-500' :
                        alert.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}>
                        <AlertTriangle size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{alert.title}</div>
                        <div className="text-sm text-gray-500">
                          {alert.created_at ? new Date(alert.created_at).toLocaleString('fr-FR') : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      {alert.type === 'technical' ? 'Technique' :
                       alert.type === 'system' ? 'Système' : 
                       alert.type === 'security' ? 'Sécurité' :
                       alert.type === 'performance' ? 'Performance' : 'Autre'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getSeverityBadge(alert.severity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {alert.affected_users ? `${alert.affected_users} utilisateurs` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(alert.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {setSelectedItem(alert); setIsDetailModalOpen(true);}}
                        className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      {alert.status !== 'resolved' && (
                        <button 
                          onClick={() => handleResolveAlert(alert.id)}
                          className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Header */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Notifications et Alertes</h2>
        <p className="text-gray-600">
          Gérez les notifications push, campagnes marketing et alertes système
        </p>
        {/* <div className="mt-3 flex gap-2 text-sm"> */}
          {/* <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">✅ Notifications: /api/notifications/</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">✅ Campagnes: /api/campaigns/</span>
          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full">✅ Alertes: /api/alerts/</span> */}
        {/* </div> */}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentTab('notifications')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentTab === 'notifications'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bell size={16} />
            Notifications Push
          </button>
          
          <button
            onClick={() => setCurrentTab('campaigns')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentTab === 'campaigns'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Target size={16} />
            Campagnes Marketing
          </button>
          
          <button
            onClick={() => setCurrentTab('alerts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              currentTab === 'alerts'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle size={16} />
            Alertes Système
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {currentTab === 'notifications' && renderNotificationsTab()}
      {currentTab === 'campaigns' && renderCampaignsTab()}
      {currentTab === 'alerts' && renderAlertsTab()}

      {/* Modal Création/Édition */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                {formData.type === 'notification' ? 'Nouvelle Notification' :
                 formData.type === 'campaign' ? 'Nouvelle Campagne' : 'Nouvelle Alerte'}
              </h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Titre..."
                />
              </div>
              
              {/* Champ conditionnel selon le type */}
              {formData.type === 'notification' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    placeholder="Message de la notification..."
                  />
                </div>
              )}
              
              {formData.type === 'campaign' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Contenu de la campagne..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de campagne</label>
                    <select
                      value={formData.campaign_type}
                      onChange={(e) => setFormData({...formData, campaign_type: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="promotional">Promotion</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="announcement">Annonce</option>
                    </select>
                  </div>
                </>
              )}
              
              {formData.type === 'alert' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Description de l'alerte..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type d'alerte</label>
                      <select
                        value={formData.alert_type}
                        onChange={(e) => setFormData({...formData, alert_type: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="technical">Technique</option>
                        <option value="system">Système</option>
                        <option value="security">Sécurité</option>
                        <option value="performance">Performance</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sévérité</label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({...formData, severity: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      >
                        <option value="info">Information</option>
                        <option value="warning">Attention</option>
                        <option value="critical">Critique</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utilisateurs affectés</label>
                    <input
                      type="number"
                      value={formData.affected_users}
                      onChange={(e) => setFormData({...formData, affected_users: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Nombre d'utilisateurs affectés..."
                    />
                  </div>
                </>
              )}
              
              {/* Champs communs pour campagnes et notifications */}
              {formData.type !== 'alert' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cible</label>
                    <select
                      value={formData.target_users}
                      onChange={(e) => setFormData({...formData, target_users: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="all">Tous les utilisateurs</option>
                      <option value="clients">Clients uniquement</option>
                      <option value="vendors">Vendeurs uniquement</option>
                      <option value="active">Utilisateurs actifs</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Canal</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({...formData, channel: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    >
                      <option value="in-app">In-App</option>
                    </select>
                  </div>
                </div>
              )}
              
              {formData.type === 'campaign' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Programmation (optionnel)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4 p-6 border-t">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={handleCreateSubmit}
                disabled={
                  !formData.title || 
                  (formData.type === 'notification' && !formData.message) ||
                  (formData.type === 'campaign' && !formData.content) ||
                  (formData.type === 'alert' && !formData.description) ||
                  loading
                }
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 
                 formData.type === 'campaign' && formData.scheduled_date ? 'Programmer' : 
                 formData.type === 'campaign' ? 'Envoyer' :
                 formData.type === 'alert' ? 'Créer' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">
                Détails - {selectedItem.title || selectedItem.message}
              </h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium ml-2">{selectedItem.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium ml-2">{selectedItem.type || 'Notification'}</span>
                </div>
              </div>
              
              {/* Contenu selon le type */}
              {selectedItem.message && (
                <div>
                  <span className="text-gray-600">Message:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedItem.message}</p>
                </div>
              )}
              
              {selectedItem.content && (
                <div>
                  <span className="text-gray-600">Contenu:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedItem.content}</p>
                </div>
              )}
              
              {selectedItem.description && (
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg">{selectedItem.description}</p>
                </div>
              )}
              
              {/* Stats campagne */}
              {selectedItem.sent_count !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Envoyées:</span>
                    <span className="font-medium ml-2">{selectedItem.sent_count.toLocaleString()}</span>
                  </div>
                  {selectedItem.opened_count !== undefined && (
                    <div>
                      <span className="text-gray-600">Ouvertes:</span>
                      <span className="font-medium ml-2">{selectedItem.opened_count.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
              
              {selectedItem.open_rate !== undefined && selectedItem.open_rate > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Taux d'ouverture:</span>
                    <span className="font-medium ml-2 text-green-600">{selectedItem.open_rate.toFixed(1)}%</span>
                  </div>
                  {selectedItem.click_rate !== undefined && (
                    <div>
                      <span className="text-gray-600">Taux de clic:</span>
                      <span className="font-medium ml-2 text-blue-600">{selectedItem.click_rate.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Info alerte */}
              {selectedItem.severity && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Sévérité:</span>
                    <span className="font-medium ml-2">{selectedItem.severity}</span>
                  </div>
                  {selectedItem.affected_users !== undefined && (
                    <div>
                      <span className="text-gray-600">Utilisateurs affectés:</span>
                      <span className="font-medium ml-2">{selectedItem.affected_users}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                {selectedItem.created_at && (
                  <div>
                    <span className="text-gray-600">Créé le:</span>
                    <span className="font-medium ml-2">
                      {new Date(selectedItem.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                )}
                {selectedItem.resolved_at && (
                  <div>
                    <span className="text-gray-600">Résolu le:</span>
                    <span className="font-medium ml-2">
                      {new Date(selectedItem.resolved_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t">
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNotificationsView;