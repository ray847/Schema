import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import type { CurrentUser } from '../api/authentication';

interface UserPageProps {
  currentUser: CurrentUser | null;
}

export function UserPage({ currentUser }: UserPageProps) {
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
            User preference management will live here. For now, authenticated
            users can edit preferences from the console table selector.
          </Typography>
        </Box>
        <Alert severity={currentUser ? 'info' : 'warning'}>
          {currentUser
            ? `Signed in as ${currentUser.email}.`
            : 'Sign in before editing personal room, building, or campus weights.'}
        </Alert>
      </Stack>
    </Paper>
  );
}
