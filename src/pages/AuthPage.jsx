import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, Phone, ClipboardCopy, Key } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookSquare } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [signupMode, setSignupMode] = useState("telephone");
  const [loginMode, setLoginMode] = useState("telephone");
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    resetEmail: "",
    resetToken: "",
    newPassword: "",
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
        appId: "1859730208143519",
        cookie: true,
        xfbml: false,
        version: "v18.0",
      });
    };

    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/fr_FR/sdk.js";
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  // Fonction de redirection commune pour tous les types de connexion
  const redirectUserAfterLogin = async () => {
    try {
      const userInfoRes = await fetch("http://localhost:8000/api/client-info/", {
        credentials: "include",
      });

      if (userInfoRes.ok) {
        const userInfo = await userInfoRes.json();
        
        if (userInfo.type_utilisateur === "client") {
          console.log("👤 Redirection client vers la page d'accueil");
          window.location.href = "/clientHomePage";
          
        } else if (userInfo.type_utilisateur === "administrateur") {
          console.log("🛡️ Connexion administrateur détectée");
          setSuccessMsg("Connexion administrateur réussie ! Redirection vers le panneau d'administration...");
          setTimeout(() => {
            window.location.href = "/admin";
          }, 1000);
          
        } else if (userInfo.type_utilisateur === "vendeur") {
          console.log("🏪 Vérification du profil vendeur...");
          const profilRes = await fetch("http://localhost:8000/api/profil-vendeur/", {
            credentials: "include",
          });

          if (profilRes.status === 404) {
            console.log("🆕 Vendeur sans boutique → Redirection vers création boutique");
            window.location.href = "/creer-boutique";
          } else if (profilRes.ok) {
            console.log("✅ Vendeur avec boutique → Redirection vers dashboard");
            window.location.href = "/dashboard";
          } else {
            const data = await profilRes.json();
            setErrorMsg(data?.error || "Erreur lors de la vérification du profil vendeur.");
          }
          
        } else {
          setErrorMsg(`Type d'utilisateur non reconnu: ${userInfo.type_utilisateur}`);
        }
      } else {
        // Fallback avec l'ancienne API vendeur
        const vendeurInfoRes = await fetch("http://localhost:8000/api/vendeur-info/", {
          credentials: "include",
        });

        if (vendeurInfoRes.ok) {
          const userInfo = await vendeurInfoRes.json();
          
          if (userInfo.type_utilisateur === "client") {
            window.location.href = "/clientHomePage";
          } else if (userInfo.type_utilisateur === "administrateur") {
            window.location.href = "/admin";
          } else if (userInfo.type_utilisateur === "vendeur") {
            const profilRes = await fetch("http://localhost:8000/api/profil-vendeur/", {
              credentials: "include",
            });

            if (profilRes.status === 404) {
              window.location.href = "/creer-boutique";
            } else if (profilRes.ok) {
              window.location.href = "/dashboard";
            } else {
              const data = await profilRes.json();
              setErrorMsg(data?.error || "Erreur lors de la vérification du profil vendeur.");
            }
          }
        } else {
          setErrorMsg("Erreur lors de la récupération des informations utilisateur.");
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du profil:", err);
      setErrorMsg("Erreur réseau lors de la vérification du profil utilisateur.");
    }
  };

  // Gestion login Google avec redirection automatique
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("🔍 Google response:", credentialResponse);
      const token = credentialResponse.credential;
      
      // 🔧 RÉCUPÉRER LE TYPE D'UTILISATEUR CHOISI
      const typeUtilisateur = localStorage.getItem("type_utilisateur") || "client";
      console.log("👤 Type utilisateur choisi:", typeUtilisateur);
      
      const res = await fetch("http://localhost:8000/api/login/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token,
          type_utilisateur: typeUtilisateur  // 📤 ENVOYER LE TYPE AU BACKEND
        }),
        credentials: "include",
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur Google login");
      
      setSuccessMsg("Connexion Google réussie ! Redirection en cours...");
      resetMessages();
      
      // 🚀 REDIRECTION AUTOMATIQUE après connexion Google
      setTimeout(async () => {
        await redirectUserAfterLogin();
      }, 1000);
      
    } catch (err) {
      console.error("❌ Erreur Google login:", err);
      setErrorMsg(err.message);
    }
  };

  const handleGoogleError = () => {
    setErrorMsg("Connexion Google échouée.");
  };

  // Gestion Facebook Login avec redirection automatique
  const handleFacebookLogin = () => {
    FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;
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

            console.log("📘 Tentative de connexion Facebook...");
            
            // 🔧 RÉCUPÉRER LE TYPE D'UTILISATEUR CHOISI
            const typeUtilisateur = localStorage.getItem("type_utilisateur") || "client";
            console.log("👤 Type utilisateur choisi:", typeUtilisateur);
            
            fetch("http://localhost:8000/api/facebook-login/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: accessToken,
                email,
                type_utilisateur: typeUtilisateur  // 📤 ENVOYER LE TYPE AU BACKEND
              }),
              credentials: "include",
            })
              .then((res) => res.json())
              .then(async (data) => {
                if (data.error) {
                  setErrorMsg(data.error);
                } else {
                  setSuccessMsg("Connexion Facebook réussie ! Redirection en cours...");
                  setErrorMsg(null);
                  
                  // 🚀 REDIRECTION AUTOMATIQUE après connexion Facebook
                  setTimeout(async () => {
                    await redirectUserAfterLogin();
                  }, 1000);
                }
              })
              .catch((err) => {
                console.error("❌ Erreur Facebook login:", err);
                setErrorMsg("Erreur lors de la connexion Facebook");
              });
          });
        } else {
          setErrorMsg("Connexion Facebook échouée.");
        }
      },
      { scope: "email" }
    );
  };

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
      setResetStep(2);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

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

      setTimeout(async () => {
        try {
          const userInfoRes = await fetch("http://localhost:8000/api/client-info/", {
            credentials: "include",
          });

          if (userInfoRes.ok) {
            const userInfo = await userInfoRes.json();
            
            if (userInfo.type_utilisateur === "client") {
              window.location.href = "/clientHomePage";
            } else if (userInfo.type_utilisateur === "administrateur") {
              console.log("🛡️ Connexion administrateur détectée");
              setSuccessMsg("Connexion administrateur réussie ! Redirection vers le panneau d'administration...");
              setTimeout(() => {
                window.location.href = "/admin";
              }, 1000);
            } else if (userInfo.type_utilisateur === "vendeur") {
              const profilRes = await fetch("http://localhost:8000/api/profil-vendeur/", {
                credentials: "include",
              });

              if (profilRes.status === 404) {
                window.location.href = "/creer-boutique";
              } else if (profilRes.ok) {
                window.location.href = "/dashboard";
              } else {
                const data = await profilRes.json();
                setErrorMsg(data?.error || "Erreur lors de la vérification du profil vendeur.");
              }
            } else {
              setErrorMsg(`Type d'utilisateur non reconnu: ${userInfo.type_utilisateur}`);
            }
          } else {
            const vendeurInfoRes = await fetch("http://localhost:8000/api/vendeur-info/", {
              credentials: "include",
            });

            if (vendeurInfoRes.ok) {
              const userInfo = await vendeurInfoRes.json();
              
              if (userInfo.type_utilisateur === "client") {
                window.location.href = "/clientHomePage";
              } else if (userInfo.type_utilisateur === "administrateur") {
                window.location.href = "/admin";
              } else if (userInfo.type_utilisateur === "vendeur") {
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
              }
            } else {
              setErrorMsg("Erreur lors de la récupération des informations utilisateur.");
            }
          }
        } catch (err) {
          console.error("Erreur lors de la vérification du profil:", err);
          setErrorMsg("Erreur réseau lors de la vérification du profil utilisateur.");
        }
      }, 500);

    } catch (err) {
      setErrorMsg(err.message);
    }
  };

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
        window.location.href = "/login";
      } else {
        setIsLogin(true);
      }
      setFormData({ nom: "", prenom: "", email: "", telephone: "", password: "" });

    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setShowResetPassword(false);
    setResetStep(1);
    setLoginMode("telephone");
    setFormData({ nom: "", prenom: "", email: "", telephone: "", password: "" });
    resetMessages();
    setShowPassword(false);
  };

  const toggleResetPassword = () => {
    setShowResetPassword(!showResetPassword);
    setResetStep(1);
    resetMessages();
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 overflow-hidden relative">
      {/* Background bubbles améliorés */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-300 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-40 w-64 h-64 bg-gradient-to-r from-indigo-300 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-500"></div>
      </div>

      {/* Main container avec radius améliorés */}
      <div
        className="relative z-10 w-full max-w-5xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden bg-white/25 backdrop-blur-xl border border-white/40 flex"
        style={{ height: 550 }}
      >
        {/* Login form container avec radius amélioré */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out z-10 ${
            isLogin ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"
          } flex`}
        >
          <div className="w-full h-full bg-white/30 backdrop-blur-lg rounded-l-[2.5rem] p-10 flex flex-col justify-center border-r border-white/20">
            {showResetPassword ? (
              <>
                {resetStep === 1 ? (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mot de passe oublié</h2>
                    <form onSubmit={handleResetEmailSubmit} className="space-y-6">
                      <div className="relative">
                        <input
                          type="email"
                          name="resetEmail"
                          placeholder="Votre email"
                          value={formData.resetEmail || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                        />
                        <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>

                      {errorMsg && <p className="text-red-600 text-center bg-red-50 p-3 rounded-xl">{errorMsg}</p>}
                      {successMsg && <p className="text-green-600 text-center bg-green-50 p-3 rounded-xl">{successMsg}</p>}

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
                      >
                        Envoyer le code par email
                      </button>

                      <button
                        type="button"
                        onClick={toggleResetPassword}
                        className="mt-4 text-center text-purple-700 underline hover:text-purple-900 bg-transparent border-0 cursor-pointer w-full"
                      >
                        Annuler
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Nouveau mot de passe</h2>
                    <p className="text-sm text-gray-600 mb-8 text-center">
                      Vérifiez votre email et copiez le code de réinitialisation
                    </p>

                    <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
                      <div className="relative">
                        <input
                          type="text"
                          name="resetToken"
                          placeholder="Collez votre code de réinitialisation ici"
                          value={formData.resetToken || ""}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-20 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                        />
                        <Key className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <ClipboardCopy
                          onClick={handlePasteToken}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 cursor-pointer w-5 h-5"
                          title="Coller le code"
                        />
                      </div>

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="newPassword"
                          placeholder="Nouveau mot de passe"
                          value={formData.newPassword || ""}
                          onChange={handleInputChange}
                          required
                          minLength={6}
                          className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      {errorMsg && <p className="text-red-600 text-center bg-red-50 p-3 rounded-xl">{errorMsg}</p>}
                      {successMsg && <p className="text-blue-600 text-center bg-blue-50 p-3 rounded-xl">{successMsg}</p>}

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
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
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Connexion</h2>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      type={loginMode === "email" ? "email" : "tel"}
                      name={loginMode === "email" ? "email" : "telephone"}
                      placeholder={loginMode === "email" ? "Email" : "Téléphone"}
                      value={loginMode === "email" ? formData.email : formData.telephone}
                      onChange={loginMode === "telephone" ? (e) => {
                        if (e.target.value.includes('@')) {
                          return;
                        }
                        handleInputChange(e);
                      } : handleInputChange}
                      onPaste={loginMode === "telephone" ? (e) => {
                        const pastedText = e.clipboardData.getData('text');
                        if (pastedText.includes('@')) {
                          e.preventDefault();
                          setErrorMsg("Veuillez utiliser le mode email pour saisir une adresse email");
                          setTimeout(() => setErrorMsg(null), 3000);
                        }
                      } : undefined}
                      required
                      className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-lg"
                    />
                    {loginMode === "email" ? 
                      <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" /> :
                      <Phone className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                      className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {errorMsg && <p className="text-red-600 text-center bg-red-50 p-3 rounded-xl">{errorMsg}</p>}
                  {successMsg && <p className="text-green-600 text-center bg-green-50 p-3 rounded-xl">{successMsg}</p>}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
                  >
                    Connexion
                  </button>
                </form>

                <button
                  onClick={toggleResetPassword}
                  className="mt-6 text-center text-blue-700 underline hover:text-blue-900 bg-transparent border-0 cursor-pointer"
                  type="button"
                >
                  Mot de passe oublié ?
                </button>

                {/* NOUVELLES ICÔNES SOCIALES MODERNES */}
                <div className="mt-8">
                  <p className="text-center text-gray-600 text-sm mb-6">ou connectez-vous avec</p>
                  <div className="flex items-center justify-center space-x-4">
                    {/* Google */}
                    <div className="relative">
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        render={(renderProps) => (
                          <button
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl flex items-center justify-center hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-lg"
                            title="Connexion avec Google"
                          >
                            <FcGoogle size={24} />
                          </button>
                        )}
                      />
                    </div>

                    {/* Facebook */}
                    <button
                      onClick={handleFacebookLogin}
                      className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl flex items-center justify-center hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-lg text-blue-600"
                      title="Connexion avec Facebook"
                    >
                      <FaFacebookSquare size={24} />
                    </button>

                    {/* Email Toggle */}
                    <button
                      onClick={() => setLoginMode("email")}
                      className={`w-12 h-12 backdrop-blur-sm border border-white/40 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg ${
                        loginMode === "email" 
                          ? "bg-blue-500 text-white" 
                          : "bg-white/80 text-gray-600 hover:bg-white/90"
                      }`}
                      title="Se connecter avec email"
                    >
                      <Mail size={20} />
                    </button>

                    {/* Phone Toggle */}
                    <button
                      onClick={() => setLoginMode("telephone")}
                      className={`w-12 h-12 backdrop-blur-sm border border-white/40 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg ${
                        loginMode === "telephone" 
                          ? "bg-green-500 text-white" 
                          : "bg-white/80 text-gray-600 hover:bg-white/90"
                      }`}
                      title="Se connecter avec téléphone"
                    >
                      <Phone size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Signup form container avec radius amélioré */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full transition-all duration-700 ease-in-out z-10 ${
            isLogin ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100 pointer-events-auto"
          } flex`}
        >
          <div className="w-full h-full bg-white/30 backdrop-blur-lg rounded-r-[2.5rem] p-10 flex flex-col justify-center border-l border-white/20">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Inscription</h2>
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                  />
                  <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                  />
                  <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                    className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                  />
                  <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                />
                <Phone className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-4 pr-14 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {errorMsg && <p className="text-red-600 text-center bg-red-50 p-3 rounded-xl">{errorMsg}</p>}
              {successMsg && <p className="text-green-600 text-center bg-green-50 p-3 rounded-xl">{successMsg}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
              >
                S'inscrire
              </button>
              
              <div className="text-center mt-4">
                {signupMode === "telephone" ? (
                  <button
                    type="button"
                    onClick={() => setSignupMode("email")}
                    className="text-purple-600 underline hover:text-purple-800 transition-colors"
                  >
                    S'inscrire avec email
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSignupMode("telephone")}
                    className="text-purple-600 underline hover:text-purple-800 transition-colors"
                  >
                    S'inscrire avec téléphone
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toggle Panel amélioré */}
      <div
        className={`absolute top-1/2 transform -translate-y-1/2 h-[550px] ${
          isLogin
            ? "w-[480px] left-[calc(50%+60px)] rounded-l-none rounded-r-[2.5rem]"
            : "w-[480px] left-[calc(50%-540px)] rounded-r-none rounded-l-[2.5rem]"
        } bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex flex-col items-center justify-center text-white text-center px-12 select-none transition-all duration-700 ease-in-out z-20 shadow-2xl`}
        onClick={toggleForm}
      >
        {isLogin ? (
          <>
            <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
            <p className="mb-8 text-lg opacity-90">Enter your personal details to register</p>
            <button className="bg-white/20 hover:bg-white/30 py-4 px-10 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30">
              Sign Up
            </button>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
            <p className="mb-8 text-lg opacity-90">To keep connected with us please login</p>
            <button className="bg-white/20 hover:bg-white/30 py-4 px-10 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30">
              Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;