
// 📁 src/components/settings/NotificationSettings.jsx
import React, { useState } from 'react';
import { Save, Bell } from 'lucide-react';

const NotificationSettings = ({ showMessage }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailCommandes: true,
    emailPromotions: false,
    smsCommandes: true,
    pushCommandes: true,
    pushMessages: true,
    pushPromotions: false
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulation d'une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Paramètres de notification sauvegardés');
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Bell className="w-6 h-6 mr-2 text-blue-600" />
        Préférences de notification
      </h3>
      
      <div className="space-y-4">
        <div className="bg-white/30 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">Notifications Email</h4>
          <div className="space-y-3">
            {[
              { key: 'emailCommandes', label: 'Nouvelles commandes' },
              { key: 'emailPromotions', label: 'Promotions et offres spéciales' }
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{item.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${notificationSettings[item.key] ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <h4 className="font-medium text-gray-800 mb-3">Notifications Push</h4>
          <div className="space-y-3">
            {[
              { key: 'pushCommandes', label: 'Nouvelles commandes' },
              { key: 'pushMessages', label: 'Messages clients' },
              { key: 'pushPromotions', label: 'Promotions' }
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">{item.label}</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={notificationSettings[item.key]}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${notificationSettings[item.key] ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${notificationSettings[item.key] ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
      >
        <Save className="w-5 h-5 mr-2" />
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );
};

export default NotificationSettings;