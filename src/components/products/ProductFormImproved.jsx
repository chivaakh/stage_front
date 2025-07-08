// src/components/products/ProductFormImproved.jsx
import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea } from '../ui';
import ImageUpload from '../ui/ImageUpload';
import { PlusIcon, DeleteIcon } from '../icons';
import { useCategories } from '../../hooks/useCategories';
import { theme } from '../../styles/theme';

const ProductFormImproved = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  isLoading = false 
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    reference: '',
    categorie: '', // ✅ AJOUT CATÉGORIE
    images: [],
    specifications: []
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        description: initialData.description || '',
        reference: initialData.reference || '',
        categorie: initialData.categorie?.id || '', // ✅ RÉCUPÉRER ID CATÉGORIE
        images: initialData.images || [],
        specifications: initialData.specifications || []
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        reference: '',
        categorie: '',
        images: [],
        specifications: []
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

    if (!formData.categorie) {
      newErrors.categorie = 'La catégorie est obligatoire';
    }

    // Validation des spécifications
    formData.specifications.forEach((spec, index) => {
      if (!spec.nom?.trim()) {
        newErrors[`spec_nom_${index}`] = 'Le nom de la spécification est requis';
      }
      if (!spec.prix || spec.prix <= 0) {
        newErrors[`spec_prix_${index}`] = 'Le prix doit être supérieur à 0';
      }
    });

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
      reference: '',
      categorie: '',
      images: [],
      specifications: []
    });
    setErrors({});
    setActiveTab('basic');
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Gestion des images (même code que précédemment)
  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { 
        url_image: '', 
        est_principale: prev.images.length === 0,
        ordre: prev.images.length 
      }]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index).map((img, i) => ({
        ...img,
        ordre: i,
        est_principale: img.est_principale && index === 0 ? false : 
                       (index === 0 && i === 0 ? true : img.est_principale)
      }))
    }));
  };

  const updateImageUrl = (index, url) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, url_image: url } : img
      )
    }));
  };

  const updateImagePrincipal = (index, isPrincipal) => {
    if (isPrincipal) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.map((img, i) => ({
          ...img,
          est_principale: i === index
        }))
      }));
    }
  };

  // Gestion des spécifications (même code que précédemment)
  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, {
        nom: '',
        description: '',
        prix: '',
        prix_promo: '',
        quantite_stock: 0,
        est_defaut: prev.specifications.length === 0,
        reference_specification: ''
      }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const updateSpecification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const isEditing = Boolean(initialData);

  const tabStyle = (tabName) => ({
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    backgroundColor: activeTab === tabName ? theme.colors.primary : 'transparent',
    color: activeTab === tabName ? theme.colors.white : theme.colors.gray[600],
    border: 'none',
    borderRadius: `${theme.borderRadius.md} ${theme.borderRadius.md} 0 0`,
    cursor: 'pointer',
    fontWeight: activeTab === tabName ? '600' : 'normal',
    transition: 'all 0.2s'
  });

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="1000px">
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '85vh',
        overflow: 'hidden' 
      }}>
        {/* En-tête fixe */}
        <div style={{ 
          borderBottom: `1px solid ${theme.colors.gray[300]}`,
          paddingBottom: theme.spacing.md,
          marginBottom: 0,
          flexShrink: 0
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: theme.colors.gray[800],
            margin: `0 0 ${theme.spacing.lg} 0`
          }}>
            {isEditing ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
          </h2>

          {/* Onglets */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${theme.colors.gray[300]}`
          }}>
            <button
              type="button"
              style={tabStyle('basic')}
              onClick={() => setActiveTab('basic')}
            >
              Informations de base
            </button>
            <button
              type="button"
              style={tabStyle('images')}
              onClick={() => setActiveTab('images')}
            >
              Images ({formData.images.length})
            </button>
            <button
              type="button"
              style={tabStyle('specifications')}
              onClick={() => setActiveTab('specifications')}
            >
              Spécifications ({formData.specifications.length})
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: `${theme.spacing.lg} 0`,
          marginBottom: theme.spacing.lg
        }}>
          <form onSubmit={handleSubmit}>
            {/* Onglet Informations de base */}
            {activeTab === 'basic' && (
              <div>
                <Input
                  label="Nom du produit"
                  placeholder="Saisissez le nom de votre produit"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  error={errors.nom}
                  required
                  disabled={isLoading}
                />

                <Textarea
                  label="Description"
                  placeholder="Décrivez votre produit, ses caractéristiques et avantages"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  error={errors.description}
                  required
                  rows={4}
                  disabled={isLoading}
                />

                <Input
                  label="Référence"
                  placeholder="Code ou référence unique du produit"
                  value={formData.reference}
                  onChange={(e) => handleChange('reference', e.target.value)}
                  error={errors.reference}
                  required
                  disabled={isLoading}
                />

                {/* ✅ NOUVEAU : SELECT POUR CATÉGORIE */}
                <div style={{ marginBottom: theme.spacing.lg }}>
                  <label style={{
                    display: 'block',
                    marginBottom: theme.spacing.sm,
                    fontWeight: '500',
                    color: theme.colors.gray[700]
                  }}>
                    Catégorie *
                  </label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => handleChange('categorie', e.target.value)}
                    disabled={isLoading || categoriesLoading}
                    style={{
                      width: '100%',
                      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                      border: `1px solid ${errors.categorie ? '#dc2626' : theme.colors.gray[300]}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: theme.colors.white,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">
                      {categoriesLoading ? 'Chargement...' : 'Sélectionnez une catégorie'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom}
                      </option>
                    ))}
                  </select>
                  {errors.categorie && (
                    <div style={{
                      color: '#dc2626',
                      fontSize: '12px',
                      marginTop: theme.spacing.xs
                    }}>
                      {errors.categorie}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Onglet Images - même code que précédemment */}
            {activeTab === 'images' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.lg,
                  padding: `0 ${theme.spacing.md}`
                }}>
                  <h3 style={{ margin: 0, color: theme.colors.gray[700] }}>
                    Images du produit
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addImage}
                    disabled={isLoading}
                  >
                    <PlusIcon size={16} />
                    Ajouter une image
                  </Button>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: theme.spacing.lg,
                  padding: `0 ${theme.spacing.md}`
                }}>
                  {formData.images.map((image, index) => (
                    <ImageUpload
                      key={index}
                      label={`Image ${index + 1}`}
                      value={image.url_image}
                      onChange={(url) => updateImageUrl(index, url)}
                      onRemove={() => removeImage(index)}
                      isPrincipal={image.est_principale}
                      onPrincipalChange={(isPrincipal) => updateImagePrincipal(index, isPrincipal)}
                      disabled={isLoading}
                    />
                  ))}
                </div>

                {formData.images.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: theme.spacing.xl,
                    color: theme.colors.gray[500],
                    border: `2px dashed ${theme.colors.gray[300]}`,
                    borderRadius: theme.borderRadius.md,
                    margin: `0 ${theme.spacing.md}`
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>🖼️</div>
                    <div style={{ marginBottom: theme.spacing.sm }}>Aucune image ajoutée</div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addImage}
                      disabled={isLoading}
                    >
                      Ajouter la première image
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Spécifications - même code que précédemment */}
            {activeTab === 'specifications' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.lg,
                  padding: `0 ${theme.spacing.md}`
                }}>
                  <h3 style={{ margin: 0, color: theme.colors.gray[700] }}>
                    Spécifications du produit
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addSpecification}
                    disabled={isLoading}
                  >
                    <PlusIcon size={16} />
                    Ajouter une spécification
                  </Button>
                </div>

                <div style={{ 
                  padding: `0 ${theme.spacing.md}`
                }}>
                  {formData.specifications.map((spec, index) => (
                    <div
                      key={index}
                      style={{
                        border: `1px solid ${theme.colors.gray[300]}`,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing.md,
                        marginBottom: theme.spacing.md
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: theme.spacing.sm
                      }}>
                        <span style={{ fontWeight: '500' }}>Spécification {index + 1}</span>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeSpecification(index)}
                        >
                          <DeleteIcon size={14} />
                        </Button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                        <Input
                          label="Nom"
                          placeholder="Nom de cette variante ou spécification"
                          value={spec.nom}
                          onChange={(e) => updateSpecification(index, 'nom', e.target.value)}
                          error={errors[`spec_nom_${index}`]}
                          required
                          disabled={isLoading}
                        />

                        <Input
                          label="Référence"
                          placeholder="Référence de cette spécification"
                          value={spec.reference_specification}
                          onChange={(e) => updateSpecification(index, 'reference_specification', e.target.value)}
                          disabled={isLoading}
                        />

                        <Input
                          label="Prix (MRU)"
                          type="number"
                          step="0.01"
                          placeholder="Prix en Ouguiya"
                          value={spec.prix}
                          onChange={(e) => updateSpecification(index, 'prix', e.target.value)}
                          error={errors[`spec_prix_${index}`]}
                          required
                          disabled={isLoading}
                        />

                        <Input
                          label="Prix promo (MRU)"
                          type="number"
                          step="0.01"
                          placeholder="Prix promotionnel (optionnel)"
                          value={spec.prix_promo}
                          onChange={(e) => updateSpecification(index, 'prix_promo', e.target.value)}
                          disabled={isLoading}
                        />

                        <Input
                          label="Stock"
                          type="number"
                          placeholder="Quantité disponible"
                          value={spec.quantite_stock}
                          onChange={(e) => updateSpecification(index, 'quantite_stock', parseInt(e.target.value) || 0)}
                          disabled={isLoading}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, marginTop: theme.spacing.lg }}>
                          <input
                            type="checkbox"
                            id={`defaut_${index}`}
                            checked={spec.est_defaut}
                            onChange={(e) => updateSpecification(index, 'est_defaut', e.target.checked)}
                            disabled={isLoading}
                          />
                          <label htmlFor={`defaut_${index}`}>Spécification par défaut</label>
                        </div>
                      </div>

                      <Textarea
                        label="Description"
                        placeholder="Détails spécifiques à cette variante"
                        value={spec.description}
                        onChange={(e) => updateSpecification(index, 'description', e.target.value)}
                        rows={2}
                        disabled={isLoading}
                      />
                    </div>
                  ))}

                  {formData.specifications.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      padding: theme.spacing.xl,
                      color: theme.colors.gray[500],
                      border: `2px dashed ${theme.colors.gray[300]}`,
                      borderRadius: theme.borderRadius.md
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>📋</div>
                      <div style={{ marginBottom: theme.spacing.sm }}>Aucune spécification ajoutée</div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSpecification}
                        disabled={isLoading}
                      >
                        Ajouter la première spécification
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Boutons fixes en bas */}
        <div style={{
          borderTop: `1px solid ${theme.colors.gray[300]}`,
          padding: `${theme.spacing.lg} ${theme.spacing.md} 0`,
          backgroundColor: theme.colors.white,
          flexShrink: 0
        }}>
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            justifyContent: 'flex-end'
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
              onClick={handleSubmit}
            >
              {isLoading ? 'Traitement...' : (isEditing ? 'Modifier' : 'Créer')}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductFormImproved;