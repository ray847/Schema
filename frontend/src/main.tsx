import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css'
import { createApolloClient } from './api/apolloClient.ts';
import { AuthProvider } from './features/authentication/AuthContext.tsx';
import App from './App.tsx'

const client = createApolloClient();
const ACCENT_COLOR_STORAGE_KEY = 'schema.settings.accentColor';
const DEFAULT_ACCENT_COLOR = '#2563eb';

function Root() {
  const [accentColor, setAccentColor] = useState(() =>
    localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) ?? DEFAULT_ACCENT_COLOR
  );

  useEffect(() => {
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, accentColor);
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: accentColor,
      },
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    },
  }), [accentColor]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <AuthProvider>
          <App accentColor={accentColor} onAccentColorChange={setAccentColor} />
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
