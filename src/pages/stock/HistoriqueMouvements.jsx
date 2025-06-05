import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Calendar, Package, TrendingUp, TrendingDown, RefreshCw, ChevronLeft, ChevronRight, Download, Eye, X } from 'lucide-react';
import ModernSidebar from '../../components/layout/ModernSidebar';

const API_URL = 'http://localhost:8000/api';

export default function HistoriqueMouvements() {
  const navigate = useNavigate();

  const [mouvements, setMouvements] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres
  const [produitFilter, setProduitFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  // Pagination
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Recherche et affichage filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedMovement, setSelectedMovement] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/produits/`)
      .then(res => setProduits(res.data.results || []))
      .catch(() => setProduits([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      page,
      ...(produitFilter && { 'specification__produit': produitFilter }),
      ...(typeFilter && { type_mouvement: typeFilter }),
      ...(dateDebut && { date_mouvement__gte: dateDebut }),
      ...(dateFin && { date_mouvement__lte: dateFin }),
    };

    axios.get(`${API_URL}/mouvements_stock/`, { params })
      .then(res => {
        setMouvements(res.data.results);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des mouvements.');
        setLoading(false);
      });
  }, [page, produitFilter, typeFilter, dateDebut, dateFin]);

  // Pagination handlers
  const handlePrev = () => { if (prevPage) setPage(page - 1); };
  const handleNext = () => { if (nextPage) setPage(page + 1); };

  const resetFilters = () => {
    setProduitFilter('');
    setTypeFilter('');
    setDateDebut('');
    setDateFin('');
    setSearchTerm('');
    setPage(1);
  };

  const exportToCSV = () => {
    const csvContent = mouvements.map(m => [
      m.specification?.nom || 'N/A',
      m.quantite,
      m.type_mouvement,
      new Date(m.date_mouvement).toLocaleString(),
      m.commentaire || '-'
    ].join(',')).join('\n');

    const header = 'Produit,Quantité,Type,Date,Commentaire\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mouvements_stock.csv';
    a.click();
  };

  const filteredMouvements = mouvements.filter(m =>
    !searchTerm ||
    m.specification?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.commentaire?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TypeBadge = ({ type }) => {
    const isEntree = type === 'entree';
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        isEntree
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-rose-50 text-rose-700 border border-rose-200'
      }`}>
        {isEntree ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isEntree ? 'Entrée' : 'Sortie'}
      </div>
    );
  };

  const MovementModal = ({ movement, onClose }) => {
    if (!movement) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Détails du mouvement</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">Produit</label>
              <p className="text-slate-800 font-medium">{movement.specification?.nom || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">Quantité</label>
                <p className="text-slate-800 font-medium">{movement.quantite}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Type</label>
                <div className="mt-1">
                  <TypeBadge type={movement.type_mouvement} />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Date</label>
              <p className="text-slate-800">{new Date(movement.date_mouvement).toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500">Commentaire</label>
              <p className="text-slate-800">{movement.commentaire || 'Aucun commentaire'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <ModernSidebar currentPage="historique" />

      {/* Contenu principal */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* Bouton retour */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => navigate('/stock')}
            style={{
              backgroundColor: '#4f46e5',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ← Retour au Dashboard Stock
          </button>
        </div>

        {/* Contenu historique */}
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Historique des Mouvements de Stock
                    </h1>
                    <p className="text-slate-500 mt-1">Suivi complet des entrées et sorties de stock</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Masquer' : 'Afficher'} filtres
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm hover:shadow"
                  >
                    <Download className="w-4 h-4" />
                    Exporter
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher dans les mouvements..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-800">Filtres avancés</h2>
                <button
                  onClick={resetFilters}
                  className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="produitFilter">
                    <Package className="inline w-4 h-4 mr-2" />
                    Produit
                  </label>
                  <select
                    id="produitFilter"
                    value={produitFilter}
                    onChange={e => setProduitFilter(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  >
                    <option value="">Tous les produits</option>
                    {produits.map(p => (
                      <option key={p.id} value={p.id}>{p.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="typeFilter">
                    <TrendingUp className="inline w-4 h-4 mr-2" />
                    Type de mouvement
                  </label>
                  <select
                    id="typeFilter"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  >
                    <option value="">Tous les types</option>
                    <option value="entree">Entrée</option>
                    <option value="sortie">Sortie</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="dateDebut">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Date début
                  </label>
                  <input
                    id="dateDebut"
                    type="date"
                    value={dateDebut}
                    onChange={e => setDateDebut(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700" htmlFor="dateFin">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Date fin
                  </label>
                  <input
                    id="dateFin"
                    type="date"
                    value={dateFin}
                    onChange={e => setDateFin(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 p-8 flex items-center justify-center">
              <div className="flex items-center gap-4">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-slate-700 font-medium">Chargement des mouvements...</span>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Tableau */}
          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                      <th className="text-left p-6 font-semibold text-slate-700">Produit</th>
                      <th className="text-left p-6 font-semibold text-slate-700">Quantité</th>
                      <th className="text-left p-6 font-semibold text-slate-700">Type</th>
                      <th className="text-left p-6 font-semibold text-slate-700">Date</th>
                      <th className="text-left p-6 font-semibold text-slate-700">Commentaire</th>
                      <th className="text-left p-6 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMouvements.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-12 text-center">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium">Aucun mouvement trouvé</p>
                              <p className="text-slate-400 text-sm mt-1">Essayez de modifier vos filtres</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {filteredMouvements.map((m, index) => (
                      <tr
                        key={m.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        <td className="p-6">
                          <div className="font-medium text-slate-800">
                            {m.specification?.nom || 'N/A'}
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-sm font-semibold text-slate-700">
                            {m.quantite}
                          </span>
                        </td>
                        <td className="p-6">
                          <TypeBadge type={m.type_mouvement} />
                        </td>
                        <td className="p-6">
                          <div className="text-slate-700">
                            {new Date(m.date_mouvement).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {new Date(m.date_mouvement).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="text-slate-600">
                            {m.commentaire ? (
                              m.commentaire.length > 30
                                ? `${m.commentaire.substring(0, 30)}...`
                                : m.commentaire
                            ) : (
                              '-'
                            )}
                          </span>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => setSelectedMovement(m)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Page {page} • {filteredMouvements.length} mouvement(s) affiché(s)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={!prevPage}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        prevPage
                          ? 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Précédent
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!nextPage}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        nextPage
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-sm hover:shadow'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      }`}
                    >
                      Suivant
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal détails */}
          <MovementModal
            movement={selectedMovement}
            onClose={() => setSelectedMovement(null)}
          />
        </div>
      </div>
    </div>
  );
}
