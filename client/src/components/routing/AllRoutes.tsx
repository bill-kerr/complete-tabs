import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { AuthContext } from '../../context';
import { parseQuery } from '../../utils';
import { Dashboard } from '../pages/Dashboard';
import { ForgotPassword } from '../pages/ForgotPassword';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ResetPassword } from '../pages/ResetPassword';
import { ProtectedRoute } from './ProtectedRoute';
import { UnprotectedRoute } from './UnprotectedRoute';

export const AllRoutes: React.FC = () => {
  const user = useContext(AuthContext);

  return (
    <Switch>
      <UnprotectedRoute exact path="/login" component={Login} user={user} />
      <UnprotectedRoute exact path="/register" component={Register} user={user} />
      <UnprotectedRoute exact path="/forgot-password" component={ForgotPassword} user={user} />
      <UnprotectedRoute
        exact
        path="/reset-password"
        user={user}
        render={props => {
          const query = parseQuery(props.location.search);
          return <ResetPassword email={query.email as string} code={query.oobCode as string} />;
        }}
      />
      <ProtectedRoute path="/dashboard" user={user} component={Dashboard} />
      <Route path="/">{user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}</Route>
    </Switch>
  );
};
