import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface DemoShellProps {
  title?: string;
  description?: ReactNode;
  children: ReactNode;
}

/** Lightweight wrapper used by every demo for consistent spacing + title. */
export function DemoShell({ title, description, children }: DemoShellProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {title && (
        <Typography
          sx={{
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      )}
      {description && (
        <Typography sx={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          {description}
        </Typography>
      )}
      <Box>{children}</Box>
    </Box>
  );
}
