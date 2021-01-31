import { Link } from 'react-router-dom';
import { PageContainer } from './PageContainer';
import { FullLogo } from '../svg/logos/FullLogo';
import { RegisterForm } from '../auth/RegisterForm';

export const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 to-indigo-200">
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="flex space-x-16">
          <div className="mt-12 max-w-lg">
            <FullLogo className="h-8" />
            <p className="mt-4 text-gray-600">
              Enter the new age of digital construction data. Use CompleteTabs as the source of
              truth for your next project!
            </p>
          </div>
          <div className="p-12 space-y-8 w-full max-w-lg bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-700">Create your CompleteTabs account</h1>
            <RegisterForm />
            <p className="text-center text-sm">
              <span>Already have an account?</span>
              <Link to="/login" className="ml-1 text-indigo-500">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
