import 'colors';
import 'dotenv/config';
import { ApolloServer, gql } from 'apollo-server';

import { query } from './db/db';

const PORT = process.env.PORT || 5000;

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String!
    updated_at: String!
  }
  type Query {
    getUsers: [User]!
  }
`;

const resolvers = {
  Query: {
    getUsers: async () => {
      return (await query('SELECT * FROM users;', [])).rows;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`.green.bold);
});
