import { IconExclamation } from '../svg/icons/IconExclamation';

interface WarningMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  useIcon?: boolean;
}

export const WarningMessage: React.FC<WarningMessageProps> = ({
  message,
  useIcon = true,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={`space-x-2 flex items-center text-sm font-medium text-red-500 ${className}`}
    >
      <IconExclamation className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
};
