import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
    <input ref={ref} className={`input-field ${error ? 'border-red-500/60 focus:ring-red-500/40' : ''} ${className}`} {...props} />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
