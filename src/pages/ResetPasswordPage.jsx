import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const { token } = useParams(); // récupère le token dans l'URL
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/reset-password/${token}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mot_de_passe: newPassword }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erreur serveur");
      }

      setSuccessMsg("Mot de passe modifié avec succès !");
      setNewPassword("");

      // Optionnel : rediriger vers la page de connexion après quelques secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Réinitialisation du mot de passe</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            minLength={6}
          />

          {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 shadow-lg"
          >
            {loading ? "Chargement..." : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
