import { Formik, Form, FormikHelpers } from 'formik';
import { FirebaseError, registerUser } from '../../apis/firebase';
import { RegisterValidationSchema } from '../../form-validation';
import { FieldErrorMessage } from './FieldErrorMessage';
import { FieldLabel } from './FieldLabel';
import { TextField } from './TextField';
import { LoadingSpinner } from '../widgets/LoadingSpinner';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
};

export const RegisterForm: React.FC<React.HTMLAttributes<HTMLDivElement>> = props => {
  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const error = await registerUser(values.email, values.password);
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
      case FirebaseError.InvalidEmail:
        return setError('Invalid email.');
      case FirebaseError.EmailInUse:
        return setError('That email is already is use.');
      default:
        return setError('An unknown error occurred. Please try again.');
    }
  };

  return (
    <div {...props}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={RegisterValidationSchema}
      >
        {({ isSubmitting, isValid, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <FieldLabel label="Email" htmlFor="email" />
              <div>
                <TextField
                  name="email"
                  id="email"
                  placeholder="name@example.com"
                  type="text"
                  autoComplete="email"
                  className={`mt-1 w-full ${errors.email && touched.email && 'border-red-400'}`}
                  tabIndex={1}
                  required
                />
                <div className="mt-1 h-3">
                  <FieldErrorMessage name="email" />
                </div>
              </div>
            </div>
            <div>
              <FieldLabel label="Password" htmlFor="password" />
              <TextField
                name="password"
                type="password"
                id="password"
                placeholder="Must contain at least 6 characters"
                autoComplete="password"
                className={`mt-1 w-full ${errors.password && touched.password && 'border-red-400'}`}
                tabIndex={2}
                required
              />
              <div className="mt-1 h-3">
                <FieldErrorMessage name="password" />
              </div>
            </div>
            <div>
              <FieldLabel label="Confirm Password" htmlFor="confirmPassword" />
              <TextField
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Re-type your password"
                autoComplete="password"
                className={`mt-1 w-full ${
                  errors.confirmPassword && touched.confirmPassword && 'border-red-400'
                }`}
                tabIndex={3}
                required
              />
              <div className="mt-1 h-3">
                <FieldErrorMessage name="confirmPassword" />
              </div>
            </div>
            <button
              disabled={!isValid}
              type="submit"
              className={`w-full p-3 flex items-center justify-center rounded ${
                isSubmitting || !isValid ? 'bg-indigo-300 pointer-events-none' : 'bg-indigo-500'
              } text-white font-medium focus:ring focus:outline-none`}
            >
              {isSubmitting ? <LoadingSpinner /> : 'Create account'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
