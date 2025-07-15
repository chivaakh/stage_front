import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Download, 
  Eye,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Filter,
  Package,
  CreditCard,
  Phone,
  Mail,
  Edit,
  Flag,
  RotateCcw,
  MessageSquare,
  FileText,
  Users
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminCommandesView = ({ showNotification }) => {
  const [commandes, setCommandes] = useState([]);
  const [filteredCommandes, setFilteredCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [filterMontant, setFilterMontant] = useState('all');
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [commandeToUpdate, setCommandeToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [sortBy, setSortBy] = useState('date_commande');
  const [sortOrder, setSortOrder] = useState('desc');

  // Service API pour les commandes - ADAPTÉ POUR VOTRE BACKEND
  const commandesAPI = {
    async getCommandes() {
      const response = await fetch(`${API_BASE_URL}/commandes/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async getCommandesStats() {
      // Pour l'instant, on calcule les stats côté frontend
      // Vous pourrez ajouter cet endpoint plus tard si besoin
      try {
        const commandes = await this.getCommandes();
        const commandesList = Array.isArray(commandes) ? commandes : commandes.results || [];
        
        const stats = {
          total: commandesList.length,
          en_attente: commandesList.filter(c => c.statut === 'en_attente').length,
          confirmees: commandesList.filter(c => c.statut === 'confirmee').length,
          livrees: commandesList.filter(c => c.statut === 'livree').length,
          litigieuses: commandesList.filter(c => c.est_litigieuse).length,
          ca_total: commandesList.reduce((sum, c) => sum + parseFloat(c.montant_total || 0), 0),
          ca_mois: commandesList
            .filter(c => {
              const commandeDate = new Date(c.date_commande);
              const now = new Date();
              return commandeDate.getMonth() === now.getMonth() && 
                     commandeDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, c) => sum + parseFloat(c.montant_total || 0), 0),
          commandes_today: commandesList.filter(c => {
            const commandeDate = new Date(c.date_commande);
            const today = new Date();
            return commandeDate.toDateString() === today.toDateString();
          }).length
        };
        
        return stats;
      } catch (error) {
        console.error('Erreur calcul stats:', error);
        return {
          total: 0, en_attente: 0, confirmees: 0, livrees: 0, 
          litigieuses: 0, ca_total: 0, ca_mois: 0, commandes_today: 0
        };
      }
    },

    async updateStatut(commandeId, statut, commentaire = '') {
      // Utilise votre endpoint existant ou simulation
      const response = await fetch(`${API_BASE_URL}/commandes/${commandeId}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut })
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return { success: true, message: 'Statut mis à jour avec succès' };
    },

    async marquerLitigieuse(commandeId, raison) {
      // Simulation - vous pourrez ajouter cet endpoint plus tard
      showNotification('info', 'Fonctionnalité en développement - Commande marquée localement');
      return { success: true, message: 'Commande marquée comme litigieuse' };
    },

    async approuverRemboursement(commandeId, montant) {
      // Simulation - vous pourrez ajouter cet endpoint plus tard
      showNotification('info', 'Fonctionnalité en développement');
      return { success: true, message: 'Remboursement approuvé' };
    }
  };

  useEffect(() => {
    fetchCommandesAndStats();
  }, []);

  const fetchCommandesAndStats = async () => {
    try {
      setLoading(true);
      
      const [commandesData, statsData] = await Promise.all([
        commandesAPI.getCommandes(),
        commandesAPI.getCommandesStats()
      ]);
      
      const commandesList = Array.isArray(commandesData) ? commandesData : commandesData.results || [];
      setCommandes(commandesList);
      setFilteredCommandes(commandesList);
      
      setStats({
        total: statsData.total || 0,
        en_attente: statsData.en_attente || 0,
        confirmees: statsData.confirmees || 0,
        livrees: statsData.livrees || 0,
        litigieuses: statsData.litigieuses || 0,
        ca_total: statsData.ca_total || 0,
        ca_mois: statsData.ca_mois || 0,
        commandes_today: statsData.commandes_today || 0
      });

    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      showNotification('error', 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...commandes];

    // Recherche textuelle - ADAPTÉE POUR VOS DONNÉES
    if (searchTerm) {
      filtered = filtered.filter(commande =>
        commande.id?.toString().includes(searchTerm) ||
        commande.client?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.client?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.client?.telephone?.includes(searchTerm) ||
        commande.client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatut !== 'all') {
      filtered = filtered.filter(commande => commande.statut === filterStatut);
    }

    // Filtre par date
    if (filterDate !== 'all') {
      const now = new Date();
      filtered = filtered.filter(commande => {
        const commandeDate = new Date(commande.date_commande);
        switch (filterDate) {
          case 'today':
            return commandeDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return commandeDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return commandeDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    // Filtre par montant
    if (filterMontant !== 'all') {
      filtered = filtered.filter(commande => {
        const montant = parseFloat(commande.montant_total);
        switch (filterMontant) {
          case 'small':
            return montant < 1000;
          case 'medium':
            return montant >= 1000 && montant <= 5000;
          case 'large':
            return montant > 5000;
          default:
            return true;
        }
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'date_commande') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCommandes(filtered);
  }, [commandes, searchTerm, filterStatut, filterDate, filterMontant, sortBy, sortOrder]);

  const handleUpdateStatut = (commande) => {
    setCommandeToUpdate(commande);
    setNewStatus(commande.statut);
    setIsStatusModalOpen(true);
  };

  const confirmUpdateStatut = async () => {
    if (!commandeToUpdate || !newStatus) return;
    
    try {
      setLoading(true);
      const result = await commandesAPI.updateStatut(commandeToUpdate.id, newStatus);
      
      if (result.success) {
        const updatedCommandes = commandes.map(c =>
          c.id === commandeToUpdate.id ? { ...c, statut: newStatus } : c
        );
        setCommandes(updatedCommandes);
        showNotification('success', result.message || 'Statut mis à jour avec succès');
        setIsStatusModalOpen(false);
        setCommandeToUpdate(null);
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerLitigieuse = async (commande) => {
    try {
      setLoading(true);
      const result = await commandesAPI.marquerLitigieuse(commande.id, 'Marquée manuellement par admin');
      
      if (result.success) {
        const updatedCommandes = commandes.map(c =>
          c.id === commande.id ? { ...c, est_litigieuse: true } : c
        );
        setCommandes(updatedCommandes);
        showNotification('success', 'Commande marquée comme litigieuse');
      } else {
        throw new Error(result.error || 'Erreur lors du marquage');
      }
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredCommandes.length === 0) {
      showNotification('warning', 'Aucune donnée à exporter');
      return;
    }

    const headers = 'ID,Date,Client,Montant,Statut,Articles,Date création\n';
    const csv = headers + filteredCommandes.map(commande => 
      `${commande.id},"${commande.date_commande ? new Date(commande.date_commande).toLocaleDateString('fr-FR') : 'N/A'}","${commande.client ? `${commande.client.prenom || ''} ${commande.client.nom || ''}`.trim() || 'Client anonyme' : 'Client anonyme'}","${commande.montant_total}","${commande.statut}","${commande.detailcommande_set ? commande.detailcommande_set.length : 0}","${commande.date_commande ? new Date(commande.date_commande).toLocaleString('fr-FR') : 'N/A'}"`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('success', `Export réussi ! ${filteredCommandes.length} commande(s) exportée(s)`);
  };

  const getStatutBadge = (statut, estLitigieuse = false) => {
    if (estLitigieuse) {
      return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Litigieuse</span>;
    }
    
    const badges = {
      'en_attente': <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">En attente</span>,
      'confirmee': <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">Confirmée</span>,
      'en_preparation': <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-600">En préparation</span>,
      'expedie': <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-600">Expédiée</span>,
      'livree': <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Livrée</span>,
      'annulee': <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Annulée</span>
    };
    
    return badges[statut] || badges['en_attente'];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'MRU',
      minimumFractionDigits: 0 
    }).format(amount || 0);
  };

  const getStatutOptions = () => [
    { value: 'en_attente', label: 'En attente' },
    { value: 'confirmee', label: 'Confirmée' },
    { value: 'en_preparation', label: 'En préparation' },
    { value: 'expedie', label: 'Expédiée' },
    { value: 'livree', label: 'Livrée' },
    { value: 'annulee', label: 'Annulée' }
  ];

  return (
    <>
      {/* Page Header */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Commandes</h2>
        <p className="text-gray-600">
          Suivez et gérez toutes les commandes de la plateforme en temps réel
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.total?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Total Commandes</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.livrees?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Livrées</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <AlertTriangle size={16} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.en_attente?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">En Attente</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Flag size={24} className="text-white" />
            </div>
            <AlertTriangle size={16} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.litigieuses?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Litigieuses</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 lg:mb-0">Filtres et Recherche</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={fetchCommandesAndStats} 
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button 
              onClick={handleExport}
              disabled={filteredCommandes.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download size={16} />
              Exporter CSV ({filteredCommandes.length})
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <select 
            value={filterStatut} 
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            {getStatutOptions().map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>

          <select 
            value={filterMontant} 
            onChange={(e) => setFilterMontant(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tous les montants</option>
            <option value="small">Moins de 1,000 MRU</option>
            <option value="medium">1,000 - 5,000 MRU</option>
            <option value="large">Plus de 5,000 MRU</option>
          </select>

          <select 
            value={`${sortBy}-${sortOrder}`} 
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="date_commande-desc">Plus récentes</option>
            <option value="date_commande-asc">Plus anciennes</option>
            <option value="montant_total-desc">Montant décroissant</option>
            <option value="montant_total-asc">Montant croissant</option>
            <option value="id-desc">ID décroissant</option>
          </select>
        </div>
        
        <p className="text-gray-600 text-sm">
          {filteredCommandes.length} commande(s) trouvée(s) sur {commandes.length} total
        </p>
      </div>

      {/* Table */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Chargement des commandes depuis l'API...</p>
          </div>
        ) : filteredCommandes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-500">
              {commandes.length === 0 
                ? 'Aucune commande dans la base de données.' 
                : 'Aucune commande ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Commande</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Client</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Montant</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommandes.map((commande, index) => (
                  <tr key={commande.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          <ShoppingCart size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">#{commande.id}</div>
                          <div className="text-sm text-gray-500">
                            {commande.detailcommande_set ? commande.detailcommande_set.length : 0} article(s)
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                          {commande.client ? 
                            `${commande.client.prenom || ''} ${commande.client.nom || ''}`.trim() || 'Client anonyme'
                            : 'Client anonyme'
                          }
                        </div>
                        {commande.client?.utilisateur?.telephone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={12} />
                            {commande.client.utilisateur.telephone}
                          </div>
                        )}
                        {commande.client?.utilisateur?.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={12} />
                            {commande.client.utilisateur.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-blue-600 text-lg">
                        {formatCurrency(commande.montant_total)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatutBadge(commande.statut, commande.est_litigieuse)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} />
                        {commande.date_commande ? 
                          new Date(commande.date_commande).toLocaleDateString('fr-FR') : 
                          'N/A'
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {setSelectedCommande(commande); setIsModalOpen(true);}}
                          className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        
                        <button 
                          onClick={() => handleUpdateStatut(commande)}
                          className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors"
                          title="Changer statut"
                          disabled={loading}
                        >
                          <Edit size={16} />
                        </button>
                        
                        {!commande.est_litigieuse && (
                          <button 
                            onClick={() => handleMarquerLitigieuse(commande)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                            title="Marquer litigieuse"
                            disabled={loading}
                          >
                            <Flag size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal changement de statut */}
      {isStatusModalOpen && commandeToUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Changer le statut</h3>
              <p className="text-gray-600 mb-4">
                Commande #{commandeToUpdate.id} - 
                {commandeToUpdate.client ? 
                  `${commandeToUpdate.client.prenom || ''} ${commandeToUpdate.client.nom || ''}`.trim() || 'Client anonyme'
                  : 'Client anonyme'
                }
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau statut
                </label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {getStatutOptions().map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmUpdateStatut}
                  disabled={loading || !newStatus}
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Mise à jour...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails commande */}
      {isModalOpen && selectedCommande && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Détails de la commande #{selectedCommande.id}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations commande */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Informations commande</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Numéro:</span>
                      <span className="font-medium">#{selectedCommande.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {selectedCommande.date_commande ? 
                          new Date(selectedCommande.date_commande).toLocaleString('fr-FR') : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant total:</span>
                      <span className="font-bold text-blue-600">{formatCurrency(selectedCommande.montant_total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      {getStatutBadge(selectedCommande.statut, selectedCommande.est_litigieuse)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nb articles:</span>
                      <span className="font-medium">
                        {selectedCommande.detailcommande_set ? selectedCommande.detailcommande_set.length : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations client */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Informations client</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">
                        {selectedCommande.client ? 
                          `${selectedCommande.client.prenom || ''} ${selectedCommande.client.nom || ''}`.trim() || 'Non renseigné'
                          : 'Non renseigné'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{selectedCommande.client?.utilisateur?.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedCommande.client?.utilisateur?.email || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adresse:</span>
                      <span className="font-medium">{selectedCommande.client?.adresse || 'Non renseignée'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ville:</span>
                      <span className="font-medium">{selectedCommande.client?.ville || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Articles de la commande */}
              {selectedCommande.detailcommande_set && selectedCommande.detailcommande_set.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Articles commandés</h4>
                  <div className="space-y-3">
                    {selectedCommande.detailcommande_set.map((detail, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium">{detail.specification?.nom || detail.specification?.produit?.nom || 'Produit'}</div>
                          <div className="text-sm text-gray-600">Quantité: {detail.quantite}</div>
                          {detail.specification?.description && (
                            <div className="text-sm text-gray-500">{detail.specification.description}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(detail.prix_unitaire)}</div>
                          <div className="text-sm text-gray-600">
                            Total: {formatCurrency(detail.prix_unitaire * detail.quantite)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total commande:</span>
                      <span className="text-blue-600">{formatCurrency(selectedCommande.montant_total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Historique de suivi */}
              {selectedCommande.tracking_history && selectedCommande.tracking_history.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Historique de suivi</h4>
                  <div className="space-y-3">
                    {selectedCommande.tracking_history.map((track, index) => (
                      <div key={index} className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {track.ancien_statut ? 
                              `${track.ancien_statut} → ${track.nouveau_statut}` : 
                              track.nouveau_statut
                            }
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(track.date_modification).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  handleUpdateStatut(selectedCommande);
                  setIsModalOpen(false);
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
              >
                Changer statut
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCommandesView;