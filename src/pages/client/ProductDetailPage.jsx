// src/pages/client/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { fetchProduitById, fetchAvisProduit, ajouterAvis, toggleFavori, ajouterProduitAuPanier } from '../../api/clientAPI';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  
  // État pour les avis
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ note: 5, commentaire: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadProduct();
    loadAvis();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchProduitById(id);
      console.log('Product response:', response);
      console.log('Response data structure:', JSON.stringify(response.data, null, 2));
      
      let productData = null;
      
      // Gérer différents formats de réponse de l'API
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          productData = response.data.results[0];
        } else if (response.data.id) {
          productData = response.data;
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          productData = response.data[0];
        }
      }
      
      if (!productData) {
        setError('Produit non trouvé');
        return;
      }
      
      console.log('Final product data:', productData);
      console.log('Product images:', productData.images);
      console.log('Product specifications:', productData.specifications);
      
      setProduct(productData);
      
      // Sélectionner la première spécification par défaut si disponible
      if (productData.specifications && productData.specifications.length > 0) {
        const defaultSpec = productData.specifications.find(s => s.est_defaut) || productData.specifications[0];
        console.log('Selected default spec:', defaultSpec);
        setSelectedSpec(defaultSpec);
      }
      
    } catch (error) {
      console.error('Erreur chargement produit:', error);
      setError('Erreur lors du chargement du produit');
    } finally {
      setLoading(false);
    }
  };

  const loadAvis = async () => {
    try {
      const response = await fetchAvisProduit(id);
      console.log('Avis response:', response); // Debug
      
      let avisData = [];
      
      // Gérer différents formats de réponse
      if (response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          avisData = response.data.results;
        } else if (Array.isArray(response.data)) {
          avisData = response.data;
        }
      }
      
      setAvis(avisData);
    } catch (error) {
      console.error('Erreur chargement avis:', error);
      setAvis([]); // Garder un tableau vide si échec
    }
  };

  const handleAddToCart = async () => {
    if (!product.id) return;
    
    setAddingToCart(true);
    
    try {
      // Utiliser l'API d'ajout rapide au panier
      await ajouterProduitAuPanier(product.id, quantity);
      
      // Rediriger vers le panier après ajout réussi
      navigate('/panier');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavori(product.id);
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Erreur favori:', error);
      alert('Fonctionnalité non disponible pour le moment');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.commentaire.trim()) {
      alert('Veuillez saisir un commentaire');
      return;
    }
    
    setSubmittingReview(true);
    
    try {
      await ajouterAvis({
        produit: product.id,
        note: newReview.note,
        commentaire: newReview.commentaire
      });
      
      setNewReview({ note: 5, commentaire: '' });
      setShowReviewForm(false);
      loadAvis(); // Recharger les avis
      alert('Avis ajouté avec succès !');
    } catch (error) {
      console.error('Erreur ajout avis:', error);
      alert('Erreur lors de l\'ajout de l\'avis');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#f59e0b' : '#d1d5db' }}>
        ⭐
      </span>
    ));
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString() : price;
  };

  const getProductImages = () => {
    let images = [];
    
    console.log('🖼️ === DÉBUT TRAITEMENT IMAGES ===');
    console.log('Product data for images:', product);
    
    // Étape 1: Ajouter l'image principale du produit si disponible
    if (product.image_principale) {
      console.log('✅ Image principale trouvée:', product.image_principale);
      images.push({ 
        id: 'main', 
        url_image: product.image_principale, 
        est_principale: true,
        source: 'produit',
        titre: 'Image principale'
      });
    } else {
      console.log('❌ Aucune image principale trouvée');
    }
    
    // Étape 2: Ajouter les images du produit
    if (product.images && Array.isArray(product.images)) {
      console.log(`✅ ${product.images.length} images produit trouvées:`, product.images);
      const productImages = product.images.map((img, index) => {
        console.log(`  - Image ${index + 1}:`, img);
        return {
          id: img.id || `product-img-${index}`,
          url_image: img.url_image,
          est_principale: img.est_principale || false,
          ordre: img.ordre || 0,
          source: 'produit',
          titre: `Image produit ${index + 1}`,
          ...img
        };
      });
      images = [...images, ...productImages];
    } else {
      console.log('❌ Aucune image produit trouvée ou structure incorrecte');
      console.log('Structure images reçue:', typeof product.images, product.images);
    }
    
    // Étape 3: Traiter les spécifications et leurs images
    if (product.specifications && Array.isArray(product.specifications)) {
      console.log(`📋 ${product.specifications.length} spécifications trouvées`);
      
      product.specifications.forEach((spec, specIndex) => {
        console.log(`🔧 Traitement spécification ${specIndex + 1}:`, spec);
        
        // Vérifier si la spécification a des images
        if (spec.images && Array.isArray(spec.images)) {
          console.log(`  ✅ ${spec.images.length} images trouvées pour ${spec.nom}:`, spec.images);
          const specImages = spec.images.map((img, index) => {
            console.log(`    - Image spec ${index + 1}:`, img);
            return {
              id: img.id || `spec-${spec.id}-img-${index}`,
              url_image: img.url_image,
              est_principale: img.est_principale || false,
              ordre: img.ordre || 0,
              source: 'specification',
              spec_id: spec.id,
              spec_nom: spec.nom,
              titre: img.titre || `${spec.nom} - Image ${index + 1}`,
              ...img
            };
          });
          images = [...images, ...specImages];
        } else {
          console.log(`  ❌ Aucune image pour spécification ${spec.nom}`);
          console.log(`  Structure images spec:`, typeof spec.images, spec.images);
        }
      });
    } else {
      console.log('❌ Aucune spécification trouvée');
      console.log('Structure specifications reçue:', typeof product.specifications, product.specifications);
    }
    
    console.log(`📊 Total images avant tri: ${images.length}`);
    
    // Étape 4: Trier les images par ordre puis par est_principale
    images.sort((a, b) => {
      const ordreA = a.ordre || 0;
      const ordreB = b.ordre || 0;
      if (ordreA !== ordreB) return ordreA - ordreB;
      if (a.est_principale && !b.est_principale) return -1;
      if (!a.est_principale && b.est_principale) return 1;
      return 0;
    });
    
    // Étape 5: Supprimer les doublons
    const uniqueImages = images.filter((image, index, self) => {
      const url = image.url_image;
      if (!url) {
        console.log('⚠️ Image sans URL ignorée:', image);
        return false;
      }
      return index === self.findIndex(img => img.url_image === url);
    });
    
    console.log(`🎯 Images finales (${uniqueImages.length}):`, uniqueImages);
    console.log('🖼️ === FIN TRAITEMENT IMAGES ===');
    
    return uniqueImages;
  };

  // Handler pour changer de spécification et mettre à jour les images
  const handleSpecChange = (spec) => {
    setSelectedSpec(spec);
    
    // Basculer automatiquement vers l'image de la spécification sélectionnée si disponible
    const productImages = getProductImages();
    const specImageIndex = productImages.findIndex(img => 
      img.source === 'specification' && img.spec_id === spec.id
    );
    
    if (specImageIndex !== -1) {
      setSelectedImageIndex(specImageIndex);
    }
  };

  if (loading) {
    return (
      <ClientLayout currentPage="products">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px',
          textAlign: 'center'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Chargement du produit...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (error || !product) {
    return (
      <ClientLayout currentPage="products">
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
            {error || 'Produit non trouvé'}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate('/produits')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            ← Retour au catalogue
          </button>
        </div>
      </ClientLayout>
    );
  }

  const productImages = getProductImages();

  return (
    <ClientLayout currentPage="products">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span 
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', color: '#3b82f6' }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Accueil
          </span>
          <span>→</span>
          <span 
            onClick={() => navigate('/produits')}
            style={{ cursor: 'pointer', color: '#3b82f6' }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Produits
          </span>
          <span>→</span>
          <span style={{ color: '#1f2937' }}>{product.nom}</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          marginBottom: '48px'
        }}>
          {/* Images produit */}
          <div>
            {/* Image principale */}
            <div style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              marginBottom: '16px',
              overflow: 'hidden',
              backgroundImage: productImages[selectedImageIndex]?.url_image ? 
                `url(${productImages[selectedImageIndex].url_image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '64px',
              color: '#9ca3af',
              border: '1px solid #e5e7eb',
              position: 'relative'
            }}>
              {!productImages[selectedImageIndex]?.url_image && '📦'}
              
              {/* Badge pour l'image principale */}
              {productImages[selectedImageIndex]?.est_principale && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  ⭐ Image principale
                </div>
              )}
              
              {/* Badge pour les images de spécification */}
              {productImages[selectedImageIndex]?.source === 'specification' && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  🔧 {productImages[selectedImageIndex].spec_nom}
                </div>
              )}
              
              {/* Navigation entre images */}
              {productImages.length > 1 && (
                <>
                  {selectedImageIndex > 0 && (
                    <button
                      onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0,0,0,0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0,0,0,0.5)';
                      }}
                    >
                      ←
                    </button>
                  )}
                  
                  {selectedImageIndex < productImages.length - 1 && (
                    <button
                      onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(0,0,0,0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(0,0,0,0.5)';
                      }}
                    >
                      →
                    </button>
                  )}
                </>
              )}
              
              {/* Indicateur position image */}
              {productImages.length > 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {selectedImageIndex + 1} / {productImages.length}
                </div>
              )}
            </div>

            {/* Miniatures */}
            {productImages.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px'
              }}>
                {productImages.map((image, index) => (
                  <div
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                      backgroundImage: image.url_image ? `url(${image.url_image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#9ca3af',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedImageIndex !== index) {
                        e.target.style.borderColor = '#60a5fa';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedImageIndex !== index) {
                        e.target.style.borderColor = '#e5e7eb';
                      }
                    }}
                    title={image.titre || 'Image du produit'}
                  >
                    {!image.url_image && '📦'}
                    
                    {/* Badge pour indiquer la source de l'image */}
                    {image.source === 'specification' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        fontSize: '8px',
                        padding: '1px 3px',
                        borderRadius: '2px',
                        fontWeight: '500'
                      }}>
                        SPEC
                      </div>
                    )}
                    
                    {/* Badge pour l'image principale */}
                    {image.est_principale && (
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontSize: '8px',
                        padding: '1px 3px',
                        borderRadius: '2px',
                        fontWeight: '500'
                      }}>
                        ⭐
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Informations sur l'image sélectionnée */}
            {productImages[selectedImageIndex] && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                backgroundColor: productImages[selectedImageIndex].source === 'specification' ? '#f0f4ff' : '#f0fdf4',
                borderRadius: '6px',
                fontSize: '12px',
                color: productImages[selectedImageIndex].source === 'specification' ? '#3b82f6' : '#10b981',
                textAlign: 'center'
              }}>
                {productImages[selectedImageIndex].source === 'specification' ? (
                  <>📷 Image de la variante : {productImages[selectedImageIndex].spec_nom}</>
                ) : (
                  <>📷 {productImages[selectedImageIndex].titre || 'Image du produit'}</>
                )}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                lineHeight: '1.2'
              }}>
                {product.nom}
              </h1>
              
              <button
                onClick={handleToggleFavorite}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isFavorite ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Note et avis */}
            {(product.note_moyenne > 0 || avis.length > 0) && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {renderStars(Math.round(product.note_moyenne || 0))}
                  <span style={{ fontWeight: '600', marginLeft: '8px', color: '#1f2937' }}>
                    {product.note_moyenne ? product.note_moyenne.toFixed(1) : '0.0'}
                  </span>
                </div>
                <span style={{ color: '#6b7280' }}>
                  ({product.nombre_avis || avis.length} avis)
                </span>
              </div>
            )}

            {/* Prix */}
            <div style={{ marginBottom: '24px' }}>
              {selectedSpec ? (
                <div>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#3b82f6',
                    marginBottom: '4px'
                  }}>
                    {formatPrice(selectedSpec.prix_promo || selectedSpec.prix)} MRU
                  </div>
                  {selectedSpec.prix_promo && (
                    <div style={{
                      fontSize: '18px',
                      color: '#9ca3af',
                      textDecoration: 'line-through'
                    }}>
                      {formatPrice(selectedSpec.prix)} MRU
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {product.prix_min === product.prix_max ? (
                    <div style={{
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#3b82f6'
                    }}>
                      {formatPrice(product.prix_min)} MRU
                    </div>
                  ) : (
                    <div style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#3b82f6'
                    }}>
                      {formatPrice(product.prix_min)} - {formatPrice(product.prix_max)} MRU
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#4b5563',
              marginBottom: '32px'
            }}>
              {product.description}
            </p>

            {/* Spécifications si disponibles */}
            {product.specifications && product.specifications.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '16px'
                }}>
                  Choisir une variante :
                </h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {product.specifications.map(spec => (
                    <div
                      key={spec.id}
                      onClick={() => handleSpecChange(spec)}
                      style={{
                        padding: '16px',
                        border: selectedSpec?.id === spec.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: selectedSpec?.id === spec.id ? '#f0f4ff' : '#ffffff',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSpec?.id !== spec.id) {
                          e.target.style.borderColor = '#60a5fa';
                          e.target.style.backgroundColor = '#fafbff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSpec?.id !== spec.id) {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.backgroundColor = '#ffffff';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                            {spec.nom}
                            {/* Indicateur d'images disponibles */}
                            {spec.images && spec.images.length > 0 && (
                              <span style={{
                                marginLeft: '8px',
                                fontSize: '12px',
                                backgroundColor: '#3b82f6',
                                color: '#ffffff',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                📷 {spec.images.length} image{spec.images.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: spec.quantite_stock > 0 ? '#10b981' : '#ef4444'
                          }}>
                            {spec.quantite_stock > 0 ? 
                              `En stock (${spec.quantite_stock})` : 
                              'Rupture de stock'
                            }
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: '#3b82f6'
                          }}>
                            {formatPrice(spec.prix_promo || spec.prix)} MRU
                          </div>
                          {spec.prix_promo && (
                            <div style={{
                              fontSize: '14px',
                              color: '#9ca3af',
                              textDecoration: 'line-through'
                            }}>
                              {formatPrice(spec.prix)} MRU
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantité et ajout panier */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              marginBottom: '32px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#374151'
                }}>
                  Quantité :
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {[...Array(Math.min(10, selectedSpec?.quantite_stock || 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || (selectedSpec && selectedSpec.quantite_stock === 0)}
                style={{
                  flex: 1,
                  width: '100%',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: addingToCart ? '#9ca3af' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  cursor: addingToCart ? 'not-allowed' : 'pointer',
                  transform: 'translateY(0)',
                  boxShadow: 'none',
                  fontSize: '16px',
                  minHeight: '50px'
                }}
                onMouseEnter={(e) => {
                  if (!addingToCart) {
                    e.target.style.backgroundColor = '#1d4ed8';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!addingToCart) {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {addingToCart ? '⏳ Ajout en cours...' : '🛒 Ajouter au panier'}
              </button>
            </div>

            {/* Informations supplémentaires */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6b7280',
              border: '1px solid #e5e7eb'
            }}>
              {product.categorie_nom && (
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#374151' }}>Catégorie :</strong> {product.categorie_nom}
                </div>
              )}
              {product.commercant_nom && (
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: '#374151' }}>Vendeur :</strong> {product.commercant_nom}
                </div>
              )}
              <div>
                <strong style={{ color: '#374151' }}>Livraison :</strong> 2-3 jours ouvrés
              </div>
            </div>
          </div>
        </div>

        {/* Section Avis */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Avis clients ({avis.length})
            </h2>
            
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#10b981';
              }}
            >
              ✏️ Donner mon avis
            </button>
          </div>

          {/* Formulaire d'avis */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#374151'
                }}>
                  Note :
                </label>
                <select
                  value={newReview.note}
                  onChange={(e) => setNewReview({...newReview, note: parseInt(e.target.value)})}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {[5,4,3,2,1].map(note => (
                    <option key={note} value={note}>
                      {note} étoile{note > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#374151'
                }}>
                  Commentaire :
                </label>
                <textarea
                  value={newReview.commentaire}
                  onChange={(e) => setNewReview({...newReview, commentaire: e.target.value})}
                  placeholder="Partagez votre expérience avec ce produit..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={submittingReview}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: submittingReview ? '#9ca3af' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: submittingReview ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!submittingReview) {
                      e.target.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submittingReview) {
                      e.target.style.backgroundColor = '#3b82f6';
                    }
                  }}
                >
                  {submittingReview ? '⏳ Publication...' : 'Publier l\'avis'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Liste des avis */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {avis.length > 0 ? avis.map(avisItem => (
              <div key={avisItem.id} style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div>
                    <div style={{ 
                      fontWeight: '600', 
                      marginBottom: '4px',
                      color: '#1f2937'
                    }}>
                      {avisItem.client_nom || avisItem.nom_client || 'Client anonyme'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {renderStars(avisItem.note)}
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {avisItem.date_creation ? 
                          new Date(avisItem.date_creation).toLocaleDateString('fr-FR') :
                          'Date inconnue'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#4b5563',
                  margin: 0
                }}>
                  {avisItem.commentaire}
                </p>
              </div>
            )) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px'
                }}>
                  Aucun avis pour ce produit
                </h3>
                <p style={{ fontSize: '14px' }}>
                  Soyez le premier à donner votre avis !
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '16px'
          }}>
            Produits similaires
          </h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Découvrez d'autres produits qui pourraient vous intéresser
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/produits')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              Voir plus de produits
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ProductDetailPage;