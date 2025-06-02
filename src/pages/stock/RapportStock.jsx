import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernSidebar from '../../components/layout/ModernSidebar';
import { ArrowPathIcon, CubeIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const API_URL = 'http://localhost:8000/api';

export default function RapportStock() {
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorieFilter, setCategorieFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [resProduits, resCategories] = await Promise.all([
        fetch(`${API_URL}/produits/`).then(res => {
          if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
          return res.json();
        }),
        fetch(`${API_URL}/categories/`).then(res => {
          if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);
          return res.json();
        }),
      ]);
      setProduits(resProduits.results || resProduits);
      setCategories(resCategories.results || resCategories);
      setLoading(false);
    } catch (error) {
      setError(`Erreur lors du chargement : ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const calculerStockTotal = produit => {
    if (!produit.specifications) return 0;
    return produit.specifications.reduce((acc, spec) => acc + spec.quantite_stock, 0);
  };

  const estEnRupture = produit => calculerStockTotal(produit) < 5;

  const produitsFiltres = produits.filter(produit => {
    const categorieMatch = !categorieFilter || produit.categorie?.id === parseInt(categorieFilter);
    const searchMatch = !searchTerm ||
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (produit.categorie?.nom && produit.categorie.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    return categorieMatch && searchMatch;
  });

  const exportToCSV = () => {
    const dataToExport = produitsFiltres.map(produit => {
      const stockTotal = calculerStockTotal(produit);
      const statut = stockTotal < 5 ? 'Stock Épuisé' :
        stockTotal < 10 ? 'Stock Faible' : 'Stock Suffisant';

      return {
        'Nom du Produit': produit.nom,
        'Catégorie': produit.categorie?.nom || 'Non définie',
        'Stock Total': stockTotal,
        'Statut': statut,
        'Spécifications': produit.specifications ?
          produit.specifications.map(spec =>
            `${spec.taille || spec.couleur || 'Standard'}: ${spec.quantite_stock}`
          ).join('; ') : 'Aucune',
        'Date d\'export': new Date().toLocaleDateString('fr-FR')
      };
    });

    if (dataToExport.length === 0) return;

    const headers = Object.keys(dataToExport[0]);
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row =>
        headers.map(header => `"${row[header] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_stock_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ModernSidebar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header + bouton retour */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent flex items-center gap-3">
              <CubeIcon className="w-8 h-8 text-indigo-700" />
              Rapports de Stock
            </h1>
            <button
              onClick={() => navigate('/stock')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
            >
              ← Retour au Dashboard
            </button>
          </div>

          {/* Barre de recherche + filtres */}
          <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex items-center flex-1 gap-3 max-w-lg">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-slate-500 hover:text-indigo-600"
                  aria-label="Effacer la recherche"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={categorieFilter}
              onChange={e => setCategorieFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition max-w-xs"
            >
              <option value="">Toutes catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>

            <button
              onClick={exportToCSV}
              disabled={loading || produitsFiltres.length === 0}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition flex items-center gap-2 justify-center"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Export CSV
            </button>
          </div>

          {/* Stats simples */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Produits" value={produitsFiltres.length} color="indigo" icon={<CubeIcon className="w-6 h-6" />} />
            <StatCard label="Stock Épuisé" value={produitsFiltres.filter(p => calculerStockTotal(p) < 5).length} color="red" icon={<XCircleIcon className="w-6 h-6" />} />
            <StatCard label="Stock Faible" value={produitsFiltres.filter(p => {
              const total = calculerStockTotal(p);
              return total >= 5 && total < 10;
            }).length} color="orange" icon={<ExclamationTriangleIcon className="w-6 h-6" />} />
            <StatCard label="Stock Suffisant" value={produitsFiltres.filter(p => calculerStockTotal(p) >= 10).length} color="green" icon={<CheckCircleIcon className="w-6 h-6" />} />
          </div>

          {/* Tableau des produits */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4 text-right">Stock Total</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Détails des spécifications</th>
                </tr>
              </thead>
              <tbody>
                {produitsFiltres.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-10 text-slate-400 font-medium">
                      Aucun produit trouvé.
                    </td>
                  </tr>
                )}
                {produitsFiltres.map(produit => {
                  const stockTotal = calculerStockTotal(produit);
                  const statut = stockTotal < 5 ? 'Stock Épuisé' :
                    stockTotal < 10 ? 'Stock Faible' : 'Stock Suffisant';

                  const statutStyles = {
                    'Stock Épuisé': 'bg-red-600 text-white px-3 py-1 rounded-full inline-flex items-center gap-2 font-semibold',
                    'Stock Faible': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md font-medium',
                    'Stock Suffisant': 'bg-green-100 text-green-800 px-2 py-1 rounded-md font-medium',
                  };

                  return (
                    <tr key={produit.id} className="border-t border-slate-200 hover:bg-indigo-50 transition-colors">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <CubeIcon className="w-5 h-5 text-indigo-600" />
                        {produit.nom}
                      </td>
                      <td className="p-4">{produit.categorie?.nom || '-'}</td>
                      <td className="p-4 text-right font-semibold">{stockTotal}</td>
                      <td className="p-4">
                        <span className={statutStyles[statut]}>
                          {statut === 'Stock Épuisé' && <XCircleIcon className="w-5 h-5" />}
                          {statut === 'Stock Faible' && <ExclamationTriangleIcon className="w-4 h-4" />}
                          {statut === 'Stock Suffisant' && <CheckCircleIcon className="w-4 h-4" />}
                          {statut}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs text-sm text-slate-600">
                        {produit.specifications && produit.specifications.length > 0 ? (
                          produit.specifications.map((spec, idx) => (
                            <div key={idx}>
                              <strong>{spec.taille || spec.couleur || 'Standard'}:</strong> {spec.quantite_stock}
                            </div>
                          ))
                        ) : (
                          <em>Aucune spécification</em>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="p-10 text-center text-indigo-600 font-semibold flex items-center justify-center gap-2">
              <ArrowPathIcon className="w-6 h-6 animate-spin" />
              Chargement des données...
            </div>
          )}
          {error && (
            <div className="p-10 text-center text-red-600 font-semibold">{error}</div>
          )}
        </div>
      </div>
    </ModernSidebar>
  );
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    indigo: 'text-indigo-700 bg-indigo-100',
    red: 'text-red-700 bg-red-100',
    orange: 'text-orange-700 bg-orange-100',
    green: 'text-green-700 bg-green-100',
  };
  return (
    <div className={`rounded-2xl p-6 font-semibold text-center flex flex-col items-center justify-center gap-2 ${colors[color] || colors.indigo}`}>
      {icon}
      <div className="text-3xl">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
