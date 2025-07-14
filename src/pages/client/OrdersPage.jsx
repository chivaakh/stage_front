// src/pages/client/OrdersPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Truck, MapPin, Phone, Star, MessageSquare } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  // Simuler le chargement des commandes
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOrders = [
        {
          id: 'CMD-2024-001',
          date_commande: '2024-01-20T10:30:00Z',
          statut: 'livree',
          montant_total: 1578,
          nombre_articles: 3,
          details: [
            {
              nom: 'iPhone 15 Pro',
              specification: 'Bleu Titane - 256GB',
              quantite: 1,
              prix_unitaire: 1299,
              image: '/api/placeholder/60/60'
            },
            {
              nom: 'AirPods Pro',
              specification: 'Blanc - 2ème génération',
              quantite: 1,
              prix_unitaire: 279,
              image: '/api/placeholder/60/60'
            }
          ],
          tracking: [
            { status: 'en_attente', date: '2024-01-20T10:30:00Z', description: 'Commande reçue' },
            { status: 'confirmee', date: '2024-01-20T14:15:00Z', description: 'Commande confirmée et en préparation' },
            { status: 'expediee', date: '2024-01-21T09:00:00Z', description: 'Commande expédiée' },
            { status: 'livree', date: '2024-01-22T16:30:00Z', description: 'Commande livrée avec succès' }
          ],
          adresse_livraison: 'Tevragh Zeina, Rue 42-155, Nouakchott',
          peut_evaluer: true
        },
        {
          id: 'CMD-2024-002',
          date_commande: '2024-01-22T15:45:00Z',
          statut: 'expediee',
          montant_total: 450,
          nombre_articles: 2,
          details: [
            {
              nom: 'Casque Bluetooth Sony',
              specification: 'Noir - WH-1000XM5',
              quantite: 1,
              prix_unitaire: 350,
              image: '/api/placeholder/60/60'
            },
            {
              nom: 'Chargeur USB-C',
              specification: 'Blanc - 20W',
              quantite: 1,
              prix_unitaire: 100,
              image: '/api/placeholder/60/60'
            }
          ],
          tracking: [
            { status: 'en_attente', date: '2024-01-22T15:45:00Z', description: 'Commande reçue' },
            { status: 'confirmee', date: '2024-01-22T18:20:00Z', description: 'Commande confirmée et en préparation' },
            { status: 'expediee', date: '2024-01-23T11:30:00Z', description: 'Commande expédiée - Livreur: Ahmed (Tel: +222 XX XX XX XX)' }
          ],
          adresse_livraison: 'Ksar, Quartier 5, Nouakchott',
          livraison_estimee: '2024-01-24T18:00:00Z',
          peut_evaluer: false
        },
        {
          id: 'CMD-2024-003',
          date_commande: '2024-01-23T09:15:00Z',
          statut: 'confirmee',
          montant_total: 890,
          nombre_articles: 1,
          details: [
            {
              nom: 'MacBook Air M2',
              specification: 'Gris Sidéral - 256GB',
              quantite: 1,
              prix_unitaire: 890,
              image: '/api/placeholder/60/60'
            }
          ],
          tracking: [
            { status: 'en_attente', date: '2024-01-23T09:15:00Z', description: 'Commande reçue' },
            { status: 'confirmee', date: '2024-01-23T12:45:00Z', description: 'Commande confirmée et en préparation' }
          ],
          adresse_livraison: 'Dar Naim, Rue 15-234, Nouakchott',
          peut_evaluer: false
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    };

    loadOrders();
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      'en_attente': {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        description: 'Votre commande est en cours de traitement'
      },
      'confirmee': {
        label: 'Confirmée',
        color: 'bg-blue-100 text-blue-800',
        icon: CheckCircle,
        description: 'Votre commande a été confirmée et est en préparation'
      },
      'expediee': {
        label: 'Expédiée',
        color: 'bg-purple-100 text-purple-800',
        icon: Truck,
        description: 'Votre commande est en route'
      },
      'livree': {
        label: 'Livrée',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        description: 'Votre commande a été livrée avec succès'
      },
      'annulee': {
        label: 'Annulée',
        color: 'bg-red-100 text-red-800',
        icon: Package,
        description: 'Cette commande a été annulée'
      }
    };
    return statusMap[status] || statusMap['en_attente'];
  };

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.statut === filterStatus
  );

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Modal de suivi détaillé
  const TrackingModal = () => {
    if (!showTrackingModal || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full mx-auto shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Suivi de commande {selectedOrder.id}
            </h3>
            <button
              onClick={() => setShowTrackingModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6 space-y-6">
            {/* Statut actuel */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                {React.createElement(getStatusInfo(selectedOrder.statut).icon, {
                  size: 24,
                  className: "text-purple-600"
                })}
                <span className="font-semibold text-gray-900">
                  Statut actuel : {getStatusInfo(selectedOrder.statut).label}
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                {getStatusInfo(selectedOrder.statut).description}
              </p>
              {selectedOrder.livraison_estimee && selectedOrder.statut === 'expediee' && (
                <div className="mt-3 flex items-center gap-2 text-sm text-purple-600">
                  <Clock size={16} />
                  <span>Livraison estimée : {formatDate(selectedOrder.livraison_estimee)}</span>
                </div>
              )}
            </div>

            {/* Timeline de suivi */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Historique de la commande</h4>
              <div className="space-y-4">
                {selectedOrder.tracking.map((event, index) => {
                  const isLast = index === selectedOrder.tracking.length - 1;
                  const statusInfo = getStatusInfo(event.status);
                  
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isLast ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {React.createElement(statusInfo.icon, { size: 20 })}
                        </div>
                        {index < selectedOrder.tracking.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {statusInfo.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informations de livraison */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin size={20} className="text-purple-600" />
                Adresse de livraison
              </h4>
              <p className="text-gray-700">{selectedOrder.adresse_livraison}</p>
            </div>

            {/* Articles commandés */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Articles commandés</h4>
              <div className="space-y-3">
                {selectedOrder.details.map((item, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.nom}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => { e.target.src = '/api/placeholder/48/48'; }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {item.nom}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {item.specification}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Qté: {item.quantite}
                        </span>
                        <span className="font-semibold text-sm text-gray-900">
                          {(item.prix_unitaire * item.quantite).toLocaleString()} MRU
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact support */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Phone size={20} />
                Besoin d'aide ?
              </h4>
              <p className="text-blue-700 text-sm mb-3">
                Notre équipe support est là pour vous aider avec votre commande.
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  📞 Appeler le support
                </button>
                <button className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                  💬 Chat en ligne
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Composant carte de commande
  const OrderCard = ({ order }) => {
    const statusInfo = getStatusInfo(order.statut);
    
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Commande {order.id}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(order.date_commande)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Articles aperçu */}
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            {order.details.slice(0, 3).map((item, index) => (
              <img
                key={index}
                src={item.image}
                alt={item.nom}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                onError={(e) => { e.target.src = '/api/placeholder/48/48'; }}
              />
            ))}
            {order.details.length > 3 && (
              <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-600">
                +{order.details.length - 3}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {order.nombre_articles} article{order.nombre_articles > 1 ? 's' : ''}
          </p>
        </div>

        {/* Montant et actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {order.montant_total.toLocaleString()} MRU
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleTrackOrder(order)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Package size={16} />
              Suivre
            </button>
            {order.peut_evaluer && (
              <button
                onClick={() => alert('Modal d\'évaluation')}
                className="px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors flex items-center gap-2"
              >
                <Star size={16} />
                Évaluer
              </button>
            )}
          </div>
        </div>

        {/* Livraison estimée */}
        {order.livraison_estimee && order.statut === 'expediee' && (
          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <Truck size={16} />
              <span>Livraison estimée : {formatDate(order.livraison_estimee)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-2xl">
              <Package size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mes Commandes
            </h1>
          </div>
          <p className="text-gray-600">
            Suivez l'état de vos commandes et leur livraison
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-medium text-gray-700">Filtrer par statut :</span>
            {[
              { id: 'all', label: 'Toutes', count: orders.length },
              { id: 'en_attente', label: 'En attente', count: orders.filter(o => o.statut === 'en_attente').length },
              { id: 'confirmee', label: 'Confirmées', count: orders.filter(o => o.statut === 'confirmee').length },
              { id: 'expediee', label: 'Expédiées', count: orders.filter(o => o.statut === 'expediee').length },
              { id: 'livree', label: 'Livrées', count: orders.filter(o => o.statut === 'livree').length }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filterStatus === filter.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>

        {/* Liste des commandes */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Package size={80} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {filterStatus === 'all' ? 'Aucune commande' : `Aucune commande ${getStatusInfo(filterStatus).label.toLowerCase()}`}
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {filterStatus === 'all' 
                  ? 'Vous n\'avez pas encore passé de commande'
                  : 'Aucune commande ne correspond à ce filtre'
                }
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => alert('Navigation vers les produits')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                >
                  🛍️ Découvrir nos produits
                </button>
                {filterStatus !== 'all' && (
                  <button
                    onClick={() => setFilterStatus('all')}
                    className="w-full py-3 px-6 border border-purple-200 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200"
                  >
                    Voir toutes mes commandes
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de suivi */}
        <TrackingModal />
      </div>
    </div>
  );
};

export default OrdersPage;