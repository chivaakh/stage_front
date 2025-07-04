import React, { useState } from 'react';

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

  // ✅ SUPPRIMÉ : Plus d'appel useEffect pour vérifier l'auth au chargement
  // L'utilisateur est déjà arrivé ici via la redirection après login

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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Créer votre boutique</h2>
      <p className="text-gray-600 text-center mb-6">
        Remplissez les informations de votre boutique pour commencer à vendre
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la boutique *
          </label>
          <input 
            type="text" 
            name="nom_boutique" 
            placeholder="Ex: Ma Super Boutique" 
            value={formData.nom_boutique}
            onChange={handleChange} 
            required 
            disabled={loading}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            name="description" 
            placeholder="Décrivez votre boutique et vos produits..." 
            value={formData.description}
            onChange={handleChange} 
            disabled={loading}
            rows={3}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <input 
            type="text" 
            name="adresse" 
            placeholder="123 Rue de la Paix" 
            value={formData.adresse}
            onChange={handleChange} 
            disabled={loading}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville *
          </label>
          <input 
            type="text" 
            name="ville" 
            placeholder="Ex: Nouakchott" 
            value={formData.ville}
            onChange={handleChange} 
            required 
            disabled={loading}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone professionnel
          </label>
          <input 
            type="tel" 
            name="telephone_professionnel" 
            placeholder="Ex: +222 XX XX XX XX" 
            value={formData.telephone_professionnel}
            onChange={handleChange} 
            disabled={loading}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo de la boutique
          </label>
          <input 
            type="file" 
            name="logo" 
            onChange={handleChange} 
            disabled={loading}
            accept="image/*"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" 
          />
          <p className="text-xs text-gray-500 mt-1">
            Formats acceptés: JPG, PNG, GIF (Max: 5MB)
          </p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <strong>Succès:</strong> {success}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full px-4 py-3 rounded font-semibold transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Création en cours...
            </div>
          ) : (
            'Créer ma boutique'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          En créant votre boutique, vous acceptez nos{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            conditions d'utilisation
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreerBoutique;