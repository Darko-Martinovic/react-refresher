import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface User {
  id: number;
  name: string;
}

// Simulated network — latency varies, so a quick-second request can resolve BEFORE
// the first one and overwrite it if not cancelled.
function fakeFetchUser(id: number, signal?: AbortSignal): Promise<User> {
  return new Promise((resolve, reject) => {
    const delay = 200 + Math.random() * 1200;
    const t = setTimeout(() => resolve({ id, name: 'User #' + id }), delay);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export default function DataFetchingDemo() {
  const [id, setId] = useState(1);
  const [useAbort, setUseAbort] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;
    setLoading(true);
    const requestId = id;
    setLog((l) => [...l.slice(-7), `→ fetch user ${requestId}`]);

    fakeFetchUser(requestId, useAbort ? ac.signal : undefined)
      .then((u) => {
        if (!useAbort && cancelled) {
          // Without abort, we'd still write the stale value; show the bug.
          setLog((l) => [...l.slice(-7), `  ← STALE write for user ${requestId}`]);
        }
        setUser(u);
        setLoading(false);
        setLog((l) => [...l.slice(-7), `  ← arrived user ${requestId}`]);
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          setLog((l) => [...l.slice(-7), `  × aborted request for user ${requestId}`]);
        }
      });

    return () => {
      cancelled = true;
      if (useAbort) ac.abort();
    };
  }, [id, useAbort]);

  return (
    <DemoShell
      title="Race conditions in useEffect fetches"
      description="Click the buttons quickly. Without AbortController, an earlier-issued request can resolve after a later one and write stale data. With AbortController, the earlier one is cancelled cleanly."
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Button
            key={n}
            size="small"
            variant={id === n ? 'contained' : 'outlined'}
            onClick={() => setId(n)}
          >
            Fetch #{n}
          </Button>
        ))}
        <FormControlLabel
          control={
            <Switch
              checked={useAbort}
              onChange={(_, v) => setUseAbort(v)}
              size="small"
            />
          }
          label={useAbort ? 'AbortController on' : 'AbortController off (BAD)'}
        />
      </Box>

      <Box
        sx={{
          padding: 1.5,
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)',
          borderRadius: 1.5,
          mb: 2,
        }}
      >
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Currently displayed
        </Typography>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
          {loading ? 'loading…' : (user?.name ?? '—')}
        </Typography>
      </Box>

      <Box
        sx={{
          padding: 1.5,
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)',
          borderRadius: 1.5,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
          minHeight: 160,
        }}
      >
        {log.length === 0 ? (
          <Typography sx={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Click a button to start a request.
          </Typography>
        ) : (
          log.map((line, i) => (
            <Box key={i} sx={{ color: line.includes('STALE') ? 'var(--danger)' : undefined }}>
              {line}
            </Box>
          ))
        )}
      </Box>
    </DemoShell>
  );
}
