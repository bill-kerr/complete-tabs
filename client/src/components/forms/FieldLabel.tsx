interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ label, ...props }) => {
  return (
    <label className={`inline-block text-sm font-bold text-gray-500 ${props.className}`} {...props}>
      {label}
    </label>
  );
};
