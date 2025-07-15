import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, Phone, ClipboardCopy, Key } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);  // <-- pour afficher le formulaire reset
  const [resetStep, setResetStep] = useState(1); // AJOUT : 1 = email, 2 = token + nouveau mot de passe
  const [signupMode, setSignupMode] = useState("telephone"); // ou "email"
  const [loginMode, setLoginMode] = useState("telephone"); // "telephone" ou "email"
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    resetEmail: "", // email pour réinitialisation
    resetToken: "", //  AJOUT : pour le token de reset
    newPassword: "", //  AJOUT : pour le nouveau mot de passe
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleInputChange = (e) => {
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const resetMessages = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
  };




  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "1859730208143519",  // Remplace par ton App ID Facebook
        cookie: true,
        xfbml: false,
        version: "v18.0", // ou la dernière version stable
      });
    };

    // Charger le SDK Facebook asynchrone
    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/fr_FR/sdk.js";
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);








  // Gestion login Google
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google response:", credentialResponse);
      const token = credentialResponse.credential;
      // Envoie le token au backend pour vérification / création utilisateur
      const res = await fetch("http://localhost:8000/api/login/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur Google login");
      setSuccessMsg("Connexion Google réussie !");
      // TODO: rediriger ou mettre à jour état connecté
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Connexion Google échouée.");
  };










  //  MODIFIÉ : Soumission reset mot de passe - étape 1 (demande email)
  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      const res = await fetch("http://localhost:8000/api/request-password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.resetEmail }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erreur serveur");
      }

      setSuccessMsg("Code de réinitialisation envoyé par email ! Vérifiez votre boîte mail.");
      setResetStep(2); //  Passer à l'étape 2
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  //  NOUVEAU : Soumission reset mot de passe - étape 2 (token + nouveau mot de passe)
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!formData.resetToken) {
      setErrorMsg("Le code de réinitialisation est requis");
      return;
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      setErrorMsg("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/reset-password/${formData.resetToken}/`, {
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

      setSuccessMsg("Mot de passe modifié avec succès ! Vous pouvez maintenant vous connecter.");
      
      // Réinitialiser le formulaire et revenir au login
      setTimeout(() => {
        setFormData(f => ({ ...f, resetEmail: "", resetToken: "", newPassword: "" }));
        setShowResetPassword(false);
        setResetStep(1);
        resetMessages();
      }, 2000);

    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  //  NOUVEAU : Fonction pour coller depuis le presse-papiers
  const handlePasteToken = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFormData(f => ({ ...f, resetToken: text }));
      setSuccessMsg("Code collé !");
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err) {
      setErrorMsg("Impossible d'accéder au presse-papiers");
      setTimeout(() => setErrorMsg(null), 2000);
    }
  };



  // Soumission login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (loginMode === "telephone" && formData.telephone.includes('@')) {
    setErrorMsg("Format téléphone invalide. Utilisez le mode email pour les adresses email.");
    return;
  }



    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifiant: loginMode === "email" ? formData.email : formData.telephone,
          mot_de_passe: formData.password,
        }),
        credentials: "include",
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erreur serveur");
      }

      setSuccessMsg("Connexion réussie !");
      // TODO: redirection ou mise à jour état connecté ici


      // Appel backend pour vérifier si c’est un vendeur et s’il a un profil boutique
      //  Attendre une courte durée pour que le cookie de session soit bien reçu
      //  NOUVELLE LOGIQUE : Vérifier d'abord le type d'utilisateur
    setTimeout(async () => {
      try {
        // Récupérer les infos utilisateur pour connaître son type
        const userInfoRes = await fetch("http://localhost:8000/api/vendeur-info/", {
          credentials: "include",
        });

        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json();
          
          // Redirection selon le type d'utilisateur
          if (userInfo.type_utilisateur === "client") {
            //  REDIRECTION CLIENT vers page client
            window.location.href = "/clientHomePage"; // ou "/shop" ou "/home-client"
          } else if (userInfo.type_utilisateur === "vendeur") {
            //  LOGIQUE VENDEUR INCHANGÉE
            // Vérifier si le vendeur a un profil boutique
            const profilRes = await fetch("http://localhost:8000/api/profil-vendeur/", {
              credentials: "include",
            });

            if (profilRes.status === 404) {
              window.location.href = "/";
            } else if (profilRes.ok) {
              window.location.href = "/dashboard";
            } else {
              const data = await profilRes.json();
              setErrorMsg(data?.error || "Erreur lors de la vérification du profil vendeur.");
            }
          } else {
            // Type d'utilisateur non reconnu
            setErrorMsg("Type d'utilisateur non reconnu.");
          }
        } else {
          // Si on ne peut pas récupérer les infos utilisateur
          setErrorMsg("Erreur lors de la récupération des informations utilisateur.");
        }
      } catch (err) {
        setErrorMsg("Erreur réseau lors de la vérification du profil utilisateur.");
      }
    }, 500);

  } catch (err) {
    setErrorMsg(err.message);
  }
};

  // Soumission signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (signupMode === "email" && !formData.email) {
    setErrorMsg("L'email est requis pour cette méthode.");
    return;
    }


    const typeUtilisateur = localStorage.getItem("type_utilisateur");

    if (!typeUtilisateur) {
      setErrorMsg("Veuillez d'abord choisir si vous êtes client ou vendeur.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email || "",
          telephone: formData.telephone,
          mot_de_passe: formData.password,
          type_utilisateur: typeUtilisateur,
        }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Erreur serveur");
      }

      setSuccessMsg("Inscription réussie ! Connectez-vous.");
      if (typeUtilisateur === "vendeur") {
        window.location.href = "/login";  //  redirection immédiate vers le formulaire boutique
      } else {
        setIsLogin(true);  // le client reste sur la page login
      }
      setFormData({ nom: "", prenom: "", email: "", telephone: "", password: "" });

    } catch (err) {
      setErrorMsg(err.message);
    }
  };


  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowResetPassword(false); // cacher reset si on change de formulaire
    setResetStep(1); //  AJOUT : Réinitialiser l'étape
    setLoginMode("telephone"); // Ajoutez cette ligne
    setFormData({ nom: "", prenom: "", email: "", telephone: "", password: "" });
    resetMessages();
    setShowPassword(false);
  };

  const toggleResetPassword = () => {
    setShowResetPassword(!showResetPassword);
    setResetStep(1); //  AJOUT : Réinitialiser l'étape
    resetMessages();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-slate-100 via-blue-50 to-purple-50 p-4 overflow-hidden relative">
      {/* Background bubbles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-60 h-60 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Main container */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30 flex"
        style={{ height: 480 }}
      >
      {/* Login form ou Reset form (exclusif) */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full p-8 flex-col justify-center transition-all duration-700 ease-in-out z-10 ${
          isLogin ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"
        } flex`}
      >
          {showResetPassword ? (
            <>
              {resetStep === 1 ? (
                //  ÉTAPE 1 : Demande d'email
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mot de passe oublié</h2>
                  <form onSubmit={handleResetEmailSubmit} className="space-y-6">
                    <div className="relative">
                      <input
                        type="email"
                        name="resetEmail"
                        placeholder="Votre email"
                        value={formData.resetEmail || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                      />
                      <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>

                    {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
                    {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Envoyer le code par email
                    </button>

                    <button
                      type="button"
                      onClick={toggleResetPassword}
                      className="mt-4 text-center text-blue-700 underline hover:text-blue-900 bg-transparent border-0 cursor-pointer w-full"
                    >
                      Annuler
                    </button>
                  </form>
                </>
              ) : (
                //  ÉTAPE 2 : Saisie du token + nouveau mot de passe
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Nouveau mot de passe</h2>
                  <p className="text-sm text-gray-600 mb-6 text-center">
                    Vérifiez votre email et copiez le code de réinitialisation
                  </p>

                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    {/* Champ Token */}
                    <div className="relative">
                      <input
                        type="text"
                        name="resetToken"
                        placeholder="Collez votre code de réinitialisation ici"
                        value={formData.resetToken || ""}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                      />
                      <Key className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <ClipboardCopy
                        onClick={handlePasteToken}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800 cursor-pointer w-5 h-5"
                        title="Coller le code"
                      />
                    </div>

                    {/* Champ nouveau mot de passe */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Nouveau mot de passe"
                        value={formData.newPassword || ""}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
                    {successMsg && <p className="text-blue-600 text-center">{successMsg}</p>}

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Modifier le mot de passe
                    </button>

                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setResetStep(1)}
                        className="flex-1 text-center text-blue-700 underline hover:text-blue-900"
                      >
                        ← Renvoyer le code
                      </button>
                      <button
                        type="button"
                        onClick={toggleResetPassword}
                        className="flex-1 text-center text-gray-600 underline hover:text-gray-800"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>

                </>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Connexion</h2>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={loginMode === "email" ? "email" : "tel"}
                    name={loginMode === "email" ? "email" : "telephone"}
                    placeholder={loginMode === "email" ? "Email" : "Téléphone"}
                    value={loginMode === "email" ? formData.email : formData.telephone}
                    onChange={loginMode === "telephone" ? (e) => {
                      // Empêcher la saisie d'emails (contenant @) dans le champ téléphone
                      if (e.target.value.includes('@')) {
                        return; // Ne pas mettre à jour si ça contient @
                      }
                      handleInputChange(e);
                    } : handleInputChange}
                    onPaste={loginMode === "telephone" ? (e) => {
                      // Empêcher le collage d'emails
                      const pastedText = e.clipboardData.getData('text');
                      if (pastedText.includes('@')) {
                        e.preventDefault();
                        setErrorMsg("Veuillez utiliser le mode email pour saisir une adresse email");
                        setTimeout(() => setErrorMsg(null), 3000);
                      }
                    } : undefined}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                  {loginMode === "email" ? 
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> :
                    <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  }

                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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

                {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
                {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 shadow-lg"
                >
                  Connexion
                </button>
              </form>

              <button
                onClick={toggleResetPassword}
                className="mt-4 text-center text-blue-700 underline hover:text-blue-900 bg-transparent border-0 cursor-pointer"
                type="button"
              >
                Mot de passe oublié ?
              </button>

              {/* Nouveau bouton de basculement */}
              <button
                onClick={() => setLoginMode(loginMode === "telephone" ? "email" : "telephone")}
                className="mt-2 flex items-center justify-center text-blue-700 hover:text-blue-900 bg-transparent border-0 cursor-pointer mx-auto"
                type="button"
              >
                {loginMode === "telephone" ? 
                  <Mail className="w-5 h-5" /> : 
                  <Phone className="w-5 h-5" />
                }
              </button>
            </>
          )}
        </div>

        {/* Signup form */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full p-8 flex-col justify-center transition-all duration-700 ease-in-out z-10 ${
            isLogin ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100 pointer-events-auto"
          } flex`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inscription</h2>
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="relative flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            {signupMode === "email" && (
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email (obligatoire)"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            )}

            <div className="relative">
              <input
                type="tel"
                name="telephone"
                placeholder={
                  signupMode === "telephone"
                    ? "Téléphone (obligatoire)"
                    : "Téléphone (secondaire obligatoire)"
                }
                value={formData.telephone}
                onChange={handleInputChange}
                required
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
              <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 pr-12 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
            {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 text-center">{successMsg}</p>}



            {/* Icônes Google et Facebook pour login social */}
        <div className="flex items-center space-x-6 mt-4 justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                render={(renderProps) => (
                  <FcGoogle
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    size={32}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    aria-label="Login with Google"
                  />
                )}
              />


              <button
                type="button"
                onClick={() => {
                  FB.login(
                    (response) => {
                      if (response.authResponse) {
                        const accessToken = response.authResponse.accessToken;
                        // Récupérer l’email via Graph API
                        FB.api('/me', { fields: 'email,name' }, (userInfo) => {
                          if (!userInfo || userInfo.error) {
                            setErrorMsg("Erreur lors de la récupération des infos Facebook");
                            return;
                          }
                          const email = userInfo.email;
                          if (!email) {
                            setErrorMsg("Email Facebook non disponible");
                            return;
                          }

                          // Envoie token et email au backend
                          fetch("http://localhost:8000/api/facebook-login/", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              access_token: accessToken, // Note ici `access_token` en snake_case
                              email, // ajouté ici pour être sûr
                            }),
                            credentials: "include",
                          })

                            .then((res) => res.json())
                            .then((data) => {
                              if (data.error) {
                                setErrorMsg(data.error);
                              } else {
                                setSuccessMsg("Connexion Facebook réussie !");
                                setErrorMsg(null);
                                // TODO: redirection ou mise à jour état connecté
                              }
                            })
                            .catch(() => {
                              setErrorMsg("Erreur lors de la connexion Facebook");
                            });
                        });
                      } else {
                        setErrorMsg("Connexion Facebook échouée.");
                      }
                    },
                    { scope: "email" }
                  );
                }}
                className="cursor-pointer text-blue-700 hover:opacity-80 transition-opacity"
                aria-label="Login with Facebook"
              >
                <FaFacebookSquare size={32} />
              </button>



              
            </div>



            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-transform duration-300 transform hover:scale-105 shadow-lg"
            >
              S'inscrire
            </button>
            <div className="text-center mt-2">
  {signupMode === "telephone" ? (
    <button
      type="button"
      onClick={() => setSignupMode("email")}
      className="text-blue-600 underline"
    >
      S'inscrire avec email
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setSignupMode("telephone")}
      className="text-blue-600 underline"
    >
      S'inscrire avec téléphone
    </button>
  )}
</div>

          </form>
        </div>
      </div>

      {/* Toggle Panel */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 h-[480px] ${
          isLogin
            ? "w-[440px] left-[calc(50%+40px)] rounded-l-none rounded-r-3xl"
            : "w-[440px] left-[calc(50%-520px)] rounded-r-none rounded-l-3xl"
        } bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white text-center px-8 select-none transition-all duration-700 ease-in-out z-20`}
        onClick={toggleForm}
      >
        {isLogin ? (
          <>
            <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
            <p className="mb-6">Enter your personal details to register</p>
            <button className="bg-white/20 hover:bg-white/30 py-3 px-8 rounded-xl font-semibold transition">
              Sign Up
            </button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="mb-6">To keep connected with us please login</p>
            <button className="bg-white/20 hover:bg-white/30 py-3 px-8 rounded-xl font-semibold transition">
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
