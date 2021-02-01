import { Formik, Form, FormikHelpers } from 'formik';
import { ForgotPasswordValidationSchema } from '../../form-validation';
import { FieldLabel } from './FieldLabel';
import { TextField } from './TextField';
import { LoadingSpinner } from '../widgets/LoadingSpinner';
import { FieldErrorMessage } from './FieldErrorMessage';
import { FirebaseError, sendPasswordResetEmail } from '../../apis/firebase';

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onEmailSent?: (email: string) => void;
}

interface FormValues {
  email: string;
}

const initialValues: FormValues = {
  email: '',
};

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onEmailSent = () => {},
  ...props
}) => {
  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const error = await sendPasswordResetEmail(values.email);
    if (error) {
      return handleFirebaseError(error, msg => helpers.setFieldError('email', msg));
    }
    onEmailSent(values.email);
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
        return setError('We did not find an account associated with that email.');
      default:
        return setError('An unknown error occurred. Please try again.');
    }
  };

  return (
    <div {...props}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ForgotPasswordValidationSchema}
      >
        {({ isSubmitting, errors, touched, isValid }) => (
          <Form className="space-y-4">
            <div>
              <FieldLabel label="Email" htmlFor="email" />
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
            <button
              type="submit"
              className={`w-full p-3 flex items-center justify-center rounded ${
                isSubmitting || !isValid ? 'bg-indigo-300 pointer-events-none' : 'bg-indigo-500'
              } text-white font-medium focus:ring focus:outline-none`}
            >
              {isSubmitting ? <LoadingSpinner /> : 'Continue'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
