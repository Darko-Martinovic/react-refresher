import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';
import { CodeBlock } from '@/shared/CodeBlock';

const UNIT = `// utils/currency.ts
export const fmtUSD = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
    .format(cents / 100);

// utils/currency.test.ts
import { describe, expect, test } from 'vitest';
import { fmtUSD } from './currency';

describe('fmtUSD', () => {
  test('formats whole dollars', () => {
    expect(fmtUSD(12_345)).toBe('$123.45');
  });
});`;

const COMPONENT = `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

test('shows error on invalid credentials', async () => {
  render(<LoginForm onSubmit={async () => 'Invalid credentials'} />);
  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/invalid/i);
});`;

const INTEGRATION = `import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/orders', () =>
    HttpResponse.json([{ id: 1, customer: 'Acme', total: 199 }]),
  ),
);
beforeAll(() => server.listen());
afterAll(() => server.close());

test('renders orders from the API', async () => {
  render(<OrdersPage />);
  expect(await screen.findByText('Acme')).toBeInTheDocument();
});`;

const E2E = `// e2e/login.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('user can sign in and reach the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('me@example.com');
  await page.getByLabel(/password/i).fill('correct horse');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\\/dashboard/);
});`;

const LAYERS = [
  {
    label: 'Unit (Vitest)',
    note: 'Pure functions, custom hooks, reducers. Fast, focused.',
    code: UNIT,
  },
  {
    label: 'Component (Testing Library)',
    note: 'Render → interact like a user → assert on the DOM.',
    code: COMPONENT,
  },
  {
    label: 'Integration (MSW)',
    note: 'Bigger render slice + mocked network. Highest ROI layer.',
    code: INTEGRATION,
  },
  {
    label: 'E2E (Playwright)',
    note: 'Real browser, real flows. Reserve for critical paths.',
    code: E2E,
  },
];

export default function TestingDemo() {
  return (
    <DemoShell
      title="The pyramid in code"
      description="Fat integration layer, thinner unit layer below, just a handful of E2E on top. Test behavior, not implementation."
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {LAYERS.map((l) => (
          <Box key={l.label} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'var(--accent-strong)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {l.label}
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {l.note}
            </Typography>
            <CodeBlock code={l.code} language="tsx" />
          </Box>
        ))}
      </Box>
    </DemoShell>
  );
}
