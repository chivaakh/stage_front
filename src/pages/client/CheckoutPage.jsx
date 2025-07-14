// src/pages/client/CheckoutPage.jsx - Version connectée au backend réel
import React, { useState, useEffect } from 'react';
import { CheckCircle, MapPin, CreditCard, Truck, Package, User, Phone, Mail } from 'lucide-react';
import { fetchPanier, resumePanier, creerCommande, viderPanier } from '../../api/clientAPI';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartSummary, setCartSummary] = useState({ total_items: 0, total_prix: 0, nombre_articles: 0 });
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [error, setError] = useState(null);
  
  // Formulaire de livraison
  const [deliveryInfo, setDeliveryInfo] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: 'Nouakchott',
    quartier: '',
    instructions: ''
  });

  // Options de livraison
  const [selectedDelivery, setSelectedDelivery] = useState('standard');
  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Livraison Standard',
      description: '3-5 jours ouvrés',
      price: 0,
      icon: '📦'
    },
    {
      id: 'express',
      name: 'Livraison Express',
      description: '1-2 jours ouvrés',
      price: 500,
      icon: '⚡'
    },
    {
      id: 'same_day',
      name: 'Livraison Même Jour',
      description: 'Avant 18h (Nouakchott uniquement)',
      price: 1000,
      icon: '🚀'
    }
  ];

  // Options de paiement
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const paymentOptions = [
    {
      id: 'cash',
      name: 'Paiement à la livraison',
      description: 'Payez en espèces lors de la réception',
      icon: '💵',
      available: true
    },
    {
      id: 'masrvi',
      name: 'Masrvi Mobile',
      description: 'Paiement par portefeuille électronique',
      icon: '📱',
      available: true
    },
    {
      id: 'bankily',
      name: 'Bankily',
      description: 'Transfert bancaire mobile',
      icon: '🏦',
      available: true
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard (bientôt disponible)',
      icon: '💳',
      available: false
    }
  ];

  // Charger les données réelles du panier
  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [cartResponse, summaryResponse] = await Promise.allSettled([
        fetchPanier(),
        resumePanier()
      ]);

      // Traiter la réponse du panier
      let cartData = [];
      if (cartResponse.status === 'fulfilled' && cartResponse.value?.data) {
        const responseData = cartResponse.value.data;
        if (responseData.results && Array.isArray(responseData.results)) {
          cartData = responseData.results;
        } else if (Array.isArray(responseData)) {
          cartData = responseData;
        }
      }

      // Traiter la réponse du résumé
      let summaryData = { total_items: 0, total_prix: 0, nombre_articles: 0 };
      if (summaryResponse.status === 'fulfilled' && summaryResponse.value?.data) {
        summaryData = summaryResponse.value.data;
      } else if (cartData.length > 0) {
        summaryData = {
          total_items: cartData.length,
          total_prix: cartData.reduce((sum, item) => sum + (parseFloat(item.prix_total) || 0), 0),
          nombre_articles: cartData.reduce((sum, item) => sum + (item.quantite || 0), 0)
        };
      }

      setCartItems(cartData);
      setCartSummary(summaryData);
      
      // Si le panier est vide, rediriger
      if (cartData.length === 0) {
        window.location.href = '/panier';
      }
    } catch (error) {
      console.error('Erreur chargement panier:', error);
      setError('Impossible de charger votre panier. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return parseFloat(cartSummary.total_prix) || 0;
  };

  const getDeliveryPrice = () => {
    const option = deliveryOptions.find(opt => opt.id === selectedDelivery);
    return option ? option.price : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getDeliveryPrice();
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    
    try {
      // Créer la commande via l'API
      const orderData = {
        adresse_livraison: `${deliveryInfo.adresse}, ${deliveryInfo.quartier ? deliveryInfo.quartier + ', ' : ''}${deliveryInfo.ville}`,
        mode_livraison: selectedDelivery,
        mode_paiement: selectedPayment,
        instructions_livraison: deliveryInfo.instructions,
        contact: {
          nom: deliveryInfo.nom,
          prenom: deliveryInfo.prenom,
          telephone: deliveryInfo.telephone,
          email: deliveryInfo.email
        }
      };
      
      const response = await creerCommande(orderData);
      console.log('Commande créée:', response);
      
      // Sauvegarder l'ID de la commande
      setCreatedOrderId(response.data.commande_id || response.data.id);
      
      // Vider le panier après commande réussie
      await viderPanier();
      
      setOrderPlaced(true);
    } catch (error) {
      console.error('Erreur création commande:', error);
      setError('Erreur lors de la création de la commande. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return deliveryInfo.nom && deliveryInfo.prenom && deliveryInfo.telephone && deliveryInfo.adresse;
      case 2:
        return selectedDelivery;
      case 3:
        return selectedPayment;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Composant Header des étapes
  const StepHeader = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
      <div className="flex items-center justify-between">
        {[
          { step: 1, title: 'Livraison', icon: User },
          { step: 2, title: 'Mode de livraison', icon: Truck },
          { step: 3, title: 'Paiement', icon: CreditCard },
          { step: 4, title: 'Confirmation', icon: CheckCircle }
        ].map(({ step, title, icon: Icon }) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
              currentStep >= step 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {currentStep > step ? (
                <CheckCircle size={20} />
              ) : (
                <Icon size={20} />
              )}
            </div>
            <div className="ml-3 hidden md:block">
              <div className={`font-medium text-sm ${
                currentStep >= step ? 'text-purple-600' : 'text-gray-400'
              }`}>
                Étape {step}
              </div>
              <div className={`text-xs ${
                currentStep >= step ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {title}
              </div>
            </div>
            {step < 4 && (
              <div className={`w-12 h-0.5 mx-4 hidden md:block ${
                currentStep > step ? 'bg-purple-600' : 'bg-gray-300'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Page de confirmation de commande
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h2>
            <p className="text-gray-600">
              Votre commande {createdOrderId ? `#${createdOrderId}` : ''} a été enregistrée avec succès
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-sm text-gray-600 mb-2">Montant total</div>
            <div className="text-2xl font-bold text-gray-900">
              {calculateTotal().toLocaleString()} MRU
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/mes-commandes'}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              📋 Suivre ma commande
            </button>
            <button
              onClick={() => window.location.href = '/produits'}
              className="w-full py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              🛍️ Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finaliser ma commande
          </h1>
          <p className="text-gray-600">
            Complétez votre achat en quelques étapes simples
          </p>
        </div>

        <StepHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              
              {/* Étape 1: Informations de livraison */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <User className="text-purple-600" size={24} />
                    Informations de livraison
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={deliveryInfo.prenom}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, prenom: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Votre prénom"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={deliveryInfo.nom}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, nom: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={deliveryInfo.telephone}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, telephone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="+222 XX XX XX XX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={deliveryInfo.email}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="votre@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville *
                      </label>
                      <select
                        value={deliveryInfo.ville}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, ville: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="Nouakchott">Nouakchott</option>
                        <option value="Nouadhibou">Nouadhibou</option>
                        <option value="Rosso">Rosso</option>
                        <option value="Kaédi">Kaédi</option>
                        <option value="Zouérate">Zouérate</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quartier
                      </label>
                      <input
                        type="text"
                        value={deliveryInfo.quartier}
                        onChange={(e) => setDeliveryInfo({...deliveryInfo, quartier: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Nom du quartier"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse complète *
                    </label>
                    <textarea
                      value={deliveryInfo.adresse}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, adresse: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Adresse complète avec points de repère"
                    ></textarea>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instructions de livraison
                    </label>
                    <textarea
                      value={deliveryInfo.instructions}
                      onChange={(e) => setDeliveryInfo({...deliveryInfo, instructions: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Instructions spéciales pour le livreur (optionnel)"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Étape 2: Mode de livraison */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <Truck className="text-purple-600" size={24} />
                    Choisir le mode de livraison
                  </h3>
                  
                  <div className="space-y-4">
                    {deliveryOptions.map(option => (
                      <div
                        key={option.id}
                        onClick={() => setSelectedDelivery(option.id)}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedDelivery === option.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {option.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              option.price === 0 ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {option.price === 0 ? 'Gratuit' : `${option.price} MRU`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 3: Mode de paiement */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <CreditCard className="text-purple-600" size={24} />
                    Choisir le mode de paiement
                  </h3>
                  
                  <div className="space-y-4">
                    {paymentOptions.map(option => (
                      <div
                        key={option.id}
                        onClick={() => option.available && setSelectedPayment(option.id)}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                          !option.available
                            ? 'opacity-50 cursor-not-allowed border-gray-200'
                            : selectedPayment === option.id
                            ? 'border-purple-500 bg-purple-50 cursor-pointer'
                            : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <div className="font-semibold text-gray-900 flex items-center gap-2">
                                {option.name}
                                {!option.available && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                    Bientôt
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-600">
                                {option.description}
                              </div>
                            </div>
                          </div>
                          {option.available && selectedPayment === option.id && (
                            <CheckCircle className="text-purple-600" size={24} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Étape 4: Confirmation */}
              {currentStep === 4 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <CheckCircle className="text-purple-600" size={24} />
                    Confirmer votre commande
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Résumé livraison */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin size={20} className="text-purple-600" />
                        Adresse de livraison
                      </h4>
                      <div className="text-gray-700">
                        <div className="font-medium">{deliveryInfo.prenom} {deliveryInfo.nom}</div>
                        <div>{deliveryInfo.telephone}</div>
                        {deliveryInfo.email && <div>{deliveryInfo.email}</div>}
                        <div className="mt-2">
                          {deliveryInfo.adresse}, {deliveryInfo.quartier && `${deliveryInfo.quartier}, `}{deliveryInfo.ville}
                        </div>
                        {deliveryInfo.instructions && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Instructions:</strong> {deliveryInfo.instructions}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Résumé livraison */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Truck size={20} className="text-purple-600" />
                        Mode de livraison
                      </h4>
                      <div className="text-gray-700">
                        {deliveryOptions.find(opt => opt.id === selectedDelivery)?.name}
                        <div className="text-sm text-gray-600 mt-1">
                          {deliveryOptions.find(opt => opt.id === selectedDelivery)?.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Résumé paiement */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard size={20} className="text-purple-600" />
                        Mode de paiement
                      </h4>
                      <div className="text-gray-700">
                        {paymentOptions.find(opt => opt.id === selectedPayment)?.name}
                        <div className="text-sm text-gray-600 mt-1">
                          {paymentOptions.find(opt => opt.id === selectedPayment)?.description}
                        </div>
                      </div>
                    </div>
                    
                    {/* Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                      <input type="checkbox" className="mt-1" required />
                      <div className="text-sm text-gray-700">
                        J'accepte les <a href="#" className="text-blue-600 underline">conditions générales de vente</a> et la <a href="#" className="text-blue-600 underline">politique de confidentialité</a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    ← Étape précédente
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <button
                      onClick={nextStep}
                      disabled={!validateStep(currentStep)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Étape suivante →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitOrder}
                      disabled={loading}
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Confirmer la commande
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Résumé de commande */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Package size={24} className="text-purple-600" />
              Résumé de commande
            </h3>
            
            {/* Articles */}
            <div className="space-y-4 mb-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.nom}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">
                        {item.nom}
                      </div>
                      <div className="text-xs text-gray-600 mb-1">
                        {item.specification}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          Qté: {item.quantite}
                        </span>
                        <span className="font-semibold text-sm text-gray-900">
                          {(item.prix_unitaire * item.quantite).toLocaleString()} MRU
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Calculs */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sous-total</span>
                <span className="font-medium text-gray-900">
                  {calculateSubtotal().toLocaleString()} MRU
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Livraison</span>
                <span className={`font-medium ${getDeliveryPrice() === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {getDeliveryPrice() === 0 ? 'Gratuite' : `${getDeliveryPrice().toLocaleString()} MRU`}
                </span>
              </div>
              
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                <span className="text-gray-900">Total</span>
                <span className="text-purple-600">
                  {calculateTotal().toLocaleString()} MRU
                </span>
              </div>
            </div>
            
            {/* Sécurité */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle size={16} />
                <span className="font-medium">Commande sécurisée</span>
              </div>
              <div className="text-xs text-green-600 mt-1">
                Vos données sont protégées par chiffrement SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;