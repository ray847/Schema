import type { CurrentUser } from '../api/authentication';
import { PreferenceView } from '../features/preference';

interface PreferencesPageProps {
  currentUser: CurrentUser | null;
}

export function PreferencesPage({ currentUser }: PreferencesPageProps) {
  return <PreferenceView currentUser={currentUser} />;
}
