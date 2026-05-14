import { StrictMode, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react';
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import './index.css'
import { createApolloClient } from './api/apolloClient.ts';
import { AuthProvider } from './features/authentication/AuthContext.tsx';
import App from './App.tsx'
import {
  createMaterialYouTheme,
  type EffectiveThemeMode,
  type ThemeModePreference,
} from './theme/materialYouTheme.ts';

const client = createApolloClient();
const ACCENT_COLOR_STORAGE_KEY = 'schema.settings.accentColor';
const THEME_MODE_STORAGE_KEY = 'schema.settings.themeMode';
const DEFAULT_ACCENT_COLOR = '#2563eb';
const DEFAULT_THEME_MODE: ThemeModePreference = 'system';

function Root() {
  const [accentColor, setAccentColor] = useState(() =>
    localStorage.getItem(ACCENT_COLOR_STORAGE_KEY) ?? DEFAULT_ACCENT_COLOR
  );
  const [themeMode, setThemeMode] = useState<ThemeModePreference>(() => {
    const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system'
      ? stored
      : DEFAULT_THEME_MODE;
  });
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const effectiveThemeMode: EffectiveThemeMode =
    themeMode === 'system' ? (prefersDark ? 'dark' : 'light') : themeMode;

  useEffect(() => {
    localStorage.setItem(ACCENT_COLOR_STORAGE_KEY, accentColor);
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
    document.documentElement.dataset.theme = effectiveThemeMode;
    document.documentElement.style.colorScheme = effectiveThemeMode;
  }, [effectiveThemeMode, themeMode]);

  const theme = useMemo(
    () => createMaterialYouTheme(accentColor, effectiveThemeMode),
    [accentColor, effectiveThemeMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <AuthProvider>
          <App
            accentColor={accentColor}
            effectiveThemeMode={effectiveThemeMode}
            onAccentColorChange={setAccentColor}
            onThemeModeChange={setThemeMode}
            themeMode={themeMode}
          />
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
