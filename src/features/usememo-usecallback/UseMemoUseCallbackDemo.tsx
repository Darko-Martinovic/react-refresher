import { useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Slider,
  Switch,
  Typography,
} from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

const BIG = Array.from({ length: 50_000 }, (_, i) => ({
  id: i,
  // Some made-up names so the search has something to filter
  name: ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'][i % 6] + '-' + i,
}));

function slowCount(items: typeof BIG, query: string): number {
  // O(n) over 50k entries — perceptible work
  let n = 0;
  for (const it of items) {
    if (it.name.includes(query)) n++;
  }
  return n;
}

export default function UseMemoUseCallbackDemo() {
  const [query, setQuery] = useState('-1');
  const [slider, setSlider] = useState(0); // unrelated state to force re-renders
  const [useMemoization, setUseMemoization] = useState(true);

  const computeRuns = useRef(0);

  const memoized = useMemo(() => {
    computeRuns.current++;
    return slowCount(BIG, query);
  }, [query]);

  // The non-memoized path: recompute every render
  let plain: number;
  if (!useMemoization) {
    computeRuns.current++;
    plain = slowCount(BIG, query);
  } else {
    plain = memoized;
  }

  return (
    <DemoShell
      title="Memoize the heavy bit, not everything"
      description="`slowCount` filters a 50k-row list. The slider re-renders the component without changing the query. With memoization the work runs only when query changes; without it, it runs on every render."
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={useMemoization}
              onChange={(_, v) => {
                computeRuns.current = 0;
                setUseMemoization(v);
              }}
              size="small"
            />
          }
          label={useMemoization ? 'useMemo on' : 'useMemo off (recompute every render)'}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => (computeRuns.current = 0)}
        >
          Reset counter
        </Button>
      </Box>

      <Box
        sx={{
          padding: 2,
          background: 'var(--surface-2)',
          borderRadius: 1.5,
          border: '1px solid var(--surface-border)',
        }}
      >
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Query (suffix match)
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              padding: '0.45rem 0.6rem',
              border: '1px solid var(--surface-border)',
              borderRadius: 6,
              background: 'var(--surface-1)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
            }}
          />
          <Typography
            sx={{
              fontWeight: 600,
              color: 'var(--accent-strong)',
              fontSize: '1.1rem',
            }}
          >
            {plain.toLocaleString()} matches
          </Typography>
        </Box>

        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', mt: 2 }}>
          Unrelated slider (forces re-renders)
        </Typography>
        <Slider
          value={slider}
          onChange={(_, v) => setSlider(v as number)}
          min={0}
          max={100}
          size="small"
        />

        <Typography sx={{ fontSize: '0.85rem', mt: 1 }}>
          slowCount has run{' '}
          <strong style={{ color: 'var(--accent-strong)' }}>
            {computeRuns.current}
          </strong>{' '}
          time{computeRuns.current === 1 ? '' : 's'} so far.
        </Typography>
      </Box>
    </DemoShell>
  );
}
