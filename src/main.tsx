import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polyfill global for PouchDB
(window as any).global = window;

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
