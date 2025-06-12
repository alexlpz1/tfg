import React from 'react'
import ReactDOM from 'react-dom/client'   // <<< IMPORTA ReactDOM
import App from './App'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { colors, breakpoints } from './theme'

// tus estilos globales…
const GlobalStyle = createGlobalStyle`…`

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={{ colors, breakpoints }}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
