import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { colors } from './theme';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    background: ${p => p.theme.colors.background};
    color: ${p => p.theme.colors.text};
    font-family: 'Orbitron', sans-serif;
  }
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={{ colors }}>
    <GlobalStyle/>
    <App />
  </ThemeProvider>
);
