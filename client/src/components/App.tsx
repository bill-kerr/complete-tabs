import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import '../assets/css/fonts.css';
import '../assets/css/main.css';
import { useWaitForSignIn } from '../hooks/useWaitForSignIn';
import { AllRoutes } from './routing/AllRoutes';
import store from '../state/store';

export const App: React.FC = () => {
  const waiting = useWaitForSignIn();

  return waiting ? (
    <div>loading...</div>
  ) : (
    <BrowserRouter>
      <Provider store={store}>
        <AllRoutes />
      </Provider>
    </BrowserRouter>
  );
};
