import { Alert, Stack } from '@mui/material';
import type { CurrentUser } from '../api/authentication';
import { ConsoleView } from '../features/console';

interface ConsolePageProps {
  currentUser: CurrentUser | null;
}

export function ConsolePage({ currentUser }: ConsolePageProps) {
  const isAdmin = currentUser?.type === 'admin';

  return (
    <Stack spacing={3}>
      {!isAdmin && (
        <Alert severity={currentUser ? 'info' : 'warning'}>
          {currentUser
            ? 'Your preference table is available to edit. Other tables remain admin-only.'
            : 'Sign in with an admin account to insert, update, or delete rows.'}
        </Alert>
      )}
      <ConsoleView editable={isAdmin} currentUser={currentUser} />
    </Stack>
  );
}
