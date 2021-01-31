import { Link } from 'react-router-dom';
import { LoginForm } from '../auth/LoginForm';

export const Login: React.FC = () => {
  return (
    <div className="p-12 space-y-8 mx-auto max-w-lg bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-700">Log in to your account</h1>
      <LoginForm />
      <p className="text-center text-sm">
        <span>Don't have an account?</span>
        <Link to="/register" className="ml-1 text-indigo-500">
          Register
        </Link>
      </p>
    </div>
  );
};
