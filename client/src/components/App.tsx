import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import '../assets/css/fonts.css';
import '../assets/css/main.css';
import { useAuthState } from '../hooks/useAuthState';
import { Login } from './pages/Login';
import { RegisterForm } from './auth/RegisterForm';
import { ForgotPassword } from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';
import { parseQuery } from '../utils';
import { signOut } from '../apis/firebase';

export const App: React.FC = () => {
  const user = useAuthState();

  return (
    <div className="mx-auto max-w-screen-lg xl:max-w-screen-xl min-h-screen">
      <BrowserRouter>
        {!user ? (
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={RegisterForm} />
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
          </Switch>
        ) : (
          <div>
            Logged in. <span onClick={signOut}>Log out</span>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
};
