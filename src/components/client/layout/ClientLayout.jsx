// src/components/client/layout/ClientLayout.jsx
import React from 'react';
import ClientHeader from './ClientHeader';
import { theme } from '../../../styles/theme';

const ClientLayout = ({ children, currentPage = 'home' }) => {
  // Composant SVG Ishrili pour le footer
  const IshriliIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 200 200" 
      fill="none"
    >
      <circle cx="100" cy="40" r="15" fill="url(#footerGradient)" />
      <path d="M109.6,164.7c-5.9,6.3-15.9,7.7-22.8,2.8c-8.3-5.9-10.7-18.6-4.4-35.3c4.7-12.6,11.6-24.9,13.5-31.8 
               c2.2-7.9,0.7-13.6-4-17.2c-4.4-3.3-11.4-4.2-18.1-3.2c-5.7,0.9-9.4-2.2-9.6-7c-0.2-4.7,3.3-8.8,7.9-9.2
               c10.2-0.8,25.1-0.8,34.6,9.1c10.6,10.9,10.3,25.1,5.8,39.3c-2.4,7.4-5.9,15.3-8.4,22.2c-2.9,7.9-3.1,14.1,1.3,16.6
               c3.5,2,9.7,1.6,13.8-2.7C121.1,151.3,115.6,158.2,109.6,164.7z" fill="url(#footerGradient)"/>
      <defs>
        <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
    </svg>
  );

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
            <IshriliIcon />
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: 0,
              color: '#f9fafb'
            }}>
              Ishrili E-Commerce
            </h3>
          </div>
          <p style={{
            color: '#9ca3af',
            fontSize: '14px',
            margin: 0
          }}>
            © 2025 Ishrili E-Commerce. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;