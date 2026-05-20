import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useFeatures } from '@/core/features/useFeatures';

export function Home() {
  const { grouped, totals } = useFeatures();
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return grouped;
    return grouped
      .map((g) => ({
        section: g.section,
        features: g.features.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.tagline.toLowerCase().includes(q) ||
            f.summary.toLowerCase().includes(q) ||
            f.keyPoints.some((k) => k.toLowerCase().includes(q)),
        ),
      }))
      .filter((g) => g.features.length > 0);
  }, [grouped, query]);

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          padding: { xs: '3rem 1.25rem 2.5rem', md: '4.5rem 3rem 3rem' },
          background:
            'radial-gradient(ellipse 800px 400px at 50% -10%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              padding: '0.35rem 0.75rem',
              background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
              color: 'var(--accent-strong)',
              border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            <BoltIcon sx={{ fontSize: '1rem' }} />
            React 19 refresher
          </Box>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            Modern React,{' '}
            <Box component="span" sx={{ color: 'var(--accent-strong)' }}>
              at a glance
            </Box>
          </Typography>
          <Typography
            sx={{
              color: 'var(--text-secondary)',
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            An internal reference covering every concept from <strong>JSX and the rendering model</strong> to the latest <strong>React 19 actions, useOptimistic, and the use() hook</strong> — with snippets, live demos, and self-validating tasks so you can actually try each idea.
          </Typography>

          {/* Stats */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 1.5,
              width: '100%',
              maxWidth: 600,
              mt: 1,
            }}
          >
            <Stat value={totals.features} label="Features" />
            <Stat value={totals.sections} label="Sections" />
            <Stat value={totals.demos} label="Live demos" />
            <Stat value={totals.tasks} label="Tasks" />
          </Box>

          {/* Search */}
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features…"
            sx={{ mt: 2, width: '100%', maxWidth: 520 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'var(--text-muted)' }} />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setQuery('')}
                      aria-label="Clear"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
          />
        </Box>
      </Box>

      {/* Catalog */}
      <Box
        sx={{
          padding: { xs: '2rem 1.25rem 4rem', md: '3rem 3rem 5rem' },
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {filteredGroups.length === 0 ? (
          <Box
            sx={{
              padding: '3rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1px dashed var(--surface-border)',
              borderRadius: 2,
            }}
          >
            <SearchOffIcon sx={{ fontSize: '3rem', mb: 1 }} />
            <Typography sx={{ mb: 1.5 }}>No features match &ldquo;{query}&rdquo;.</Typography>
            <Button variant="outlined" onClick={() => setQuery('')}>
              Clear search
            </Button>
          </Box>
        ) : (
          filteredGroups.map((group) => (
            <Box
              key={group.section.key}
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                    color: 'var(--accent-strong)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '1.5rem' }}
                  >
                    {group.section.icon}
                  </span>
                </Box>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      m: 0,
                    }}
                  >
                    {group.section.label}
                  </Typography>
                  <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {group.section.description}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 1.5,
                }}
              >
                {group.features.map((f) => (
                  <Box
                    key={f.slug}
                    component={Link}
                    to={`/feature/${f.slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.75,
                      padding: '1.25rem 1.15rem',
                      background: 'var(--surface-1)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: 'var(--accent)',
                        boxShadow: '0 6px 20px -10px var(--shadow)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          flex: 1,
                        }}
                      >
                        {f.title}
                      </Typography>
                      {f.demoKey && (
                        <Pill color="success" title="Has interactive demo">
                          <PlayCircleIcon sx={{ fontSize: '1rem' }} />
                        </Pill>
                      )}
                      {f.tasks && f.tasks.length > 0 && (
                        <Pill color="accent" title={`${f.tasks.length} task${f.tasks.length === 1 ? '' : 's'}`}>
                          <ChecklistIcon sx={{ fontSize: '1rem' }} />
                        </Pill>
                      )}
                      {f.version && (
                        <Pill color="warn" title={f.version}>
                          <NewReleasesIcon sx={{ fontSize: '1rem' }} />
                        </Pill>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {f.tagline}
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.4,
                        color: 'var(--accent-strong)',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        mt: 0.25,
                      }}
                    >
                      Explore
                      <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Box
      sx={{
        padding: '0.85rem 1rem',
        background: 'var(--surface-1)',
        border: '1px solid var(--surface-border)',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography
        sx={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function Pill({
  children,
  color,
  title,
}: {
  children: React.ReactNode;
  color: 'accent' | 'success' | 'warn';
  title: string;
}) {
  const bg = {
    accent: 'color-mix(in srgb, var(--accent) 14%, transparent)',
    success: 'color-mix(in srgb, var(--success) 14%, transparent)',
    warn: 'color-mix(in srgb, var(--warn) 14%, transparent)',
  }[color];
  const fg = {
    accent: 'var(--accent-strong)',
    success: 'var(--success)',
    warn: 'var(--warn)',
  }[color];
  return (
    <Box
      title={title}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
        borderRadius: 999,
        background: bg,
        color: fg,
      }}
    >
      {children}
    </Box>
  );
}
