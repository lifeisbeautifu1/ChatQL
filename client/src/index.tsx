import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { AuthProvider } from './context';
import './index.css';
import App from './App';
import { getMainDefinition } from '@apollo/client/utilities';

let httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:5000/subscriptions',
  })
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token;
  if (localStorage.getItem('token')) {
    token = localStorage.getItem('token');
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

httpLink = authLink.concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
