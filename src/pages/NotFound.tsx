import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function NotFound() {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
        gap: 2,
      }}
    >
      <SearchOffIcon sx={{ fontSize: '4rem', color: 'var(--text-muted)' }} />
      <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 600 }}>
        Page not found
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)' }}>
        That route doesn&apos;t match any feature in the registry.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back to home
      </Button>
    </Box>
  );
}
