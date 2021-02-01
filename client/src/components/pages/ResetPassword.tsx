import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../layout/PageContainer';
import { FullLogo } from '../svg/logos/FullLogo';
import { ResetPasswordForm } from '../forms/ResetPasswordForm';

interface ResetPasswordProps {
  email: string;
  code: string;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ code }) => {
  const [changed, setChanged] = useState(false);

  const renderPasswordChanged = () => {
    return <p className="my-8">Your password has been updated.</p>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 to-indigo-200">
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="w-full max-w-lg px-6">
          <FullLogo className="h-8" />
        </div>
        <div className="mt-12 p-12 space-y-4 w-full max-w-lg bg-white rounded-lg shadow-lg">
          {changed ? (
            renderPasswordChanged()
          ) : (
            <ResetPasswordForm code={code} onPasswordChange={() => setChanged(true)} />
          )}
          <p className="text-center text-sm">
            <Link to="/login" className="ml-1 text-indigo-500">
              Return to log in
            </Link>
          </p>
        </div>
      </PageContainer>
    </div>
  );
};
