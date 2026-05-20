import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';

import type { SnippetLang } from '@/core/features/feature.model';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('jsx', typescript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

const LANG_LABELS: Record<SnippetLang, string> = {
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  html: 'HTML',
  scss: 'SCSS',
  css: 'CSS',
  bash: 'Shell',
  json: 'JSON',
};

const HLJS_LANG_MAP: Record<SnippetLang, string> = {
  typescript: 'typescript',
  tsx: 'tsx',
  jsx: 'jsx',
  html: 'html',
  scss: 'scss',
  css: 'css',
  bash: 'bash',
  json: 'json',
};

interface CodeBlockProps {
  code: string;
  language?: SnippetLang;
  label?: string;
}

export function CodeBlock({ code, language = 'typescript', label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [snack, setSnack] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: '',
  });
  const codeRef = useRef<HTMLPreElement>(null);

  const highlighted = useMemo(() => {
    try {
      return hljs.highlight(code, {
        language: HLJS_LANG_MAP[language],
        ignoreIllegals: true,
      }).value;
    } catch {
      return code;
    }
  }, [code, language]);

  // Re-highlight on theme change by depending on a MutationObserver of <html>'s data-mui-color-scheme.
  // Actually highlight.js output is theme-agnostic — colors come from our CSS rules — so no work needed.

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setSnack({ open: true, msg: 'Snippet copied' });
    } catch {
      setSnack({ open: true, msg: 'Copy failed' });
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        background: 'var(--surface-1)',
        border: '1px solid var(--surface-border)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 0.85rem',
          borderBottom: '1px solid var(--surface-border)',
          background: 'var(--surface-2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 500,
              fontSize: '0.7rem',
            }}
          >
            {LANG_LABELS[language]}
          </Typography>
          {label && (
            <Typography
              variant="caption"
              sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}
            >
              · {label}
            </Typography>
          )}
        </Box>
        <Tooltip title={copied ? 'Copied!' : 'Copy snippet'}>
          <IconButton size="small" onClick={copy} sx={{ color: 'var(--text-muted)' }}>
            {copied ? (
              <CheckIcon fontSize="small" sx={{ color: 'var(--success)' }} />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      <pre
        ref={codeRef}
        style={{
          margin: 0,
          padding: '1rem 1.1rem',
          overflowX: 'auto',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        }}
      >
        <code
          className={`hljs language-${HLJS_LANG_MAP[language]}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      <Snackbar
        open={snack.open}
        autoHideDuration={1500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        message={snack.msg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
