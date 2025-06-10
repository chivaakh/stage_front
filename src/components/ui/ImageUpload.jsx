// src/components/ui/ImageUpload.jsx - VERSION CORRIGÉE
import { useState, useRef } from 'react';
import { Button } from './index';
import { DeleteIcon } from '../icons';
import { theme } from '../../styles/theme';

const UploadIcon = ({ size = 16, ...props }) => (
  <svg 
    style={{ width: `${size}px`, height: `${size}px` }} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
    />
  </svg>
);

const ImageUpload = ({ 
  label, 
  value, 
  onChange, 
  onRemove, 
  isPrincipal = false, 
  onPrincipalChange,
  disabled = false 
}) => {
  const [preview, setPreview] = useState(value || '');
  const [uploadMethod, setUploadMethod] = useState('url');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ FONCTION D'UPLOAD RÉEL
  const uploadFileToServer = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setIsUploading(true);
      
      // ✅ REMPLACEZ cette URL par votre endpoint d'upload Django
      const response = await fetch('http://localhost:8000/api/upload-image/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur upload: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Image uploadée avec succès:', data);
      
      // Retourner l'URL de l'image uploadée
      return data.url || data.image_url;
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      
      // ✅ FALLBACK : Créer URL locale temporaire
      const localUrl = URL.createObjectURL(file);
      console.log('⚠️ Fallback: Utilisation URL locale:', localUrl);
      return localUrl;
      
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation du fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux (max 5MB)');
      event.target.value = '';
      return;
    }

    try {
      console.log('📤 Upload du fichier:', file.name);
      
      // ✅ UPLOAD RÉEL du fichier
      const imageUrl = await uploadFileToServer(file);
      
      // Mettre à jour l'aperçu ET l'URL finale
      setPreview(imageUrl);
      onChange(imageUrl);
      
      console.log('✅ Fichier traité, URL finale:', imageUrl);
      
    } catch (error) {
      console.error('❌ Erreur traitement fichier:', error);
      alert('Erreur lors de l\'upload de l\'image');
    }
  };

  const handleUrlChange = (url) => {
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div style={{
      border: `1px solid ${theme.colors.gray[300]}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.white
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md
      }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
          {label}
        </h4>
        
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={handleRemove}
          disabled={disabled || isUploading}
          title="Supprimer cette image"
        >
          <DeleteIcon size={14} />
          Supprimer
        </Button>
      </div>

      {/* Sélecteur de méthode d'upload */}
      <div style={{
        display: 'flex',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          cursor: 'pointer'
        }}>
          <input
            type="radio"
            name={`upload-method-${Math.random()}`}
            value="url"
            checked={uploadMethod === 'url'}
            onChange={(e) => setUploadMethod(e.target.value)}
            disabled={disabled || isUploading}
          />
          <span style={{ fontSize: '14px' }}>URL d'image</span>
        </label>
        
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs,
          cursor: 'pointer'
        }}>
          <input
            type="radio"
            name={`upload-method-${Math.random()}`}
            value="file"
            checked={uploadMethod === 'file'}
            onChange={(e) => setUploadMethod(e.target.value)}
            disabled={disabled || isUploading}
          />
          <span style={{ fontSize: '14px' }}>Upload depuis PC</span>
        </label>
      </div>

      {/* Zone d'upload selon la méthode */}
      {uploadMethod === 'url' ? (
        <div>
          <input
            type="url"
            placeholder="https://exemple.com/image.jpg"
            value={value || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
            disabled={disabled || isUploading}
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: '14px',
              backgroundColor: theme.colors.gray[50],
              cursor: disabled || isUploading ? 'not-allowed' : 'pointer'
            }}
          />
          
          <div style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.md,
            border: `2px dashed ${theme.colors.primary}`,
            borderRadius: theme.borderRadius.md,
            textAlign: 'center',
            backgroundColor: `${theme.colors.primary}10`,
            cursor: disabled || isUploading ? 'not-allowed' : 'pointer'
          }}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          >
            <UploadIcon size={32} style={{ color: theme.colors.primary, marginBottom: theme.spacing.sm }} />
            <div style={{ fontSize: '14px', color: theme.colors.primary, fontWeight: '500' }}>
              {isUploading ? '⏳ Upload en cours...' : '📁 Cliquez pour sélectionner votre image'}
            </div>
          </div>
        </div>
      )}

      {/* Aperçu de l'image */}
      {(preview || value) && (
        <div style={{ marginTop: theme.spacing.md }}>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: theme.spacing.sm }}>
            Aperçu :
          </div>
          <div style={{
            width: '150px',
            height: '150px',
            border: `1px solid ${theme.colors.gray[300]}`,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img
              src={preview || value}
              alt="Aperçu"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onLoad={() => {
                console.log('✅ Image preview chargée:', preview || value);
              }}
              onError={(e) => {
                console.error('❌ Erreur chargement preview:', preview || value);
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: theme.colors.gray[100],
              color: theme.colors.gray[400],
              fontSize: '12px',
              textAlign: 'center'
            }}>
              ❌ Erreur de chargement
            </div>
          </div>
        </div>
      )}

      {/* Checkbox image principale */}
      <div style={{ 
        marginTop: theme.spacing.md,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm 
      }}>
        <input
          type="checkbox"
          id={`principal-${Math.random()}`}
          checked={isPrincipal}
          onChange={(e) => onPrincipalChange && onPrincipalChange(e.target.checked)}
          disabled={disabled || isUploading}
        />
        <label 
          htmlFor={`principal-${Math.random()}`}
          style={{ fontSize: '14px', cursor: disabled || isUploading ? 'not-allowed' : 'pointer' }}
        >
          Image principale
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;