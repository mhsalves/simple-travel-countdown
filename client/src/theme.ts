import { CSSProperties } from 'react';
import { createTheme } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';

// Tokens and scale from docs/specs/style-guide.md.

declare module '@mui/material/styles' {
  interface TypographyVariants {
    countdownValue: CSSProperties;
  }

  interface TypographyVariantsOptions {
    countdownValue?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    countdownValue: true;
  }
}

const BORDER_STRONG = { light: '#857B6E', dark: '#5F7282' };

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#0B6E99', contrastText: '#FFFFFF' },
        secondary: { main: '#C8502A', contrastText: '#FFFFFF' },
        error: { main: '#B42318' },
        success: { main: '#1E7A4F' },
        background: { default: '#F8F5EF', paper: '#FFFFFF' },
        text: { primary: '#1F2A33', secondary: '#5A6670' },
        divider: '#DDD5C8',
      },
    },
    dark: {
      palette: {
        primary: { main: '#5BBDE6', contrastText: '#0E1620' },
        secondary: { main: '#FF9166', contrastText: '#0E1620' },
        error: { main: '#FF8A80' },
        success: { main: '#5CD49A' },
        background: { default: '#0E1620', paper: '#17222E' },
        text: { primary: '#EAF0F4', secondary: '#9DAEBD' },
        divider: '#273646',
      },
    },
  },
  typography: {
    fontFamily: '"Inter Variable", Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
    h2: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    subtitle1: { fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.4 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    overline: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5, letterSpacing: '0.08em' },
    button: { fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.5, textTransform: 'none' },
    countdownValue: {
      fontSize: 'clamp(2.5rem, 8vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      fontVariantNumeric: 'tabular-nums',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiContainer: {
      defaultProps: { maxWidth: false, disableGutters: true },
      styleOverrides: {
        root: { maxWidth: 1120, paddingLeft: 16, paddingRight: 16 },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: { countdownValue: 'span' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', fullWidth: true },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({ theme }) => ({
          borderColor: BORDER_STRONG.light,
          ...theme.applyStyles('dark', { borderColor: BORDER_STRONG.dark }),
        }),
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        notchedOutline: ({ theme }) => ({
          borderColor: BORDER_STRONG.light,
          ...theme.applyStyles('dark', { borderColor: BORDER_STRONG.dark }),
        }),
      },
    },
  },
});

export default theme;
