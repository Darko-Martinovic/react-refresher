import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DemoShell } from '@/shared/DemoShell';

interface Item {
  id: string;
  name: string;
}

const INITIAL: Item[] = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Bravo' },
  { id: 'c', name: 'Charlie' },
  { id: 'd', name: 'Delta' },
];

export default function KeysAndListsDemo() {
  const [items, setItems] = useState<Item[]>(INITIAL);

  const swap = (i: number, j: number) => {
    setItems((arr) => {
      if (i < 0 || j < 0 || i >= arr.length || j >= arr.length) return arr;
      const next = arr.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const shuffle = () => {
    setItems((arr) => {
      const next = arr.slice();
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  const reset = () => setItems(INITIAL);

  return (
    <DemoShell
      title="Index key vs id key"
      description="Type into the inputs, then shuffle. Notice how the left list ties typed values to position; the right list keeps them attached to the row."
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<ShuffleIcon />}
          onClick={shuffle}
        >
          Shuffle
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RestartAltIcon />}
          onClick={reset}
        >
          Reset
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <ListColumn
          title="key={index}  (BAD)"
          color="danger"
          items={items}
          renderItem={(item, i) => (
            <Row
              key={i}
              item={item}
              onUp={() => swap(i, i - 1)}
              onDown={() => swap(i, i + 1)}
            />
          )}
        />
        <ListColumn
          title="key={item.id}  (GOOD)"
          color="success"
          items={items}
          renderItem={(item, i) => (
            <Row
              key={item.id}
              item={item}
              onUp={() => swap(i, i - 1)}
              onDown={() => swap(i, i + 1)}
            />
          )}
        />
      </Box>
    </DemoShell>
  );
}

function ListColumn({
  title,
  color,
  items,
  renderItem,
}: {
  title: string;
  color: 'danger' | 'success';
  items: Item[];
  renderItem: (item: Item, i: number) => React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography
        sx={{
          fontSize: '0.78rem',
          color: `var(--${color})`,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          padding: 1.5,
          background: 'var(--surface-2)',
          borderRadius: 1.5,
          border: '1px solid var(--surface-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        {items.map(renderItem)}
      </Box>
    </Box>
  );
}

function Row({
  item,
  onUp,
  onDown,
}: {
  item: Item;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ minWidth: 60, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        {item.name}
      </Typography>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Type here…"
        fullWidth
        slotProps={{ input: { sx: { fontSize: '0.85rem' } } }}
      />
      <Tooltip title="Move up">
        <IconButton size="small" onClick={onUp}>
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Move down">
        <IconButton size="small" onClick={onDown}>
          <ArrowDownwardIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
