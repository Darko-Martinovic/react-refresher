import { Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyIcon from '@mui/icons-material/Key';
import CodeIcon from '@mui/icons-material/Code';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ExploreIcon from '@mui/icons-material/Explore';
import FlagIcon from '@mui/icons-material/Flag';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

import { CodeBlock } from './CodeBlock';
import { FeatureTasks } from './FeatureTasks';
import { useFeatures } from '@/core/features/useFeatures';
import { DEMO_LOADERS } from '@/core/features/demo-loaders';

export function FeaturePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { bySlug, sectionByKey, neighbors } = useFeatures();

  const feature = bySlug(slug);
  if (!feature) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h4">Feature not found</Typography>
        <Typography sx={{ mt: 1, color: 'var(--text-muted)' }}>
          Unknown slug: <code>{slug}</code>
        </Typography>
        <Button component={Link} to="/" sx={{ mt: 2 }} variant="outlined">
          Back to home
        </Button>
      </Box>
    );
  }

  const section = sectionByKey(feature.section);
  const { prev, next } = neighbors(feature.slug);
  const DemoComponent = feature.demoKey ? DEMO_LOADERS[feature.demoKey] : null;

  return (
    <Box
      component="article"
      sx={{
        padding: { xs: '1.5rem 1rem 3rem', md: '2rem 2rem 4rem' },
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* Breadcrumbs */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.25,
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          flexWrap: 'wrap',
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: 1,
            '&:hover': {
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
            },
          }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Box>
        {section && (
          <>
            <ChevronRightIcon fontSize="small" sx={{ color: 'var(--text-muted)' }} />
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'var(--accent-strong)',
                fontWeight: 500,
                padding: '0.25rem 0.5rem',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.05rem' }}>
                {section.icon}
              </span>
              {section.label}
            </Box>
          </>
        )}
      </Box>

      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          padding: { xs: '1.25rem 1.15rem', md: '1.75rem 2rem' },
          background: 'linear-gradient(135deg, var(--surface-1), var(--surface-2))',
          border: '1px solid var(--surface-border)',
          borderRadius: 3,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 600px 280px at 100% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 60%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '1.85rem', md: '2.5rem' },
              fontWeight: 600,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            {feature.title}
          </Typography>
          <Typography
            sx={{
              color: 'var(--text-secondary)',
              fontSize: '1.125rem',
              lineHeight: 1.5,
            }}
          >
            {feature.tagline}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
            {feature.version && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                  color: 'var(--accent-strong)',
                  border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                }}
              >
                <NewReleasesIcon sx={{ fontSize: '0.95rem' }} />
                {feature.version}
              </Box>
            )}
            {feature.demoKey && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  padding: '0.25rem 0.65rem',
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  background: 'color-mix(in srgb, var(--success) 14%, transparent)',
                  color: 'var(--success)',
                  border: '1px solid color-mix(in srgb, var(--success) 30%, transparent)',
                }}
              >
                <PlayCircleIcon sx={{ fontSize: '0.95rem' }} />
                Interactive demo
              </Box>
            )}
          </Box>
          <Typography sx={{ color: 'var(--text-secondary)', lineHeight: 1.65, mt: 1 }}>
            {feature.summary}
          </Typography>
        </Box>
      </Box>

      {/* Key points */}
      <Section icon={<KeyIcon sx={{ color: 'var(--accent)' }} />} title="Key points">
        <BulletList items={feature.keyPoints} />
      </Section>

      {/* Snippets */}
      {feature.snippets.length > 0 && (
        <Section icon={<CodeIcon sx={{ color: 'var(--accent)' }} />} title="Snippets">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {feature.snippets.map((snippet, i) => (
              <CodeBlock
                key={i}
                code={snippet.code}
                language={snippet.language}
                label={snippet.label}
              />
            ))}
          </Box>
        </Section>
      )}

      {/* Live demo */}
      {DemoComponent && (
        <Section
          icon={<PlayCircleIcon sx={{ color: 'var(--accent)' }} />}
          title="Live demo"
        >
          <Box
            sx={{
              padding: { xs: '1rem', md: '1.5rem' },
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-border)',
              borderRadius: 2,
              boxShadow: '0 4px 18px -8px var(--shadow)',
            }}
          >
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                  }}
                >
                  <CircularProgress size={18} />
                  Loading interactive demo…
                </Box>
              }
            >
              <DemoComponent />
            </Suspense>
          </Box>
        </Section>
      )}

      {/* Tasks */}
      {feature.tasks && feature.tasks.length > 0 && (
        <Section
          icon={<ChecklistIcon sx={{ color: 'var(--accent)' }} />}
          title="Tasks"
        >
          <FeatureTasks slug={feature.slug} tasks={feature.tasks} />
        </Section>
      )}

      {/* Explore */}
      {feature.pointers.length > 0 && (
        <Section
          icon={<ExploreIcon sx={{ color: 'var(--accent)' }} />}
          title="Explore in the codebase"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {feature.pointers.map((p, i) => (
              <Box
                key={i}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1fr) auto',
                  gap: '0.25rem 0.85rem',
                  padding: '0.6rem 0.85rem',
                  background: 'var(--surface-1)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 1.5,
                }}
              >
                <Box
                  component="code"
                  sx={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.85rem',
                    color: 'var(--accent-strong)',
                    wordBreak: 'break-all',
                  }}
                >
                  {p.path}
                </Box>
                <Typography
                  sx={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    textAlign: 'right',
                  }}
                >
                  {p.label}
                </Typography>
                {p.note && (
                  <Typography
                    sx={{
                      gridColumn: '1 / -1',
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                    }}
                  >
                    {p.note}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Section>
      )}

      {/* Red flags */}
      {feature.redFlags && feature.redFlags.length > 0 && (
        <Section
          icon={<FlagIcon sx={{ color: 'var(--warn)' }} />}
          title="Red flags"
        >
          <BulletList items={feature.redFlags} warn />
        </Section>
      )}

      {/* References */}
      {feature.references.length > 0 && (
        <Section
          icon={<MenuBookIcon sx={{ color: 'var(--accent)' }} />}
          title="References"
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {feature.references.map((r) => (
              <Box
                key={r.url}
                component="a"
                href={r.url}
                target="_blank"
                rel="noopener"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'var(--accent-strong)',
                  textDecoration: 'none',
                  padding: '0.4rem 0',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {r.label}
                <OpenInNewIcon sx={{ fontSize: '0.95rem' }} />
              </Box>
            ))}
          </Box>
        </Section>
      )}

      <Divider />

      {/* Prev / Next nav */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 1.5,
        }}
      >
        {prev ? (
          <NavLink direction="prev" to={`/feature/${prev.slug}`} title={prev.title} />
        ) : (
          <span />
        )}
        {next && (
          <NavLink direction="next" to={`/feature/${next.slug}`} title={next.title} />
        )}
      </Box>
    </Box>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      <Typography
        variant="h2"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}
      >
        {icon}
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function BulletList({ items, warn = false }: { items: string[]; warn?: boolean }) {
  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {items.map((item, i) => (
        <Box
          key={i}
          component="li"
          sx={{
            position: 'relative',
            padding: '0.55rem 0.85rem 0.55rem 2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            background: 'var(--surface-1)',
            border: '1px solid var(--surface-border)',
            borderRadius: 1.5,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '0.85rem',
              top: '0.95rem',
              width: '0.45rem',
              height: '0.45rem',
              borderRadius: '50%',
              background: warn ? 'var(--warn)' : 'var(--accent)',
            },
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
}

function NavLink({
  direction,
  to,
  title,
}: {
  direction: 'prev' | 'next';
  to: string;
  title: string;
}) {
  return (
    <Box
      component={Link}
      to={to}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        padding: '0.85rem 1.1rem',
        border: '1px solid var(--surface-border)',
        borderRadius: 2,
        background: 'var(--surface-1)',
        justifyContent: direction === 'next' ? 'flex-end' : 'flex-start',
        textAlign: direction === 'next' ? 'right' : 'left',
        color: 'var(--text-primary)',
        '&:hover': {
          background: 'var(--surface-2)',
          borderColor: 'var(--accent)',
        },
      }}
    >
      {direction === 'prev' && <ArrowBackIcon />}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.7rem',
          }}
        >
          {direction === 'prev' ? 'Previous' : 'Next'}
        </Typography>
        <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
          {title}
        </Typography>
      </Box>
      {direction === 'next' && <ArrowForwardIcon />}
    </Box>
  );
}
