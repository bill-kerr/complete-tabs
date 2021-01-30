import * as Yup from 'yup';

const email = Yup.string()
  .email('Must be a valid email address.')
  .required('An email address is required.');

const password = Yup.string()
  .min(6, 'Password must be at least 6 characters long.')
  .required('A password is required.');

const confirmPassword = Yup.string()
  .equals([Yup.ref('password')], 'Passwords do not match.')
  .required('Please confirm your password.');

export const RegisterValidationSchema = Yup.object().shape({
  email,
  password,
  confirmPassword,
});

export const LoginValidationSchema = Yup.object().shape({ email, password });
