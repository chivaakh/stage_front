import React, { useState, useEffect } from 'react';
import { Bell, User, Search, Menu, X, Home, Store, Package, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/vendeur-info/', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        await fetch('http://localhost:8000/api/logout/', {
          method: 'POST',
          credentials: 'include'
        });
        window.location.href = '/login';
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    }
  };

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { path: '/boutique', icon: Store, label: 'Ma Boutique' },
    { path: '/produits', icon: Package, label: 'Produits' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ishrili
              </h1>
            </div>

            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all">
                <Bell className="w-5 h-5" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {userInfo?.prenom} {userInfo?.nom}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-white/20">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content avec padding-top pour compenser la navbar fixed */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;