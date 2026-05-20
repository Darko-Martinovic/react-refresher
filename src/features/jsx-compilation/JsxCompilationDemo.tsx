import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { CodeBlock } from '@/shared/CodeBlock';
import { DemoShell } from '@/shared/DemoShell';

const JSX_CODE = `<button className="btn primary" onClick={save}>
  Save changes
</button>`;

const CREATE_ELEMENT_CODE = `React.createElement(
  'button',
  { className: 'btn primary', onClick: save },
  'Save changes',
);`;

export default function JsxCompilationDemo() {
  const [showCompiled, setShowCompiled] = useState(false);

  return (
    <DemoShell
      title="JSX vs the function call it compiles to"
      description="Same UI, two ways of writing it. Toggle the view and confirm the trees are isomorphic."
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button
          variant={!showCompiled ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowCompiled(false)}
        >
          JSX
        </Button>
        <Button
          variant={showCompiled ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setShowCompiled(true)}
        >
          createElement
        </Button>
      </Box>

      <CodeBlock
        code={showCompiled ? CREATE_ELEMENT_CODE : JSX_CODE}
        language="tsx"
        label={showCompiled ? 'Compiled output' : 'Source'}
      />

      <Box sx={{ mt: 2, padding: 2, background: 'var(--surface-2)', borderRadius: 1 }}>
        <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Rendered DOM either way:
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Button variant="contained" onClick={() => alert('save()')}>
            Save changes
          </Button>
        </Box>
      </Box>
    </DemoShell>
  );
}
