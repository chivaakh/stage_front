import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HistoriqueMouvements.css';

const API_URL = 'http://localhost:8000/api';

export default function HistoriqueMouvements() {
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

  // Charger la liste des produits pour filtre
  useEffect(() => {
    axios.get(`${API_URL}/produits/`)
      .then(res => setProduits(res.data.results || []))
      .catch(() => setProduits([]));
  }, []);
  

  // Charger les mouvements avec filtres et page
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

  // Pagination buttons
  const handlePrev = () => {
    if (prevPage) setPage(page - 1);
  };
  const handleNext = () => {
    if (nextPage) setPage(page + 1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">Historique des Mouvements de Stock</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtre Produit */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="produitFilter">Produit</label>
          <select
            id="produitFilter"
            value={produitFilter}
            onChange={e => setProduitFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Tous</option>
            {produits.map(p => (
              <option key={p.id} value={p.id}>{p.nom}</option>
            ))}
          </select>
        </div>

        {/* Filtre Type */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="typeFilter">Type de mouvement</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Tous</option>
            <option value="entree">Entrée</option>
            <option value="sortie">Sortie</option>
          </select>
        </div>

        {/* Filtre Date début */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="dateDebut">Date début</label>
          <input
            id="dateDebut"
            type="date"
            value={dateDebut}
            onChange={e => setDateDebut(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Filtre Date fin */}
        <div>
          <label className="block mb-1 font-semibold" htmlFor="dateFin">Date fin</label>
          <input
            id="dateFin"
            type="date"
            value={dateFin}
            onChange={e => setDateFin(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      </div>

      {loading && <p>Chargement des mouvements...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Produit</th>
                <th className="border border-gray-300 p-2">Quantité</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {mouvements.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center">Aucun mouvement trouvé.</td>
                </tr>
              )}
              {mouvements.map(m => (
                <tr key={m.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-2">{m.specification?.nom || 'N/A'}</td>
                  <td className="border border-gray-300 p-2">{m.quantite}</td>
                  <td className="border border-gray-300 p-2 capitalize">{m.type_mouvement}</td>
                  <td className="border border-gray-300 p-2">{new Date(m.date_mouvement).toLocaleString()}</td>
                  <td className="border border-gray-300 p-2">{m.commentaire || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={!prevPage}
              className={`px-4 py-2 rounded ${prevPage ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Précédent
            </button>
            <button
              onClick={handleNext}
              disabled={!nextPage}
              className={`px-4 py-2 rounded ${nextPage ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}
