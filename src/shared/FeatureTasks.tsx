import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import ChecklistIcon from '@mui/icons-material/Checklist';

import type { Task } from '@/core/features/feature.model';

type Answer = string | number | boolean | null;

interface TaskState {
  answer: Answer;
  submitted: boolean;
  hintOpen: boolean;
}

const initialTaskState = (): TaskState => ({
  answer: null,
  submitted: false,
  hintOpen: false,
});

interface FeatureTasksProps {
  /** Feature slug used as a reset key when the user navigates. */
  slug: string;
  tasks: Task[];
}

export function FeatureTasks({ slug, tasks }: FeatureTasksProps) {
  const [states, setStates] = useState<Record<number, TaskState>>({});

  // Reset all task state when slug changes (user navigated to another feature page)
  useEffect(() => {
    setStates({});
  }, [slug]);

  const stateOf = (i: number): TaskState => states[i] ?? initialTaskState();

  const setAnswer = (i: number, value: Answer) =>
    setStates((m) => ({
      ...m,
      [i]: { ...stateOf(i), answer: value, submitted: false },
    }));

  const toggleHint = (i: number) =>
    setStates((m) => ({
      ...m,
      [i]: { ...stateOf(i), hintOpen: !stateOf(i).hintOpen },
    }));

  const submit = (i: number) =>
    setStates((m) => ({
      ...m,
      [i]: { ...stateOf(i), submitted: true },
    }));

  const reset = (i: number) =>
    setStates((m) => ({
      ...m,
      [i]: { answer: null, submitted: false, hintOpen: stateOf(i).hintOpen },
    }));

  const isSubmitted = (i: number) => stateOf(i).submitted;

  const canSubmit = (i: number): boolean => {
    const s = stateOf(i);
    const task = tasks[i];
    if (!task) return false;
    switch (task.validator.kind) {
      case 'predict':
        return typeof s.answer === 'number';
      case 'input':
        return typeof s.answer === 'string' && s.answer.trim().length > 0;
      case 'self-check':
        return s.answer === true;
    }
  };

  const isCorrect = (i: number): boolean => {
    const s = stateOf(i);
    const task = tasks[i];
    if (!task || !s.submitted) return false;
    switch (task.validator.kind) {
      case 'predict':
        return s.answer === task.validator.correct;
      case 'input': {
        if (typeof s.answer !== 'string') return false;
        const norm = (v: string) => v.trim().toLowerCase();
        const a = norm(s.answer);
        return task.validator.accept.some((acc) => norm(acc) === a);
      }
      case 'self-check':
        return s.answer === true;
    }
  };

  const completedCount = tasks.filter((_, i) => isCorrect(i)).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          padding: '0.4rem 0.75rem',
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)',
          borderRadius: 999,
          alignSelf: 'flex-start',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
        }}
      >
        <ChecklistIcon fontSize="small" sx={{ color: 'var(--success)' }} />
        <strong style={{ color: 'var(--text-primary)' }}>{completedCount}</strong>
        <span>/ {tasks.length} completed</span>
      </Box>

      {tasks.map((task, i) => {
        const correct = isCorrect(i);
        const wrong = isSubmitted(i) && !correct;
        const s = stateOf(i);

        return (
          <Box
            key={i}
            sx={{
              padding: '1rem 1.1rem',
              background: 'var(--surface-1)',
              border: `1px solid ${
                correct
                  ? 'color-mix(in srgb, var(--success) 40%, transparent)'
                  : wrong
                    ? 'color-mix(in srgb, var(--danger) 40%, transparent)'
                    : 'var(--surface-border)'
              }`,
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontSize: '0.7rem',
                }}
              >
                Task {i + 1}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: 'var(--accent-strong)',
                  background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                  borderRadius: 999,
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.7rem',
                }}
              >
                {task.validator.kind}
              </Typography>
              {task.hint && (
                <Button
                  size="small"
                  variant="text"
                  onClick={() => toggleHint(i)}
                  startIcon={s.hintOpen ? <VisibilityOffIcon /> : <LightbulbIcon />}
                  sx={{ ml: 'auto', textTransform: 'none' }}
                >
                  {s.hintOpen ? 'Hide hint' : 'Hint'}
                </Button>
              )}
            </Box>

            <Typography sx={{ color: 'var(--text-primary)' }}>{task.prompt}</Typography>

            {s.hintOpen && task.hint && (
              <Typography
                sx={{
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  padding: '0.5rem 0.75rem',
                  background: 'var(--surface-2)',
                  borderRadius: 1.5,
                  borderLeft: '3px solid var(--warn)',
                }}
              >
                {task.hint}
              </Typography>
            )}

            <Box sx={{ mt: 0.5 }}>
              {task.validator.kind === 'predict' && (
                <RadioGroup
                  value={typeof s.answer === 'number' ? String(s.answer) : ''}
                  onChange={(_, value) => setAnswer(i, Number(value))}
                >
                  {task.validator.options.map((option, oi) => (
                    <FormControlLabel
                      key={oi}
                      value={String(oi)}
                      disabled={isSubmitted(i)}
                      control={<Radio size="small" />}
                      label={option}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              )}

              {task.validator.kind === 'input' && (
                <TextField
                  fullWidth
                  size="small"
                  label="Your answer"
                  value={typeof s.answer === 'string' ? s.answer : ''}
                  disabled={isSubmitted(i)}
                  onChange={(e) => setAnswer(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canSubmit(i)) submit(i);
                  }}
                  slotProps={{
                    htmlInput: { autoComplete: 'off', spellCheck: 'false' },
                  }}
                />
              )}

              {task.validator.kind === 'self-check' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={s.answer === true}
                      disabled={isSubmitted(i)}
                      onChange={(e) => setAnswer(i, e.target.checked)}
                    />
                  }
                  label="I've tried this in the demo above"
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isSubmitted(i) ? (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckIcon />}
                  onClick={() => submit(i)}
                  disabled={!canSubmit(i)}
                >
                  Check answer
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={() => reset(i)}
                >
                  Try again
                </Button>
              )}
            </Box>

            {isSubmitted(i) && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-start',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 1.5,
                  background: correct
                    ? 'color-mix(in srgb, var(--success) 12%, transparent)'
                    : 'color-mix(in srgb, var(--danger) 12%, transparent)',
                  border: `1px solid ${
                    correct
                      ? 'color-mix(in srgb, var(--success) 35%, transparent)'
                      : 'color-mix(in srgb, var(--danger) 35%, transparent)'
                  }`,
                  color: correct ? 'var(--success)' : 'var(--danger)',
                }}
              >
                {correct ? <CheckCircleIcon /> : <CancelIcon />}
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    {correct ? 'Correct.' : 'Not quite.'}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)', mt: 0.25 }}
                  >
                    {task.validator.explanation}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
