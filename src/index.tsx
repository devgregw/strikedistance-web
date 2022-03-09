import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import SettingsProvider from './SettingsProvider';
import yellow from '@mui/material/colors/yellow'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: yellow,
    secondary: yellow
  }
})

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
