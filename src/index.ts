import 'colors';
import 'dotenv/config';
import { ApolloServer, gql } from 'apollo-server';

import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

import { query } from './db/db';

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return {
      db: {
        query,
      },
    };
  },
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`.green.bold);
});
