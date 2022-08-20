import { QueryResult } from 'pg';

export interface AppContext {
  req: any;
  db: {
    query: (text: string, vars: any[]) => Promise<QueryResult<any>>;
  };
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  username: string;
  password: string;
}
