import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DemoShell } from '@/shared/DemoShell';

interface FormValues {
  email: string;
  password: string;
  github: string;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormsRhfDemo() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '', github: '' },
    mode: 'onTouched',
  });
  const [submitted, setSubmitted] = useState<FormValues | null>(null);

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    setSubmitted(data);
  };

  return (
    <DemoShell
      title="React Hook Form + inline validation"
      description="Uncontrolled inputs. The form root does not re-render on every keystroke; errors compute on blur and on submit."
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <TextField
          size="small"
          label="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: emailRe, message: 'Must be a valid email' },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          size="small"
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <TextField
          size="small"
          label="GitHub username (optional)"
          {...register('github', {
            maxLength: { value: 39, message: 'Max 39 chars (GitHub limit)' },
            pattern: {
              value: /^[a-zA-Z0-9-]*$/,
              message: 'Letters, digits and hyphens only',
            },
          })}
          error={!!errors.github}
          helperText={errors.github?.message}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="text"
            onClick={() => {
              reset();
              setSubmitted(null);
            }}
          >
            Reset
          </Button>
        </Box>

        {submitted && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
              padding: 1.5,
              background: 'color-mix(in srgb, var(--success) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--success) 35%, transparent)',
              borderRadius: 1.5,
              color: 'var(--success)',
            }}
          >
            <CheckCircleIcon />
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Submitted</Typography>
              <Typography
                component="pre"
                sx={{
                  m: 0,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                }}
              >
                {JSON.stringify(submitted, null, 2)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </DemoShell>
  );
}
