import { FieldHookConfig, useField } from 'formik';

export const TextField: React.FC<FieldHookConfig<string>> = ({ className, ...props }) => {
  const [field] = useField<string>(props);

  return (
    <input
      className={`py-2 px-4 text-sm border border-gray-200 focus:ring focus:outline-none rounded ${className}`}
      {...field}
      type={props.type}
      placeholder={props.placeholder}
      id={props.id}
      autoComplete={props.autoComplete}
      tabIndex={props.tabIndex}
    />
  );
};
