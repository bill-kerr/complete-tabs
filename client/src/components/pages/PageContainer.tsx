export const PageContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={`px-6 mx-auto max-w-screen-lg xl:max-w-screen-xl min-h-screen ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
