import { createContext, useContext, useRef, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { DemoShell } from '@/shared/DemoShell';

/** Render-count overlay shared by all three variants */
function useRenderCount() {
  const ref = useRef(0);
  ref.current++;
  return ref.current;
}

// 1) Local — state lives inside the input component itself
function Local() {
  const renders = useRenderCount();
  const [value, setValue] = useState('');
  return (
    <Card label="Local state" renders={renders}>
      <TextField
        size="small"
        fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type — only this card re-renders"
      />
    </Card>
  );
}

// 2) Lifted — state in the parent
function LiftedParent() {
  const [value, setValue] = useState('');
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
      <LiftedInput value={value} onChange={setValue} />
      <LiftedEcho value={value} />
    </Box>
  );
}
function LiftedInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const renders = useRenderCount();
  return (
    <Card label="Lifted: input" renders={renders}>
      <TextField
        size="small"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type me…"
      />
    </Card>
  );
}
function LiftedEcho({ value }: { value: string }) {
  const renders = useRenderCount();
  return (
    <Card label="Lifted: echo" renders={renders}>
      <Typography sx={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {value || '—'}
      </Typography>
    </Card>
  );
}

// 3) Context — same idea via context
interface Ctx {
  value: string;
  setValue: (next: string) => void;
}
const FieldContext = createContext<Ctx | null>(null);
function ContextParent() {
  const [value, setValue] = useState('');
  return (
    <FieldContext.Provider value={{ value, setValue }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <ContextInput />
        <ContextEcho />
      </Box>
    </FieldContext.Provider>
  );
}
function ContextInput() {
  const renders = useRenderCount();
  const ctx = useContext(FieldContext)!;
  return (
    <Card label="Context: input" renders={renders}>
      <TextField
        size="small"
        fullWidth
        value={ctx.value}
        onChange={(e) => ctx.setValue(e.target.value)}
      />
    </Card>
  );
}
function ContextEcho() {
  const renders = useRenderCount();
  const ctx = useContext(FieldContext)!;
  return (
    <Card label="Context: echo" renders={renders}>
      <Typography sx={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {ctx.value || '—'}
      </Typography>
    </Card>
  );
}

export default function StateColocationDemo() {
  return (
    <DemoShell
      title="Same UI, three placements"
      description="Type into each input and watch the render counts. Local state only re-renders the local card; lifted/context update both."
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Section label="1 · Local state">
          <Local />
        </Section>
        <Section label="2 · Lifted state">
          <LiftedParent />
        </Section>
        <Section label="3 · Context">
          <ContextParent />
        </Section>
      </Box>
    </DemoShell>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box>
      <Typography
        sx={{
          fontSize: '0.75rem',
          color: 'var(--accent-strong)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 1,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function Card({
  label,
  renders,
  children,
}: {
  label: string;
  renders: number;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        padding: 1.5,
        background: 'var(--surface-2)',
        border: '1px solid var(--surface-border)',
        borderRadius: 1.5,
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75, gap: 1 }}
      >
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {label}
        </Typography>
        <Typography
          sx={{ color: 'var(--accent-strong)', fontSize: '0.8rem', fontWeight: 600 }}
        >
          renders: {renders}
        </Typography>
      </Box>
      {children}
    </Box>
  );
}
