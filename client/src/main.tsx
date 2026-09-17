import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import '@fontsource-variable/inter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import I18nProvider from './i18n/I18nProvider';
import theme from './theme';

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
);
