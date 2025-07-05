// src/pages/client/ClientHomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { fetchCategories, fetchNouveautes, fetchPopulaires, ajouterProduitAuPanier } from '../../api/clientAPI';
import { theme } from '../../styles/theme';

const ClientHomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [nouveautes, setNouveautes] = useState([]);
  const [populaires, setPopulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, nouveautesRes, populairesRes] = await Promise.all([
        fetchCategories().catch(() => ({ data: { results: [] } })),
        fetchNouveautes().catch(() => ({ data: { results: [] } })),
        fetchPopulaires().catch(() => ({ data: { results: [] } }))
      ]);

      // ✅ CORRECTION: Gérer le format {count: X, results: [...]}
      
      // Catégories
      let categoriesData = [];
      if (categoriesRes.data) {
        if (categoriesRes.data.results && Array.isArray(categoriesRes.data.results)) {
          categoriesData = categoriesRes.data.results;
        } else if (Array.isArray(categoriesRes.data)) {
          categoriesData = categoriesRes.data;
        }
      }
      setCategories(categoriesData.slice(0, 6));

      // Nouveautés
      let nouveautesData = [];
      if (nouveautesRes.data) {
        if (nouveautesRes.data.results && Array.isArray(nouveautesRes.data.results)) {
          nouveautesData = nouveautesRes.data.results;
        } else if (Array.isArray(nouveautesRes.data)) {
          nouveautesData = nouveautesRes.data;
        }
      }
      setNouveautes(nouveautesData.slice(0, 8));

      // Populaires
      let populairesData = [];
      if (populairesRes.data) {
        if (populairesRes.data.results && Array.isArray(populairesRes.data.results)) {
          populairesData = populairesRes.data.results;
        } else if (Array.isArray(populairesRes.data)) {
          populairesData = populairesRes.data;
        }
      }
      setPopulaires(populairesData.slice(0, 8));

    } catch (error) {
      console.error('Erreur chargement données:', error);
      // Définir des valeurs par défaut en cas d'erreur
      setCategories([]);
      setNouveautes([]);
      setPopulaires([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (produitId) => {
    setAddingToCart(prev => new Set(prev).add(produitId));
    
    try {
      await ajouterProduitAuPanier(produitId, 1);
      // Rediriger vers le panier après ajout réussi
      navigate('/panier');
    } catch (error) {
      console.error('Erreur ajout panier:', error);
      alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(produitId);
        return newSet;
      });
    }
  };

  // Section Hero
  const HeroSection = () => (
    <section style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      padding: '80px 0',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          margin: '0 0 24px 0',
          lineHeight: '1.2'
        }}>
          Découvrez nos Produits Exceptionnels
        </h1>
        <p style={{
          fontSize: '20px',
          margin: '0 0 40px 0',
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto 40px auto'
        }}>
          Une collection unique de produits soigneusement sélectionnés pour vous offrir le meilleur
        </p>
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
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
            🛍️ Parcourir le Catalogue
          </button>
          <button
            onClick={() => navigate('/categories')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#6b7280',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#4b5563';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6b7280';
            }}
          >
            📂 Explorer les Catégories
          </button>
          <button
            onClick={() => navigate('/client-dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: '#8b5cf6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7c3aed';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#8b5cf6';
            }}
          >
            📊 Mon Dashboard
          </button>
        </div>
      </div>
    </section>
  );

  // Section Catégories
  const CategoriesSection = () => (
    <section style={{
      padding: '80px 0',
      backgroundColor: '#ffffff'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Nos Catégories
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: 0
          }}>
            Explorez notre large gamme de produits
          </p>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: '200px',
                backgroundColor: '#f3f4f6',
                borderRadius: '16px',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {categories.length > 0 ? categories.map(category => {
              // Fonction pour obtenir l'icône basée sur le nom de la catégorie
              const getCategoryIcon = (categoryName) => {
                const name = categoryName.toLowerCase();
                if (name.includes('électronique') || name.includes('electronique') || name.includes('tech')) return '📱';
                if (name.includes('vêtement') || name.includes('vetement') || name.includes('mode') || name.includes('textile')) return '👕';
                if (name.includes('maison') || name.includes('jardin') || name.includes('déco') || name.includes('deco')) return '🏠';
                if (name.includes('sport') || name.includes('loisir') || name.includes('fitness')) return '⚽';
                if (name.includes('livre') || name.includes('éducation') || name.includes('education')) return '📚';
                if (name.includes('beauté') || name.includes('beaute') || name.includes('santé') || name.includes('sante') || name.includes('cosmétique')) return '💄';
                if (name.includes('alimentaire') || name.includes('nourriture') || name.includes('cuisine')) return '🍎';
                if (name.includes('automobile') || name.includes('voiture') || name.includes('auto')) return '🚗';
                if (name.includes('jouet') || name.includes('enfant') || name.includes('bébé') || name.includes('bebe')) return '🧸';
                if (name.includes('bijou') || name.includes('accessoire')) return '💎';
                return '📦'; // Icône par défaut
              };

              return (
                <div
                  key={category.id}
                  onClick={() => navigate(`/categories/${category.id}`)}
                  style={{
                    padding: '32px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e5e7eb'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                  }}>
                    {getCategoryIcon(category.nom)}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  }}>
                    {category.nom}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {category.description || 'Découvrez cette catégorie'}
                  </p>
                </div>
              );
            }) : (
              // Catégories par défaut si pas de données
              [
                { id: 1, nom: 'Électronique', icon: '📱' },
                { id: 2, nom: 'Vêtements', icon: '👕' },
                { id: 3, nom: 'Maison & Jardin', icon: '🏠' },
                { id: 4, nom: 'Sport & Loisirs', icon: '⚽' },
                { id: 5, nom: 'Livres', icon: '📚' },
                { id: 6, nom: 'Beauté & Santé', icon: '💄' }
              ].map(category => (
                <div
                  key={category.id}
                  onClick={() => navigate(`/categories/${category.id}`)}
                  style={{
                    padding: '32px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e5e7eb'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                  }}>
                    {category.icon}
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  }}>
                    {category.nom}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Découvrez cette catégorie
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );

  // Section Produits (réutilisable)
  const ProductsSection = ({ title, products, emptyMessage }) => (
    <section style={{
      padding: '80px 0',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px'
        }}>
          <div>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              {title}
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: 0
            }}>
              {emptyMessage}
            </p>
          </div>
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
            Voir tout →
          </button>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                height: '300px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {products.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/produits/${product.id}`)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  height: '200px',
                  backgroundColor: '#f3f4f6',
                  backgroundImage: product.image_principale ? `url(${product.image_principale})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#9ca3af'
                }}>
                  {!product.image_principale && '📦'}
                </div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 8px 0',
                    lineHeight: '1.4'
                  }}>
                    {product.nom}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 12px 0',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {product.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#667eea'
                      }}>
                        {product.prix_min} MRU
                      </span>
                      {product.prix_max !== product.prix_min && (
                        <span style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          marginLeft: '8px'
                        }}>
                          - {product.prix_max} MRU
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      disabled={addingToCart.has(product.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 20px',
                        backgroundColor: addingToCart.has(product.id) ? '#9ca3af' : '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: addingToCart.has(product.id) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        gap: '6px',
                        boxShadow: addingToCart.has(product.id) ? 'none' : '0 3px 12px rgba(37, 99, 235, 0.3)',
                        transform: 'translateY(0)'
                      }}
                      onMouseEnter={(e) => {
                        if (!addingToCart.has(product.id)) {
                          e.target.style.backgroundColor = '#1d4ed8';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 5px 16px rgba(37, 99, 235, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!addingToCart.has(product.id)) {
                          e.target.style.backgroundColor = '#2563eb';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 3px 12px rgba(37, 99, 235, 0.3)';
                        }
                      }}
                    >
                      {addingToCart.has(product.id) ? '⏳' : '🛒'} Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '60px 0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📦</div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              Aucun produit disponible
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '0 0 24px 0'
            }}>
              Cette section ne contient pas encore de produits.
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
              🔍 Voir tous les produits
            </button>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <ClientLayout currentPage="home">
      <HeroSection />
      <CategoriesSection />
      <ProductsSection 
        title="Nouveautés" 
        products={nouveautes}
        emptyMessage="Découvrez nos derniers produits"
      />
      <ProductsSection 
        title="Produits Populaires" 
        products={populaires}
        emptyMessage="Les produits les plus appréciés par nos clients"
      />
    </ClientLayout>
  );
};

export default ClientHomePage;