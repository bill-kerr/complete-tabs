import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import '../assets/css/fonts.css';
import '../assets/css/main.css';
import { useAuthState } from '../hooks/useAuthState';
import { Login } from './pages/Login';
import { ForgotPassword } from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';
import { parseQuery } from '../utils';
import { signOut } from '../apis/firebase';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  const user = useAuthState();

  return (
    <div className="mx-auto max-w-screen-lg xl:max-w-screen-xl min-h-screen">
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            {user ? <Redirect to="/" /> : <Login />}
          </Route>
          <Route exact path="/register">
            {user ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route exact path="/forgot-password">
            {user ? <Redirect to="/" /> : <ForgotPassword />}
          </Route>
          <Route
            exact
            path="/reset-password"
            render={props => {
              const query = parseQuery(props.location.search);
              return user ? (
                <Redirect to="/" />
              ) : (
                <ResetPassword email={query.email as string} oobCode={query.oobCode as string} />
              );
            }}
          />
          <Route path="/">
            {user ? (
              <div>
                Logged in. <span onClick={signOut}>Log out</span>
              </div>
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};
