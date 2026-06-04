const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-zinc-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-900 animate-spin"></div>
      </div>
      {text && <p className="text-zinc-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
