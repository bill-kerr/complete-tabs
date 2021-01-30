import { FieldHookConfig, useField } from 'formik';

export const TextField: React.FC<FieldHookConfig<string>> = ({ className, ...props }) => {
  const [field, meta] = useField<string>(props);

  const showError = () => meta.error && meta.touched;

  return (
    <input
      className={`py-3 px-4 border ${
        showError() ? 'border-red-400' : 'border-gray-200'
      } focus:ring focus:outline-none ${className}`}
      {...field}
    />
  );
};
