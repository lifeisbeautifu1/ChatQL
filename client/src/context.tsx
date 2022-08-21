import { createContext, Dispatch, useContext, useReducer } from 'react';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
