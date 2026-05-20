import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useFeatures } from '@/core/features/useFeatures';

const DRAWER_WIDTH = 300;
const COLOR_MODE_STORAGE_KEY = 'react-refresher-color-mode';

export function App() {
  const isHandset = useMediaQuery('(max-width: 900px)');
  const { grouped } = useFeatures();
  const location = useLocation();
  const [tempDrawerOpen, setTempDrawerOpen] = useState(false);
  const { mode, setMode } = useColorScheme();

  // Restore persisted color mode on mount
  useEffect(() => {
    const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      setMode(stored);
    }
  }, [setMode]);

  // Persist on change
  useEffect(() => {
    if (mode === 'light' || mode === 'dark') {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    }
  }, [mode]);

  // Close temporary drawer on route change
  useEffect(() => {
    setTempDrawerOpen(false);
  }, [location.pathname]);

  const toggleMode = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const drawerContents = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          padding: '1.5rem 1.25rem 1rem',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            fontSize: '1.15rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.01em',
            display: 'block',
          }}
        >
          React Refresher
        </Typography>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.78rem', mt: 0.25 }}>
          L4 / Tech Lead concept tour
        </Typography>
      </Box>

      <Box sx={{ overflow: 'auto', flex: 1, padding: '0.5rem 0 1.5rem' }}>
        {grouped.map((group) => (
          <List
            key={group.section.key}
            dense
            subheader={
              <ListSubheader
                sx={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  lineHeight: '2.4em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  padding: '0 1rem',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '1rem' }}
                >
                  {group.section.icon}
                </span>
                {group.section.label}
              </ListSubheader>
            }
          >
            {group.features.map((f) => {
              const isActive = location.pathname === `/feature/${f.slug}`;
              return (
                <ListItem key={f.slug} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/feature/${f.slug}`}
                    selected={isActive}
                    sx={{
                      borderLeft: '3px solid transparent',
                      paddingLeft: '0.9rem',
                      '&.Mui-selected': {
                        background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                        borderLeftColor: 'var(--accent)',
                      },
                      '&.Mui-selected:hover': {
                        background: 'color-mix(in srgb, var(--accent) 18%, transparent)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={f.title}
                      slotProps={{
                        primary: {
                          sx: {
                            color: isActive
                              ? 'var(--accent-strong)'
                              : 'var(--text-primary)',
                            fontSize: '0.9rem',
                            fontWeight: isActive ? 600 : 400,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        ))}
      </Box>

      <Box
        sx={{
          padding: '0.85rem 1.25rem',
          borderTop: '1px solid var(--surface-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}
      >
        <span>React 19.2 · Vite</span>
        <Box
          component="a"
          href="https://react.dev"
          target="_blank"
          rel="noopener"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.35,
            color: 'var(--accent-strong)',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          react.dev
          <OpenInNewIcon sx={{ fontSize: '0.85rem' }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', background: 'var(--surface-0)' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          background: 'var(--surface-0)',
          color: 'var(--text-primary)',
          borderBottom: '1px solid var(--surface-border)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Toolbar sx={{ minHeight: '60px !important', gap: 1 }}>
          {isHandset && (
            <IconButton
              edge="start"
              onClick={() => setTempDrawerOpen(true)}
              sx={{ color: 'var(--text-primary)' }}
              aria-label="Open navigation"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box sx={{ flex: 1 }} />
          <Tooltip title={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
            <IconButton
              onClick={toggleMode}
              sx={{ color: 'var(--text-primary)' }}
              aria-label="Toggle color theme"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {!isHandset && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              borderRight: '1px solid var(--surface-border)',
              background: 'var(--surface-1)',
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawerContents}
        </Drawer>
      )}

      {isHandset && (
        <Drawer
          variant="temporary"
          open={tempDrawerOpen}
          onClose={() => setTempDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: 'var(--surface-1)',
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContents}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          paddingTop: '60px',
          background: 'var(--surface-0)',
          color: 'var(--text-primary)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
