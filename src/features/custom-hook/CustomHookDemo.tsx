import { useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default function CustomHookDemo() {
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 250);

  // Imaginary "search" — show how often it would fire
  const [calls, setCalls] = useState(0);
  useEffect(() => {
    if (debounced) setCalls((c) => c + 1);
  }, [debounced]);

  return (
    <DemoShell
      title="useDebouncedValue"
      description="Type quickly. The debounced value commits ~250ms after you stop — that's when the imaginary search would fire."
    >
      <TextField
        size="small"
        fullWidth
        placeholder="Type rapidly…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
          gap: 1.5,
          mt: 2,
        }}
      >
        <Pill label="Live value" value={query || '—'} />
        <Pill label="Debounced (250ms)" value={debounced || '—'} accent />
        <Pill label="Search calls" value={String(calls)} />
      </Box>
    </DemoShell>
  );
}

function Pill({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Box
      sx={{
        padding: '0.85rem 1rem',
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
      }}
    >
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.05rem',
          color: accent ? 'var(--accent-strong)' : 'var(--text-primary)',
          fontWeight: accent ? 600 : 400,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
