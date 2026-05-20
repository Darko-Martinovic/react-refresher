import { Suspense, use, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface User {
  id: number;
  name: string;
  email: string;
}

function fakeFetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          id,
          name: ['Alice', 'Bob', 'Carol', 'Dave', 'Eve'][id % 5] + ' #' + id,
          email: `user${id}@example.com`,
        }),
      900,
    );
  });
}

function UserCard({ promise }: { promise: Promise<User> }) {
  const user = use(promise);
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
      }}
    >
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        Synchronous read inside the component:
      </Typography>
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 600 }}>{user.name}</Typography>
      <Typography sx={{ color: 'var(--text-muted)' }}>{user.email}</Typography>
    </Box>
  );
}

export default function SuspenseUseHookDemo() {
  const [id, setId] = useState(1);
  // memoize so we don't create a new promise every parent render
  const promise = useMemo(() => fakeFetchUser(id), [id]);

  return (
    <DemoShell
      title="use(promise) inside a Suspense boundary"
      description="The component reads the user with `use(promise)` as if it were synchronous. The boundary shows the spinner while the promise is pending."
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Button
            key={n}
            size="small"
            variant={id === n ? 'contained' : 'outlined'}
            onClick={() => setId(n)}
          >
            Load user {n}
          </Button>
        ))}
      </Box>

      <Suspense
        fallback={
          <Box
            sx={{
              padding: 3,
              background: 'var(--surface-2)',
              border: '1px dashed var(--surface-border)',
              borderRadius: 1.5,
              display: 'flex',
              gap: 1.5,
              alignItems: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <CircularProgress size={18} />
            Suspense fallback…
          </Box>
        }
      >
        <UserCard promise={promise} />
      </Suspense>
    </DemoShell>
  );
}
