import { createTheme } from '@mui/material/styles';

/**
 * MUI v7+ theme — wires both color schemes through CSS variables.
 * `cssVariables.colorSchemeSelector: 'data-mui-color-scheme'` matches
 * the attribute our index.css selectors key off of.
 */
export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#2563eb' },
        secondary: { main: '#7c3aed' },
        success: { main: '#16a34a' },
        warning: { main: '#d97706' },
        error: { main: '#dc2626' },
        background: { default: '#fafafb', paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#60a5fa' },
        secondary: { main: '#c4b5fd' },
        success: { main: '#4ade80' },
        warning: { main: '#fbbf24' },
        error: { main: '#f87171' },
        background: { default: '#0a0b10', paper: '#12141c' },
      },
    },
  },
  typography: {
    fontFamily: `'Inter', system-ui, -apple-system, sans-serif`,
    h1: { fontWeight: 600, letterSpacing: '-0.025em' },
    h2: { fontWeight: 600, letterSpacing: '-0.005em' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
});
