const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-14 h-14' };
  return (
    <div className={`${sizes[size]} border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin ${className}`} />
  );
};

export default Spinner;
