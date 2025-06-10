// import VendeurDashboard from './pages/VendeurDashboard'

// export default function App() {
//   return <VendeurDashboard />
// }
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthPage from './pages/AuthPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';

// export default function App() {
//   return <AuthPage />;
// }


// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<AuthPage />} />
//         <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
//         {/* Ajoute ici d'autres routes si nécessaire */}
//       </Routes>
//     </Router>
//   );
// }

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
}



