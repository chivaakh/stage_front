import React from "react";
import { FaUser, FaStore, FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ChoixTypeUtilisateur = ({ onChoisir }) => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animations de fond */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 max-w-4xl w-full">
                {/* Section de bienvenue et logo */}
                <div className="text-center mb-12">
                    {/* Logo/Titre principal */}
                    <div className="mb-6">
                        <h1 className="text-6xl font-bold text-white mb-2 tracking-wide">
                            ishrili
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
                    </div>
                    
                    {/* Message de bienvenue */}
                    <h2 className="text-2xl font-semibold text-white/95 mb-4">
                        Bienvenue sur Ishrili
                    </h2>
                    
                    {/* Description courte */}
                    <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
                        La plateforme e-commerce dédiée au marché mauritanien. 
                        Connectez vendeurs et acheteurs pour une expérience d'achat simple, 
                        sécurisée et locale.
                    </p>

                    {/* Statistiques ou points forts */}
                    <div className="flex justify-center items-center gap-8 mb-8 text-white/70">
                        <div className="flex items-center gap-2">
                            <FaStore className="text-yellow-400" />
                            <span className="text-sm">Vendeurs locaux</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaShoppingCart className="text-yellow-400" />
                            <span className="text-sm">Livraison rapide</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaStar className="text-yellow-400" />
                            <span className="text-sm">Qualité garantie</span>
                        </div>
                    </div>
                </div>

                {/* Section choix du type d'utilisateur */}
                <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                    <h3 className="text-2xl font-bold text-center text-white mb-8">
                        Qui êtes-vous ?
                    </h3>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                        {/* Client */}
                        <div
                            onClick={() => {
                                localStorage.setItem("type_utilisateur", "client");
                                navigate("/login");
                            }}
                            className="group cursor-pointer w-full lg:w-1/2 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8 flex flex-col items-center hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaUser className="text-white text-3xl" />
                            </div>
                            <h4 className="text-2xl font-bold mb-3 text-gray-800">Client</h4>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Je veux acheter, explorer les produits et 
                                passer commande.
                            </p>
                            <div className="mt-4 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                Commencer mes achats
                            </div>
                        </div>

                        {/* Vendeur */}
                        <div
                            onClick={() => {
                                localStorage.setItem("type_utilisateur", "vendeur");
                                navigate("/login");
                            }}
                            className="group cursor-pointer w-full lg:w-1/2 bg-white/90 backdrop-blur-sm rounded-2xl border border-white/30 p-8 flex flex-col items-center hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 transform hover:scale-105"
                        >
                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                <FaStore className="text-white text-3xl" />
                            </div>
                            <h4 className="text-2xl font-bold mb-3 text-gray-800">Vendeur</h4>
                            <p className="text-gray-600 text-center leading-relaxed">
                                Je veux vendre mes produits et gérer mon 
                                espace boutique.
                            </p>
                            <div className="mt-4 px-6 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium">
                                Créer ma boutique
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer avec informations de contact */}
                <div className="text-center mt-8 text-white/60 text-sm">
                    <p>Une question ? Contactez-nous sur WhatsApp : +222 38393738</p>
                </div>
            </div>
        </div>
    );
};

export default ChoixTypeUtilisateur;