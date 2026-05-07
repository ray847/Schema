import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { getStoredToken } from './authentication';

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/graphql',
      fetch: (uri, options) => {
        const token = getStoredToken();
        const headers = new Headers(options?.headers);
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return fetch(uri, { ...options, headers });
      },
    }),
    cache: new InMemoryCache(),
  });
}
