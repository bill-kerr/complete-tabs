import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../layout/PageContainer';
import { FullLogo } from '../svg/logos/FullLogo';
import { ForgotPasswordForm } from '../forms/ForgotPasswordForm';

export const ForgotPassword: React.FC = () => {
  const [emailSent, setEmailSent] = useState<string>('');

  const renderResetPassword = () => {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter the email address associated with your account and we will send you a link to
            reset your password.
          </p>
        </div>
        <ForgotPasswordForm onEmailSent={email => setEmailSent(email)} />
      </div>
    );
  };

  const renderEmailSent = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-700">Check your email</h1>
        <p className="my-8 text-sm text-gray-600">
          We sent an email to {emailSent} with a link to reset your password. Didn't get the email?{' '}
          <span onClick={() => setEmailSent('')} className="ml-1 text-indigo-500 cursor-pointer">
            Resend email
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-100 to-indigo-200">
      <PageContainer className="flex flex-col items-center justify-center">
        <div className="w-full max-w-lg px-6">
          <FullLogo className="h-8" />
        </div>
        <div className="mt-12 p-12 space-y-4 w-full max-w-lg bg-white rounded-lg shadow-lg">
          {emailSent === '' ? renderResetPassword() : renderEmailSent()}
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
