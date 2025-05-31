import React, { useEffect, useState } from 'react';
import { getSpecifications } from '../../api/stockAPI';
import './DashboardStock.css';

export default function DashboardStock() {
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSpecifications()
      .then(res => {
        setSpecs(res.data.results);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des données.');
        setLoading(false);
      });
  }, []);

  const stocksFaibles = Array.isArray(specs) ? specs.filter(spec => spec.quantite_stock < 5) : [];

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Dashboard Gestion des Stocks</h1>

        {loading && (
          <div className="loading-spinner" aria-label="Chargement...">
            <div className="spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Erreur :</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <section>
            <h2 className="section-title">Alertes Stock Faible &lt; 5 unités</h2>

            {stocksFaibles.length === 0 ? (
              <div className="no-alert">
                <svg
                  className="icon-check"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p>Aucun stock faible détecté. Tous les stocks sont suffisants.</p>
              </div>
            ) : (
              <div className="alerts-grid">
                {stocksFaibles.map(spec => (
                  <div key={spec.id} className="alert-card">
                    <h3 className="alert-title">{spec.nom}</h3>
                    <p>Stock actuel : <span className="stock-quantity">{spec.quantite_stock}</span></p>
                    <p className="price-normal">Prix normal : {spec.prix} €</p>
                    {spec.prix_promo && <p className="price-promo">Prix promo : {spec.prix_promo} €</p>}

                    <div className="alert-tag">
                      <svg
                        className="icon-cross"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Stock faible
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
