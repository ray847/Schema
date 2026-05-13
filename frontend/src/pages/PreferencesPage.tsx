import type { CurrentUser } from '../api/authentication';
import { UserPage } from './UserPage';

interface PreferencesPageProps {
  currentUser: CurrentUser | null;
}

export function PreferencesPage({ currentUser }: PreferencesPageProps) {
  return <UserPage currentUser={currentUser} />;
}
