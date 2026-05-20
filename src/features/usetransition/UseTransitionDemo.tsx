import { useState, useTransition } from 'react';
import { Box, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

const BIG = Array.from({ length: 10_000 }, (_, i) => ({
  id: i,
  text: ['alpha', 'bravo', 'charlie', 'delta', 'echo'][i % 5] + '-' + i,
}));

function slowFilter(items: typeof BIG, q: string): typeof BIG {
  // Burn some CPU per match to make the difference visible
  const lower = q.toLowerCase();
  const out: typeof BIG = [];
  for (const it of items) {
    // Artificial work
    let n = 0;
    for (let i = 0; i < 50; i++) n += i;
    if (n >= 0 && it.text.includes(lower)) out.push(it);
  }
  return out;
}

export default function UseTransitionDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(BIG);
  const [useTransitionEnabled, setUseTransitionEnabled] = useState(true);
  const [isPending, startTransition] = useTransition();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next); // urgent — input responsiveness
    if (useTransitionEnabled) {
      startTransition(() => setResults(slowFilter(BIG, next)));
    } else {
      setResults(slowFilter(BIG, next));
    }
  };

  return (
    <DemoShell
      title="Heavy filter, responsive input"
      description="Type quickly. With useTransition on, the input updates immediately and the heavy list re-renders in the background. With it off, the input feels sluggish."
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useTransitionEnabled}
              onChange={(_, v) => setUseTransitionEnabled(v)}
              size="small"
            />
          }
          label={useTransitionEnabled ? 'useTransition on' : 'useTransition off (laggy)'}
        />
        {isPending && (
          <Typography sx={{ color: 'var(--warn)', fontSize: '0.85rem' }}>
            (pending heavy update…)
          </Typography>
        )}
      </Box>

      <TextField
        size="small"
        fullWidth
        value={query}
        onChange={onChange}
        placeholder="Type — try 'bravo-12' or 'alpha-99'"
      />

      <Typography
        sx={{
          mt: 1,
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
        }}
      >
        {results.length.toLocaleString()} matches out of 10,000
      </Typography>

      <Box
        sx={{
          mt: 1,
          maxHeight: 220,
          overflowY: 'auto',
          padding: 1,
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)',
          borderRadius: 1.5,
          opacity: isPending ? 0.5 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {results.slice(0, 100).map((r) => (
          <Box
            key={r.id}
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.78rem',
              padding: '0.15rem 0.4rem',
              color: 'var(--text-secondary)',
            }}
          >
            {r.text}
          </Box>
        ))}
        {results.length > 100 && (
          <Typography
            sx={{ color: 'var(--text-muted)', fontSize: '0.78rem', mt: 0.5 }}
          >
            …and {(results.length - 100).toLocaleString()} more
          </Typography>
        )}
      </Box>
    </DemoShell>
  );
}
