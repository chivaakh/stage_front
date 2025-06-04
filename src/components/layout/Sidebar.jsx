// src/components/layout/Sidebar.jsx
import React from 'react';
import { theme } from '../../styles/theme';

const Sidebar = ({ onAddProductClick }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', active: false },
    { id: 'orders', 
      icon: '🛒', 
      label: 'Commandes', 
      active: true,
      submenu:[
        {id: 'all-commands', labal: 'Tous les commandes', active:true},
        // {id: 'add-product', label: 'Ajouter une commande', onClick: }
      ]

    },
    { 
      id: 'products', 
      icon: '📦', 
      label: 'Produits', 
      active: true,
      submenu: [
        { id: 'all-products', label: 'Tous les produits', active: true },
        { id: 'add-product', label: 'Ajouter un produit', onClick: onAddProductClick }
      ]
    },
    { id: 'customers', icon: '👥', label: 'Clients', active: false },
    { id: 'messages', icon: '💬', label: 'Messages', active: false }
  ];

  const bottomItems = [
    { id: 'settings', icon: '🔧', label: 'Paramètres' },
    { id: 'logout', icon: '🚪', label: 'Déconnexion' }
  ];

  return (
    <div style={{
      width: '280px',
      backgroundColor: theme.colors.white,
      borderRight: `1px solid ${theme.colors.gray[300]}`,
      padding: `${theme.spacing.lg} 0`,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      {/* Logo */}
      <div style={{ padding: `0 ${theme.spacing.lg}`, marginBottom: theme.spacing.xl }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: theme.colors.gray[800],
          margin: 0
        }}>
          E-Commerce
        </h1>
      </div>

      {/* Navigation principale */}
      <nav style={{ padding: `0 ${theme.spacing.md}`, flex: 1 }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ marginBottom: theme.spacing.sm }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing.md,
              backgroundColor: item.active ? theme.colors.primary : 'transparent',
              color: item.active ? theme.colors.white : theme.colors.gray[500],
              borderRadius: theme.borderRadius.md,
              fontWeight: item.active ? '500' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!item.active) {
                e.target.style.backgroundColor = theme.colors.gray[100];
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
            >
              {item.icon} {item.label}
            </div>
            
            {/* Sous-menu */}
            {item.submenu && (
              <div style={{ marginLeft: '20px', marginTop: theme.spacing.sm }}>
                {item.submenu.map(subItem => (
                  <div 
                    key={subItem.id}
                    style={{ 
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`, 
                      color: subItem.active ? theme.colors.primary : theme.colors.gray[500], 
                      fontSize: '14px',
                      cursor: 'pointer',
                      borderRadius: theme.borderRadius.sm,
                      transition: 'all 0.2s'
                    }}
                    onClick={subItem.onClick}
                    onMouseEnter={(e) => {
                      if (!subItem.active) {
                        e.target.style.backgroundColor = theme.colors.gray[50];
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!subItem.active) {
                        e.target.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Navigation du bas */}
      <div style={{ 
        borderTop: `1px solid ${theme.colors.gray[300]}`,
        padding: theme.spacing.lg,
        marginTop: 'auto'
      }}>
        {bottomItems.map(item => (
          <div 
            key={item.id}
            style={{ 
              color: theme.colors.gray[500], 
              fontSize: '14px', 
              marginBottom: theme.spacing.sm,
              cursor: 'pointer',
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.sm,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.colors.gray[50];
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            {item.icon} {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;