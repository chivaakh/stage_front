// src/components/client/layout/ClientHeader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../styles/theme';

const ClientHeader = ({ currentPage = 'home' }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Accueil', path: '/', icon: '🏠' },
    { id: 'products', label: 'Produits', path: '/produits', icon: '📦' },
    { id: 'categories', label: 'Catégories', path: '/categories', icon: '📂' },
    { id: 'favorites', label: 'Favoris', path: '/favoris', icon: '❤️' },
    { id: 'cart', label: 'Panier', path: '/panier', icon: '🛒', badge: 3 },
    { id: 'orders', label: 'Mes Commandes', path: '/mes-commandes', icon: '📋' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Barre principale */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '80px'
        }}>
          {/* Logo */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '20px', filter: 'brightness(0) invert(1)' }}>⚡</span>
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              E-Commerce
            </h1>
          </div>

          {/* Barre de recherche */}
          <form 
            onSubmit={handleSearch}
            style={{
              flex: 1,
              maxWidth: '500px',
              margin: '0 32px',
              position: 'relative'
            }}
          >
            <input
              type="search"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 48px 12px 16px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s ease',
                color: '#374151'
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
            <button
              type="submit"
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '4px'
              }}
            >
              🔍
            </button>
          </form>

          {/* Actions utilisateur */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Bouton Dashboard Admin */}
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
              }}
            >
              ⚙️ Admin
            </button>

            {/* Favoris */}
            <button
              onClick={() => navigate('/favoris')}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                color: currentPage === 'favorites' ? '#dc2626' : '#6b7280'
              }}
            >
              ❤️
            </button>

            {/* Panier */}
            <button
              onClick={() => navigate('/panier')}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                color: currentPage === 'cart' ? '#667eea' : '#6b7280'
              }}
            >
              🛒
              <span style={{
                position: 'absolute',
                top: '0px',
                right: '0px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: '600',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                3
              </span>
            </button>

            {/* Profil */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#667eea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              JD
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav style={{
          borderTop: '1px solid #f3f4f6',
          paddingTop: '16px',
          paddingBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            overflowX: 'auto'
          }}>
            {menuItems.slice(0, -2).map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: currentPage === item.id ? '#e0e7ff' : 'transparent',
                  color: currentPage === item.id ? '#4f46e5' : '#6b7280',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: currentPage === item.id ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ClientHeader;