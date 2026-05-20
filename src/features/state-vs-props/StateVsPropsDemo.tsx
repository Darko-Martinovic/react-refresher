import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { DemoShell } from '@/shared/DemoShell';

interface CounterDisplayProps {
  count: number;
  label: string;
}

/** Pure child — props in, JSX out. No state of its own. */
function CounterDisplay({ count, label }: CounterDisplayProps) {
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        borderRadius: 1.5,
        border: '1px solid var(--surface-border)',
      }}
    >
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '2rem', fontWeight: 600 }}>{count}</Typography>
    </Box>
  );
}

export default function StateVsPropsDemo() {
  const [count, setCount] = useState(0);

  return (
    <DemoShell
      title="Parent owns state, child renders a prop"
      description="Click the buttons. The child has no useState — it just renders whatever `count` it's given."
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RemoveIcon />}
          onClick={() => setCount((c) => c - 1)}
        >
          Decrement
        </Button>
        <CounterDisplay count={count} label="count (prop)" />
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setCount((c) => c + 1)}
        >
          Increment
        </Button>
        <Button
          variant="text"
          size="small"
          onClick={() => setCount(0)}
          sx={{ ml: 'auto' }}
        >
          Reset
        </Button>
      </Box>
    </DemoShell>
  );
}
