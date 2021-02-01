import { Formik, Form, FormikHelpers } from 'formik';
import { ResetPasswordValidationSchema } from '../../form-validation';
import { FieldLabel } from './FieldLabel';
import { TextField } from './TextField';
import { LoadingSpinner } from '../widgets/LoadingSpinner';
import { FieldErrorMessage } from './FieldErrorMessage';
import { confirmPasswordReset, FirebaseError } from '../../apis/firebase';
import { WarningMessage } from '../widgets/WarningMessage';

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  onPasswordChange?: () => void;
}

interface FormValues {
  password: string;
  confirmPassword: string;
  errorField: string;
}

const initialValues: FormValues = {
  password: '',
  confirmPassword: '',
  errorField: '',
};

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  code,
  onPasswordChange = () => {},
  ...props
}) => {
  const handleSubmit = async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const error = await confirmPasswordReset(code, values.password);
    if (error) {
      return handleFirebaseError(error, msg => helpers.setFieldError('errorField', msg));
    }
    return onPasswordChange();
  };

  const handleFirebaseError = (
    error: FirebaseError | null,
    setError: (message: string) => void
  ) => {
    if (!error) {
      return;
    }

    switch (error) {
      case FirebaseError.ExpiredActionCode:
        return setError('The password reset code has expired.');
      case FirebaseError.InvalidActionCode:
      case FirebaseError.ArgumentError:
        return setError('The password reset code is invalid.');
      case FirebaseError.UserNotFound:
        return setError('We did not find an account associated with that email.');
      case FirebaseError.UserDisabled:
        return setError('Your account has been temporarily disabled. Please try again later.');
      default:
        return setError('An unknown error occurred. Please try again.');
    }
  };

  return (
    <div {...props}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ResetPasswordValidationSchema}
      >
        {({ isSubmitting, errors, touched, isValid }) => (
          <Form className="space-y-4">
            <div>
              <FieldLabel label="New Password" htmlFor="password" />
              <TextField
                name="password"
                id="password"
                placeholder="Must contain at least 6 characters"
                type="password"
                className={`mt-1 w-full ${errors.password && touched.password && 'border-red-400'}`}
                tabIndex={1}
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
                id="confirmPassword"
                placeholder="Re-type your password"
                type="password"
                className={`mt-1 w-full ${
                  errors.confirmPassword && touched.confirmPassword && 'border-red-400'
                }`}
                tabIndex={2}
                required
              />
              <div className="mt-1 h-3">
                <FieldErrorMessage name="confirmPassword" />
              </div>
            </div>
            {errors.errorField && <WarningMessage message={errors.errorField} />}
            <button
              type="submit"
              className={`w-full p-3 flex items-center justify-center rounded ${
                isSubmitting || !isValid ? 'bg-indigo-300 pointer-events-none' : 'bg-indigo-500'
              } text-white font-medium focus:ring focus:outline-none`}
            >
              {isSubmitting ? <LoadingSpinner /> : 'Change Password'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
