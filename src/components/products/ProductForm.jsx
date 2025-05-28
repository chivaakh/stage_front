// src/components/products/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea } from '../ui';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    reference: ''
  });
  const [errors, setErrors] = useState({});

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        description: initialData.description || '',
        reference: initialData.reference || ''
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        reference: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du produit est obligatoire';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    }

    if (!formData.reference.trim()) {
      newErrors.reference = 'La référence est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      nom: '',
      description: '',
      reference: ''
    });
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a202c',
        marginBottom: '24px',
        margin: '0 0 24px 0'
      }}>
        {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
      </h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Nom du produit"
          placeholder="Ex: iPhone 15 Pro"
          value={formData.nom}
          onChange={(e) => handleChange('nom', e.target.value)}
          error={errors.nom}
          required
          disabled={isLoading}
        />

        <Textarea
          label="Description"
          placeholder="Description détaillée du produit..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          required
          rows={4}
          disabled={isLoading}
        />

        <Input
          label="Référence"
          placeholder="Ex: IP15-001"
          value={formData.reference}
          onChange={(e) => handleChange('reference', e.target.value)}
          error={errors.reference}
          required
          disabled={isLoading}
        />

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          marginTop: '32px'
        }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Traitement...' : (isEditing ? 'Modifier' : 'Créer')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;