import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm]   = useState({ email: '', password: '' });
  const [show, setShow]   = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(res)) {
      toast.success('Welcome back!');
      const user = res.payload.user;
      navigate(user.onboardingCompleted ? '/dashboard' : '/onboarding');
    } else {
      toast.error(res.payload);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
              <span className="font-bold text-lg gradient-text">PollWave</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  name="password" type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={handleChange} required
                  className="input-field pr-11"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {show ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">Sign In</Button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-medium">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
