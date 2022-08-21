import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';


import { useAuthDispatch, useAuthState } from '../context';

export const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      id
      token
    }
  }
`;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAuthDispatch();

  const { authenticated } = useAuthState();
  if (authenticated) navigate('/');

  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<any>({});

  const [login] = useLazyQuery(LOGIN_USER, {
    onCompleted: (data) => {
      dispatch({ type: 'LOGIN', payload: data.login });
      navigate('/');
    },
    onError: (err: any) => {
      console.log(err);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ variables: formState });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="flex bg-white">
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: 'url(./images/bricks.jpeg)' }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-[18rem]">
          <h1 className="mb-2 text-lg font-medium">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <div className="relative">
                <input
                  type="text"
                  value={formState.username}
                  onChange={handleChange}
                  name="username"
                  id="username"
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none
                  ${
                    errors.username
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="username"
                  className={`absolute text-sm ${
                    errors.username ? 'text-red-500' : 'text-gray-500'
                  } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                >
                  Username
                </label>
              </div>
              {errors.username && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  <span className="font-medium">Oh, snapp!</span>{' '}
                  {errors.username}
                </p>
              )}
            </div>

            <div className="mb-2">
              <div className="relative">
                <input
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  name="password"
                  id="password"
                  className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border appearance-none
                  ${
                    errors.password
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-gray-200'
                  }  focus:outline-none focus:ring-0  peer`}
                  placeholder=" "
                />
                <label
                  htmlFor="password"
                  className={`absolute text-sm ${
                    errors.password ? 'text-red-500' : 'text-gray-500'
                  } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1`}
                >
                  Password
                </label>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  <span className="font-medium">Oh, snapp!</span>{' '}
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded hover:bg-blue-500/90"
            >
              Login
            </button>
          </form>
          <small>
            Don't have an account?
            <Link to="/register" className="ml-1 text-blue-500">
              Sign Up
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
