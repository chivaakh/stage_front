// src/pages/orders/OrderEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderForm from './OrderForm';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/commandes/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error('Commande introuvable');
        return res.json();
      })
      .then(data => {
        console.log('Données reçues:', data);
        setOrderData(data);
      })
      .catch(err => {
        console.error('Erreur chargement:', err);
        alert('Erreur lors du chargement de la commande');
      })
      .finally(() => setLoading(false));
  }, [id]);

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
          nom: updatedData.client_nom,
          prenom: updatedData.client_prenom,
          adresse: updatedData.client_adresse,
          ville: updatedData.client_ville,
          code_postal: updatedData.client_code_postal,
          pays: updatedData.client_pays
        },
        
        // Inclure les détails s'ils existent
        details: updatedData.details || []
      };

      console.log('Données envoyées:', dataToSend);

      const res = await fetch(`http://127.0.0.1:8000/api/commandes/${id}/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Erreur API:', errorData);
        throw new Error(`Erreur ${res.status}: ${JSON.stringify(errorData)}`);
      }

      const result = await res.json();
      console.log('Réponse API:', result);
      
    //   alert('Commande mise à jour avec succès');
      navigate('/commandes');
      
    } catch (err) {
      console.error('Erreur complète:', err);
      alert(`Erreur lors de la mise à jour: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!orderData) return <div>Commande introuvable</div>;

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