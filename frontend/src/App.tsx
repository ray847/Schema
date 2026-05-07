import { ConsoleView } from './components/ConsoleView.tsx';
import { AuthView } from './components/AuthView.tsx';
import { useAuth } from './AuthContext.tsx';
import './App.css';

function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <main className="status-page">
        <p>Loading account...</p>
      </main>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  if (user.type !== 'admin') {
    return (
      <main className="status-page">
        <section className="status-panel">
          <p className="eyebrow">Signed in</p>
          <h1>Console unavailable</h1>
          <p>
            {user.email} is registered as {user.type}. The database console is
            only visible to admin users.
          </p>
          <button className="secondary-action" onClick={signOut} type="button">
            Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <p className="eyebrow">Admin console</p>
          <h1>Schema</h1>
        </div>
        <div className="account-chip">
          <span>{user.email}</span>
          <button onClick={signOut} type="button">
            Sign out
          </button>
        </div>
      </header>
      <ConsoleView />
    </div>
  );
}

export default App;
