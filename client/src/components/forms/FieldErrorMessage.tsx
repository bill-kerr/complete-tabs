import { ErrorMessage, ErrorMessageProps } from 'formik';
import { IconExclamation } from '../svg/icons';

export const FieldErrorMessage: React.FC<ErrorMessageProps> = props => {
  const renderMessage = (msg: string) => (
    <div className="flex items-center text-red-500">
      <IconExclamation className="h-4 w-4" />
      <span className="ml-1 text-xs">{msg}</span>
    </div>
  );

  return (
    <ErrorMessage
      {...props}
      className={`text-xs ${props.className}`}
      render={msg => renderMessage(msg)}
    />
  );
};
