import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderForm from './OrderForm';

const OrderEdit = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    
    setLoading(true);
    
    // Using proxy path - Vite will forward to http://127.0.0.1:8000
    fetch(`/api/commandes/${orderId}/`)
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Données reçues:', data);
        setOrderData(data);
      })
      .catch(err => {
        console.error('Erreur chargement:', err);
        alert(`Erreur lors du chargement de la commande: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [orderId]);

  const handleSubmit = async (updatedData) => {
    setIsSubmitting(true);
    
    try {
      // Préparer les données en conservant les champs requis
      const dataToSend = {
        statut: updatedData.statut,
        montant_total: parseFloat(updatedData.montant_total),
        date_commande: updatedData.date_commande,
        
        // Conserver les données client originales (requis par l'API)
        client: orderData.client || {
          nom: updatedData.client_nom || '',
          prenom: updatedData.client_prenom || '',
          adresse: updatedData.client_adresse || '',
          ville: updatedData.client_ville || '',
          code_postal: updatedData.client_code_postal || '',
          pays: updatedData.client_pays || ''
        },
        
        // Inclure les détails s'ils existent
        details: updatedData.details || []
      };

      console.log('Données envoyées:', dataToSend);

      // Using proxy path
      const res = await fetch(`/api/commandes/${orderId}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('PUT Response status:', res.status);

      if (!res.ok) {
        let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        try {
          const errorData = await res.json();
          console.error('Erreur API:', errorData);
          errorMessage = JSON.stringify(errorData);
        } catch (e) {
          console.error('Could not parse error response');
        }
        throw new Error(errorMessage);
      }

      const result = await res.json();
      console.log('Réponse API:', result);
      
      alert('Commande mise à jour avec succès');
      navigate('/commandes');
      
    } catch (err) {
      console.error('Erreur complète:', err);
      alert(`Erreur lors de la mise à jour: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Chargement...</div>
      </div>
    );
  }
  
  if (!orderData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Commande introuvable</div>
        <button onClick={() => navigate('/commandes')}>
          Retour aux commandes
        </button>
      </div>
    );
  }

  return (
    <OrderForm
      isOpen={true}
      initialData={orderData}
      onSubmit={handleSubmit}
      onClose={() => navigate('/commandes')}
      isLoading={isSubmitting}
    />
  );
};

export default OrderEdit;