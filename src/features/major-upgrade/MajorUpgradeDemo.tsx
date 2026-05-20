import { useState } from 'react';
import { Box, Checkbox, FormControlLabel, LinearProgress, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

const STEPS = [
  { id: 1, label: 'Read the migration guide for the target version' },
  { id: 2, label: 'Audit dependency compatibility (npm outdated, peer deps)' },
  { id: 3, label: 'Patch test coverage gaps on critical paths' },
  { id: 4, label: 'Bump react + react-dom on a feature branch' },
  { id: 5, label: 'Run codemods (npx react-codemod@latest)' },
  { id: 6, label: 'Type-check, lint, unit + integration tests pass' },
  { id: 7, label: 'Triage Strict Mode warnings in dev — fix the real bugs' },
  { id: 8, label: 'Manual smoke of critical flows + visual regression' },
  { id: 9, label: 'Roll out behind a feature flag / gradual deploy' },
  { id: 10, label: 'After ship: knowledge-share session on new patterns' },
];

export default function MajorUpgradeDemo() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const completed = STEPS.filter((s) => done[s.id]).length;
  const pct = (completed / STEPS.length) * 100;

  return (
    <DemoShell
      title="React 18 → 19 rollout checklist"
      description="Treat it as a project. Tick items as you simulate the upgrade for your own team."
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Progress
          </Typography>
          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
            {completed} / {STEPS.length}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{
            height: 8,
            borderRadius: 1,
            background: 'var(--surface-2)',
            '& .MuiLinearProgress-bar': { background: 'var(--accent)' },
          }}
        />
      </Box>

      <Box
        sx={{
          padding: 1,
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)',
          borderRadius: 1.5,
        }}
      >
        {STEPS.map((s) => (
          <FormControlLabel
            key={s.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              ml: 0,
              gap: 1,
              padding: '0.25rem 0.5rem',
              borderRadius: 1,
              '&:hover': { background: 'var(--surface-3)' },
            }}
            control={
              <Checkbox
                size="small"
                checked={!!done[s.id]}
                onChange={(_, v) => setDone((d) => ({ ...d, [s.id]: v }))}
              />
            }
            label={
              <Typography
                sx={{
                  textDecoration: done[s.id] ? 'line-through' : 'none',
                  color: done[s.id] ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: 'var(--accent-strong)',
                    fontWeight: 600,
                    mr: 1,
                  }}
                >
                  {s.id}.
                </Box>
                {s.label}
              </Typography>
            }
          />
        ))}
      </Box>
    </DemoShell>
  );
}
