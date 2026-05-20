import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DemoShell } from '@/shared/DemoShell';

interface State {
  error: string | null;
  message: string | null;
}

async function login(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  await new Promise((r) => setTimeout(r, 800));
  if (!email.includes('@')) return { error: 'Invalid email', message: null };
  if (password.length < 8) return { error: 'Password must be ≥ 8 chars', message: null };
  return { error: null, message: `Signed in as ${email}` };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </Button>
  );
}

export default function UseActionStateDemo() {
  const [state, action] = useActionState<State, FormData>(login, {
    error: null,
    message: null,
  });

  return (
    <DemoShell
      title="useActionState + useFormStatus"
      description="The form action returns the next state. useFormStatus inside the button reads pending without any prop drilling."
    >
      <Box
        component="form"
        action={action}
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <TextField
          name="email"
          size="small"
          label="Email"
          defaultValue="user@example.com"
          autoComplete="off"
        />
        <TextField
          name="password"
          size="small"
          label="Password"
          type="password"
          defaultValue="short"
        />
        <Box>
          <SubmitButton />
        </Box>
        {state.error && (
          <Typography role="alert" sx={{ color: 'var(--danger)', fontSize: '0.9rem' }}>
            {state.error}
          </Typography>
        )}
        {state.message && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              padding: 1.5,
              borderRadius: 1.5,
              background: 'color-mix(in srgb, var(--success) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--success) 35%, transparent)',
              color: 'var(--success)',
            }}
          >
            <CheckCircleIcon fontSize="small" />
            <Typography>{state.message}</Typography>
          </Box>
        )}
      </Box>
      <Typography
        sx={{
          mt: 2,
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic',
        }}
      >
        Try: leave password short, or remove the @ in the email.
      </Typography>
    </DemoShell>
  );
}
