// src/components/layout/ModernSidebar.jsx
import React, { useState } from 'react';
import { theme } from '../../styles/theme';

const ModernSidebar = ({ onAddProductClick, currentPage = 'products' }) => {
  const [expandedMenus, setExpandedMenus] = useState({ products: true });

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems = [
    {
      id: 'dashboard',
      icon: '🏠',
      label: 'Dashboard',
      active: currentPage === 'dashboard',
      onClick: () => console.log('Navigate to Dashboard')
    },
    {
      id: 'orders',
      icon: '🛒',
      label: 'Orders',
      active: currentPage === 'orders',
      onClick: () => console.log('Navigate to Orders')
    },
    {
      id: 'products',
      icon: '📦',
      label: 'Products',
      active: currentPage === 'products',
      expandable: true,
      expanded: expandedMenus.products,
      submenu: [
        {
          id: 'all-products',
          label: 'All Products',
          active: true,
          onClick: () => console.log('Navigate to All Products')
        },
        {
          id: 'add-product',
          label: 'Add Product',
          onClick: onAddProductClick
        },
        {
          id: 'categories',
          label: 'Categories',
          onClick: () => console.log('Navigate to Categories')
        },
        {
          id: 'inventory',
          label: 'Inventory',
          onClick: () => console.log('Navigate to Inventory')
        }
      ]
    },
    {
      id: 'customers',
      icon: '👥',
      label: 'Customers',
      active: currentPage === 'customers',
      onClick: () => console.log('Navigate to Customers')
    },
    {
      id: 'chats',
      icon: '💬',
      label: 'Chats',
      active: currentPage === 'chats',
      badge: '3',
      onClick: () => console.log('Navigate to Chats')
    },
    {
      id: 'analytics',
      icon: '📊',
      label: 'Analytics',
      active: currentPage === 'analytics',
      onClick: () => console.log('Navigate to Analytics')
    },
    {
      id: 'promotions',
      icon: '🏷️',
      label: 'Promotions',
      active: currentPage === 'promotions',
      onClick: () => console.log('Navigate to Promotions')
    }
  ];

  const bottomItems = [
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      onClick: () => console.log('Navigate to Profile')
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      onClick: () => console.log('Navigate to Settings')
    },
    {
      id: 'logout',
      icon: '🚪',
      label: 'Logout',
      onClick: () => console.log('Logout'),
      danger: true
    }
  ];

  return (
    <div style={{
      width: '280px',
      backgroundColor: '#f8fafc',
      borderRight: `1px solid ${theme.colors.gray[200]}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Logo/Header */}
      <div style={{
        padding: `${theme.spacing.xl} ${theme.spacing.lg}`,
        borderBottom: `1px solid ${theme.colors.gray[200]}`,
        backgroundColor: theme.colors.white
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: theme.colors.gray[800],
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}>
          <span style={{ 
            fontSize: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ⚡
          </span>
          E-Commerce
        </h1>
        <p style={{
          fontSize: '12px',
          color: theme.colors.gray[500],
          margin: `${theme.spacing.xs} 0 0 0`
        }}>
          Vendor Dashboard
        </p>
      </div>

      {/* Navigation principale */}
      <nav style={{
        flex: 1,
        padding: `${theme.spacing.lg} 0`,
        overflowY: 'auto'
      }}>
        <div style={{ padding: `0 ${theme.spacing.md}` }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '600',
            color: theme.colors.gray[400],
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: theme.spacing.md,
            paddingLeft: theme.spacing.md
          }}>
            Main Menu
          </div>

          {menuItems.map(item => (
            <div key={item.id} style={{ marginBottom: theme.spacing.xs }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: `${theme.spacing.md} ${theme.spacing.md}`,
                  borderRadius: theme.borderRadius.lg,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: item.active ? '#e0e7ff' : 'transparent',
                  color: item.active ? '#4f46e5' : theme.colors.gray[600],
                  fontWeight: item.active ? '600' : '500',
                  fontSize: '14px',
                  margin: `0 ${theme.spacing.sm}`,
                  position: 'relative'
                }}
                onClick={() => {
                  if (item.expandable) {
                    toggleMenu(item.id);
                  } else if (item.onClick) {
                    item.onClick();
                  }
                }}
                onMouseEnter={(e) => {
                  if (!item.active) {
                    e.target.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!item.active) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  {item.badge && (
                    <span style={{
                      backgroundColor: '#ef4444',
                      color: theme.colors.white,
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      minWidth: '16px',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  
                  {item.expandable && (
                    <span style={{
                      fontSize: '12px',
                      transform: item.expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}>
                      ▶
                    </span>
                  )}
                </div>

                {/* Indicateur actif */}
                {item.active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '20px',
                    backgroundColor: '#4f46e5',
                    borderRadius: '0 2px 2px 0'
                  }} />
                )}
              </div>

              {/* Sous-menu */}
              {item.expandable && item.expanded && item.submenu && (
                <div style={{
                  marginTop: theme.spacing.sm,
                  marginLeft: theme.spacing.xl,
                  paddingLeft: theme.spacing.md,
                  borderLeft: `2px solid ${theme.colors.gray[200]}`
                }}>
                  {item.submenu.map(subItem => (
                    <div
                      key={subItem.id}
                      style={{
                        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                        borderRadius: theme.borderRadius.md,
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: subItem.active ? '#4f46e5' : theme.colors.gray[500],
                        fontWeight: subItem.active ? '600' : '500',
                        backgroundColor: subItem.active ? '#e0e7ff' : 'transparent',
                        transition: 'all 0.2s ease',
                        margin: `${theme.spacing.xs} 0`
                      }}
                      onClick={subItem.onClick}
                      onMouseEnter={(e) => {
                        if (!subItem.active) {
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.color = theme.colors.gray[700];
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!subItem.active) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = theme.colors.gray[500];
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
        </div>
      </nav>

      {/* Section du bas */}
      <div style={{
        borderTop: `1px solid ${theme.colors.gray[200]}`,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: theme.colors.gray[400],
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          marginBottom: theme.spacing.md
        }}>
          Account
        </div>

        {bottomItems.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              fontSize: '14px',
              color: item.danger ? '#ef4444' : theme.colors.gray[600],
              fontWeight: '500',
              transition: 'all 0.2s ease',
              marginBottom: theme.spacing.xs
            }}
            onClick={item.onClick}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = item.danger ? '#fef2f2' : '#f8fafc';
              e.target.style.color = item.danger ? '#dc2626' : theme.colors.gray[800];
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = item.danger ? '#ef4444' : theme.colors.gray[600];
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        {/* Profil utilisateur */}
        <div style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          backgroundColor: theme.colors.gray[50],
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.gray[200]}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.white,
              fontWeight: '600',
              fontSize: '16px'
            }}>
              JD
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: theme.colors.gray[800]
              }}>
                John Doe
              </div>
              <div style={{
                fontSize: '12px',
                color: theme.colors.gray[500]
              }}>
                Vendor Premium
              </div>
            </div>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;