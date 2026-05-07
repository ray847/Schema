import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client/react';
import './index.css'
import { createApolloClient } from './api/apolloClient.ts';
import { AuthProvider } from './features/authentication/AuthContext.tsx';
import App from './App.tsx'

const client = createApolloClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
