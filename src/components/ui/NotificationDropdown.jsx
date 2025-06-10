import React, { useEffect, useState, useRef } from 'react';
import { Bell, X, Eye, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Charger les notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/notifications/?limit=5`);
      setNotifications(response.data.results || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications au montage du composant
  useEffect(() => {
    fetchNotifications();
    
    // Actualiser les notifications toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Marquer une notification comme lue
  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/`, { est_lue: true });
      setNotifications(current =>
        current.map(n => (n.id === id ? { ...n, est_lue: true } : n))
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Supprimer une notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}/`);
      setNotifications(current => current.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  // Naviguer vers la page complète des notifications
  const goToNotificationsPage = () => {
    setIsOpen(false);
    navigate('/stock/notifications');
  };

  const unreadCount = notifications.filter(n => !n.est_lue).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Liste des notifications */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.slice(0, 5).map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !notification.est_lue ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium text-sm truncate ${
                          !notification.est_lue ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {notification.produit}
                        </h4>
                        {!notification.est_lue && (
                          <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(notification.date_notification).toLocaleString('fr-FR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.est_lue && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Marquer comme lu"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          

          {/* Pied de page */}
          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={goToNotificationsPage}
              className="w-full flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>Voir toutes les notifications</span>
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}