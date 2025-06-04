import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import OrderEdit from './pages/orders/OrderEdit';  // adapte le chemin selon ton arborescence
=======
// import OrderEdit from './pages/orders/OrderEdit';  // adapte le chemin selon ton arborescence
>>>>>>> 1b3b1fce7701292b9a7a72c48522fa2ab25d2ce2
import VendeurDashboard from './pages/VendeurDashboard';
import DashboardStock from './pages/stock/DashboardStock';
import HistoriqueMouvements from './pages/stock/HistoriqueMouvements';
import RapportStock from './pages/stock/RapportStock';
import Notifications from './pages/stock/NotificationsStock';

<<<<<<< HEAD
import OrdersList from './pages/orders/OrdersList';
=======
// import OrdersList from './pages/orders/OrdersList';
>>>>>>> 1b3b1fce7701292b9a7a72c48522fa2ab25d2ce2
// import OrderDetails from './pages/orders/OrderDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
<<<<<<< HEAD

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
=======

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
>>>>>>> 1b3b1fce7701292b9a7a72c48522fa2ab25d2ce2
      </Routes>
    </Router>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 1b3b1fce7701292b9a7a72c48522fa2ab25d2ce2
