export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary opacity-20"></div>
        <div className="w-12 h-12 rounded-full border-4 border-t-primary animate-spin absolute top-0 left-0"></div>
      </div>
      <span className="ml-4 text-lg font-medium">Loading...</span>
    </div>
  );
};
