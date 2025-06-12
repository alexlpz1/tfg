// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { colors, breakpoints } from './theme'   // <-- importa también breakpoints

const GlobalStyle = createGlobalStyle`
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;background:${p=>p.theme.colors.background};color:${p=>p.theme.colors.text};font-family:'Orbitron',sans-serif}
`

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={{ colors, breakpoints }}>  {/* <-- aquí le pasas ambos */}
    <GlobalStyle/>
    <App/>
  </ThemeProvider>
)
