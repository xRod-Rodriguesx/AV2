// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DatabaseProvider } from './contexts/DatabaseContext' // 1. Importar o DB Provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {}
      <DatabaseProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </DatabaseProvider>
    </BrowserRouter>
  </React.StrictMode>,
)