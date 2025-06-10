import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import OrderEdit from './pages/orders/OrderEdit';  // adapte le chemin selon ton arborescence
// import OrderEdit from './pages/orders/OrderEdit';  // adapte le chemin selon ton arborescence
import VendeurDashboard from './pages/VendeurDashboard';
import DashboardStock from './pages/stock/DashboardStock';
import HistoriqueMouvements from './pages/stock/HistoriqueMouvements';
import RapportStock from './pages/stock/RapportStock';
import Notifications from './pages/stock/NotificationsStock';

import OrdersList from './pages/orders/OrdersList';
// import OrdersList from './pages/orders/OrdersList';
// import OrderDetails from './pages/orders/OrderDetails';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';



function App() {
  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

      </Routes>
      <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Routes>
    </Router>
  );
}


export default App;

