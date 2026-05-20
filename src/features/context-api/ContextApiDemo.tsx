import { createContext, useContext, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

type Mode = 'light' | 'dark';
interface ThemeCtx {
  mode: Mode;
  toggle: () => void;
}
const ThemeContext = createContext<ThemeCtx | null>(null);

function DeepLeaf({ label }: { label: string }) {
  const renders = useRef(0);
  renders.current++;
  const ctx = useContext(ThemeContext)!;
  return (
    <Box
      sx={{
        padding: '0.5rem 0.85rem',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1,
        background: ctx.mode === 'dark' ? '#1a1d27' : '#ffffff',
        color: ctx.mode === 'dark' ? '#f5f7fa' : '#0f172a',
      }}
    >
      <Typography sx={{ fontSize: '0.85rem' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.85rem', opacity: 0.7 }}>
        mode={ctx.mode} · renders={renders.current}
      </Typography>
    </Box>
  );
}

function ConsumersTree() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
      <DeepLeaf label="A" />
      <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <DeepLeaf label="A › B" />
        <Box sx={{ pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <DeepLeaf label="A › B › C" />
          <DeepLeaf label="A › B › D" />
        </Box>
      </Box>
    </Box>
  );
}

export default function ContextApiDemo() {
  const [mode, setMode] = useState<Mode>('light');
  const [tick, setTick] = useState(0);
  const [stableValue, setStableValue] = useState(true);

  // Stable vs new-object-every-render value
  const memoValue = useMemo(
    () => ({ mode, toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')) }),
    [mode],
  );
  const inlineValue: ThemeCtx = {
    mode,
    toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
  };

  const value = stableValue ? memoValue : inlineValue;

  return (
    <DemoShell
      title="Provider value stability matters"
      description="Click 'Force parent re-render'. With an inline (new-object) value, every consumer re-renders; with a stable memoized value, none do unless the mode actually changes."
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Button variant="outlined" size="small" onClick={() => setTick((t) => t + 1)}>
          Force parent re-render ({tick})
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={stableValue}
              onChange={(_, v) => setStableValue(v)}
              size="small"
            />
          }
          label={stableValue ? 'Stable value (useMemo)' : 'Inline value (NEW each render)'}
        />
        <Button variant="contained" size="small" onClick={value.toggle}>
          Toggle theme (mode: {mode})
        </Button>
      </Box>
      <ThemeContext.Provider value={value}>
        <ConsumersTree />
      </ThemeContext.Provider>
    </DemoShell>
  );
}
