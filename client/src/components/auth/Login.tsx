import { Formik, Form, FormikHelpers } from 'formik';
import { FirebaseError, signInWithEmailAndPassword } from '../../apis/firebase';
import { LoginValidationSchema } from '../../form-validation';
import { FieldLabel } from '../forms/FieldLabel';
import { TextField } from '../forms/TextField';

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

export const Login: React.FC = () => {
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
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={LoginValidationSchema}
      >
        {() => (
          <Form>
            <div>
              <FieldLabel label="Email" htmlFor="email" />
              <TextField name="email" id="email" placeholder="name@example.com" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
