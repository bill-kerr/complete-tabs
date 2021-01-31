import { Formik, Form, FormikHelpers } from 'formik';
import { Link } from 'react-router-dom';
import { FirebaseError, signInWithEmailAndPassword } from '../../apis/firebase';
import { LoginValidationSchema } from '../../form-validation';
import { FieldLabel } from '../forms/FieldLabel';
import { TextField } from '../forms/TextField';
import { LoadingSpinner } from '../widgets/LoadingSpinner';

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
    if (error === FirebaseError.UserNotFound || error === FirebaseError.WrongPassword) {
      // handle login error
    }

    if (error === FirebaseError.UserDisabled) {
      helpers.setFieldError('email', 'This account has been disabled.');
    }
  };

  return (
    <div {...props}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={LoginValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
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
              />
            </div>
            <button
              type="submit"
              className={`w-full p-3 flex items-center justify-center rounded ${
                isSubmitting ? 'bg-indigo-400' : 'bg-indigo-500'
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
