export const LoadingSpinner: React.FC = () => {
  return (
    <div className="h-6 w-6 flex items-center justify-center">
      <div
        className="h-4 w-4 rounded-full border-2 border-indigo-200 animate-spin"
        style={{ borderLeftColor: 'transparent' }}
      />
    </div>
  );
};
