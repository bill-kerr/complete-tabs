import { render } from 'react-dom';
import { initializeAuth } from './apis/firebase';
import { App } from './components/App';

initializeAuth();

render(<App />, document.getElementById('root'));
