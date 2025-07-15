import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Download, 
  Eye,
  Calendar,
  MapPin,
  Star,
  DollarSign,
  Image,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Tag,
  User,
  Filter,
  Grid,
  List,
  Edit,
  Flag
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminProduitsView = ({ showNotification }) => {
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [produitToDelete, setProduitToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // table ou grid
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  // Service API pour les produits
  const produitsAPI = {
    async getProduits() {
      const response = await fetch(`${API_BASE_URL}/produits/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async getProduitsStats() {
      const response = await fetch(`${API_BASE_URL}/produits/stats/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async getCategories() {
      const response = await fetch(`${API_BASE_URL}/categories/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async approuverProduit(produitId) {
      const response = await fetch(`${API_BASE_URL}/admin/produits/${produitId}/approuver/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async supprimerProduit(produitId) {
      const response = await fetch(`${API_BASE_URL}/produits/${produitId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    },

    async marquerSignalement(produitId, statut) {
      const response = await fetch(`${API_BASE_URL}/admin/produits/${produitId}/signalement/`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut })
      });
      if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
      return await response.json();
    }
  };

  useEffect(() => {
    fetchProduitsAndStats();
  }, []);

  const fetchProduitsAndStats = async () => {
    try {
      setLoading(true);
      
      const [produitsData, statsData, categoriesData] = await Promise.all([
        produitsAPI.getProduits(),
        produitsAPI.getProduitsStats(),
        produitsAPI.getCategories()
      ]);
      
      const produitsList = Array.isArray(produitsData) ? produitsData : produitsData.results || [];
      setProduits(produitsList);
      setFilteredProduits(produitsList);
      
      const categoriesList = Array.isArray(categoriesData) ? categoriesData : categoriesData.results || [];
      setCategories(categoriesList);
      
      setStats({
        total: statsData.total || 0,
        en_stock: statsData.en_stock || 0,
        stock_faible: statsData.stock_faible || 0,
        rupture: statsData.rupture || 0,
        avec_images: statsData.avec_images || 0,
        en_attente: statsData.en_attente || 0,
        signales: statsData.signales || 0
      });

    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      showNotification('error', 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...produits];

    // Recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter(produit =>
        produit.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.categorie_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filterCategorie !== 'all') {
      filtered = filtered.filter(produit => produit.categorie === parseInt(filterCategorie));
    }

    // Filtre par statut
    if (filterStatut !== 'all') {
      if (filterStatut === 'en_attente') {
        filtered = filtered.filter(produit => produit.statut === 'en_attente');
      } else if (filterStatut === 'approuve') {
        filtered = filtered.filter(produit => produit.statut === 'approuve');
      } else if (filterStatut === 'rejete') {
        filtered = filtered.filter(produit => produit.statut === 'rejete');
      } else if (filterStatut === 'signale') {
        filtered = filtered.filter(produit => produit.signalements_count > 0);
      }
    }

    // Filtre par stock
    if (filterStock !== 'all') {
      if (filterStock === 'en_stock') {
        filtered = filtered.filter(produit => produit.stock_total > 5);
      } else if (filterStock === 'stock_faible') {
        filtered = filtered.filter(produit => produit.stock_total > 0 && produit.stock_total <= 5);
      } else if (filterStock === 'rupture') {
        filtered = filtered.filter(produit => produit.stock_total === 0);
      }
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProduits(filtered);
  }, [produits, searchTerm, filterCategorie, filterStatut, filterStock, sortBy, sortOrder]);

  const handleApprouverProduit = async (produit) => {
    try {
      setLoading(true);
      const result = await produitsAPI.approuverProduit(produit.id);
      
      if (result.success) {
        const updatedProduits = produits.map(p =>
          p.id === produit.id ? { ...p, statut: 'approuve' } : p
        );
        setProduits(updatedProduits);
        showNotification('success', result.message || 'Produit approuvé avec succès');
      } else {
        throw new Error(result.error || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSupprimerProduit = (produit) => {
    setProduitToDelete(produit);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!produitToDelete) return;
    
    try {
      setLoading(true);
      await produitsAPI.supprimerProduit(produitToDelete.id);
      
      const updatedProduits = produits.filter(p => p.id !== produitToDelete.id);
      setProduits(updatedProduits);
      showNotification('success', 'Produit supprimé avec succès');
      setIsDeleteModalOpen(false);
      setProduitToDelete(null);
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTraiterSignalement = async (produit, action) => {
    try {
      setLoading(true);
      const result = await produitsAPI.marquerSignalement(produit.id, action);
      
      if (result.success) {
        const updatedProduits = produits.map(p =>
          p.id === produit.id ? { ...p, signalements_count: action === 'resolu' ? 0 : p.signalements_count } : p
        );
        setProduits(updatedProduits);
        showNotification('success', result.message || 'Signalement traité');
      } else {
        throw new Error(result.error || 'Erreur lors du traitement');
      }
    } catch (error) {
      showNotification('error', `Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredProduits.length === 0) {
      showNotification('warning', 'Aucune donnée à exporter');
      return;
    }

    const headers = 'ID,Nom,Référence,Catégorie,Prix Min,Prix Max,Stock,Statut,Date Création\n';
    const csv = headers + filteredProduits.map(produit => 
      `${produit.id},"${produit.nom}","${produit.reference}","${produit.categorie_nom || ''}","${produit.prix_min}","${produit.prix_max}","${produit.stock_total}","${produit.statut || 'N/A'}","${produit.date_creation ? new Date(produit.date_creation).toLocaleDateString('fr-FR') : 'N/A'}"`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `produits_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('success', `Export réussi ! ${filteredProduits.length} produit(s) exporté(s)`);
  };

  const getStatutBadge = (produit) => {
    if (produit.signalements_count > 0) {
      return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Signalé ({produit.signalements_count})</span>;
    }
    
    const statut = produit.statut || 'en_attente';
    const badges = {
      'en_attente': <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">En attente</span>,
      'approuve': <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">Approuvé</span>,
      'rejete': <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Rejeté</span>
    };
    
    return badges[statut] || badges['en_attente'];
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">Rupture</span>;
    } else if (stock <= 5) {
      return <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-600">Stock faible</span>;
    }
    return <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">En stock</span>;
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Produits</h2>
        <p className="text-gray-600">
          Consultez, modérez et gérez tous les produits de la plateforme
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.total?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Total Produits</div>
        </div>

        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-white" />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {loading ? '...' : stats.en_stock?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">En Stock</div>
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
            {loading ? '...' : stats.signales?.toLocaleString() || 0}
          </div>
          <div className="text-gray-600 text-sm">Signalés</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 lg:mb-0">Filtres et Recherche</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Grid size={16} />
              </button>
            </div>
            <button 
              onClick={fetchProduitsAndStats} 
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button 
              onClick={handleExport}
              disabled={filteredProduits.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download size={16} />
              Exporter CSV ({filteredProduits.length})
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <select 
            value={filterCategorie} 
            onChange={(e) => setFilterCategorie(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>

          <select 
            value={filterStatut} 
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="approuve">Approuvés</option>
            <option value="rejete">Rejetés</option>
            <option value="signale">Signalés</option>
          </select>

          <select 
            value={filterStock} 
            onChange={(e) => setFilterStock(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Tous les stocks</option>
            <option value="en_stock">En stock</option>
            <option value="stock_faible">Stock faible</option>
            <option value="rupture">Rupture</option>
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
            <option value="nom-asc">Nom A-Z</option>
            <option value="nom-desc">Nom Z-A</option>
            <option value="prix_min-asc">Prix croissant</option>
            <option value="prix_min-desc">Prix décroissant</option>
            <option value="stock_total-desc">Stock décroissant</option>
            <option value="id-desc">Plus récents</option>
          </select>
        </div>
        
        <p className="text-gray-600 text-sm">
          {filteredProduits.length} produit(s) trouvé(s) sur {produits.length} total
        </p>
      </div>

      {/* Content */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Chargement des produits depuis l'API...</p>
          </div>
        ) : filteredProduits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500">
              {produits.length === 0 
                ? 'Aucun produit dans la base de données.' 
                : 'Aucun produit ne correspond à vos critères de recherche.'
              }
            </p>
          </div>
        ) : viewMode === 'table' ? (
          // Vue Tableau
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Produit</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Catégorie</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Prix</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Stock</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Statut</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProduits.map((produit, index) => (
                  <tr key={produit.id} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                          {produit.image_principale ? (
                            <img 
                              src={produit.image_principale.url_image} 
                              alt={produit.nom}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <Package size={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{produit.nom}</div>
                          <div className="text-sm text-gray-500">Réf: {produit.reference}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-gray-400" />
                        <span className="text-sm">{produit.categorie_nom || 'Non catégorisé'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {produit.prix_min === produit.prix_max ? (
                          <div className="font-medium">{formatCurrency(produit.prix_min)}</div>
                        ) : (
                          <div className="font-medium">
                            {formatCurrency(produit.prix_min)} - {formatCurrency(produit.prix_max)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium">{produit.stock_total || 0}</div>
                        {getStockBadge(produit.stock_total)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatutBadge(produit)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {setSelectedProduit(produit); setIsModalOpen(true);}}
                          className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {produit.statut === 'en_attente' && (
                          <button 
                            onClick={() => handleApprouverProduit(produit)}
                            className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors"
                            title="Approuver"
                            disabled={loading}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        
                        {produit.signalements_count > 0 && (
                          <button 
                            onClick={() => handleTraiterSignalement(produit, 'resolu')}
                            className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center hover:bg-yellow-200 transition-colors"
                            title="Résoudre signalement"
                            disabled={loading}
                          >
                            <Flag size={16} />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleSupprimerProduit(produit)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                          title="Supprimer"
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
        ) : (
          // Vue Grille
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProduits.map((produit) => (
              <div key={produit.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                <div className="relative mb-4">
                  {produit.image_principale ? (
                    <img 
                      src={produit.image_principale.url_image} 
                      alt={produit.nom}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package size={48} className="text-white" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2">
                    {getStatutBadge(produit)}
                  </div>
                  
                  {produit.signalements_count > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        {produit.signalements_count} signalement(s)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 truncate">{produit.nom}</h3>
                  <p className="text-sm text-gray-500">Réf: {produit.reference}</p>
                  <p className="text-sm text-gray-600">{produit.categorie_nom || 'Non catégorisé'}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-blue-600">
                      {produit.prix_min === produit.prix_max 
                        ? formatCurrency(produit.prix_min)
                        : `${formatCurrency(produit.prix_min)} - ${formatCurrency(produit.prix_max)}`
                      }
                    </div>
                    {getStockBadge(produit.stock_total)}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => {setSelectedProduit(produit); setIsModalOpen(true);}}
                      className="flex-1 bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      Détails
                    </button>
                    
                    {produit.statut === 'en_attente' && (
                      <button 
                        onClick={() => handleApprouverProduit(produit)}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        disabled={loading}
                      >
                        ✓
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleSupprimerProduit(produit)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🎉 BELLE MODAL DE CONFIRMATION DE SUPPRESSION */}
      {isDeleteModalOpen && produitToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
            <div className="p-6 text-center">
              {/* Icône d'alerte */}
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-white" />
              </div>
              
              {/* Titre */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
              
              {/* Message */}
              <p className="text-gray-600 mb-2">
                Êtes-vous sûr de vouloir supprimer définitivement le produit
              </p>
              <p className="font-semibold text-gray-800 mb-6">
                "{produitToDelete.nom}" ?
              </p>
              
              {/* Avertissement */}
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-left">
                <div className="flex items-center">
                  <AlertTriangle size={16} className="text-red-500 mr-2" />
                  <span className="text-red-700 text-sm font-medium">
                    Cette action est irréversible
                  </span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  Toutes les données du produit seront perdues définitivement.
                </p>
              </div>
              
              {/* Boutons */}
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProduitToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails produit */}
      {isModalOpen && selectedProduit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Détails du produit - {selectedProduit.nom}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Images du produit</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedProduit.images && selectedProduit.images.length > 0 ? (
                      selectedProduit.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image.url_image} 
                          alt={`${selectedProduit.nom} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))
                    ) : (
                      <div className="col-span-2 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image size={32} className="text-gray-400" />
                        <span className="ml-2 text-gray-500">Aucune image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informations */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Informations générales</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">{selectedProduit.nom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Référence:</span>
                      <span className="font-medium">{selectedProduit.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium">{selectedProduit.categorie_nom || 'Non catégorisé'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stock total:</span>
                      <span className="font-medium">{selectedProduit.stock_total || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix:</span>
                      <span className="font-medium">
                        {selectedProduit.prix_min === selectedProduit.prix_max 
                          ? formatCurrency(selectedProduit.prix_min)
                          : `${formatCurrency(selectedProduit.prix_min)} - ${formatCurrency(selectedProduit.prix_max)}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-4">Description</h4>
                <p className="text-gray-700">{selectedProduit.description || 'Aucune description disponible'}</p>
              </div>

              {/* Spécifications */}
              {selectedProduit.specifications && selectedProduit.specifications.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-4">Spécifications</h4>
                  <div className="space-y-3">
                    {selectedProduit.specifications.map((spec, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{spec.nom}</span>
                          <span className="text-blue-600 font-bold">{formatCurrency(spec.prix_final)}</span>
                        </div>
                        <p className="text-sm text-gray-600">{spec.description}</p>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>Stock: {spec.quantite_stock}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            spec.statut_stock === 'bon' ? 'bg-green-100 text-green-600' :
                            spec.statut_stock === 'moyen' ? 'bg-yellow-100 text-yellow-600' :
                            spec.statut_stock === 'faible' ? 'bg-orange-100 text-orange-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {spec.statut_stock}
                          </span>
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
              
              {selectedProduit.statut === 'en_attente' && (
                <button 
                  onClick={() => {
                    handleApprouverProduit(selectedProduit);
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                >
                  Approuver
                </button>
              )}
              
              {selectedProduit.signalements_count > 0 && (
                <button 
                  onClick={() => {
                    handleTraiterSignalement(selectedProduit, 'resolu');
                    setIsModalOpen(false);
                  }}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all"
                >
                  Résoudre signalement
                </button>
              )}
              
              <button 
                onClick={() => {
                  handleSupprimerProduit(selectedProduit);
                  setIsModalOpen(false);
                }}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProduitsView;