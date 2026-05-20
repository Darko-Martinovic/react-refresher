import { useReducer, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DemoShell } from '@/shared/DemoShell';

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clear-completed' };

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      if (!action.text.trim()) return state;
      return [
        ...state,
        { id: crypto.randomUUID(), text: action.text.trim(), done: false },
      ];
    case 'toggle':
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t,
      );
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    case 'clear-completed':
      return state.filter((t) => !t.done);
  }
}

export default function UseReducerDemo() {
  const [todos, dispatch] = useReducer(reducer, [
    { id: '1', text: 'Read the React docs', done: true },
    { id: '2', text: 'Refresh on hooks', done: false },
  ]);
  const [input, setInput] = useState('');

  const submit = () => {
    dispatch({ type: 'add', text: input });
    setInput('');
  };

  const completed = todos.filter((t) => t.done).length;

  return (
    <DemoShell
      title="A todo reducer"
      description="Every interaction goes through dispatch(action). The reducer is a pure function — easy to read, easy to test."
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo and press Enter"
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={submit}
          disabled={!input.trim()}
        >
          Add
        </Button>
      </Box>

      <Box
        sx={{
          background: 'var(--surface-2)',
          border: '1px solid var(--surface-border)',
          borderRadius: 1.5,
          padding: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        {todos.length === 0 ? (
          <Typography
            sx={{ color: 'var(--text-muted)', fontStyle: 'italic', p: 1.5 }}
          >
            Empty list — add something.
          </Typography>
        ) : (
          todos.map((t) => (
            <Box
              key={t.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                padding: '0.25rem 0.5rem',
                borderRadius: 1,
                '&:hover': { background: 'var(--surface-3)' },
              }}
            >
              <Checkbox
                size="small"
                checked={t.done}
                onChange={() => dispatch({ type: 'toggle', id: t.id })}
              />
              <Typography
                sx={{
                  flex: 1,
                  textDecoration: t.done ? 'line-through' : 'none',
                  color: t.done ? 'var(--text-muted)' : 'var(--text-primary)',
                }}
              >
                {t.text}
              </Typography>
              <IconButton
                size="small"
                onClick={() => dispatch({ type: 'remove', id: t.id })}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5 }}>
        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {completed} of {todos.length} done
        </Typography>
        <Button
          size="small"
          variant="text"
          disabled={completed === 0}
          onClick={() => dispatch({ type: 'clear-completed' })}
        >
          Clear completed
        </Button>
      </Box>
    </DemoShell>
  );
}
