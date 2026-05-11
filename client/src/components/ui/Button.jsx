import { motion } from 'framer-motion';

const Button = ({
  children, onClick, type = 'button', variant = 'primary',
  size = 'md', loading = false, disabled = false, className = '', icon,
}) => {
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    ghost:     'text-gray-400 hover:text-white hover:bg-white/5 px-4 py-2 rounded-xl transition-all',
  };
  const sizes = { sm: 'text-sm px-4 py-2', md: '', lg: 'text-lg px-8 py-3' };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${sizes[size]} flex items-center gap-2 justify-center ${className}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
    </motion.button>
  );
};

export default Button;
