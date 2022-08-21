import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';

export const auth = (context: any) => {
  let token;
  if (context.req || context.req.headers.authorization.startsWith('Bearer')) {
    token = context.req.headers.authorization.split(' ')[1];
  } else {
    throw new AuthenticationError('Token not provided');
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);

    return user;
  } catch (error) {
    throw new AuthenticationError('Invalid/Expired token');
  }
};
