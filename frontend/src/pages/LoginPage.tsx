import { useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Tile } from '../components/Tile';
import { useAuth } from '../features/authentication';

type AuthMode = 'login' | 'register';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        await signUp({ email, password });
      } else {
        await signIn({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <Tile
      aria-labelledby="auth-title"
      component="section"
      tone="sheet"
      sx={{
        maxWidth: 460,
        p: 4,
        width: 1,
        '@media (max-width: 600px) and (orientation: portrait)': {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: 'calc(50svh - 8px)',
          maxHeight: 'calc(50svh - 8px)',
          maxWidth: 'none',
          overflowY: 'auto',
          p: 2,
        },
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
            Schema Access
          </Typography>
          <Typography id="auth-title" variant="h4">
            {mode === 'register' ? 'Create your account' : 'Sign in'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }} variant="body2">
            The database console is available to admin users. The first
            registered account becomes admin automatically.
          </Typography>
        </Box>

        <Tabs
          aria-label="Auth mode"
          onChange={(_event, value: AuthMode) => {
            setMode(value);
            setError(null);
          }}
          value={mode}
          variant="fullWidth"
        >
          <Tab label="Sign in" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>

        <Stack component="form" onSubmit={handleSubmit} spacing={2}>
          <TextField
            autoComplete="email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />

          <TextField
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button disabled={submitting} type="submit" variant="contained">
            {submitting
              ? 'Working...'
              : mode === 'register'
                ? 'Create account'
                : 'Sign in'}
          </Button>
        </Stack>
      </Stack>
    </Tile>
  );

  return content;
}
