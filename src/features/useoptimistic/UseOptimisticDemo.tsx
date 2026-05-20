import { useOptimistic, useState, useTransition } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { DemoShell } from '@/shared/DemoShell';

interface LikeState {
  liked: boolean;
  count: number;
}

function fakeToggleLike(next: boolean): Promise<{ liked: boolean }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // ~30% chance of failure to demo the rollback
      if (Math.random() < 0.3) reject(new Error('Network blip'));
      else resolve({ liked: next });
    }, 700);
  });
}

export default function UseOptimisticDemo() {
  const [state, setState] = useState<LikeState>({ liked: false, count: 42 });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [optimistic, setOptimistic] = useOptimistic<LikeState, boolean>(
    state,
    (curr, next) => ({ liked: next, count: curr.count + (next ? 1 : -1) }),
  );

  const onClick = () => {
    const next = !optimistic.liked;
    setError(null);
    startTransition(async () => {
      setOptimistic(next);
      try {
        await fakeToggleLike(next);
        setState({ liked: next, count: state.count + (next ? 1 : -1) });
      } catch (e: unknown) {
        // React will revert the optimistic value because the action threw / didn't commit.
        setError(e instanceof Error ? e.message : 'Failed');
      }
    });
  };

  return (
    <DemoShell
      title="Optimistic like button"
      description="Clicks flip the heart instantly. Roughly 30% of clicks fail; the optimistic value rolls back and an error appears."
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant={optimistic.liked ? 'contained' : 'outlined'}
          color={optimistic.liked ? 'error' : 'primary'}
          startIcon={optimistic.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          onClick={onClick}
          disabled={isPending}
          sx={{ minWidth: 140 }}
        >
          {optimistic.liked ? 'Liked' : 'Like'} · {optimistic.count}
        </Button>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Real state: {state.liked ? 'liked' : 'not liked'} · {state.count}
        </Typography>
      </Box>
      {error && (
        <Typography
          role="alert"
          sx={{ mt: 1.5, color: 'var(--danger)', fontSize: '0.9rem' }}
        >
          {error} — optimistic value rolled back.
        </Typography>
      )}
    </DemoShell>
  );
}
