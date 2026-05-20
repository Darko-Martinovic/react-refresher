import { memo, useCallback, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface ChildProps {
  onPing: () => void;
}

function ChildBody({ onPing: _onPing }: ChildProps) {
  const renders = useRef(0);
  renders.current++;
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
      }}
    >
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Child renders:
      </Typography>
      <Typography sx={{ fontSize: '2rem', fontWeight: 600 }}>
        {renders.current}
      </Typography>
    </Box>
  );
}

const ChildPlain = ChildBody;
const ChildMemo = memo(ChildBody);

export default function MemoMisuseDemo() {
  const [tick, setTick] = useState(0);
  const [memoOn, setMemoOn] = useState(false);
  const [stableCallback, setStableCallback] = useState(false);

  // The two callbacks the child gets
  const stable = useCallback(() => {}, []);
  const inline = () => {};

  const Child = memoOn ? ChildMemo : ChildPlain;
  const onPing = stableCallback ? stable : inline;

  return (
    <DemoShell
      title="memo only helps with stable props"
      description="Try all four combos. The child re-renders unless BOTH 'memo' and 'stable callback' are on."
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Button variant="contained" onClick={() => setTick((t) => t + 1)}>
          Force parent re-render ({tick})
        </Button>
        <FormControlLabel
          control={<Switch checked={memoOn} onChange={(_, v) => setMemoOn(v)} size="small" />}
          label="React.memo on"
        />
        <FormControlLabel
          control={
            <Switch
              checked={stableCallback}
              onChange={(_, v) => setStableCallback(v)}
              size="small"
            />
          }
          label="useCallback (stable)"
        />
      </Box>

      <Child onPing={onPing} />
    </DemoShell>
  );
}
