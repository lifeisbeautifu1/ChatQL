import { useAuthState } from '../context';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useAuthState();
  return <>{authenticated ? children : <Navigate to="/login" />}</>;
};

export default ProtectedRoute;
