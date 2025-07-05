// src/pages/client/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientLayout from '../../components/client/layout/ClientLayout';
import { fetchCategories } from '../../api/clientAPI';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

// 1. CORRIGEZ la fonction qui charge les catégories :
const loadCategories = async () => {
  try {
    setLoading(true);
    const response = await fetchCategories();
    console.log('Categories response:', response); // Debug
    
    // ✅ CORRECTION: Gérer le format { count: X, results: [] }
    let categoriesData = [];
    if (response.data) {
      if (response.data.results && Array.isArray(response.data.results)) {
        categoriesData = response.data.results;
      } else if (Array.isArray(response.data)) {
        categoriesData = response.data;
      }
    }
    
    setCategories(categoriesData);
  } catch (error) {
    console.error('Erreur chargement catégories:', error);
    setCategories([]); // ✅ Toujours définir comme tableau vide
  } finally {
    setLoading(false);
  }
};
const filteredCategories = Array.isArray(categories)
  ? categories.filter(category =>
      category.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

const totalProduits = Array.isArray(categories)
  ? categories.reduce((sum, cat) => sum + (cat.nombre_produits || 0), 0)
  : 0;

  return (
    <ClientLayout currentPage="categories">
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px'
      }}>
        {/* En-tête */}
        <div style={{
          textAlign: 'center',
          marginBottom: '48px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '32px',
              filter: 'brightness(0) invert(1)'
            }}>
              📂
            </div>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Toutes les Catégories
            </h1>
          </div>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: '0 0 32px 0',
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            Explorez notre large gamme de produits organisés par catégories
          </p>

          {/* Barre de recherche catégories */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            position: 'relative'
          }}>
            <input
              type="search"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 56px 16px 20px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '20px',
              color: '#9ca3af'
            }}>
              🔍
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '8px'
            }}>
              {categories.length}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Catégories Disponibles
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '8px'
            }}>
              {totalProduits.toLocaleString()}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Produits au Total
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '8px'
            }}>
              {filteredCategories.length}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              {searchTerm ? 'Résultats Trouvés' : 'Catégories Affichées'}
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {[...Array(10)].map((_, i) => (
              <div key={i} style={{
                height: '200px',
                backgroundColor: '#f3f4f6',
                borderRadius: '16px',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        ) : filteredCategories.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filteredCategories.map(category => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* En-tête coloré */}
                <div style={{
                  height: '80px',
                  background: `linear-gradient(135deg, ${
                    ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'][category.id % 8]
                  } 0%, ${
                    ['#764ba2', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#ea580c'][category.id % 8]
                  } 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  position: 'relative'
                }}>
                  <span style={{ filter: 'brightness(0) invert(1)' }}>
                    {category.icon || '📦'}
                  </span>
                  
                  {/* Badge nombre de produits */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    color: '#1f2937',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {category.nombre_produits || 0} produits
                  </div>
                </div>

                {/* Contenu */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 12px 0'
                  }}>
                    {category.nom}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 20px 0',
                    lineHeight: '1.5'
                  }}>
                    {category.description || 'Découvrez tous les produits de cette catégorie'}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/produits?categorie=${category.id}`);
                      }}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#374151',
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
                      🔍 Filtrer par cette catégorie
                    </button>
                    
                    <div style={{
                      fontSize: '24px',
                      color: '#667eea'
                    }}>
                      →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '2px dashed #e5e7eb'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              Aucune catégorie trouvée
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '0 0 24px 0'
            }}>
              Essayez avec d'autres termes de recherche
            </p>
            <button
              onClick={() => setSearchTerm('')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#667eea',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🗑️ Effacer la recherche
            </button>
          </div>
        )}

        {/* Section d'actions */}
        <div style={{
          marginTop: '64px',
          textAlign: 'center',
          padding: '48px',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 32px 0'
          }}>
            Parcourez notre catalogue complet ou utilisez la recherche avancée
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
                padding: '16px 32px',
                backgroundColor: '#667eea',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              🛍️ Voir Tous les Produits
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: '#667eea',
                border: '2px solid #667eea',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#667eea';
                e.target.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#667eea';
              }}
            >
              🏠 Retour à l'Accueil
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default CategoriesPage;