import React, { useState } from 'react';
import { Save, Globe, Sun, Moon } from 'lucide-react';

const GeneralSettings = ({ showMessage }) => {
  const [generalSettings, setGeneralSettings] = useState({
    langue: 'fr',
    devise: 'MRU',
    theme: 'light',
    autoSave: true
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Paramètres généraux sauvegardés');
    } catch (error) {
      showMessage('error', 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Globe className="w-6 h-6 mr-2 text-blue-600" />
        Paramètres généraux
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
          <select
            value={generalSettings.langue}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, langue: e.target.value }))}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Devise</label>
          <select
            value={generalSettings.devise}
            onChange={(e) => setGeneralSettings(prev => ({ ...prev, devise: e.target.value }))}
            className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="MRU">Ouguiya (MRU)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar US (USD)</option>
          </select>
        </div>

        <div className="bg-white/30 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Thème</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setGeneralSettings(prev => ({ ...prev, theme: 'light' }))}
              className={`flex items-center px-4 py-2 rounded-xl transition-all ${generalSettings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-700'}`}
            >
              <Sun className="w-4 h-4 mr-2" />
              Clair
            </button>
            <button
              onClick={() => setGeneralSettings(prev => ({ ...prev, theme: 'dark' }))}
              className={`flex items-center px-4 py-2 rounded-xl transition-all ${generalSettings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-white/50 text-gray-700'}`}
            >
              <Moon className="w-4 h-4 mr-2" />
              Sombre
            </button>
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

export default GeneralSettings;