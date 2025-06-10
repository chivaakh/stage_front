import React, { useEffect, useState } from 'react';
import { getSpecifications } from '../../api/stockAPI';
// import { createRestockOrder } from '../../api/reststockApi';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ShoppingBagIcon, XMarkIcon, MagnifyingGlassIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon, DocumentTextIcon, BellIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from '../../components/ui/NotificationDropdown';
import ModernSidebar from '../../components/layout/ModernSidebar';

export default function DashboardStock() {
  const navigate = useNavigate();

  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour la recherche et filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les nouvelles fonctionnalités
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [, setNotifications] = useState([]);

  useEffect(() => {
    loadSpecifications();
    generateNotifications();
  }, []);

  const loadSpecifications = () => {
    setLoading(true);
    getSpecifications()
      .then(res => {
        setSpecs(res.data.results);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des données.');
        setLoading(false);
      });
  };

  const generateNotifications = () => {
    const now = new Date();
    const notifs = [
      {
        id: 1,
        type: 'warning',
        title: 'Stock critique détecté',
        message: 'Plusieurs produits nécessitent un réapprovisionnement urgent',
        time: new Date(now - 2 * 60 * 60 * 1000) // Il y a 2 heures
      },
      {
        id: 2,
        type: 'info',
        title: 'Rapport hebdomadaire disponible',
        message: 'Le rapport de stock de la semaine est prêt',
        time: new Date(now - 6 * 60 * 60 * 1000) // Il y a 6 heures
      }
    ];
    setNotifications(notifs);
  };

  const stocksFaibles = Array.isArray(specs) ? specs.filter(spec => spec.quantite_stock < 5) : [];
  const stocksEpuises = stocksFaibles.filter(spec => spec.quantite_stock === 0);
  const stocksCritiques = stocksFaibles.filter(spec => spec.quantite_stock > 0 && spec.quantite_stock < 3);

  // Fonction de filtrage et tri
  const getFilteredAndSortedSpecs = () => {
    let filtered = stocksFaibles;

    if (searchTerm) {
      filtered = filtered.filter(spec => 
        spec.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== 'tous') {
      if (selectedFilter === 'epuise') {
        filtered = filtered.filter(spec => spec.quantite_stock === 0);
      } else if (selectedFilter === 'critique') {
        filtered = filtered.filter(spec => spec.quantite_stock > 0 && spec.quantite_stock < 3);
      } else if (selectedFilter === 'faible') {
        filtered = filtered.filter(spec => spec.quantite_stock >= 3 && spec.quantite_stock < 5);
      }
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'prix' || sortBy === 'prix_promo') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'quantite_stock') {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStockStatus = (quantite) => {
    if (quantite === 0) {
      return {
        badge: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircleIcon,
        text: 'Épuisé',
        cardBorder: 'border-red-200',
        iconColor: 'text-red-500',
        priority: 'Urgent'
      };
    } else if (quantite < 3) {
      return {
        badge: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: ExclamationTriangleIcon,
        text: 'Critique',
        cardBorder: 'border-orange-200',
        iconColor: 'text-orange-500',
        priority: 'Élevée'
      };
    } else {
      return {
        badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: ExclamationTriangleIcon,
        text: 'Faible',
        cardBorder: 'border-yellow-200',
        iconColor: 'text-yellow-500',
        priority: 'Normale'
      };
    }
  };

  const handleDetailsClick = (product) => {
    setSelectedProductDetails(product);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProductDetails(null);
  };

  const filteredSpecs = getFilteredAndSortedSpecs();

  return (
    <ModernSidebar currentPage="stock">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header avec titre et notifications */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                  Gestion des Stocks
                </h1>
                <p className="text-lg text-slate-600">
                  Surveillance des niveaux de stock et alertes automatiques
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <NotificationDropdown />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/stock/historique')}
                    className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 hover:bg-blue-50 group"
                    title="Historique des mouvements"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Historique</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/stock/rapport')}
                    className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 hover:bg-green-50 group"
                    title="Rapport de stock"
                  >
                    <DocumentTextIcon className="w-5 h-5 text-slate-600 group-hover:text-green-600" />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-green-600">Rapport</span>
                  </button>
                </div>
                <button
                  onClick={loadSpecifications}
                  className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 hover:bg-indigo-50"
                >
                  <ArrowPathIcon className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Statistiques avec design amélioré */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Total Alertes</p>
                    <p className="text-3xl font-bold text-indigo-600">{stocksFaibles.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Produits concernés</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
                    <ShoppingBagIcon className="w-7 h-7 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-1">Stock Épuisé</p>
                    <p className="text-3xl font-bold text-red-600">{stocksEpuises.length}</p>
                    <p className="text-xs text-red-500 mt-1">Action immédiate</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                    <XCircleIcon className="w-7 h-7 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-1">Stock Critique</p>
                    <p className="text-3xl font-bold text-orange-600">{stocksCritiques.length}</p>
                    <p className="text-xs text-orange-500 mt-1">Priorité élevée</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                    <ExclamationTriangleIcon className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600 mb-1">Stock Faible</p>
                    <p className="text-3xl font-bold text-yellow-600">{stocksFaibles.length - stocksEpuises.length - stocksCritiques.length}</p>
                    <p className="text-xs text-yellow-500 mt-1">Surveillance requise</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                    <ExclamationTriangleIcon className="w-7 h-7 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-indigo-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-slate-600 font-medium text-lg">Chargement des données...</p>
              <p className="text-slate-500 text-sm mt-2">Analyse des niveaux de stock en cours</p>
            </div>
          )}

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 p-6 rounded-xl mb-8 shadow-md">
              <div className="flex items-center">
                <XCircleIcon className="w-6 h-6 text-red-400 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-1">Erreur de chargement</h3>
                  <p className="text-red-700">{error}</p>
                  <button 
                    onClick={loadSpecifications}
                    className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              {stocksFaibles.length === 0 ? (
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-12 text-center border border-green-200 shadow-lg">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full mb-6">
                    <CheckCircleIcon className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-green-800 mb-4">
                    Excellent ! Tous les stocks sont suffisants
                  </h3>
                  <p className="text-green-700 text-lg mb-4">
                    Aucune alerte de stock faible détectée. Votre inventaire est bien géré.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Dernière vérification: maintenant</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Barre de recherche et filtres améliorée */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                      <div className="flex-1 flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          <FunnelIcon className="w-5 h-5" />
                          Filtres
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-600">Affichage:</span>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600'}`}
                          >
                            Grille
                          </button>
                          <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-600'}`}
                          >
                            Liste
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Filtres étendus */}
                    {showFilters && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Statut du stock</label>
                            <select
                              value={selectedFilter}
                              onChange={(e) => setSelectedFilter(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="tous">Tous les statuts</option>
                              <option value="epuise">Stock épuisé</option>
                              <option value="critique">Stock critique</option>
                              <option value="faible">Stock faible</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trier par</label>
                            <select
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="nom">Nom</option>
                              <option value="quantite_stock">Quantité en stock</option>
                              <option value="prix">Prix</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Ordre</label>
                            <button
                              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              {sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                              {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* En-tête des résultats */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Alertes Stock Faible
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                        {filteredSpecs.length} résultat{filteredSpecs.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Affichage des produits */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredSpecs.map(spec => {
                        const status = getStockStatus(spec.quantite_stock);
                        const StatusIcon = status.icon;
                        
                        return (
                          <div
                            key={spec.id}
                            className={`bg-white rounded-2xl p-6 shadow-lg border ${status.cardBorder} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                  {spec.nom}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.badge}`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {status.text}
                                  </span>
                                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                    Priorité {status.priority}
                                  </span>
                                </div>
                              </div>
                              <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors`}>
                                <StatusIcon className={`w-6 h-6 ${status.iconColor} group-hover:text-indigo-600`} />
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-600 font-medium">Stock actuel</span>
                                <span className={`font-bold text-lg ${spec.quantite_stock === 0 ? 'text-red-600' : 'text-slate-800'}`}>
                                  {spec.quantite_stock} unité{spec.quantite_stock > 1 ? 's' : ''}
                                </span>
                              </div>

                              <div className="border-t border-slate-100 pt-3">
                                {spec.prix_promo ? (
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="text-slate-400 line-through text-sm">
                                        {spec.prix} €
                                      </span>
                                      <span className="text-green-600 font-bold text-lg">
                                        {spec.prix_promo} €
                                      </span>
                                    </div>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-semibold">
                                      PROMO
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-600">Prix</span>
                                    <span className="font-bold text-lg text-slate-800">
                                      {spec.prix} €
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 mt-6">
                              <button 
                                onClick={() => handleDetailsClick(spec)}
                                className="px-4 py-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Vue liste
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-4 text-left">
                                <button
                                  onClick={() => handleSort('nom')}
                                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
                                >
                                  Produit
                                  {sortBy === 'nom' && (
                                    sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                                  )}
                                </button>
                              </th>
                              <th className="px-6 py-4 text-left">
                                <span className="text-sm font-semibold text-slate-700">Statut</span>
                              </th>
                              <th className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleSort('quantite_stock')}
                                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
                                >
                                  Stock
                                  {sortBy === 'quantite_stock' && (
                                    sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                                  )}
                                </button>
                              </th>
                              <th className="px-6 py-4 text-center">
                                <button
                                  onClick={() => handleSort('prix')}
                                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600"
                                >
                                  Prix
                                  {sortBy === 'prix' && (
                                    sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                                  )}
                                </button>
                              </th>
                              <th className="px-6 py-4 text-center">
                                <span className="text-sm font-semibold text-slate-700">Priorité</span>
                              </th>
                              <th className="px-6 py-4 text-center">
                                <span className="text-sm font-semibold text-slate-700">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {filteredSpecs.map(spec => {
                              const status = getStockStatus(spec.quantite_stock);
                              const StatusIcon = status.icon;
                              
                              return (
                                <tr key={spec.id} className="hover:bg-slate-50 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${status.iconColor === 'text-red-500' ? 'bg-red-50' : status.iconColor === 'text-orange-500' ? 'bg-orange-50' : 'bg-yellow-50'}`}>
                                        <StatusIcon className={`w-5 h-5 ${status.iconColor}`} />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-slate-800">{spec.nom}</h3>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.badge}`}>
                                      {status.text}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={`font-bold ${spec.quantite_stock === 0 ? 'text-red-600' : 'text-slate-800'}`}>
                                      {spec.quantite_stock}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    {spec.prix_promo ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-slate-400 line-through text-sm">{spec.prix} €</span>
                                        <span className="text-green-600 font-bold">{spec.prix_promo} €</span>
                                      </div>
                                    ) : (
                                      <span className="font-semibold text-slate-800">{spec.prix} €</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                      status.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                                      status.priority === 'Élevée' ? 'bg-orange-100 text-orange-700' :
                                      'bg-yellow-100 text-yellow-700'
                                    }`}>
                                      {status.priority}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        onClick={() => handleDetailsClick(spec)}
                                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                      >
                                        <EyeIcon className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {filteredSpecs.length === 0 && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                        <MagnifyingGlassIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-800 mb-2">Aucun produit trouvé</h3>
                      <p className="text-slate-600">Essayez de modifier vos critères de recherche ou filtres</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal de détails du produit */}
        {showDetailsModal && selectedProductDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-auto shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">
                    Détails du produit
                  </h3>
                </div>
                <button
                  onClick={closeDetailsModal}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informations principales */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-xl font-bold text-slate-800 mb-4">{selectedProductDetails.nom}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">ID Produit:</span>
                        <span className="font-medium text-slate-800">#{selectedProductDetails.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Stock actuel:</span>
                        <span className={`font-bold ${selectedProductDetails.quantite_stock === 0 ? 'text-red-600' : 'text-slate-800'}`}>
                          {selectedProductDetails.quantite_stock} unité{selectedProductDetails.quantite_stock > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Statut:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStockStatus(selectedProductDetails.quantite_stock).badge}`}>
                          {getStockStatus(selectedProductDetails.quantite_stock).text}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Prix unitaire:</span>
                        <span className="font-bold text-slate-800">{selectedProductDetails.prix} €</span>
                      </div>
                      {selectedProductDetails.prix_promo && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Prix promo:</span>
                          <span className="font-bold text-green-600">{selectedProductDetails.prix_promo} €</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-600">Priorité:</span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          getStockStatus(selectedProductDetails.quantite_stock).priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                          getStockStatus(selectedProductDetails.quantite_stock).priority === 'Élevée' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {getStockStatus(selectedProductDetails.quantite_stock).priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModernSidebar>
  );
}
