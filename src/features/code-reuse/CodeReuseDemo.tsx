import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface Pos {
  x: number;
  y: number;
}

// Custom hook (modern)
function useMouse(): Pos {
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return pos;
}

// HOC
function withMouse<P extends { mouse: Pos }>(
  Comp: React.ComponentType<P>,
): React.ComponentType<Omit<P, 'mouse'>> {
  return function WithMouse(props: Omit<P, 'mouse'>) {
    const mouse = useMouse();
    return <Comp {...(props as P)} mouse={mouse} />;
  };
}

// Render prop component
function Mouse({ children }: { children: (m: Pos) => React.ReactNode }) {
  const m = useMouse();
  return <>{children(m)}</>;
}

function Display({ label, mouse }: { label: string; mouse: Pos }) {
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
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
      <Typography
        sx={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem' }}
      >
        ({mouse.x}, {mouse.y})
      </Typography>
    </Box>
  );
}

const HocDisplay = withMouse(Display);

export default function CodeReuseDemo() {
  const mouse = useMouse();

  return (
    <DemoShell
      title="Three ways to share mouse-tracking logic"
      description="Move your mouse. All three boxes consume the same state via different patterns. Hooks (left) win for most use cases."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Display label="Custom hook (modern)" mouse={mouse} />
        <HocDisplay label="HOC (withMouse)" />
        <Mouse>{(m) => <Display label="Render prop (<Mouse>)" mouse={m} />}</Mouse>
      </Box>
    </DemoShell>
  );
}
