import { useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

function Greeting({ name }: { name: string }) {
  const mountedAt = useRef(Date.now());
  return (
    <Box
      sx={{
        padding: 1.5,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
      }}
    >
      <Typography>Hello, {name}!</Typography>
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        mounted-at: {mountedAt.current}
      </Typography>
    </Box>
  );
}

export default function ReconciliationKeysDemo() {
  const [name, setName] = useState('Darko');
  const [mode, setMode] = useState<'same-type' | 'different-type' | 'key-swap'>('same-type');

  return (
    <DemoShell
      title="What survives vs what remounts"
      description="Watch the 'mounted-at' timestamp. Same type at the same position → instance preserved. Different type or different key → unmount + remount (new timestamp)."
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          size="small"
          variant={mode === 'same-type' ? 'contained' : 'outlined'}
          onClick={() => setMode('same-type')}
        >
          Same type, different name prop
        </Button>
        <Button
          size="small"
          variant={mode === 'different-type' ? 'contained' : 'outlined'}
          onClick={() => setMode('different-type')}
        >
          Different element type
        </Button>
        <Button
          size="small"
          variant={mode === 'key-swap' ? 'contained' : 'outlined'}
          onClick={() => setMode('key-swap')}
        >
          Same type, different key
        </Button>
        <Button size="small" variant="text" onClick={() => setName((n) => (n === 'Darko' ? 'Alice' : 'Darko'))}>
          Swap name ({name})
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {mode === 'same-type' && <Greeting name={name} />}
        {mode === 'different-type' &&
          (name === 'Darko' ? (
            <Greeting name={name} />
          ) : (
            <Box
              sx={{
                padding: 1.5,
                background: 'var(--surface-2)',
                border: '1px solid var(--surface-border)',
                borderRadius: 1.5,
              }}
            >
              <Typography>Plain div now ({name}) — Greeting unmounted</Typography>
            </Box>
          ))}
        {mode === 'key-swap' && <Greeting key={name} name={name} />}
      </Box>
    </DemoShell>
  );
}
