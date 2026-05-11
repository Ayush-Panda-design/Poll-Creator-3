import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { completeOnboarding } from '../../auth/authSlice';
import { USER_INTERESTS, USER_ROLES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';

const steps = ['role', 'interests', 'done'];

const OnboardingPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [step, setStep]       = useState(0);
  const [role, setRole]       = useState('');
  const [interests, setInterests] = useState([]);

  const toggleInterest = (item) =>
    setInterests((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);

  const handleFinish = async () => {
    if (!role) { toast.error('Please select your role'); return; }
    const res = await dispatch(completeOnboarding({ role, interests }));
    if (completeOnboarding.fulfilled.match(res)) {
      toast.success('Welcome to PollWave!');
      navigate('/dashboard');
    } else {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/15 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.slice(0, -1).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-brand-500' : 'bg-white/10'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="role" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="card">
                <h2 className="text-2xl font-bold text-white mb-2">What best describes you?</h2>
                <p className="text-gray-400 mb-6">Help us personalise your experience.</p>
                <div className="grid grid-cols-2 gap-3">
                  {USER_ROLES.map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                      className={`p-4 rounded-xl border text-left font-medium transition-all ${
                        role === r ? 'border-brand-500 bg-brand-600/20 text-brand-400' : 'border-surface-border text-gray-400 hover:border-white/30 hover:text-white'
                      }`}>
                      {r}
                    </button>
                  ))}
                </div>
                <Button className="w-full mt-6" onClick={() => setStep(1)} disabled={!role}>Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="interests" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <div className="card">
                <h2 className="text-2xl font-bold text-white mb-2">What will you use it for?</h2>
                <p className="text-gray-400 mb-6">Select all that apply.</p>
                <div className="flex flex-wrap gap-3">
                  {USER_INTERESTS.map((item) => (
                    <button key={item} onClick={() => toggleInterest(item)}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        interests.includes(item) ? 'border-brand-500 bg-brand-600/20 text-brand-400' : 'border-surface-border text-gray-400 hover:border-white/30 hover:text-white'
                      }`}>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
                  <Button className="flex-1" loading={loading} onClick={handleFinish}>Finish Setup</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingPage;
