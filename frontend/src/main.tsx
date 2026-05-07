import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import './index.css'
import { AuthProvider } from './AuthContext.tsx';
import App from './App.tsx'
import { getStoredToken } from './auth.ts';

const client = new ApolloClient({
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
