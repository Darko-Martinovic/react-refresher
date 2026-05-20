import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';
import { CodeBlock } from '@/shared/CodeBlock';

const MONOLITH = `function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');
  const [selectedId, setSelectedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => { /* fetch + setOrders */ }, []);
  useEffect(() => { /* set page title */ }, []);
  useEffect(() => { /* analytics */ }, [selectedId]);

  // ...200 lines of JSX mixing filters, table, drawer, pagination...
}`;

const SPLIT = `function useOrders() {
  // owns fetching + filter + sort
  const { data, isLoading, error } = useQuery(...);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('date');
  const filtered = useMemo(() => filterAndSort(data, filter, sort), [...]);
  return { filtered, isLoading, error, filter, setFilter, sort, setSort };
}

function OrderDrawer({ selectedId, onClose }) { /* one job */ }
function OrderTable({ orders, onSelect })     { /* one job */ }
function OrdersFilter({ value, onChange })    { /* one job */ }

function OrderPage() {
  const orders = useOrders();
  const [selectedId, setSelectedId] = useState(null);
  return (
    <>
      <OrdersFilter value={orders.filter} onChange={orders.setFilter} />
      <OrderTable orders={orders.filtered} onSelect={setSelectedId} />
      <OrderDrawer selectedId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}`;

export default function ComponentSplittingDemo() {
  return (
    <DemoShell
      title="Monolith vs extract-hook + composition"
      description="The smell on the left: many unrelated useState/useEffect calls and a 200-line JSX body. The fix on the right: a custom hook + small, named sub-components."
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
              fontSize: '0.75rem',
              color: 'var(--danger)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            Smell
          </Typography>
          <CodeBlock code={MONOLITH} language="tsx" />
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'var(--success)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            After
          </Typography>
          <CodeBlock code={SPLIT} language="tsx" />
        </Box>
      </Box>
    </DemoShell>
  );
}
