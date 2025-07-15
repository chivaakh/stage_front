// src/App.jsx - Version avec contexte des favoris intégré et redirections corrigées

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// ===========================
// CONTEXTES
// ===========================
import { FavoritesProvider } from './contexts/FavoritesContext';

// ===========================
// PAGES VENDEUR/ADMIN EXISTANTES
// ===========================
import AdminUsersSimple from "./pages/admin/admin_dashboard";
import VendeurDashboard from './pages/VendeurDashboard';
import DashboardStock from './pages/stock/DashboardStock';
import HistoriqueMouvements from './pages/stock/HistoriqueMouvements';
import RapportStock from './pages/stock/RapportStock';
import Notifications from './pages/stock/NotificationsStock';

// Orders pages
import OrdersList from './pages/orders/OrdersList';
import OrderEdit from './pages/orders/OrderEdit';
import TodayOrders from './pages/orders/TodayOrders';
import OrderTracking from './pages/orders/OrderTracking';
import OrdersHistory from './pages/orders/OrdersHistory';
import OrdersArchives from './pages/orders/OrdersArchives';

// Auth & Settings
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChoixTypeUtilisateur from './pages/ChoixTypeUtilisateur';
import CreerBoutique from './pages/CreerBoutique';
import SettingsPage from './pages/SettingsPage';

// ===========================
// PAGES CLIENT
// ===========================
import ProductsClientPage from './pages/client/ProductsClientPage';
import ProductDetailPage from './pages/client/ProductDetailPage';
import CategoriesPage from './pages/client/CategoriesPage';
import CartPage from './pages/client/CartPage';
import ClientHomePage from './pages/client/ClientHomePage';
import ClientDashboard from './pages/client/ClientDashboard';
import CategoryDetailPage from './pages/client/CategoryDetailPage';
import CheckoutPage from './pages/client/CheckoutPage';
import FavoritesPage from './pages/client/FavoritesPage';

// ===========================
// COMPOSANT DE NOTIFICATION TOAST
// ===========================
const ToastContainer = () => {
  // Implémentation simple du système de toast
  React.useEffect(() => {
    // Fonction globale pour afficher les toasts
    window.showToast = (message, type = 'info') => {
      // Créer l'élément toast
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        transform: translateX(100%);
        max-width: 300px;
        word-wrap: break-word;
      `;
      
      // Couleurs selon le type
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      };
      
      toast.style.backgroundColor = colors[type] || colors.info;
      toast.textContent = message;
      
      // Ajouter au DOM
      document.body.appendChild(toast);
      
      // Animation d'entrée
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
      }, 100);
      
      // Animation de sortie et suppression
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 300);
      }, 3000);
    };
  }, []);
  
  return null;
};

function App() {
  return (
    <Router>
      <FavoritesProvider>
        <div className="App">
          <Routes>
            {/* ===========================
                ROUTES CLIENT (PUBLIC)
                =========================== */}
            
            {/* Page d'accueil client */}
            <Route path="/clientHomePage" element={<ClientHomePage />} />
            
            {/* Catalogue produits */}
            <Route path="/produits" element={<ProductsClientPage />} />
            <Route path="/produits/:id" element={<ProductDetailPage />} />
            <Route path="/produits/categorie/:categoryId" element={<ProductsClientPage />} />
            
            {/* Catégories */}
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryDetailPage />} />
            
            {/* Recherche */}
            <Route path="/recherche" element={<ProductsClientPage />} />
            
            {/* E-commerce */}
            <Route path="/panier" element={<CartPage />} />
            <Route path="/favoris" element={<FavoritesPage />} />
            <Route path="/commande" element={<CheckoutPage />} />
            
            {/* Dashboard client */}
            <Route path="/client-dashboard" element={<ClientDashboard />} />

            {/* ===========================
                ROUTES AUTHENTIFICATION
                =========================== */}
            
            <Route path="/login" element={<AuthPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            
            <Route
              path="/"
              element={<ChoixTypeUtilisateur onChoisir={(type) => {
                console.log("Utilisateur a choisi :", type);
                window.location.href = type === 'vendeur' ? '/dashboard' : '/produits';
              }} />}
            />
            
            <Route path="/creer-boutique" element={<CreerBoutique />} />

            {/* ===========================
                ROUTES VENDEUR/ADMIN
                =========================== */}
            
            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminUsersSimple />} />
            
            {/* Dashboard Principal */}
            <Route path="/dashboard" element={<VendeurDashboard />} />
            <Route path="/products" element={<VendeurDashboard />} />
            
            {/* Gestion Stock */}
            <Route path="/stock" element={<DashboardStock />} />
            <Route path="/stock/historique" element={<HistoriqueMouvements />} />
            <Route path="/stock/rapport" element={<RapportStock />} />
            <Route path="/stock/notifications" element={<Notifications />} />

            {/* Gestion Commandes */}
            <Route path="/commandes" element={<OrdersList />} />
            <Route path="/orders/edit/:id" element={<OrderEdit />} />
            <Route path="/orders/edit/:orderId" element={<OrderEdit />} />
            <Route path="/today-orders" element={<TodayOrders />} />
            
            {/* Tracking & History */}
            <Route path="/orders/tracking" element={<Navigate to="/orders/history" replace />} />
            <Route path="/orders/history" element={<OrdersHistory />} />
            <Route path="/orders/archives" element={<OrdersArchives />} />
            <Route path="/orders/tracking/:orderId" element={<OrderTracking />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />

            {/* ===========================
                PAGES TEMPORAIRES
                =========================== */}
            
            <Route path="/mes-commandes" element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  Mes Commandes
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  Cette page sera bientôt disponible
                </p>
                <button
                  onClick={() => window.history.back()}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  ← Retour
                </button>
              </div>
            } />

            {/* ===========================
                REDIRECTIONS ET 404
                =========================== */}
            
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/products-client" element={<Navigate to="/produits" replace />} />
            
            {/* ✅ AJOUT: Redirections pour les URLs anglaises vers françaises */}
            <Route path="/favorites" element={<Navigate to="/favoris" replace />} />
            <Route path="/products" element={<Navigate to="/produits" replace />} />
            <Route path="/cart" element={<Navigate to="/panier" replace />} />
            <Route path="/checkout" element={<Navigate to="/commande" replace />} />
            
            {/* 404 */}
            <Route path="*" element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>😞</div>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  Page non trouvée
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                  La page que vous recherchez n'existe pas
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => window.location.href = '/'}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    🏠 Accueil
                  </button>
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#6b7280',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    📊 Dashboard
                  </button>
                </div>
              </div>
            } />
          </Routes>
          
          {/* Système de notifications toast */}
          <ToastContainer />
        </div>
      </FavoritesProvider>
    </Router>
  );
}

export default App;