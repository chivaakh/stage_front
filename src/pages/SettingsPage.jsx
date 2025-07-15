import React, { useState } from 'react';
import SettingsLayout from '../components/layout/SettingsLayout';
import AccountSettings from '../components/settings/AccountSettings';
import BoutiqueSettings from '../components/settings/BoutiqueSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import HelpSettings from '../components/settings/HelpSettings';
import { CheckCircle, AlertCircle, Store, CreditCard, Truck, Shield, Eye } from 'lucide-react';

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('account');
  const [message, setMessage] = useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings showMessage={showMessage} />;
      case 'shop':
        return <BoutiqueSettings showMessage={showMessage} />;
      case 'notifications':
        return <NotificationSettings showMessage={showMessage} />;
      case 'general':
        return <GeneralSettings showMessage={showMessage} />;
      case 'help':
        return <HelpSettings />;
      case 'payment':
        return (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Paramètres de paiement</h3>
            <p className="text-gray-500">Configuration des méthodes de paiement</p>
          </div>
        );
      case 'delivery':
        return (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Paramètres de livraison</h3>
            <p className="text-gray-500">Zones et tarifs de livraison</p>
          </div>
        );
      case 'security':
        return (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Sécurité</h3>
            <p className="text-gray-500">Authentification à deux facteurs et sécurité</p>
          </div>
        );
      case 'privacy':
        return (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Confidentialité</h3>
            <p className="text-gray-500">Paramètres de confidentialité et données</p>
          </div>
        );
      default:
        return <AccountSettings showMessage={showMessage} />;
    }
  };

  return (
    <SettingsLayout activeSection={activeSection} setActiveSection={setActiveSection}>
      {/* Message de notification */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' 
            ? 'bg-green-100/80 border-green-300/50 text-green-700' 
            : 'bg-red-100/80 border-red-300/50 text-red-700'
        } backdrop-blur-sm flex items-center`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {renderSettingsContent()}
    </SettingsLayout>
  );
};

export default SettingsPage;