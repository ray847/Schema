import { ConsoleView } from './components/ConsoleView.tsx';
import { AuthView } from './components/AuthView.tsx';
import { useAuth } from './AuthContext.tsx';
import './App.css';

function App() {
  const { user, loading, signOut } = useAuth();
  const isAdmin = user?.type === 'admin';

  if (loading) {
    return (
      <main className="status-page">
        <p>Loading account...</p>
      </main>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <p className="eyebrow">
            {isAdmin ? 'Admin console' : user ? `${user.type} console` : 'Spectate mode'}
          </p>
          <h1>Schema</h1>
        </div>
        {user ? (
          <div className="account-chip">
            <span>{user.email}</span>
            <span className="role-pill">{user.type}</span>
            <button onClick={signOut} type="button">
              Sign out
            </button>
          </div>
        ) : (
          <a className="secondary-action" href="#auth">
            Sign in
          </a>
        )}
      </header>
      {!isAdmin && (
        <section className="mode-banner">
          <div>
            <strong>{user ? 'Editable preferences' : 'Read-only table browser'}</strong>
            <p>{user ? 'Your preference table is available to edit. Other tables remain admin-only.' : 'Sign in with an admin account to insert, update, or delete rows.'}</p>
          </div>
        </section>
      )}
      <ConsoleView editable={isAdmin} currentUser={user} />
      {!user && (
        <section id="auth" className="inline-auth">
          <AuthView compact />
        </section>
      )}
    </div>
  );
}

export default App;
