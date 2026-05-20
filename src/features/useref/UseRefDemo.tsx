import { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

export default function UseRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  const [tick, setTick] = useState(0);

  // Track every render
  renderCount.current++;

  useEffect(() => {
    // Focus on mount
    inputRef.current?.focus();
  }, []);

  return (
    <DemoShell
      title="DOM ref + value ref"
      description="The left card stores a DOM node — useful for imperative APIs like focus(). The right card stores a counter that never triggers a re-render."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Card label="DOM ref (focus)">
          <TextField
            inputRef={inputRef}
            size="small"
            fullWidth
            placeholder="I focused on mount"
          />
          <Button
            sx={{ mt: 1 }}
            size="small"
            variant="outlined"
            onClick={() => inputRef.current?.focus()}
          >
            Focus me again
          </Button>
        </Card>

        <Card label="Value ref (renders without re-rendering)">
          <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            renderCount.current
          </Typography>
          <Typography sx={{ fontSize: '2.5rem', fontWeight: 600 }}>
            {renderCount.current}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setTick((t) => t + 1)}
          >
            Force re-render (tick={tick})
          </Button>
        </Card>
      </Box>
    </DemoShell>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'var(--accent-strong)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}
