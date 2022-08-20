import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server';

import { AppContext, RegisterInput, LoginInput } from '../interfaces';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../config/validation';
import { auth } from '../config/auth';

const resolvers = {
  Query: {
    getUsers: async (parent: undefined, args: null, context: AppContext) => {
      const user: any = auth(context);
      return (
        await context.db.query('SELECT * FROM users WHERE username != $1', [
          user.username,
        ])
      ).rows;
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
          expiresIn: '7d',
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
          expiresIn: '7d',
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
};

export default resolvers;
