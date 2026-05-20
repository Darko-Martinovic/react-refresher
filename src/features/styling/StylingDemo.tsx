import { Box, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';
import { CodeBlock } from '@/shared/CodeBlock';

const CSS_MODULES = `// Button.module.css
.btn { padding: .5rem 1rem; background: #2563eb; color: white; }

// Button.tsx
import styles from './Button.module.css';
<button className={styles.btn}>Save</button>`;

const TAILWIND = `<button className="px-4 py-2 bg-blue-600 text-white rounded">
  Save
</button>`;

const STYLED = `import styled from 'styled-components';

const Btn = styled.button\`
  padding: .5rem 1rem;
  background: \${p => p.theme.primary};
  color: white;
  border-radius: .375rem;
\`;
<Btn>Save</Btn>`;

const VANILLA_EXTRACT = `// button.css.ts
import { style } from '@vanilla-extract/css';

export const btn = style({
  padding: '0.5rem 1rem',
  background: '#2563eb',
  color: 'white',
  borderRadius: '0.375rem',
});

// Button.tsx
import { btn } from './button.css';
<button className={btn}>Save</button>`;

export default function StylingDemo() {
  return (
    <DemoShell
      title="Same button, four styling approaches"
      description="Trade-offs: runtime cost, design-system enforcement, build-time vs runtime, and RSC compatibility."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Card title="CSS Modules" note="Zero runtime, scoped classes">
          <CodeBlock code={CSS_MODULES} language="tsx" />
        </Card>
        <Card title="Tailwind" note="Utility-first, build-time only">
          <CodeBlock code={TAILWIND} language="tsx" />
        </Card>
        <Card title="styled-components" note="Runtime CSS-in-JS (RSC-awkward)">
          <CodeBlock code={STYLED} language="tsx" />
        </Card>
        <Card title="vanilla-extract" note="Zero-runtime CSS-in-JS">
          <CodeBlock code={VANILLA_EXTRACT} language="tsx" />
        </Card>
      </Box>
    </DemoShell>
  );
}

function Card({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'var(--accent-strong)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        {note}
      </Typography>
      {children}
    </Box>
  );
}
