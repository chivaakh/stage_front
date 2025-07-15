import React from 'react';
import { Phone, Mail, HelpCircle, Shield, ChevronRight } from 'lucide-react';

const HelpSettings = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
        Aide & Support
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <Phone className="w-6 h-6 text-blue-500 mr-3" />
            <h4 className="font-semibold text-gray-800">WhatsApp Support</h4>
          </div>
          <p className="text-gray-600 mb-3">Contactez-nous directement via WhatsApp</p>
          <p className="text-blue-600 font-medium">+222 38393738</p>
        </div>

        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-purple-500 mr-3" />
            <h4 className="font-semibold text-gray-800">Email Support</h4>
          </div>
          <p className="text-gray-600 mb-3">Envoyez-nous un email</p>
          <p className="text-purple-600 font-medium">info@ishrili.com</p>
        </div>

        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <HelpCircle className="w-6 h-6 text-green-500 mr-3" />
            <h4 className="font-semibold text-gray-800">FAQ</h4>
          </div>
          <p className="text-gray-600 mb-3">Questions fréquemment posées</p>
          <div className="flex items-center text-green-600 font-medium">
            Voir la FAQ <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="bg-white/30 rounded-xl p-6 hover:bg-white/40 transition-all cursor-pointer">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-orange-500 mr-3" />
            <h4 className="font-semibold text-gray-800">Conditions d'utilisation</h4>
          </div>
          <p className="text-gray-600 mb-3">Consultez nos termes et conditions</p>
          <div className="flex items-center text-orange-600 font-medium">
            Lire les conditions <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-xl p-6 border border-blue-200/30">
        <h4 className="font-semibold text-gray-800 mb-2">À propos d'Ishrili</h4>
        <p className="text-gray-600 mb-4">
          Ishrili est la plateforme de e-commerce dédiée au marché mauritanien. 
          Nous permettons aux vendeurs mauritaniens de créer facilement leur boutique en ligne 
          et d'atteindre plus de clients à travers la Mauritanie.
        </p>
        <p className="text-sm text-gray-500">Version 1.0.0 - Mai 2025</p>
      </div>
    </div>
  );
};

export default HelpSettings;