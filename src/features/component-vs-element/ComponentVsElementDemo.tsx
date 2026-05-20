import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';
import { CodeBlock } from '@/shared/CodeBlock';

function Greeting({ name }: { name: string }) {
  return <h3 style={{ margin: 0 }}>Hello, {name}!</h3>;
}

export default function ComponentVsElementDemo() {
  const element = <Greeting name="Darko" />;

  // Inspect the element object directly.
  const elementShape = {
    type: '[Function: Greeting]',
    props: { name: 'Darko' },
    key: element.key,
  };

  return (
    <DemoShell
      title="Three layers, side by side"
      description="The component (function), the element it produces (plain object), and the DOM node React commits."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <Layer label="1 · Component" color="accent">
          <CodeBlock
            code={`function Greeting({ name }) {
  return <h3>Hello, {name}!</h3>;
}`}
            language="tsx"
          />
        </Layer>
        <Layer label="2 · Element (object)" color="warn">
          <CodeBlock
            code={JSON.stringify(elementShape, null, 2)}
            language="json"
          />
        </Layer>
        <Layer label="3 · DOM node" color="success">
          <Box
            sx={{
              padding: 2,
              border: '1px dashed var(--surface-border)',
              borderRadius: 1,
              background: 'var(--surface-2)',
            }}
          >
            {element}
            <Typography
              sx={{
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                mt: 1,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              &lt;h3&gt;Hello, Darko!&lt;/h3&gt;
            </Typography>
          </Box>
        </Layer>
      </Box>
    </DemoShell>
  );
}

function Layer({
  label,
  color,
  children,
}: {
  label: string;
  color: 'accent' | 'warn' | 'success';
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Typography
        sx={{
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: `var(--${color === 'warn' ? 'warn' : color === 'success' ? 'success' : 'accent-strong'})`,
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}
