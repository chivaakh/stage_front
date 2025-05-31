import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RapportStock.css';

const API_URL = 'http://localhost:8000/api';

export default function RapportStock() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorieFilter, setCategorieFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour charger les données
  const loadData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      axios.get(`${API_URL}/produits/`),
      axios.get(`${API_URL}/categories/`)
    ])
      .then(([resProduits, resCategories]) => {
        setProduits(resProduits.data.results || resProduits.data);
        setCategories(resCategories.data.results || resCategories.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des données.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const produitsFiltres = categorieFilter
    ? produits.filter(p => p.categorie?.id === parseInt(categorieFilter))
    : produits;

  const calculerStockTotal = produit => {
    if (!produit.specifications) return 0;
    return produit.specifications.reduce((acc, spec) => acc + spec.quantite_stock, 0);
  };

  const estEnRupture = produit => calculerStockTotal(produit) < 5;

  return (
    <div className="container">
      <h1 className="title">Rapports de stock par produit et catégorie</h1>

      <div className="filter-wrapper">
        <label htmlFor="categorieFilter">Filtrer par catégorie</label>
        <select
          id="categorieFilter"
          value={categorieFilter}
          onChange={e => setCategorieFilter(e.target.value)}
        >
          <option value="">Toutes catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nom}
            </option>
          ))}
        </select>
      </div>

      <button className="btn-refresh" onClick={loadData}>
        Rafraîchir
      </button>

      {loading && <p>Chargement des données...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th className="text-right">Stock total</th>
              <th className="text-center">Alerte rupture</th>
            </tr>
          </thead>
          <tbody>
            {produitsFiltres.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
            {produitsFiltres.map(produit => (
              <tr
                key={produit.id}
                className={estEnRupture(produit) ? 'alert-rupture' : ''}
              >
                <td>{produit.nom}</td>
                <td>{produit.categorie?.nom || 'Non définie'}</td>
                <td className="text-right">{calculerStockTotal(produit)}</td>
                <td className="text-center rupture-icon">
                  {estEnRupture(produit) ? '⚠️' : '✔️'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
