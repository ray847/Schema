import { useState } from 'react';
import { useAuth } from './features/authentication';
import {
  ConsolePage,
  LoginPage,
  PlanPage,
  PreferencesPage,
} from './pages';
import './App.css';

type AppPage = 'plan' | 'preferences' | 'console' | 'login';

const pageOptions: { key: AppPage; label: string }[] = [
  { key: 'plan', label: 'Plan' },
  { key: 'preferences', label: 'Preferences' },
  { key: 'console', label: 'Console' },
  { key: 'login', label: 'Login' },
];

function App() {
  const { user, loading, signOut } = useAuth();
  const [activePage, setActivePage] = useState<AppPage>('plan');
  const isAdmin = user?.type === 'admin';
  const currentPage = user && activePage === 'login' ? 'plan' : activePage;

  if (loading) {
    return (
      <main className="status-page">
        <p>Loading account...</p>
      </main>
    );
  }

  const visiblePages = user
    ? pageOptions.filter((page) => page.key !== 'login')
    : pageOptions;

  const renderPage = () => {
    switch (currentPage) {
      case 'plan':
        return <PlanPage />;
      case 'preferences':
        return <PreferencesPage currentUser={user} />;
      case 'console':
        return <ConsolePage currentUser={user} />;
      case 'login':
        return <LoginPage />;
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <div>
          <p className="eyebrow">
            {isAdmin ? 'Admin console' : user ? `${user.type} workspace` : 'Spectate mode'}
          </p>
          <h1>Space Planning</h1>
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
          <button
            className="secondary-action"
            onClick={() => setActivePage('login')}
            type="button"
          >
            Sign in
          </button>
        )}
      </header>

      <nav className="page-tabs" aria-label="Application pages">
        {visiblePages.map((page) => (
          <button
            className={currentPage === page.key ? 'active' : ''}
            key={page.key}
            onClick={() => setActivePage(page.key)}
            type="button"
          >
            {page.label}
          </button>
        ))}
      </nav>

      {renderPage()}
    </div>
  );
}

export default App;
