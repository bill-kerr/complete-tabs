import { BrowserRouter } from 'react-router-dom';
import '../assets/css/fonts.css';
import '../assets/css/main.css';
import { useAuthState } from '../hooks/useAuthState';
import { useWaitForSignIn } from '../hooks/useWaitForSignIn';
import { AllRoutes } from './routing/AllRoutes';

export const App: React.FC = () => {
  const waiting = useWaitForSignIn();
  const user = useAuthState();

  return waiting ? (
    <div>loading...</div>
  ) : (
    <BrowserRouter>
      <AllRoutes user={user} />
    </BrowserRouter>
  );
};
