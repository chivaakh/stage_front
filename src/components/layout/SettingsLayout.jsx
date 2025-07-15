import React from 'react';
import { 
  User, Store, Bell, CreditCard, Truck, Shield, Globe, Eye, HelpCircle, LogOut 
} from 'lucide-react';

const SettingsLayout = ({ children, activeSection, setActiveSection }) => {
  const settingsSections = [
    { id: 'account', label: 'Compte', icon: User },
    { id: 'shop', label: 'Boutique', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Paiements', icon: CreditCard },
    { id: 'delivery', label:'Livraison', icon: Truck },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'privacy', label: 'Confidentialité', icon: Eye },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle }
  ];

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
        // Rediriger quand même en cas d'erreur réseau
        window.location.href = '/login';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50">
      {/* Background bubbles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar Fixed de navigation - côté gauche */}
        <div className="w-80 h-screen fixed left-0 top-0 p-4">
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl h-full flex flex-col">
            
            {/* Header sidebar */}
            <div className="p-6 border-b border-white/20">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ishrili
                </h1>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Paramètres</h2>
              <p className="text-sm text-gray-600">Gérez vos préférences</p>
            </div>

            {/* Navigation settings */}
            <div className="flex-1 p-6 overflow-y-auto">
              <nav className="space-y-2">
                {settingsSections.map(section => {
                  const IconComponent = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-white/30 hover:text-gray-800'
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bouton Logout en bas */}
            <div className="p-6 border-t border-white/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal - côté droit */}
        <div className="flex-1 ml-80">
          <div className="p-8">
            {/* Header du contenu */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {settingsSections.find(s => s.id === activeSection)?.label || 'Paramètres'}
              </h1>
              <p className="text-gray-600">
                Configurez vos préférences et paramètres de compte
              </p>
            </div>

            {/* Contenu scrollable */}
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-2xl min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;