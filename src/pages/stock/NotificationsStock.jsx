import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';

const API_URL = 'http://localhost:8000/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'

  useEffect(() => {
    const fetchNotifications = () => {
      setLoading(true);
      setError(null);

      let url = `${API_URL}/notifications/`;
      if (filter === 'read') url += '?est_lue=true';
      else if (filter === 'unread') url += '?est_lue=false';

      axios.get(url)
        .then(res => {
          setNotifications(res.data.results || res.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Erreur lors du chargement des notifications.');
          setLoading(false);
        });
    };

    fetchNotifications();
  }, [filter]);

  const markAsRead = (id) => {
    axios.patch(`${API_URL}/notifications/${id}/`, { est_lue: true })
      .then(() => {
        setNotifications(current =>
          current.map(n => (n.id === id ? { ...n, est_lue: true } : n))
        );
      })
      .catch(() => alert('Erreur lors de la mise à jour'));
  };

  return (
    <div className="notifications-container">
      <h1 className="notifications-title">Notifications de rupture de stock</h1>

      <div className="notifications-filter">
        <label htmlFor="filter">Filtrer :</label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">Toutes</option>
          <option value="read">Lues</option>
          <option value="unread">Non lues</option>
        </select>
      </div>

      {loading && <p className="loading">Chargement...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          {notifications.length === 0 && <p className="no-notifications">Aucune notification.</p>}

          <ul className="notifications-list">
            {notifications.map(n => (
              <li
                key={n.id}
                className={`notification-item ${n.est_lue ? 'read' : 'unread'}`}
              >
                <div className="notification-header">
                  <strong>{n.produit}</strong>
                  {!n.est_lue && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      aria-label="Marquer comme lu"
                      className="btn-mark-read"
                    >
                      Marquer comme lu
                    </button>
                  )}
                </div>
                <p className="notification-message">{n.message}</p>
                <small className="notification-date">{new Date(n.date_notification).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
