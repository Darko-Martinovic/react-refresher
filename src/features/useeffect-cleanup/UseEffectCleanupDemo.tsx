import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

// A tiny pub/sub to play the role of an external system to "subscribe" to.
class EventHub {
  private listeners = new Set<(payload: string) => void>();
  subscribe(fn: (payload: string) => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  emit(payload: string) {
    this.listeners.forEach((fn) => fn(payload));
  }
  get count() {
    return this.listeners.size;
  }
}

const hub = new EventHub();

interface SubscriberProps {
  cleanup: boolean;
  pushLog: (line: string) => void;
}

function Subscriber({ cleanup, pushLog }: SubscriberProps) {
  useEffect(() => {
    const id = Math.random().toString(36).slice(2, 6);
    pushLog(`[sub ${id}] subscribed (active=${hub.count + 1})`);
    const off = hub.subscribe((payload) => pushLog(`[sub ${id}] received: ${payload}`));
    if (!cleanup) return; // BAD — never unsubscribes
    return () => {
      off();
      pushLog(`[sub ${id}] unsubscribed (active=${hub.count - 1})`);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanup]);

  return null;
}

export default function UseEffectCleanupDemo() {
  const [cleanup, setCleanup] = useState(true);
  const [mounted, setMounted] = useState(true);
  const [log, setLog] = useState<string[]>([]);

  const pushLog = (line: string) =>
    setLog((l) => [...l.slice(-15), `${new Date().toLocaleTimeString()}  ${line}`]);

  return (
    <DemoShell
      title="Subscribe, with or without cleanup"
      description="Watch the log. In StrictMode + dev, every mount runs twice — without cleanup the second subscription stays attached forever."
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={cleanup}
              onChange={(_, v) => setCleanup(v)}
              size="small"
            />
          }
          label={cleanup ? 'With cleanup' : 'Without cleanup (BAD)'}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => setMounted((m) => !m)}
        >
          {mounted ? 'Unmount subscriber' : 'Mount subscriber'}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => hub.emit('ping ' + Date.now().toString().slice(-4))}
        >
          Emit event (active listeners: {hub.count})
        </Button>
        <Button variant="text" size="small" onClick={() => setLog([])}>
          Clear log
        </Button>
      </Box>

      {mounted && <Subscriber cleanup={cleanup} pushLog={pushLog} />}

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
          maxHeight: 200,
          overflowY: 'auto',
        }}
      >
        {log.length === 0 ? (
          <Typography sx={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            Mount/unmount the subscriber and emit events to populate the log.
          </Typography>
        ) : (
          log.map((line, i) => <Box key={i}>{line}</Box>)
        )}
      </Box>
    </DemoShell>
  );
}
