import { Redirect, Route, RouteProps } from 'react-router';
import { User } from '../../models/User';

interface ProtectedRouteProps extends RouteProps {
  user: User | null;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, ...props }) => {
  return user ? <Route {...props} /> : <Redirect to="/login" />;
};
