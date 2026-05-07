import { useState, type FormEvent } from 'react';
import { useAuth } from '../AuthContext';

type AuthMode = 'login' | 'register';

export function AuthView() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        await signUp({ email, password });
      } else {
        await signIn({ email, password });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-heading">
          <p className="eyebrow">Schema Access</p>
          <h1 id="auth-title">
            {mode === 'register' ? 'Create your account' : 'Sign in'}
          </h1>
          <p>
            The database console is available to admin users. The first
            registered account becomes admin automatically.
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Auth mode">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            type="button"
          >
            Sign in
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            Password
            <input
              autoComplete={
                mode === 'register' ? 'new-password' : 'current-password'
              }
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button className="primary-action" disabled={submitting} type="submit">
            {submitting
              ? 'Working...'
              : mode === 'register'
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
