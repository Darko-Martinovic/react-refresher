import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import './index.css';

import { theme } from '@/core/theme';
import { App } from '@/App';
import { Home } from '@/pages/Home';
import { NotFound } from '@/pages/NotFound';
import { FeaturePage } from '@/shared/FeaturePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'feature/:slug', element: <FeaturePage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InitColorSchemeScript attribute="data-mui-color-scheme" />
    <ThemeProvider theme={theme} defaultMode="light">
      <CssBaseline enableColorScheme />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
