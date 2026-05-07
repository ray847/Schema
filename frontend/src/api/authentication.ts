export const AUTH_TOKEN_KEY = 'schema.auth.token';

export type UserType = 'admin' | 'standard' | 'spectate';

export interface CurrentUser {
  key: number;
  person_key: number | null;
  email: string;
  type: UserType;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type RegisterInput = LoginInput;

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

async function parseError(response: Response) {
  try {
    const body = await response.json();
    return body.detail || response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function fetchCurrentUser(token: string): Promise<CurrentUser> {
  const response = await fetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function login(input: LoginInput) {
  const form = new URLSearchParams();
  form.set('username', input.email);
  form.set('password', input.password);

  const response = await fetch('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  if (!response.ok) throw new Error(await parseError(response));

  const body: { access_token: string; token_type: string } =
    await response.json();
  storeToken(body.access_token);
  return fetchCurrentUser(body.access_token);
}

export async function register(input: RegisterInput) {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });
  if (!response.ok) throw new Error(await parseError(response));

  return login(input);
}
