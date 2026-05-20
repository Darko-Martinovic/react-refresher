import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';
import { CodeBlock } from '@/shared/CodeBlock';

const TYPE_BASED = `src/
  components/
    Header.tsx
    UserCard.tsx
    OrderTable.tsx
    ProductCard.tsx
  hooks/
    useUsers.ts
    useOrders.ts
    useProducts.ts
  services/
    usersApi.ts
    ordersApi.ts
    productsApi.ts
  store/
    usersSlice.ts
    ordersSlice.ts
    productsSlice.ts`;

const FEATURE_BASED = `src/
  shared/
    Button.tsx
    Modal.tsx
    DataGrid.tsx
  features/
    users/
      UserCard.tsx
      useUsers.ts
      api.ts
      slice.ts
      index.ts        # public API
    orders/
      OrderTable.tsx
      useOrders.ts
      api.ts
      slice.ts
      index.ts
    products/
      ProductCard.tsx
      useProducts.ts
      api.ts
      slice.ts
      index.ts`;

export default function FolderStructureDemo() {
  return (
    <DemoShell
      title="By-type vs by-feature"
      description="Adding the orders feature to the left tree touches 4 separate folders; adding it to the right tree means adding one folder."
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
              color: 'var(--warn)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              mb: 1,
            }}
          >
            By type — junior default
          </Typography>
          <CodeBlock code={TYPE_BASED} language="bash" />
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
            By feature — scales
          </Typography>
          <CodeBlock code={FEATURE_BASED} language="bash" />
        </Box>
      </Box>
    </DemoShell>
  );
}
