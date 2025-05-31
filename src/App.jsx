// import VendeurDashboard from './pages/VendeurDashboard'

// export default function App() {
//   return <VendeurDashboard />
// }

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import DashboardStock from './pages/stock/DashboardStock';
import HistoriqueMouvements from './pages/stock/HistoriqueMouvements';
import RapportStock from './pages/stock/RapportStock';
import Notifications from './pages/stock/NotificationsStock.jsx';


// dans <Routes>

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Navigate to="/stock" replace />} />
        <Route path="/stock" element={<DashboardStock />} />
        <Route path="/stock/historique" element={<HistoriqueMouvements />} />
        <Route path="/stock/rapport" element={<RapportStock />} />
        <Route path="/stock/notifications" element={<Notifications />} />

      </Routes>
    </Router>
  );
}

export default App;

