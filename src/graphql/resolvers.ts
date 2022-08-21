import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError, AuthenticationError } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
const pubsub = new PubSub();

import {
  AppContext,
  RegisterInput,
  LoginInput,
  GetMessagesInput,
  SendMessageInput,
} from '../interfaces';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../config/validation';
import { auth } from '../config/auth';

const resolvers = {
  User: {
    latest_message: async (parent: any, args: null, context: AppContext) => {
      const { username }: any = auth(context);
      const message = await context.db.query(
        'SELECT * FROM messages WHERE from_user IN ($1, $2) AND to_user IN ($1, $2) ORDER BY created_at DESC;',
        [username, parent.username]
      );
      return message.rows[0];
    },
  },
  Query: {
    getMe: async (parent: undefined, args: null, context: AppContext) => {
      const user: any = auth(context);
      return (
        await context.db.query('SELECT * FROM users WHERE username = $1', [
          user.username,
        ])
      ).rows[0];
    },
    getUsers: async (parent: undefined, args: null, context: AppContext) => {
      const user: any = auth(context);
      return (
        await context.db.query('SELECT * FROM users WHERE username != $1', [
          user.username,
        ])
      ).rows;
    },
    getMessages: async (
      parent: undefined,
      args: GetMessagesInput,
      context: AppContext
    ) => {
      const { username }: any = auth(context);

      const otherUser = await context.db.query(
        'SELECT * FROM users WHERE username = $1;',
        [args.to]
      );

      if (!otherUser.rows[0]) {
        throw new UserInputError('User not found');
      }

      const messages = await context.db.query(
        'SELECT * FROM messages WHERE from_user IN ($1, $2) AND to_user IN ($1, $2) ORDER BY created_at DESC;',
        [username, args.to]
      );

      return messages.rows;
    },
    login: async (parent: undefined, args: LoginInput, context: AppContext) => {
      const { username, password } = args;
      try {
        const { errors } = validateLoginInput(username, password);
        if (Object.keys(errors).length > 0) throw errors;

        const user = await context.db.query(
          'SELECT * FROM users WHERE username = $1',
          [username]
        );
        if (!user.rows[0]) {
          errors.username = 'User not found!';
        }
        if (Object.keys(errors).length > 0) throw errors;

        const match = await bcrypt.compare(password, user.rows[0].password);

        if (!match) {
          errors.password = 'Password is incorrect';
        }
        if (Object.keys(errors).length > 0) throw errors;

        const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });

        return {
          ...user.rows[0],
          token,
        };
      } catch (errors) {
        throw new UserInputError('Bad Input', {
          errors,
        });
      }
    },
  },
  Mutation: {
    sendMessage: async (
      parent: undefined,
      args: SendMessageInput,
      context: any
    ) => {
      const user: any = auth(context);
      const otherUser = await context.db.query(
        'SELECT * FROM users WHERE username = $1',
        [args.to]
      );
      if (!otherUser.rows[0]) {
        throw new UserInputError('User not found');
      } else if (user.username === args.to) {
        throw new UserInputError(`You can't send message to yourself`);
      }
      const message = await context.db.query(
        'INSERT INTO messages (content, from_user, to_user) VALUES ($1, $2, $3) returning *;',
        [args.content, user.username, args.to]
      );
      pubsub.publish('NEW_MESSAGE', { newMessage: message.rows[0] });
      return message.rows[0];
    },
    register: async (
      parent: undefined,
      args: RegisterInput,
      context: AppContext
    ) => {
      let { username, email, password, confirmPassword } = args;
      try {
        const { valid, errors } = validateRegisterInput(
          username,
          email,
          password,
          confirmPassword
        );

        const userWithUsername = await context.db.query(
          'SELECT * FROM users WHERE username = $1;',
          [username]
        );
        if (userWithUsername.rows[0]) {
          errors.username = 'Username aleardy taken';
        }

        const userWithEmail = await context.db.query(
          'SELECT * FROM users WHERE email = $1;',
          [email]
        );

        if (userWithEmail.rows[0]) {
          errors.email = 'Email aleardy taken';
        }
        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        password = await bcrypt.hash(password, 6);

        const user = await context.db.query(
          'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;',
          [username, email, password]
        );

        const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
          expiresIn: '1h',
        });

        return {
          ...user.rows[0],
          token,
        };
      } catch (errors) {
        throw new UserInputError('Bad Input', {
          errors,
        });
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => {
          return pubsub.asyncIterator(['NEW_MESSAGE']);
        },
        () => {
          return true;
        }
      ),
    },
  },
};

export default resolvers;
