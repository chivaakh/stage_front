import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModernSidebar from '../../components/layout/ModernSidebar'; // import sidebar
import { Bell, Check, CheckCheck, Trash2, RefreshCw, AlertCircle, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';  // <-- import useNavigate

const API_URL = 'http://localhost:8000/api';

export default function Notifications() {
  const navigate = useNavigate();  // <-- initialisation navigation
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.est_lue).map(n => n.id);
    Promise.all(
      unreadIds.map(id => 
        axios.patch(`${API_URL}/notifications/${id}/`, { est_lue: true })
      )
    ).then(() => {
      setNotifications(current =>
        current.map(n => ({ ...n, est_lue: true }))
      );
    }).catch(() => {
      alert('Erreur lors de la mise à jour');
    });
  };

  const deleteNotification = (id) => {
    axios.delete(`${API_URL}/notifications/${id}/`)
      .then(() => {
        setNotifications(current => current.filter(n => n.id !== id));
        setSelectedNotifications(current => current.filter(nId => nId !== id));
      })
      .catch(() => {
        alert('Erreur lors de la suppression');
      });
  };

  const deleteSelectedNotifications = () => {
    Promise.all(
      selectedNotifications.map(id => 
        axios.delete(`${API_URL}/notifications/${id}/`)
      )
    ).then(() => {
      setNotifications(current => 
        current.filter(n => !selectedNotifications.includes(n.id))
      );
      setSelectedNotifications([]);
      setShowDeleteConfirm(false);
    }).catch(() => {
      alert('Erreur lors de la suppression');
    });
  };

  const toggleSelectNotification = (id) => {
    setSelectedNotifications(current =>
      current.includes(id)
        ? current.filter(nId => nId !== id)
        : [...current, id]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(visibleIds);
  };

  const refreshNotifications = () => {
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

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'read' && n.est_lue) || 
                         (filter === 'unread' && !n.est_lue);
    const matchesSearch = n.produit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.est_lue).length;

  return (
    <ModernSidebar currentPage="notifications">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell size={32} className="text-white" />
                  <div>
                    <h1 className="text-2xl font-bold">Notifications de rupture de stock</h1>
                    <p className="text-blue-100 text-sm">
                      {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Bouton retour Dashboard */}
                <button
                  onClick={() => navigate('/stock')}
                  className="mr-4 px-4 py-2 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100 transition"
                  title="Retour au Dashboard"
                >
                  ← Retour au Dashboard
                </button>

                <button
                  onClick={refreshNotifications}
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                  disabled={loading}
                >
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            {/* Barre d'outils */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Toutes ({notifications.length})</option>
                    <option value="unread">Non lues ({unreadCount})</option>
                    <option value="read">Lues ({notifications.length - unreadCount})</option>
                  </select>

                  <button
                    onClick={markAllAsRead}
                    className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center space-x-1"
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck size={16} />
                    <span>Tout marquer lu</span>
                  </button>

                  {selectedNotifications.length > 0 && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 size={16} />
                      <span>Supprimer ({selectedNotifications.length})</span>
                    </button>
                  )}
                </div>

                <div className="relative flex-1 max-w-xs">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {filteredNotifications.length > 0 && (
                <div className="mt-3 flex items-center space-x-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.length === filteredNotifications.length}
                    onChange={() => 
                      selectedNotifications.length === filteredNotifications.length 
                        ? setSelectedNotifications([])
                        : selectAllVisible()
                    }
                    className="rounded"
                  />
                  <span>Sélectionner tout</span>
                </div>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="space-y-4">
            {loading && (
              <div className="bg-white rounded-xl p-8 text-center shadow-lg">
                <RefreshCw size={32} className="animate-spin mx-auto text-blue-500 mb-4" />
                <p className="text-gray-600">Chargement...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && filteredNotifications.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center shadow-lg">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucune notification trouvée
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Vous n\'avez aucune notification.'}
                </p>
              </div>
            )}

            {!loading && !error && filteredNotifications.map(n => (
              <div
                key={n.id}
                className={`bg-white rounded-xl shadow-lg border-l-4 overflow-hidden transition-all duration-200 hover:shadow-xl ${
                  n.est_lue ? 'border-l-gray-300 opacity-75' : 'border-l-blue-500'
                } ${selectedNotifications.includes(n.id) ? 'ring-2 ring-blue-300' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(n.id)}
                      onChange={() => toggleSelectNotification(n.id)}
                      className="mt-1 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className={`font-bold text-lg ${n.est_lue ? 'text-gray-600' : 'text-gray-900'}`}>
                            {n.produit}
                          </h3>
                          {!n.est_lue && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium animate-pulse">
                              NOUVEAU
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!n.est_lue && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
                            >
                              <Check size={14} />
                              <span>Marquer lu</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(n.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <Trash2 size={14} />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </div>
                      
                      <p className={`text-base mb-3 leading-relaxed ${n.est_lue ? 'text-gray-500' : 'text-gray-700'}`}>
                        {n.message}
                      </p>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {new Date(n.date_notification).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de confirmation de suppression */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle size={24} className="text-red-500" />
                  <h3 className="text-lg font-bold text-gray-900">Confirmer la suppression</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Êtes-vous sûr de vouloir supprimer {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} ?
                  Cette action est irréversible.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={deleteSelectedNotifications}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ModernSidebar>
  );
}
