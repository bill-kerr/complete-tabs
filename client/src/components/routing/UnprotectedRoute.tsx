import { Redirect, Route, RouteProps } from 'react-router';
import { User } from '../../models/User';

interface UnprotectedRouteProps extends RouteProps {
  user: User | null;
}

export const UnprotectedRoute: React.FC<UnprotectedRouteProps> = ({ user, ...props }) => {
  return user ? <Redirect to="/dashboard" /> : <Route {...props} />;
};
