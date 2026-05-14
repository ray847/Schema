import { Alert, Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { CurrentUser } from '../api/authentication';
import { useAuth } from '../features/authentication';
import { ConsoleView } from './ConsolePage';

interface UserPageProps {
  currentUser: CurrentUser | null;
}

export function UserPage({ currentUser }: UserPageProps) {
  const { signOut } = useAuth();

  return (
    <Paper component="section" elevation={0} sx={{ border: 1, borderColor: 'divider', p: 3 }} aria-labelledby="preference-title">
      <Stack spacing={2}>
        <Box>
          <Typography color="text.secondary" sx={{ fontWeight: 800, letterSpacing: 1.2 }} variant="overline">
            Preference View
          </Typography>
          <Typography id="preference-title" variant="h5">
            Preferences
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }} variant="body2">
            Manage your personal room, building, and campus preference weights.
          </Typography>
        </Box>
        {currentUser ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'stretch', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Alert severity="info" sx={{ flex: 1 }}>
              Signed in as {currentUser.email}.
            </Alert>
            <Button onClick={signOut} variant="outlined">
              Sign out
            </Button>
          </Stack>
        ) : (
          <Alert severity="warning">
            Sign in before editing personal room, building, or campus weights.
          </Alert>
        )}
        {currentUser && <ConsoleView currentUser={currentUser} preferenceOnly />}
      </Stack>
    </Paper>
  );
}
