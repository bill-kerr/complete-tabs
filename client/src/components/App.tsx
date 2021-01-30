import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import '../assets/css/fonts.css';
import '../assets/css/main.css';
import { useAuthState } from '../hooks/useAuthState';
import { Login } from './auth/Login';
import { Register } from './auth/Register';
import { ForgotPassword } from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';
import { parseQuery } from '../utils';

export const App: React.FC = () => {
  const user = useAuthState();

  return (
    <BrowserRouter>
      <Switch>
        {!user ? (
          <>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
              exact
              path="/reset-password"
              render={props => {
                const query = parseQuery(props.location.search);
                return (
                  <ResetPassword email={query.email as string} oobCode={query.oobCode as string} />
                );
              }}
            />
            <Route path="/">
              <Redirect to="/login" />
            </Route>
          </>
        ) : (
          <div>Logged in</div>
        )}
      </Switch>
    </BrowserRouter>
  );
};
