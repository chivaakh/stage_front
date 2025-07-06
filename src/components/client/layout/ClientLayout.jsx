// src/components/client/layout/ClientLayout.jsx
import React from 'react';
import ClientHeader from './ClientHeader';
import { theme } from '../../../styles/theme';

const ClientLayout = ({ children, currentPage = 'home' }) => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: theme?.fonts?.base || 'system-ui, -apple-system, sans-serif'
    }}>
      <ClientHeader currentPage={currentPage} />
      
      <main style={{
        flex: 1,
        width: '100%'
      }}>
        {children}
      </main>
      
      {/* Footer simple */}
      <footer style={{
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        padding: '48px 0 24px 0',
        marginTop: '80px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
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
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: '#f9fafb'
            }}>
              E-Commerce
            </h3>
          </div>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0
          }}>
            © 2024 E-Commerce. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;