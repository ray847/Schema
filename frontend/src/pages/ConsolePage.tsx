import type { CurrentUser } from '../api/authentication';
import { ConsoleView } from '../features/console';

interface ConsolePageProps {
  currentUser: CurrentUser | null;
}

export function ConsolePage({ currentUser }: ConsolePageProps) {
  const isAdmin = currentUser?.type === 'admin';

  return (
    <>
      {!isAdmin && (
        <section className="mode-banner">
          <div>
            <strong>
              {currentUser ? 'Editable preferences' : 'Read-only table browser'}
            </strong>
            <p>
              {currentUser
                ? 'Your preference table is available to edit. Other tables remain admin-only.'
                : 'Sign in with an admin account to insert, update, or delete rows.'}
            </p>
          </div>
        </section>
      )}
      <ConsoleView editable={isAdmin} currentUser={currentUser} />
    </>
  );
}
