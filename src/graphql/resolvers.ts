import bcrypt from 'bcryptjs';

import { AppContext, RegisterInput } from '../interfaces';
import { validateRegisterInput } from '../config/validation';
import { UserInputError } from 'apollo-server';

const resolvers = {
  Query: {
    getUsers: async (parent: undefined, args: null, context: AppContext) => {
      return (await context.db.query('SELECT * FROM users;', [])).rows;
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

        return user.rows[0];
      } catch (errors) {
        throw new UserInputError('Bad Input', {
          errors,
        });
      }
    },
  },
};

export default resolvers;
