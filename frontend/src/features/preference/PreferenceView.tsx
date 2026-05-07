import type { CurrentUser } from '../../api/authentication';

interface PreferenceViewProps {
  currentUser: CurrentUser | null;
}

export function PreferenceView({ currentUser }: PreferenceViewProps) {
  return (
    <section className="feature-surface" aria-labelledby="preference-title">
      <div className="feature-heading">
        <p className="eyebrow">Preference View</p>
        <h2 id="preference-title">Preferences</h2>
        <p>
          User preference management will live here. For now, authenticated
          users can edit preferences from the console table selector.
        </p>
      </div>
      <div className="placeholder-panel">
        {currentUser ? (
          <p>Signed in as {currentUser.email}.</p>
        ) : (
          <p>Sign in before editing personal room, building, or campus weights.</p>
        )}
      </div>
    </section>
  );
}
