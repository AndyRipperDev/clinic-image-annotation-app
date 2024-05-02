import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import type {} from '@mui/lab/themeAugmentation';
import Menu from './components/Menu/Menu';

const App = (): JSX.Element => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        components: {
          MuiTimeline: {
            styleOverrides: {
              root: {
                backgroundColor: 'red',
              },
            },
          },
        },
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Menu />
    </ThemeProvider>
  );
};

export default App;
