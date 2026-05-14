import { alpha, createTheme, darken, lighten } from '@mui/material/styles';
import type {} from '@mui/x-data-grid/themeAugmentation';

export type ThemeModePreference = 'light' | 'dark' | 'system';
export type EffectiveThemeMode = 'light' | 'dark';

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, Math.round(value)));

const normalizeHex = (color: string) => {
  const fallback = '#2563eb';
  const raw = color.trim().replace('#', '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw.split('').map((char) => char + char).join('')}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw}`;
  return fallback;
};

const hexToRgb = (color: string) => {
  const normalized = normalizeHex(color).slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b].map((value) => clamp(value).toString(16).padStart(2, '0')).join('')}`;

const mixColors = (from: string, to: string, amount: number) => {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  return rgbToHex({
    r: start.r + (end.r - start.r) * amount,
    g: start.g + (end.g - start.g) * amount,
    b: start.b + (end.b - start.b) * amount,
  });
};

const rotateColor = (color: string, rotation: 'secondary' | 'tertiary') => {
  const { r, g, b } = hexToRgb(color);
  if (rotation === 'secondary') {
    return rgbToHex({
      r: r * 0.58 + g * 0.24 + b * 0.18,
      g: r * 0.18 + g * 0.58 + b * 0.24,
      b: r * 0.24 + g * 0.18 + b * 0.58,
    });
  }
  return rgbToHex({
    r: b * 0.7 + r * 0.3,
    g: r * 0.65 + g * 0.35,
    b: g * 0.7 + b * 0.3,
  });
};

export function createMaterialYouTheme(seedColor: string, mode: EffectiveThemeMode) {
  const primary = normalizeHex(seedColor);
  const secondary = rotateColor(primary, 'secondary');
  const tertiary = rotateColor(primary, 'tertiary');
  const dark = mode === 'dark';

  const surface = dark ? '#111318' : '#fbfcff';
  const surfaceContainer = mixColors(surface, primary, dark ? 0.16 : 0.07);
  const surfaceContainerHigh = mixColors(surface, primary, dark ? 0.24 : 0.12);
  const outline = dark ? '#938f99' : '#79747e';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: dark ? lighten(primary, 0.22) : primary,
        light: dark ? lighten(primary, 0.34) : lighten(primary, 0.32),
        dark: dark ? darken(primary, 0.08) : darken(primary, 0.22),
        contrastText: dark ? '#111318' : '#ffffff',
      },
      secondary: {
        main: dark ? lighten(secondary, 0.22) : secondary,
        light: dark ? lighten(secondary, 0.36) : lighten(secondary, 0.36),
        dark: dark ? darken(secondary, 0.08) : darken(secondary, 0.22),
        contrastText: dark ? '#111318' : '#ffffff',
      },
      info: {
        main: dark ? lighten(tertiary, 0.2) : tertiary,
      },
      error: {
        main: dark ? '#ffb4ab' : '#ba1a1a',
      },
      warning: {
        main: dark ? '#ffcf70' : '#7d5700',
      },
      success: {
        main: dark ? '#9fd49f' : '#386a20',
      },
      background: {
        default: surface,
        paper: surfaceContainer,
      },
      text: {
        primary: dark ? '#e6e1e5' : '#1c1b1f',
        secondary: dark ? '#cac4cf' : '#49454f',
      },
      divider: alpha(outline, dark ? 0.32 : 0.26),
    },
    shape: {
      borderRadius: 20,
    },
    typography: {
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
      h4: { fontWeight: 650, letterSpacing: 0 },
      h5: { fontWeight: 650, letterSpacing: 0 },
      h6: { fontWeight: 650, letterSpacing: 0 },
      button: { fontWeight: 700, letterSpacing: 0, textTransform: 'none' },
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 999,
            minHeight: 36,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 650,
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }),
          columnHeaders: ({ theme }) => ({
            background: surfaceContainerHigh,
            color: theme.palette.text.secondary,
          }),
          footerContainer: ({ theme }) => ({
            background: surfaceContainerHigh,
            borderTopColor: theme.palette.divider,
          }),
        },
      },
      MuiFormControl: {
        styleOverrides: {
          root: {
            minWidth: 0,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            backdropFilter: 'blur(12px)',
            borderRadius: 16,
            backgroundColor: alpha(theme.palette.primary.main, dark ? 0.08 : 0.025),
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused': {
              backgroundColor: alpha(theme.palette.primary.main, dark ? 0.12 : 0.045),
            },
          }),
          notchedOutline: ({ theme }) => ({
            borderColor: alpha(theme.palette.primary.main, dark ? 0.28 : 0.22),
          }),
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: ({ theme }) => ({
            color: theme.palette.text.primary,
          }),
          icon: ({ theme }) => ({
            color: theme.palette.text.secondary,
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: surfaceContainerHigh,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 20,
            boxShadow: dark
              ? '0 18px 42px rgba(0, 0, 0, 0.42)'
              : '0 18px 42px rgba(31, 36, 46, 0.14)',
          }),
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: surfaceContainerHigh,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 20,
          }),
          list: {
            padding: 8,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            color: theme.palette.text.primary,
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, dark ? 0.22 : 0.12),
              color: theme.palette.text.primary,
            },
            '&.Mui-selected:hover, &:hover': {
              backgroundColor: alpha(theme.palette.primary.main, dark ? 0.28 : 0.16),
            },
          }),
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 999,
            borderColor: theme.palette.divider,
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, dark ? 0.24 : 0.14),
              color: theme.palette.primary.main,
            },
          }),
        },
      },
    },
  });
}
