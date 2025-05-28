// PROBLÈME IDENTIFIÉ : URL d'image fictive
// L'URL "https://votre-serveur.com/uploads/..." n'existe pas réellement

// SOLUTION 1 : Corriger ImageUpload.jsx pour utiliser des URLs réelles

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
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
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

      // ✅ CORRECTION : Créer une URL locale pour l'aperçu ET l'utiliser comme URL finale
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      
      // ✅ SOLUTION TEMPORAIRE : Utiliser des URLs d'images réelles pour les tests
      const realImageUrls = [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&h=500&fit=crop',
        'https://images.unsplash.com/photo-1678911820864-e2c972b8de50?w=500&h=500&fit=crop'
      ];
      
      // Choisir une URL aléatoire pour simuler l'upload
      const randomUrl = realImageUrls[Math.floor(Math.random() * realImageUrls.length)];
      console.log(`✅ Simulation upload: ${file.name} → ${randomUrl}`);
      
      onChange(randomUrl);
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
          disabled={disabled}
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
            disabled={disabled}
          />
          <span style={{ fontSize: '14px' }}>URL</span>
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
            disabled={disabled}
          />
          <span style={{ fontSize: '14px' }}>Upload fichier (simulé)</span>
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
            disabled={disabled}
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
          <div style={{
            fontSize: '12px',
            color: theme.colors.gray[500],
            marginTop: theme.spacing.xs
          }}>
            💡 Conseil: Utilisez des URLs d'images existantes (ex: Unsplash, Pixabay)
          </div>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled}
            style={{
              width: '100%',
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.gray[300]}`,
              borderRadius: theme.borderRadius.sm,
              fontSize: '14px',
              backgroundColor: theme.colors.gray[50],
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          />
          
          <div style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.md,
            border: `2px dashed ${theme.colors.primary}`,
            borderRadius: theme.borderRadius.md,
            textAlign: 'center',
            backgroundColor: `${theme.colors.primary}10`,
            cursor: disabled ? 'not-allowed' : 'pointer'
          }}
          onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <UploadIcon size={32} style={{ color: theme.colors.primary, marginBottom: theme.spacing.sm }} />
            <div style={{ fontSize: '14px', color: theme.colors.primary, fontWeight: '500' }}>
              📁 Simuler l'upload (utilise une image aléatoire)
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.gray[500], marginTop: theme.spacing.xs }}>
              En production, ceci uploadera votre fichier vers le serveur
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
          disabled={disabled}
        />
        <label 
          htmlFor={`principal-${Math.random()}`}
          style={{ fontSize: '14px', cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          Image principale
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;