import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                type="text"
                className={`w-full p-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                  errors.email && 'border-red-500'
                }`}
                onChange={handleChange}
                value={formState.email}
                name="email"
                placeholder="Email"
              />
              <small className="text-red-600 font-medim">{errors.email}</small>
            </div>
            <div className="mb-2">
              <input
                type="text"
                className={`w-full p-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                  errors.username && 'border-red-500'
                }`}
                onChange={handleChange}
                value={formState.username}
                name="username"
                placeholder="Username"
              />
              <small className="text-red-600 font-medim">
                {errors.username}
              </small>
            </div>
            <div className="mb-2">
              <input
                type="password"
                className={`w-full p-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                  errors.password && 'border-red-500'
                }`}
                onChange={handleChange}
                value={formState.password}
                name="password"
                placeholder="Password"
              />
              <small className="text-red-600 font-medim">
                {errors.password}
              </small>
            </div>
            <div className="mb-2">
              <input
                type="password"
                className={`w-full p-2 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white ${
                  errors.confirmPassword && 'border-red-500'
                }`}
                onChange={handleChange}
                value={formState.confirmPassword}
                name="confirmPassword"
                placeholder="Password again"
              />
              <small className="text-red-600 font-medim">
                {errors.confirmPassword}
              </small>
            </div>
            <button
              type="submit"
              className="w-full py-2 mb-4 text-sm font-bold text-white uppercase transition duration-200 bg-blue-500 border border-blue-500 rounded hover:bg-blue-500/90"
            >
              Sign Up
            </button>
          </form>
          <small>
            Have an account?
            <Link to="/login" className="ml-1 text-blue-500">
              Login
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
