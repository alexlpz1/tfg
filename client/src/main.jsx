// src/main.jsx
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { colors, breakpoints } from './theme';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { font-size: 16px; }
  body {
    margin: 0;
    background: ${p => p.theme.colors.background};
    color: ${p => p.theme.colors.text};
    font-family: 'Orbitron', sans-serif;
    line-height: 1.5;
  }
  img { max-width: 100%; display: block; }
`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={{ colors, breakpoints }}>
    <GlobalStyle/>
    <App />
  </ThemeProvider>
);
