import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String!
    updated_at: String!
    image_url: String
    token: String
    latest_message: Message
  }
  type Message {
    id: ID!
    content: String!
    from_user: String!
    to_user: String!
    created_at: String!
  }
  type Query {
    getUsers: [User]!
    getMe: User!
    getMessages(to: String!): [Message]!
    login(username: String!, password: String!): User!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(content: String!, to: String!): Message!
  }
  type Subscription {
    newMessage: Message!
  }
`;

export default typeDefs;
