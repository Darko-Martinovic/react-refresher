import { memo, useRef, useState } from 'react';
import { Box, Button, FormControlLabel, Switch, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface ChildProps {
  // Same data, but the parent toggles whether to pass it inline (new ref) or stable.
  data: number[];
}

const ChildPlain = function Child(_props: ChildProps) {
  const renderCount = useRef(0);
  renderCount.current++;
  return (
    <RenderCard label="Plain (no memo)" renders={renderCount.current} color="warn" />
  );
};

const ChildMemo = memo(function ChildMemo(_props: ChildProps) {
  const renderCount = useRef(0);
  renderCount.current++;
  return (
    <RenderCard
      label="React.memo (shallow compare)"
      renders={renderCount.current}
      color="success"
    />
  );
});

const STABLE_DATA = [1, 2, 3];

export default function RerenderCausesDemo() {
  const [tick, setTick] = useState(0);
  const [passInline, setPassInline] = useState(true);

  return (
    <DemoShell
      title="What actually re-renders"
      description="Click the button to re-render the parent. Toggle the prop strategy and watch the memoized child's render count."
    >
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Button variant="contained" onClick={() => setTick((t) => t + 1)}>
          Force parent re-render ({tick})
        </Button>
        <FormControlLabel
          control={
            <Switch
              checked={passInline}
              onChange={(_, v) => setPassInline(v)}
              size="small"
            />
          }
          label={passInline ? 'Inline array: [1,2,3]' : 'Stable array (module constant)'}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <ChildPlain data={passInline ? [1, 2, 3] : STABLE_DATA} />
        <ChildMemo data={passInline ? [1, 2, 3] : STABLE_DATA} />
      </Box>

      <Typography
        sx={{
          mt: 2,
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
        }}
      >
        With inline arrays, the memoized child re-renders every time too — same contents, different reference. Switch to stable and the memoized child stops re-rendering.
      </Typography>
    </DemoShell>
  );
}

function RenderCard({
  label,
  renders,
  color,
}: {
  label: string;
  renders: number;
  color: 'success' | 'warn';
}) {
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
      }}
    >
      <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.75rem',
          fontWeight: 600,
          color: `var(--${color})`,
        }}
      >
        {renders}
      </Typography>
      <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        renders so far
      </Typography>
    </Box>
  );
}
