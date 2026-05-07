import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearStoredToken,
  fetchCurrentUser,
  getStoredToken,
  login,
  register,
  type CurrentUser,
  type LoginInput,
  type RegisterInput,
} from '../../api/authentication';
import { AuthContext } from './authContextValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getStoredToken()));

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      return;
    }

    fetchCurrentUser(token)
      .then(setUser)
      .catch(() => {
        clearStoredToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (input: LoginInput) => {
    const currentUser = await login(input);
    setUser(currentUser);
  }, []);

  const signUp = useCallback(async (input: RegisterInput) => {
    const currentUser = await register(input);
    setUser(currentUser);
  }, []);

  const signOut = useCallback(() => {
    clearStoredToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
