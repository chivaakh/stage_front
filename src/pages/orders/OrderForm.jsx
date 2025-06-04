// src/components/orders/OrderForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '../../components/ui';
import { theme } from '../../styles/theme';

const STATUTS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'expediee', label: 'Expédiée' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
];

const OrderForm = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState({
    statut: '',
    montant_total: '',
    details: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        statut: initialData.statut || '',
        montant_total: initialData.montant_total?.toString() || '',
        details: initialData.details || [],
      });
      setErrors({});
    } else {
      setFormData({ statut: '', montant_total: '', details: [] });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.statut) newErrors.statut = 'Le statut est requis';
    if (!formData.montant_total || parseFloat(formData.montant_total) < 0) {
      newErrors.montant_total = 'Montant total invalide';
    }
    
    formData.details.forEach((item, idx) => {
      if (!item.quantite || item.quantite <= 0) newErrors[`quantite_${idx}`] = 'Quantité > 0';
      if (!item.prix_unitaire || item.prix_unitaire <= 0) newErrors[`prix_unitaire_${idx}`] = 'Prix > 0';
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleDetailChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => 
        i === index ? { ...detail, [field]: value } : detail
      )
    }));
  };

  const handleAddDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, { quantite: 1, prix_unitaire: 0 }]
    }));
  };

  const handleRemoveDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const dataToSubmit = {
      statut: formData.statut,
      montant_total: parseFloat(formData.montant_total),
      details: formData.details.map(detail => ({
        ...detail,
        quantite: parseInt(detail.quantite),
        prix_unitaire: parseFloat(detail.prix_unitaire)
      }))
    };
    
    await onSubmit(dataToSubmit);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="600px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ color: theme.colors.gray[800], margin: 0 }}>
          Modifier la commande
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Select
            label="Statut"
            options={STATUTS}
            value={formData.statut}
            onChange={e => handleChange('statut', e.target.value)}
            error={errors.statut}
            disabled={isLoading}
            required
          />
          <Input
            label="Montant total (MRU)"
            type="number"
            step="0.01"
            min="0"
            value={formData.montant_total}
            onChange={e => handleChange('montant_total', e.target.value)}
            error={errors.montant_total}
            disabled={isLoading}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '14px' }}>Détails ({formData.details.length})</h3>
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={handleAddDetail} 
              disabled={isLoading}
            >
              + Ajouter
            </Button>
          </div>
          
          {formData.details.map((detail, index) => (
            <div key={index} style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr auto', 
              gap: '8px', 
              alignItems: 'end', 
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: theme.colors.gray[50],
              borderRadius: '4px'
            }}>
              <Input
                label="Qté"
                type="number"
                min={1}
                value={detail.quantite}
                onChange={e => handleDetailChange(index, 'quantite', parseInt(e.target.value) || 1)}
                error={errors[`quantite_${index}`]}
                disabled={isLoading}
              />
              <Input
                label="Prix (MRU)"
                type="number"
                step="0.01"
                min="0"
                value={detail.prix_unitaire}
                onChange={e => handleDetailChange(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                error={errors[`prix_unitaire_${index}`]}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => handleRemoveDetail(index)}
                disabled={isLoading}
              >
                ×
              </Button>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OrderForm;