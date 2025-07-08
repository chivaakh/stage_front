import React from "react";
import { FaUser, FaStore } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


const ChoixTypeUtilisateur = ({ onChoisir }) => {

    const navigate = useNavigate();
    return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Qui êtes-vous ?
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {/* Client */}
            <div
                onClick={() => {
                    localStorage.setItem("type_utilisateur", "client");
                    navigate("/login");
                }}
                className="cursor-pointer w-full sm:w-1/2 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-transform"
            >

            <FaUser className="text-blue-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Client</h3>
            <p className="text-sm text-gray-500 text-center">
              Je veux acheter, explorer les produits et passer commande.
            </p>
          </div>

          {/* Vendeur */}
          <div
            onClick={() => {
                localStorage.setItem("type_utilisateur", "vendeur");
                navigate("/login");
            }}
            className="cursor-pointer w-full sm:w-1/2 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-transform"
            >

            <FaStore className="text-purple-500 text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Vendeur</h3>
            <p className="text-sm text-gray-500 text-center">
              Je veux vendre mes produits et gérer mon espace boutique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoixTypeUtilisateur;
