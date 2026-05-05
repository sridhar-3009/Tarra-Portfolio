import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './styles/globals.css'
import { ThemeProvider } from './context/ThemeContext'

// Register GSAP plugins globally
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
)
