import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface Tool {
  name: string;
  shape: string;
  best: string;
  bestColor: 'success' | 'warn' | 'muted';
  dev: string;
  prod: string;
}

const TOOLS: Tool[] = [
  {
    name: 'Vite',
    shape: 'Dev server + builder',
    best: 'Default for new React apps',
    bestColor: 'success',
    dev: 'Native ESM (no bundling)',
    prod: 'Rollup bundle',
  },
  {
    name: 'Webpack',
    shape: 'Bundler',
    best: 'Mature, heavy legacy',
    bestColor: 'warn',
    dev: 'Bundles everything (slow at scale)',
    prod: 'Single bundle / chunked',
  },
  {
    name: 'Rollup',
    shape: 'Library bundler',
    best: 'For publishing npm packages',
    bestColor: 'muted',
    dev: 'No HMR story for apps',
    prod: 'Clean tree-shaken ESM',
  },
  {
    name: 'Turbopack',
    shape: 'Rust-based bundler',
    best: 'Next.js (beta / opt-in)',
    bestColor: 'muted',
    dev: 'Very fast cold starts',
    prod: 'Stabilizing',
  },
];

export default function BuildToolsDemo() {
  return (
    <DemoShell
      title="Comparison at a glance"
      description="Pick by use case — Vite for greenfield apps, Rollup for libraries, Webpack only if you're already there."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 1.5,
        }}
      >
        {TOOLS.map((t) => (
          <Box
            key={t.name}
            sx={{
              padding: 2,
              background: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              borderRadius: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
              <Typography sx={{ fontSize: '1.15rem', fontWeight: 600 }}>{t.name}</Typography>
              <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                · {t.shape}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color:
                  t.bestColor === 'success'
                    ? 'var(--success)'
                    : t.bestColor === 'warn'
                      ? 'var(--warn)'
                      : 'var(--text-muted)',
                mb: 0.5,
              }}
            >
              {t.best}
            </Typography>
            <Row label="Dev" value={t.dev} />
            <Row label="Prod" value={t.prod} />
          </Box>
        ))}
      </Box>
    </DemoShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', minWidth: 48 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        {value}
      </Typography>
    </Box>
  );
}
