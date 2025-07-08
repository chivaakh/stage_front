import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import VendeurDashboard from './pages/VendeurDashboard';
import DashboardStock from './pages/stock/DashboardStock';
import HistoriqueMouvements from './pages/stock/HistoriqueMouvements';
import RapportStock from './pages/stock/RapportStock';
import Notifications from './pages/stock/NotificationsStock';

//  Orders pages
import OrdersList from './pages/orders/OrdersList';
import OrderEdit from './pages/orders/OrderEdit';
import TodayOrders from './pages/orders/TodayOrders';
import OrderTracking from './pages/orders/OrderTracking';
import OrdersHistory from './pages/orders/OrdersHistory';
import OrdersArchives from './pages/orders/OrdersArchives';

import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ChoixTypeUtilisateur from './pages/ChoixTypeUtilisateur'; // adapte le chemin selon ton dossier
import CreerBoutique from './pages/CreerBoutique';
import SettingsPage from './pages/SettingsPage';


import ProductsClientPage from './pages/client/ProductsClientPage';
import ProductDetailPage from './pages/client/ProductDetailPage';
import CategoriesPage from './pages/client/CategoriesPage';
import CartPage from './pages/client/CartPage';
// import CheckoutPage from './pages/client/CheckoutPage';
// import OrdersPage from './pages/client/OrdersPage';
// import FavoritesPage from './pages/client/FavoritesPage';
// import ProfilePage from './pages/client/ProfilePage';
import ClientHomePage from './pages/client/ClientHomePage';
import ClientDashboard from './pages/client/ClientDashboard';
import CategoryDetailPage from './pages/client/CategoryDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}

        {/* Dashboard Main */}
        <Route path="/dashboard" element={<VendeurDashboard />} />

        {/* Stock Pages */}
        <Route path="/stock" element={<DashboardStock />} />
        {/* <Route path="/stock/historique" element={<HistoriqueMouvements />} /> */}
        {/* <Route path="/stock/rapport" element={<RapportStock />} /> */}
        {/* <Route path="/stock/notifications" element={<Notifications />} /> */}

        {/* 🧾 Orders Pages */}
        <Route path="/commandes" element={<OrdersList />} />
        {/* <Route path="/commandes/:id" element={<OrderDetails />} /> */}
        <Route path="/products" element={< VendeurDashboard/>} />
        <Route path="/orders/edit/:id" element={<OrderEdit />} />

        {/* Dashboard Main */}
        <Route path="/dashboard" element={<VendeurDashboard />} />

        {/* Stock Pages */}
        <Route path="/stock" element={<DashboardStock />} />
        <Route path="/stock/historique" element={<HistoriqueMouvements />} />
        <Route path="/stock/rapport" element={<RapportStock />} />
        <Route path="/stock/notifications" element={<Notifications />} />

        {/* 🧾 Orders Pages */}
        {/* <Route path="/commandes" element={<OrdersList />} /> */}
        {/* <Route path="/commandes/:id" element={<OrderDetails />} /> */}
        <Route path="/products" element={< VendeurDashboard/>} />
        {/* <Route path="/orders/edit/:id" element={<OrderEdit />} /> */}


        {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route
          path="/choix-utilisateur"
          element={<ChoixTypeUtilisateur onChoisir={(type) => {
            console.log("Utilisateur a choisi :", type);
            // Exemple : redirection après choix
            window.location.href = type === 'vendeur' ? '/dashboard' : '/products';
          }} />}
        />
        <Route path="/creer-boutique" element={<CreerBoutique />} />

        {/* <Route path="/client" element={<ClientPage />} /> */}


        <Route path="/settings" element={<SettingsPage />} />

        <Route path="/commandes" element={<OrdersList />} />
        <Route path="/orders/edit/:orderId" element={<OrderEdit />} />
        <Route path="/today-orders" element={<TodayOrders />} />
        
        {/* 📈 Tracking & History Pages */}
        {/* Redirection de l'ancien tracking home vers l'historique global */}
        <Route path="/orders/tracking" element={<Navigate to="/orders/history" replace />} />
        
        {/* Page d'historique global de toutes les commandes */}
        <Route path="/orders/history" element={<OrdersHistory />} />
        
        {/* Page d'archives des commandes livrées/annulées */}
        <Route path="/orders/archives" element={<OrdersArchives />} />
        
        {/* Page de tracking d'une commande spécifique */}
        <Route path="/orders/tracking/:orderId" element={<OrderTracking />} />

        {/* 👤 Client Pages */}
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        
        {/* 🔐 Auth Pages (commentées pour l'instant) */}
        {/* 
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        */}
        
        {/* 404 - Redirection vers dashboard si route non trouvée */}
        {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}

        {/* Nouvelles routes Client */}
        <Route path="/" element={<ClientHomePage />} />
        <Route path="/produits" element={<ProductsClientPage />} />
        <Route path="/produits/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/produits/categorie/:categoryId" element={<ProductsClientPage />} />
        
        {/* Routes avec paramètres */}
        <Route path="/categories/:id" element={<CategoryDetailPage />} />        
        {/* Routes filtres */}
        <Route path="/recherche" element={<ProductsClientPage />} />

{/* // Dans les routes : */}
        <Route path="/panier" element={<CartPage />} />
        
        {/* Autres pages */}
        {/* <Route path="/favoris" element={<div>Page Favoris - En construction</div>} />
        <Route path="/panier" element={<div>Page Panier - En construction</div>} />
        <Route path="/profil" element={<div>Page Profil - En construction</div>} /> */}
        
        {/* <Route path="/panier" element={<CartPage />} /> */}
        {/* <Route path="/commande" element={<CheckoutPage />} /> */}
        {/* <Route path="/mes-commandes" element={<OrdersPage />} /> */}
        {/* <Route path="/favoris" element={<FavoritesPage />} /> */}
        {/* <Route path="/profil" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;