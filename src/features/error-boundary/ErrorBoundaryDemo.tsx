import { Component, type ReactNode, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DemoShell } from '@/shared/DemoShell';

interface EBProps {
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}
interface EBState {
  error: Error | null;
}
class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null };
  static getDerivedStateFromError(error: Error): EBState {
    return { error };
  }
  componentDidCatch(_error: Error) {
    // In a real app: sendToSentry(_error)
  }
  reset = () => this.setState({ error: null });
  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}

function Bomb({ explode }: { explode: boolean }) {
  if (explode) {
    throw new Error('Component threw during render');
  }
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        borderRadius: 1.5,
        border: '1px solid var(--surface-border)',
      }}
    >
      <Typography>I&apos;m a fine component until you tell me to throw.</Typography>
    </Box>
  );
}

export default function ErrorBoundaryDemo() {
  const [explode, setExplode] = useState(false);
  return (
    <DemoShell
      title="Error Boundary catches a thrown render"
      description="Click 'Throw on render'. The boundary's fallback appears. Click 'Try again' inside the fallback to reset and remount the child."
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          color={explode ? 'error' : 'primary'}
          onClick={() => setExplode(true)}
        >
          Throw on render
        </Button>
        <Button variant="outlined" onClick={() => setExplode(false)}>
          Reset bomb prop
        </Button>
      </Box>

      <ErrorBoundary
        fallback={(error, reset) => (
          <Box
            sx={{
              padding: 2,
              background: 'color-mix(in srgb, var(--danger) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--danger) 40%, transparent)',
              borderRadius: 1.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              color: 'var(--danger)',
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>Something went wrong</Typography>
            <Typography
              sx={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              {error.message}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                setExplode(false);
                reset();
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              Try again
            </Button>
          </Box>
        )}
      >
        <Bomb explode={explode} />
      </ErrorBoundary>
    </DemoShell>
  );
}
