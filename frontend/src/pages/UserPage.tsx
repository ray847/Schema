import type { CurrentUser } from '../api/authentication';
import { PreferenceView } from '../features/preference';

interface UserPageProps {
  currentUser: CurrentUser | null;
}

export function UserPage({ currentUser }: UserPageProps) {
  return <PreferenceView currentUser={currentUser} />;
}
