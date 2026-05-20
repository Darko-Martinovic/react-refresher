import { useMemo, useState } from 'react';
import { List, type RowComponentProps } from 'react-window';
import {
  Box,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface Item {
  id: number;
  name: string;
  email: string;
}

const ROW_HEIGHT = 56;

function generate(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot'][i % 6] + ' ' + (i + 1),
    email: 'user' + i + '@example.com',
  }));
}

interface RowProps {
  items: Item[];
}

function Row({ index, style, items, ariaAttributes }: RowComponentProps<RowProps>) {
  const item = items[index];
  return (
    <Box
      style={style}
      {...ariaAttributes}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        padding: '0 0.85rem',
        borderBottom: '1px solid var(--surface-border)',
        background: index % 2 === 0 ? 'var(--surface-1)' : 'var(--surface-2)',
      }}
    >
      <Typography
        sx={{
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
          minWidth: 60,
        }}
      >
        #{item.id}
      </Typography>
      <Typography sx={{ fontWeight: 500, color: 'var(--text-primary)' }}>
        {item.name}
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem', ml: 'auto' }}>
        {item.email}
      </Typography>
    </Box>
  );
}

export default function VirtualizedListDemo() {
  const [virtualized, setVirtualized] = useState(true);
  const [size, setSize] = useState(10_000);
  const items = useMemo(() => generate(size), [size]);

  return (
    <DemoShell
      title="10k rows — virtualized vs naive"
      description="Toggle virtualization off and notice the difference. Naive rendering of 10k DOM nodes is sluggish even on modern hardware."
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={virtualized}
              onChange={(_, v) => setVirtualized(v)}
              size="small"
            />
          }
          label={virtualized ? 'Virtualized (react-window)' : 'Naive (full mount — slow)'}
        />
        <TextField
          size="small"
          label="Row count"
          type="number"
          value={size}
          onChange={(e) => setSize(Math.max(1, Math.min(50_000, +e.target.value || 0)))}
          sx={{ width: 130 }}
          slotProps={{ htmlInput: { min: 1, max: 50_000, step: 100 } }}
        />
      </Box>

      <Box
        sx={{
          border: '1px solid var(--surface-border)',
          borderRadius: 1.5,
          overflow: 'hidden',
          height: 400,
        }}
      >
        {virtualized ? (
          <List
            rowCount={items.length}
            rowHeight={ROW_HEIGHT}
            rowComponent={Row}
            rowProps={{ items }}
            style={{ height: 400 }}
          />
        ) : (
          <Box sx={{ height: 400, overflowY: 'auto' }}>
            {items.map((_, index) => (
              <Row
                key={index}
                index={index}
                items={items}
                style={{ height: ROW_HEIGHT }}
                ariaAttributes={{
                  'aria-posinset': index + 1,
                  'aria-setsize': items.length,
                  role: 'listitem',
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </DemoShell>
  );
}
