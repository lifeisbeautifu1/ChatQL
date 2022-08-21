import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import jwtDecode from 'jwt-decode';
import { useLazyQuery, gql } from '@apollo/client';

import { User } from './interfaces';

interface State {
  authenticated: boolean;
  user: User | undefined;
}

interface LoginData extends User {
  token: string;
}

type Action =
  | {
      type: 'LOGIN';
      payload: LoginData;
    }
  | {
      type: 'LOGOUT';
    }
  | {
      type: 'STOP_LOADING';
    };

const initialState = {
  authenticated: false,
  user: undefined,
};

const StateContext = createContext<State>(initialState);

const DispatchContext = createContext<Dispatch<Action>>({} as Dispatch<Action>);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'LOGIN': {
      localStorage.setItem('token', action.payload?.token);
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    }
    case 'LOGOUT': {
      localStorage.removeItem('token');
      return {
        ...state,
        authenticated: false,
        user: undefined,
      };
    }
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const GET_ME = gql`
  query {
    getMe {
      username
      email
      id
    }
  }
`;

let token = localStorage.getItem('token');
if (token) {
  const decodedToken: any = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expiresAt) {
    console.log('expire');
    localStorage.removeItem('token');
    token = null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [getMe] = useLazyQuery(GET_ME, {
    onCompleted: (data) => {
      dispatch({ type: 'LOGIN', payload: { token, ...data.getMe } });
    },
    onError: (err: any) => {
      console.log(err);
    },
  });

  useEffect(() => {
    if (token) getMe();
  }, [getMe]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
