import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

interface Order {
  id: string;
  customer: string;
  total: number;
}

const SAMPLE_RECENT: Order[] = [
  { id: 'ORD-1011', customer: 'Acme', total: 199 },
  { id: 'ORD-1012', customer: 'Initech', total: 89 },
  { id: 'ORD-1013', customer: 'Globex', total: 4250 },
];
const SAMPLE_TOP: Order[] = [
  { id: 'ORD-1013', customer: 'Globex', total: 4250 },
  { id: 'ORD-1009', customer: 'Hooli', total: 2100 },
  { id: 'ORD-1014', customer: 'Wonka Co.', total: 1799 },
];

// Container hooks — own data + state
function useRecentOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setOrders(SAMPLE_RECENT), 600);
    return () => clearTimeout(id);
  }, []);
  return { orders, isLoading: orders === null };
}

function useTopOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    const id = setTimeout(() => setOrders(SAMPLE_TOP), 900);
    return () => clearTimeout(id);
  }, []);
  return { orders, isLoading: orders === null };
}

// Pure presentational — props in, JSX out
function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <Box
      component="table"
      sx={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.85rem',
        '& th, & td': {
          padding: '0.5rem 0.6rem',
          textAlign: 'left',
          borderBottom: '1px solid var(--surface-border)',
        },
        '& th': {
          color: 'var(--text-muted)',
          fontWeight: 600,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
      }}
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Customer</th>
          <th style={{ textAlign: 'right' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{o.id}</td>
            <td>{o.customer}</td>
            <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              ${o.total.toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </Box>
  );
}

function OrderPanel({
  title,
  orders,
  isLoading,
}: {
  title: string;
  orders: Order[] | null;
  isLoading: boolean;
}) {
  return (
    <Box
      sx={{
        padding: 2,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'var(--accent-strong)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: 'var(--text-muted)' }}>
          <CircularProgress size={16} />
          Loading…
        </Box>
      ) : (
        <OrderTable orders={orders ?? []} />
      )}
    </Box>
  );
}

// Containers: hooks + presentational reused with different data sources
function RecentOrders() {
  const { orders, isLoading } = useRecentOrders();
  return <OrderPanel title="Recent orders" orders={orders} isLoading={isLoading} />;
}
function TopOrders() {
  const { orders, isLoading } = useTopOrders();
  return <OrderPanel title="Top orders" orders={orders} isLoading={isLoading} />;
}

export default function SmartVsPresentationalDemo() {
  return (
    <DemoShell
      title="One pure table, two containers"
      description="OrderTable is presentational (props in, JSX out). The 'container' role is played by the two hooks below — each owns its own data and reuses the same table."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <RecentOrders />
        <TopOrders />
      </Box>
    </DemoShell>
  );
}
