import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';

const clientId = "128897548037-fi6qsoqngat2rg46apt6pq6tfspbfcp3.apps.googleusercontent.com";



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
