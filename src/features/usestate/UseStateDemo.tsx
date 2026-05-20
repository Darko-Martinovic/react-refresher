import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DemoShell } from '@/shared/DemoShell';

export default function UseStateDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const incrementBadly = () => {
    setCountA(countA + 1);
    setCountA(countA + 1);
    setCountA(countA + 1);
  };

  const incrementProperly = () => {
    setCountB((c) => c + 1);
    setCountB((c) => c + 1);
    setCountB((c) => c + 1);
  };

  return (
    <DemoShell
      title="Batching + the functional setter"
      description="Both buttons run three setters in one click. The 'value' form sees a stale snapshot; the 'function' form sees the latest queued state."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Card
          label="Value form (BAD): setCount(count + 1) × 3"
          color="danger"
          count={countA}
          onClick={incrementBadly}
          onReset={() => setCountA(0)}
        />
        <Card
          label="Function form (GOOD): setCount(c => c + 1) × 3"
          color="success"
          count={countB}
          onClick={incrementProperly}
          onReset={() => setCountB(0)}
        />
      </Box>
      <Typography
        sx={{ mt: 2, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}
      >
        Left click: count moves by +1 per click. Right click: count moves by +3.
      </Typography>
    </DemoShell>
  );
}

function Card({
  label,
  color,
  count,
  onClick,
  onReset,
}: {
  label: string;
  color: 'danger' | 'success';
  count: number;
  onClick: () => void;
  onReset: () => void;
}) {
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
          color: `var(--${color})`,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ fontSize: '2.5rem', fontWeight: 600 }}>{count}</Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained" size="small" onClick={onClick}>
          Increment ×3
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
}
