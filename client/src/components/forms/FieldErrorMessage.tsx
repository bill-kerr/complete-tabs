import { ErrorMessage, ErrorMessageProps } from 'formik';

export const FieldErrorMessage: React.FC<ErrorMessageProps> = props => {
  return (
    <ErrorMessage
      {...props}
      component="div"
      className={`text-sm text-red-500 ${props.className}`}
    />
  );
};
