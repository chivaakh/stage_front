import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Key, Eye, EyeOff, ArrowLeft } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams(); // récupère le token dans l'URL (peut être undefined)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    token: token || "", //  AJOUT : Pré-remplir avec le token de l'URL si disponible
    newPassword: "",
    confirmPassword: "", //  AJOUT : Confirmation du mot de passe
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  //  AJOUT : Si pas de token dans l'URL, afficher les instructions
  const [showInstructions, setShowInstructions] = useState(!token);

  useEffect(() => {
    // Si un token est fourni dans l'URL, le pré-remplir
    if (token) {
      setFormData(prev => ({ ...prev, token }));
      setShowInstructions(false);
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Réinitialiser les messages d'erreur quand l'utilisateur tape
    if (errorMsg) setErrorMsg(null);
  };

  //  NOUVEAU : Fonction pour coller depuis le presse-papiers
  const handlePasteToken = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData(prev => ({ ...prev, token: text }));
      setSuccessMsg("Code collé !");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err) {
      setErrorMsg("Impossible d'accéder au presse-papiers. Collez manuellement le code.");
      setTimeout(() => setErrorMsg(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    //  VALIDATION : Vérifier que tous les champs sont remplis
    if (!formData.token) {
      setErrorMsg("Le code de réinitialisation est requis");
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setErrorMsg("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/reset-password/${formData.token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mot_de_passe: formData.newPassword }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erreur serveur");
      }

      setSuccessMsg("Mot de passe modifié avec succès ! Redirection vers la connexion...");
      
      // Effacer le formulaire
      setFormData({ token: "", newPassword: "", confirmPassword: "" });

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50 p-4">
      {/* Background bubbles - même style que AuthPage */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header avec bouton retour */}
        <div className="flex items-center mb-6">
          <button
            onClick={goToLogin}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors mr-4"
            aria-label="Retour à la connexion"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">
            Nouveau mot de passe
          </h2>
        </div>

        {/* Instructions si pas de token dans l'URL */}
        {showInstructions && (
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">ℹ</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Comment obtenir votre code ?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>1. Vérifiez votre email</p>
                  <p>2. Copiez le code de réinitialisation</p>
                  <p>3. Collez-le dans le champ ci-dessous</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ Token - toujours visible */}
          <div className="relative">
            <input
              type="text"
              name="token"
              placeholder="Collez votre code de réinitialisation ici"
              value={formData.token}
              onChange={handleChange}
              required
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-16 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
            <Key className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="button"
              onClick={handlePasteToken}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 text-xs bg-green-100 px-2 py-1 rounded transition-colors"
              title="Coller depuis le presse-papiers"
            >
              📋
            </button>
          </div>

          {/* Nouveau mot de passe */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              placeholder="Nouveau mot de passe"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirmation mot de passe */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirmer le nouveau mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Messages d'erreur et succès */}
          {errorMsg && (
            <div className="bg-red-50/80 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-center text-sm">{errorMsg}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="bg-green-50/80 border border-green-200 rounded-xl p-3">
              <p className="text-green-600 text-center text-sm">{successMsg}</p>
            </div>
          )}

          {/* Conseils sécurité */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-800 mb-2">💡 Conseils pour un mot de passe sécurisé :</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Au moins 6 caractères</li>
              <li>• Mélanger majuscules et minuscules</li>
              <li>• Inclure des chiffres et symboles</li>
              <li>• Éviter les mots du dictionnaire</li>
            </ul>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Modification en cours...
              </div>
            ) : (
              "Modifier le mot de passe"
            )}
          </button>

          {/* Lien retour */}
          <div className="text-center">
            <button
              type="button"
              onClick={goToLogin}
              className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
            >
              ← Retour à la connexion
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Besoin d'aide ? Contactez le support technique
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;