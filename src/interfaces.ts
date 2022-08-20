import { QueryResult } from 'pg';

export interface AppContext {
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
