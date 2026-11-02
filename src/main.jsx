import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MarketProvider } from './context/MarketProvider.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MarketProvider>
        <App />
      </MarketProvider>
    </BrowserRouter>
  </StrictMode>,
)
