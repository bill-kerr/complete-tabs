import { Link } from 'react-router-dom';
import { LoginForm } from '../auth/LoginForm';
import { FullLogo } from '../svg/logos/FullLogo';
import { PageContainer } from './PageContainer';

export const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 to-indigo-200">
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="w-full max-w-lg px-6">
          <FullLogo className="h-8" />
        </div>
        <div className="mt-12 p-12 space-y-8 w-full max-w-lg bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-700">Log in to your account</h1>
          <LoginForm />
          <p className="text-center text-sm">
            <span>Don't have an account?</span>
            <Link to="/register" className="ml-1 text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </PageContainer>
    </div>
  );
};
