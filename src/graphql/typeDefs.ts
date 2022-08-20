import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String!
    updated_at: String!
    image_url: String
    password: String!
  }
  type Query {
    getUsers: [User]!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
  }
`;

export default typeDefs;
