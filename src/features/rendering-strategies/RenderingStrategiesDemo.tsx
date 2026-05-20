import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface Strategy {
  name: string;
  blurb: string;
  fits: string;
  cost: string;
}

const STRATEGIES: Strategy[] = [
  {
    name: 'MPA',
    blurb: 'Traditional server-rendered pages; full reload on nav.',
    fits: 'Content-heavy, low-interactivity sites (blogs, marketing).',
    cost: 'Slow nav between pages; poor app-like UX.',
  },
  {
    name: 'SPA',
    blurb: 'One HTML, JS handles everything; client-side routing.',
    fits: 'Dashboards, internal tools, authenticated apps.',
    cost: 'Slow first load; bad SEO without extra work.',
  },
  {
    name: 'SSR',
    blurb: 'Server renders HTML per request; client hydrates.',
    fits: 'Per-request data; fast first paint; SEO needed.',
    cost: 'Server compute per request; hydration mismatches.',
  },
  {
    name: 'SSG',
    blurb: 'Pre-render all pages at build; deploy to a CDN.',
    fits: 'Marketing, docs, blogs — shared content per visitor.',
    cost: 'No per-user content; rebuilds for changes.',
  },
  {
    name: 'ISR',
    blurb: 'SSG that regenerates on a schedule or on demand.',
    fits: 'Content that changes occasionally (catalogs).',
    cost: 'Framework-specific (Next.js, etc.).',
  },
  {
    name: 'RSC',
    blurb: 'Server Components stream a UI payload; client mixes in.',
    fits: 'Reduce client JS while keeping interactivity.',
    cost: 'Newer paradigm; framework lock-in (Next.js).',
  },
];

export default function RenderingStrategiesDemo() {
  return (
    <DemoShell
      title="Pick your point on the spectrum"
      description="Modern apps mix strategies — SSG for marketing, SSR/RSC for app screens, SPA-style for authenticated areas."
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {STRATEGIES.map((s) => (
          <Box
            key={s.name}
            sx={{
              padding: '0.85rem 1rem',
              background: 'var(--surface-2)',
              border: '1px solid var(--surface-border)',
              borderRadius: 1.5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '60px 1fr 1fr 1fr' },
              gap: 1.25,
              alignItems: 'baseline',
            }}
          >
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--accent-strong)',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {s.name}
            </Typography>
            <Typography sx={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {s.blurb}
            </Typography>
            <Cell label="Fits" value={s.fits} color="success" />
            <Cell label="Cost" value={s.cost} color="warn" />
          </Box>
        ))}
      </Box>
    </DemoShell>
  );
}

function Cell({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'success' | 'warn';
}) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '0.65rem',
          fontWeight: 600,
          color: `var(--${color})`,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        {value}
      </Typography>
    </Box>
  );
}
