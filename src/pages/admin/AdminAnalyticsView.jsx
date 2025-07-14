import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Eye,
  Star,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Globe,
  Heart,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Store,
  Box,
  UserCheck,
  MessageSquare,
  Truck,
  CreditCard,
  Percent
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const AdminAnalyticsView = ({ showNotification }) => {
  const [currentPeriod, setCurrentPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    // Métriques principales
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    
    // Évolutions
    revenueGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
    
    // Détails ventes
    ordersByStatus: {},
    revenueByDay: [],
    topProducts: [],
    topCategories: [],
    
    // Utilisateurs
    usersByType: {},
    newUsersToday: 0,
    activeVendors: 0,
    
    // Performance produits
    lowStockProducts: [],
    outOfStockProducts: [],
    topRatedProducts: [],
    
    // Activité récente
    recentOrders: [],
    cartItems: 0,
    favoriteItems: 0,
    pendingNotifications: 0
  });

  // ✅ Service API connecté à votre backend Django
  const analyticsAPI = {
    // Récupérer toutes les commandes pour calculs
    async getOrders() {
      try {
        console.log('📊 GET /api/commandes/ pour analytics');
        const response = await fetch(`${API_BASE_URL}/commandes/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Commandes récupérées:', data.length || data.results?.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur commandes analytics:', error);
        return [];
      }
    },

    // Récupérer tous les produits pour analytics
    async getProducts() {
      try {
        console.log('📊 GET /api/produits/ pour analytics');
        const response = await fetch(`${API_BASE_URL}/produits/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Produits récupérés:', data.length || data.results?.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur produits analytics:', error);
        return [];
      }
    },

    // Stats produits depuis votre endpoint
    async getProductsStats() {
      try {
        console.log('📊 GET /api/produits/stats/');
        const response = await fetch(`${API_BASE_URL}/produits/stats/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Stats produits:', data);
        return data;
      } catch (error) {
        console.error('❌ Erreur stats produits:', error);
        return { total: 0, en_stock: 0, stock_faible: 0, rupture: 0 };
      }
    },

    // Récupérer catégories
    async getCategories() {
      try {
        console.log('📊 GET /api/categories/');
        const response = await fetch(`${API_BASE_URL}/categories/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Catégories récupérées:', data.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur catégories analytics:', error);
        return [];
      }
    },

    // Résumé panier global
    async getCartSummary() {
      try {
        console.log('📊 GET /api/client/panier/resume/');
        const response = await fetch(`${API_BASE_URL}/client/panier/resume/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Résumé panier:', data);
        return data;
      } catch (error) {
        console.error('❌ Erreur résumé panier:', error);
        return { total_items: 0, total_prix: 0, nombre_articles: 0 };
      }
    },

    // Commandes du jour
    async getTodayOrders() {
      try {
        console.log('📊 GET /api/commandes/commandes_du_jour/');
        const response = await fetch(`${API_BASE_URL}/commandes/commandes_du_jour/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Commandes du jour:', data.count || 0);
        return data;
      } catch (error) {
        console.error('❌ Erreur commandes du jour:', error);
        return { results: [], count: 0 };
      }
    },

    // Notifications pour analytics
    async getNotifications() {
      try {
        console.log('📊 GET /api/notifications/');
        const response = await fetch(`${API_BASE_URL}/notifications/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Erreur: ${response.status}`);
        const data = await response.json();
        console.log('✅ Notifications analytics:', data.length || 0);
        return Array.isArray(data) ? data : data.results || [];
      } catch (error) {
        console.error('❌ Erreur notifications analytics:', error);
        return [];
      }
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [currentPeriod]);

  // ✅ Calcul des analytics depuis les données backend
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement analytics depuis le backend Django...');
      
      // Récupérer toutes les données en parallèle
      const [
        ordersData,
        productsData,
        categoriesData,
        productsStats,
        cartSummary,
        todayOrders,
        notificationsData
      ] = await Promise.all([
        analyticsAPI.getOrders(),
        analyticsAPI.getProducts(),
        analyticsAPI.getCategories(),
        analyticsAPI.getProductsStats(),
        analyticsAPI.getCartSummary(),
        analyticsAPI.getTodayOrders(),
        analyticsAPI.getNotifications()
      ]);

      // ✅ CALCULS ANALYTICS BASÉS SUR VOS DONNÉES RÉELLES
      
      // 1. REVENUS ET COMMANDES
      const totalRevenue = ordersData.reduce((sum, order) => 
        sum + parseFloat(order.montant_total || 0), 0
      );
      
      const totalOrders = ordersData.length;
      
      // Commandes par statut (utilise vos statuts: en_attente, confirmee, etc.)
      const ordersByStatus = ordersData.reduce((acc, order) => {
        acc[order.statut] = (acc[order.statut] || 0) + 1;
        return acc;
      }, {});

      // 2. PRODUITS ET STOCK
      const totalProducts = productsData.length;
      
      // Produits avec stock faible (< 5)
      const lowStockProducts = productsData.filter(product => 
        product.stock_total < 5 && product.stock_total > 0
      ).slice(0, 5);
      
      // Produits en rupture
      const outOfStockProducts = productsData.filter(product => 
        product.stock_total === 0
      ).slice(0, 5);

      // Top produits par prix (simulation en attendant vraies stats ventes)
      const topProducts = productsData
        .sort((a, b) => (b.prix_max || 0) - (a.prix_max || 0))
        .slice(0, 5);

      // 3. CATÉGORIES
      const topCategories = categoriesData
        .map(cat => ({
          ...cat,
          productCount: productsData.filter(p => p.categorie === cat.id).length
        }))
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, 5);

      // 4. ÉVOLUTION (simulation basée sur période)
      const getGrowthRate = (current, period) => {
        // Simulation de croissance basée sur la période
        const growthRates = {
          '1d': Math.random() * 20 - 10, // -10% à +10%
          '7d': Math.random() * 30 - 15, // -15% à +15%
          '30d': Math.random() * 50 - 25 // -25% à +25%
        };
        return growthRates[period] || 0;
      };

      // 5. DONNÉES TEMPORELLES (simulation pour graphiques)
      const generateRevenueByDay = (days) => {
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          result.push({
            date: date.toISOString().split('T')[0],
            revenue: Math.random() * 10000 + 5000,
            orders: Math.floor(Math.random() * 50 + 10)
          });
        }
        return result;
      };

      // ✅ ASSEMBLER TOUTES LES ANALYTICS
      const calculatedAnalytics = {
        // Métriques principales (données réelles)
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        totalUsers: 0, // Nécessiterait un endpoint utilisateurs
        totalProducts: totalProducts,
        
        // Évolutions (simulation)
        revenueGrowth: getGrowthRate(totalRevenue, currentPeriod),
        ordersGrowth: getGrowthRate(totalOrders, currentPeriod),
        usersGrowth: getGrowthRate(0, currentPeriod),
        
        // Détails ventes (données réelles)
        ordersByStatus: ordersByStatus,
        revenueByDay: generateRevenueByDay(
          currentPeriod === '1d' ? 1 : 
          currentPeriod === '7d' ? 7 : 30
        ),
        topProducts: topProducts,
        topCategories: topCategories,
        
        // Utilisateurs (simulation)
        usersByType: { clients: 45, vendeurs: 12, admins: 3 },
        newUsersToday: todayOrders.count || 0,
        activeVendors: 8,
        
        // Performance produits (données réelles)
        lowStockProducts: lowStockProducts,
        outOfStockProducts: outOfStockProducts,
        topRatedProducts: topProducts.slice(0, 3), // Simulation
        
        // Activité récente (données réelles)
        recentOrders: todayOrders.results || [],
        cartItems: cartSummary.total_items || 0,
        favoriteItems: 24, // Simulation
        pendingNotifications: notificationsData.filter(n => !n.est_lue).length,
        
        // Stats supplémentaires
        productsStats: productsStats
      };

      setAnalyticsData(calculatedAnalytics);
      
      console.log('✅ Analytics calculées:', calculatedAnalytics);
      
    } catch (error) {
      console.error('❌ Erreur calcul analytics:', error);
      showNotification && showNotification('error', 'Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper functions pour affichage
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      'en_attente': 'En attente',
      'confirmee': 'Confirmée',
      'en_preparation': 'En préparation',
      'expedie': 'Expédiée',
      'livree': 'Livrée',
      'annulee': 'Annulée'
    };
    return statusMap[status] || status;
  };

  const renderPeriodSelector = () => (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {[
        { value: '1d', label: '24h' },
        { value: '7d', label: '7 jours' },
        { value: '30d', label: '30 jours' }
      ].map(period => (
        <button
          key={period.value}
          onClick={() => setCurrentPeriod(period.value)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            currentPeriod === period.value
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw size={48} className="text-blue-500 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Chargement des analytics...</h3>
          {/* <p className="text-gray-500">Récupération des données depuis le backend Django</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec période */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h2>
            <p className="text-gray-600">
              Tableau de bord analytique
            </p>
            <div className="mt-3 flex gap-2 text-sm">
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">✅ Commandes: {analyticsData.totalOrders}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">✅ Produits: {analyticsData.totalProducts}</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full">✅ Revenue: {formatCurrency(analyticsData.totalRevenue)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {renderPeriodSelector()}
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Total */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 ${analyticsData.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analyticsData.revenueGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-medium">{formatPercent(analyticsData.revenueGrowth)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {formatCurrency(analyticsData.totalRevenue)}
          </div>
          <div className="text-gray-600 text-sm">Revenue Total</div>
        </div>

        {/* Commandes */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} className="text-white" />
            </div>
            <div className={`flex items-center gap-1 ${analyticsData.ordersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {analyticsData.ordersGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="text-sm font-medium">{formatPercent(analyticsData.ordersGrowth)}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analyticsData.totalOrders.toLocaleString()}
          </div>
          <div className="text-gray-600 text-sm">Total Commandes</div>
        </div>

        {/* Produits */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-blue-500">
              <Activity size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analyticsData.totalProducts.toLocaleString()}
          </div>
          <div className="text-gray-600 text-sm">Produits Actifs</div>
        </div>

        {/* Panier */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analyticsData.cartItems.toLocaleString()}
          </div>
          <div className="text-gray-600 text-sm">Articles Panier</div>
        </div>
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes par statut */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Commandes par Statut</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'livree' ? 'bg-green-500' :
                    status === 'en_preparation' ? 'bg-blue-500' :
                    status === 'confirmee' ? 'bg-purple-500' :
                    status === 'en_attente' ? 'bg-yellow-500' :
                    status === 'annulee' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-700">{getStatusDisplayName(status)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">{count}</span>
                  <span className="text-sm text-gray-500">
                    ({((count / analyticsData.totalOrders) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Produits */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Top Produits</h3>
          <div className="space-y-4">
            {analyticsData.topProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{product.nom}</div>
                  <div className="text-sm text-gray-500">Stock: {product.stock_total || 0}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {formatCurrency(product.prix_max || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Prix max</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock faible */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-yellow-500" />
            <h3 className="text-lg font-bold text-gray-800">Stock Faible</h3>
          </div>
          <div className="space-y-3">
            {analyticsData.lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{product.nom}</div>
                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-sm">
                  {product.stock_total || 0}
                </span>
              </div>
            ))}
            {analyticsData.lowStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun produit en stock faible</p>
            )}
          </div>
        </div>

        {/* Rupture de stock */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={20} className="text-red-500" />
            <h3 className="text-lg font-bold text-gray-800">Rupture Stock</h3>
          </div>
          <div className="space-y-3">
            {analyticsData.outOfStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{product.nom}</div>
                  <div className="text-sm text-gray-500">ID: {product.id}</div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm">
                  Épuisé
                </span>
              </div>
            ))}
            {analyticsData.outOfStockProducts.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune rupture de stock</p>
            )}
          </div>
        </div>

        {/* Stats rapides */}
        <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Stats Rapides</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Notifications non lues</span>
              <span className="font-semibold text-red-600">{analyticsData.pendingNotifications}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Articles en panier</span>
              <span className="font-semibold text-blue-600">{analyticsData.cartItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Favoris</span>
              <span className="font-semibold text-purple-600">{analyticsData.favoriteItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Stock OK</span>
              <span className="font-semibold text-green-600">{analyticsData.productsStats.en_stock || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Commandes Récentes (Aujourd'hui)</h3>
        {analyticsData.recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune commande aujourd'hui</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Commande</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Client</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Montant</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Heure</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentOrders.slice(0, 10).map((order, index) => (
                  <tr key={order.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600">{order.client_nom || 'Client'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {formatCurrency(order.montant_total)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.statut === 'livree' ? 'bg-green-100 text-green-600' :
                        order.statut === 'en_preparation' ? 'bg-blue-100 text-blue-600' :
                        order.statut === 'confirmee' ? 'bg-purple-100 text-purple-600' :
                        order.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {getStatusDisplayName(order.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(order.date_commande).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsView;