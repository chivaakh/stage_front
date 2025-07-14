import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  Download, 
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Package,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  RefreshCw,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminBoutiquesView = ({ showNotification }) => {
  const [boutiques, setBoutiques] = useState([]);
  const [filteredBoutiques, setFilteredBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVille, setFilterVille] = useState('all');
  const [selectedBoutique, setSelectedBoutique] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [villes, setVilles] = useState([]);

  // Service API pour les boutiques
  const boutiquesAPI = {
    async getBoutiques() {
      const response = await fetch(`${API_BASE_URL}/admin/boutiques/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async getBoutiquesStats() {
      const response = await fetch(`${API_BASE_URL}/admin/boutiques/stats/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async toggleApproval(boutiqueId) {
      const response = await fetch(`${API_BASE_URL}/admin/boutiques/${boutiqueId}/toggle-approval/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async supprimerBoutique(boutiqueId) {
      const response = await fetch(`${API_BASE_URL}/admin/boutiques/${boutiqueId}/supprimer_boutique/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    }
  };

  useEffect(() => {
    fetchBoutiquesAndStats();
  }, []);

  const fetchBoutiquesAndStats = async () => {
    try {
      setLoading(true);
      
      const [boutiquesData, statsData] = await Promise.all([
        boutiquesAPI.getBoutiques(),
        boutiquesAPI.getBoutiquesStats()
      ]);
      
      const boutiquesList = Array.isArray(boutiquesData) ? boutiquesData : boutiquesData.results || [];
      setBoutiques(boutiquesList);
      setFilteredBoutiques(boutiquesList);
      
      // Extraire les villes uniques pour le filtre
      const villesUniques = [...new Set(boutiquesList.map(b => b.ville).filter(Boolean))];
      setVilles(villesUniques);
      
      setStats({
        totalBoutiques: statsData.total_boutiques || 0,
        boutiquesApprouvees: statsData.boutiques_approuvees || 0,
        enAttenteValidation: statsData.en_attente_validation || 0,
        boutiquesActives: statsData.boutiques_actives || 0,
        nouvelles7Jours: statsData.nouvelles_7_jours || 0,
        chiffreAffairesTotal: statsData.chiffre_affaires_total || 0
      });

    } catch (error) {
      console.error('Erreur lors du chargement des boutiques:', error);
      showNotification('error', 'Erreur lors du chargement des boutiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...boutiques];

    if (searchTerm) {
      filtered = filtered.filter(boutique =>
        boutique.nom_boutique?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boutique.vendeur_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boutique.vendeur_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boutique.ville?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'approved') {
        filtered = filtered.filter(boutique => boutique.est_approuve);
      } else if (filterStatus === 'pending') {
        filtered = filtered.filter(boutique => !boutique.est_approuve);
      } else if (filterStatus === 'active') {
        filtered = filtered.filter(boutique => boutique.vendeur_actif && boutique.est_approuve);
      }
    }

    if (filterVille !== 'all') {
      filtered = filtered.filter(boutique => boutique.ville === filterVille);
    }

    setFilteredBoutiques(filtered);
  }, [boutiques, searchTerm, filterStatus, filterVille]);

  const handleToggleApproval = async (boutique) => {
    try {
      setLoading(true);
      const result = await boutiquesAPI.toggleApproval(boutique.id);
      
      if (result.success) {
        const updatedBoutiques = boutiques.map(b =>
          b.id === boutique.id ? { ...b, est_approuve: result.new_status } : b
        );
        setBoutiques(updatedBoutiques);
        showNotification('success', result.message);
      } else {
        throw new Error(result.error || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimerBoutique = async (boutique) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement la boutique "${boutique.nom_boutique}" ?`)) {
      return;
    }

    try {
      setLoading(true);
      const result = await boutiquesAPI.supprimerBoutique(boutique.id);
      
      if (result.success) {
        const updatedBoutiques = boutiques.filter(b => b.id !== boutique.id);
        setBoutiques(updatedBoutiques);
        showNotification('success', result.message);
      } else {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredBoutiques.length === 0) {
      showNotification('warning', 'Aucune donnée à exporter');
      return;
    }

    const headers = 'ID,Nom Boutique,Vendeur,Ville,Statut,Produits,Ventes,Date Création\n';
    const csv = headers + filteredBoutiques.map(boutique => 
      `${boutique.id},"${boutique.nom_boutique}","${boutique.vendeur_prenom} ${boutique.vendeur_nom}","${boutique.ville}","${boutique.est_approuve ? 'Approuvée' : 'En attente'}","${boutique.produits_count}","${boutique.total_ventes}","${boutique.date_creation ? new Date(boutique.date_creation).toLocaleDateString('fr-FR') : 'N/A'}"`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boutiques_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('success', `Export réussi ! ${filteredBoutiques.length} boutique(s) exportée(s)`);
  };

  const getStatusBadge = (boutique) => {
    if (!boutique.est_approuve) {
      return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">En attente</span>;
    }
    if (!boutique.vendeur_actif) {
      return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Vendeur suspendu</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Active</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'MRU',
      minimumFractionDigits: 0 
    }).format(amount || 0);
  };

  return (
    <>
      {/* Page Header */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 mb-6 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Boutiques</h2>
        <p className="text-gray-600">
          Consultez et modérez toutes les boutiques de la plateforme - 
          {/* <span className="text-blue-600 font-medium"> Données en temps réel depuis l'API</span> */}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Store size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.totalBoutiques?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Total Boutiques</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.boutiquesApprouvees?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Approuvées</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Clock size={24} className="text-white" />
            </div>
            <AlertTriangle size={16} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.enAttenteValidation?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">En attente</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : formatCurrency(stats.chiffreAffairesTotal)}
          </div>
          <div className="text-gray-600 text-sm">CA Total</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 lg:mb-0">Filtres et Recherche</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={fetchBoutiquesAndStats} 
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button 
              onClick={handleExport}
              disabled={filteredBoutiques.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download size={16} />
              Exporter CSV ({filteredBoutiques.length})
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, vendeur, ville..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="approved">Approuvées</option>
            <option value="pending">En attente</option>
            <option value="active">Actives</option>
          </select>

          <select 
            value={filterVille} 
            onChange={(e) => setFilterVille(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Toutes les villes</option>
            {villes.map(ville => (
              <option key={ville} value={ville}>{ville}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600">
            {filteredBoutiques.length} boutique(s) trouvée(s) sur {boutiques.length} total
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Chargement des boutiques depuis l'API...</p>
          </div>
        ) : filteredBoutiques.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Store size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune boutique trouvée</h3>
            <p className="text-gray-500">
              {boutiques.length === 0 
                ? 'Aucune boutique dans la base de données.' 
                : 'Aucune boutique ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Boutique</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Vendeur</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Localisation</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Performance</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBoutiques.map((boutique, index) => (
                  <tr key={boutique.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                          <Store size={20} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{boutique.nom_boutique}</div>
                          <div className="text-sm text-gray-500">ID: {boutique.id}</div>
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            <Star size={12} fill="currentColor" />
                            <span>{boutique.evaluation || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                          {boutique.vendeur_prenom} {boutique.vendeur_nom}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={12} />
                          {boutique.vendeur_telephone}
                        </div>
                        {boutique.vendeur_email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={12} />
                            {boutique.vendeur_email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          {boutique.ville}
                        </div>
                        {boutique.adresse && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {boutique.adresse}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={12} />
                          {boutique.date_creation ? 
                            new Date(boutique.date_creation).toLocaleDateString('fr-FR') : 
                            'N/A'
                          }
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Package size={12} className="text-blue-500" />
                          <span>{boutique.produits_count || 0} produit(s)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign size={12} className="text-green-500" />
                          <span>{formatCurrency(boutique.total_ventes)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ShoppingCart size={12} className="text-purple-500" />
                          <span>{boutique.commandes_count || 0} commande(s)</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(boutique)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {setSelectedBoutique(boutique); setIsModalOpen(true);}}
                          className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleApproval(boutique)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            boutique.est_approuve 
                              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          }`}
                          title={boutique.est_approuve ? 'Rejeter' : 'Approuver'}
                          disabled={loading}
                        >
                          {boutique.est_approuve ? <XCircle size={16} /> : <CheckCircle size={16} />}
                        </button>
                        <button 
                          onClick={() => handleSupprimerBoutique(boutique)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                          title="Supprimer définitivement"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
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

      {/* Modal détails boutique */}
      {isModalOpen && selectedBoutique && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Détails de la boutique - {selectedBoutique.nom_boutique}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Informations boutique</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">{selectedBoutique.nom_boutique}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ville:</span>
                      <span className="font-medium">{selectedBoutique.ville}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Évaluation:</span>
                      <span className="font-medium">{selectedBoutique.evaluation || '0.0'} ⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className={`font-medium ${selectedBoutique.est_approuve ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedBoutique.est_approuve ? 'Approuvée' : 'En attente'}
                      </span>
                    </div>
                  </div>
                  {selectedBoutique.description && (
                    <div className="mt-4">
                      <span className="text-gray-600 text-sm">Description:</span>
                      <p className="text-gray-800 text-sm mt-1">{selectedBoutique.description}</p>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Informations vendeur</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom complet:</span>
                      <span className="font-medium">{selectedBoutique.vendeur_prenom} {selectedBoutique.vendeur_nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-medium">{selectedBoutique.vendeur_telephone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedBoutique.vendeur_email || 'Non renseigné'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Compte vendeur:</span>
                      <span className={`font-medium ${selectedBoutique.vendeur_actif ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedBoutique.vendeur_actif ? 'Actif' : 'Suspendu'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-4">Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedBoutique.produits_count || 0}</div>
                    <div className="text-sm text-gray-600">Produits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedBoutique.total_ventes)}</div>
                    <div className="text-sm text-gray-600">Ventes totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{selectedBoutique.commandes_count || 0}</div>
                    <div className="text-sm text-gray-600">Commandes</div>
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
              <button 
                onClick={() => handleToggleApproval(selectedBoutique)}
                className={`px-6 py-2 rounded-lg transition-all ${
                  selectedBoutique.est_approuve
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {selectedBoutique.est_approuve ? 'Rejeter' : 'Approuver'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBoutiquesView;