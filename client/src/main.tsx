import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import '@fontsource-variable/inter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/pt-br';
import App from './App';
import theme from './theme';

const ptDatePicker = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br" localeText={ptDatePicker}>
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
);
