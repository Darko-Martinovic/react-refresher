import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';
import { CodeBlock } from '@/shared/CodeBlock';

const BAD = `function Profile({ id }: { id?: string }) {
  // BAD — hook order changes when id is undefined
  if (id) {
    const [tab, setTab] = useState('overview');
  }
  const [name, setName] = useState('');
  // React error: "Rendered fewer hooks than expected"
}`;

const GOOD = `function Profile({ id }: { id?: string }) {
  // GOOD — all hooks at top, branch on value
  const [tab, setTab] = useState('overview');
  const [name, setName] = useState('');
  if (!id) return <NoProfile />;
  return <Tabs value={tab} onChange={setTab}>{/* ... */}</Tabs>;
}`;

export default function RulesOfHooksDemo() {
  // Just to make this a 'live' component — toggling re-renders without breaking
  const [toggle, setToggle] = useState(false);

  return (
    <DemoShell
      title="The bug call-order shifting causes"
      description="React tracks hooks by their position in the call order. Putting hooks inside a conditional shifts that order from one render to the next."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '0.78rem',
              color: 'var(--danger)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Bug
          </Typography>
          <CodeBlock code={BAD} language="tsx" />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.78rem',
              color: 'var(--success)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Fix
          </Typography>
          <CodeBlock code={GOOD} language="tsx" />
        </Box>
      </Box>
      <Typography
        sx={{ mt: 2, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}
        onClick={() => setToggle((v) => !v)}
      >
        {toggle ? '↻ ' : ''}eslint-plugin-react-hooks catches both rule violations at lint time. Keep it at error level.
      </Typography>
    </DemoShell>
  );
}
