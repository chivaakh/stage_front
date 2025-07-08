import React, { useState } from 'react';
import { Store, FileText, MapPin, Phone, Upload, User } from 'lucide-react';

const CreerBoutique = () => {
  const [formData, setFormData] = useState({
    nom_boutique: '',
    description: '',
    adresse: '',
    ville: '',
    telephone_professionnel: '',
    logo: null,
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
    // Réinitialiser les messages d'erreur quand l'utilisateur modifie le formulaire
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    try {
      const res = await fetch('http://localhost:8000/api/profil-vendeur/', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });

      const resData = await res.json();
      
      if (!res.ok) {
        // Gestion spécifique des erreurs d'authentification
        if (res.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        
        if (res.status === 404) {
          setError('Service non disponible. Veuillez contacter le support.');
          return;
        }
        
        throw new Error(resData.error || `Erreur ${res.status}`);
      }

      setSuccess('Boutique créée avec succès ! Redirection en cours...');
      // Redirection après succès
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50 p-4 overflow-hidden relative">
      {/* Background bubbles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30 p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer votre boutique</h2>
          <p className="text-gray-600">
            Remplissez les informations de votre boutique pour commencer à vendre
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de la boutique */}
          <div className="relative">
            <input 
              type="text" 
              name="nom_boutique" 
              placeholder="Nom de la boutique *"
              value={formData.nom_boutique}
              onChange={handleChange} 
              required 
              disabled={loading}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100/50" 
            />
            <Store className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {/* Description */}
          <div className="relative">
            <textarea 
              name="description" 
              placeholder="Description de votre boutique et de vos produits..."
              value={formData.description}
              onChange={handleChange} 
              disabled={loading}
              rows={3}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100/50 resize-none" 
            />
            <FileText className="absolute right-4 top-4 text-gray-400 w-5 h-5" />
          </div>
          
          {/* Adresse et Ville sur la même ligne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input 
                type="text" 
                name="adresse" 
                placeholder="Adresse"
                value={formData.adresse}
                onChange={handleChange} 
                disabled={loading}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100/50" 
              />
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            
            <div className="relative">
              <input 
                type="text" 
                name="ville" 
                placeholder="Ville *"
                value={formData.ville}
                onChange={handleChange} 
                required 
                disabled={loading}
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100/50" 
              />
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          
          {/* Téléphone professionnel */}
          <div className="relative">
            <input 
              type="tel" 
              name="telephone_professionnel" 
              placeholder="Téléphone professionnel (ex: +222 XX XX XX XX)"
              value={formData.telephone_professionnel}
              onChange={handleChange} 
              disabled={loading}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100/50" 
            />
            <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          
          {/* Logo upload */}
          <div className="relative">
            <input 
              type="file" 
              name="logo" 
              onChange={handleChange} 
              disabled={loading}
              accept="image/*"
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700" 
            />
            <Upload className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <p className="text-xs text-gray-500 -mt-4 ml-2">
            Formats acceptés: JPG, PNG, GIF (Max: 5MB)
          </p>
          
          {/* Messages d'erreur et de succès */}
          {error && (
            <div className="p-4 bg-red-100/80 backdrop-blur-sm border border-red-300/50 text-red-700 rounded-xl">
              <strong>Erreur:</strong> {error}
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-green-100/80 backdrop-blur-sm border border-green-300/50 text-green-700 rounded-xl">
              <strong>Succès:</strong> {success}
            </div>
          )}
          
          {/* Bouton de soumission */}
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform ${
              loading 
                ? 'bg-gray-400/50 cursor-not-allowed backdrop-blur-sm' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105 shadow-lg'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Création en cours...
              </div>
            ) : (
              'Créer ma boutique'
            )}
          </button>
        </form>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            En créant votre boutique, vous acceptez nos{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-800 underline transition-colors">
              conditions d'utilisation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreerBoutique;