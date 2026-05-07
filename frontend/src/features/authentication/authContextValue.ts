import { createContext } from 'react';
import type {
  CurrentUser,
  LoginInput,
  RegisterInput,
} from '../../api/authentication';

export interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
