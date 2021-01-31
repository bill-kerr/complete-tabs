import { Formik, Form, FormikHelpers } from 'formik';
import { Link } from 'react-router-dom';
import { FirebaseError, signInWithEmailAndPassword } from '../../apis/firebase';
import { LoginValidationSchema } from '../../form-validation';
import { FieldLabel } from '../forms/FieldLabel';
import { TextField } from '../forms/TextField';
import { LoadingSpinner } from '../widgets/LoadingSpinner';
import { WarningMessage } from '../widgets/WarningMessage';

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

export const LoginForm: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const error = await signInWithEmailAndPassword(values.email, values.password);
    return handleFirebaseError(error, message => helpers.setFieldError('email', message));
  };

  const handleFirebaseError = (
    error: FirebaseError | null,
    setError: (message: string) => void
  ) => {
    if (!error) {
      return;
    }

    switch (error) {
      case FirebaseError.UserNotFound:
      case FirebaseError.WrongPassword:
        return setError('Incorrect email or password.');
      case FirebaseError.UserDisabled:
        return setError(
          'This account has been temporarily disabled. Try again later or contact support.'
        );
      case FirebaseError.TooManyRequests:
        return setError('Too many attempts. Try again later or reset your password.');
      default:
        return setError('An unknown error occurred. Please try again.');
    }
  };

  return (
    <div {...props}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={LoginValidationSchema}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {({ isSubmitting, errors }) => (
          <Form className="space-y-8">
            <div>
              <FieldLabel label="Email" htmlFor="email" />
              <TextField
                name="email"
                id="email"
                placeholder="name@example.com"
                type="text"
                autoComplete="email"
                className="mt-1 w-full"
                tabIndex={1}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center">
                <FieldLabel label="Password" htmlFor="password" />
                <Link to="/forgot-password" className="text-sm text-indigo-500">
                  Forgot your password?
                </Link>
              </div>
              <TextField
                name="password"
                type="password"
                id="password"
                autoComplete="password"
                className="mt-1 w-full"
                tabIndex={2}
                required
              />
            </div>
            {errors.email && <WarningMessage message={errors.email} />}
            <button
              type="submit"
              className={`w-full p-3 flex items-center justify-center rounded ${
                isSubmitting ? 'bg-indigo-300 pointer-events-none' : 'bg-indigo-500'
              } text-white font-medium focus:ring focus:outline-none`}
            >
              {isSubmitting ? <LoadingSpinner /> : 'Log in'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
