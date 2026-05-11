import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiShare2, FiUsers, FiZap } from 'react-icons/fi';

const features = [
  { icon: <FiZap />, title: 'Real-Time Polls', desc: 'Live vote counts and analytics update instantly via WebSockets.' },
  { icon: <FiShare2 />, title: 'Shareable Links', desc: 'Share your poll with a unique link or code — no signup needed for respondents.' },
  { icon: <FiBarChart2 />, title: 'Rich Analytics', desc: 'Beautiful charts and insights into every question and response.' },
  { icon: <FiUsers />, title: 'Anonymous Mode', desc: 'Collect honest feedback without requiring login.' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-surface-border max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="font-bold text-xl gradient-text">PollWave</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Login</Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-20 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/15 rounded-full blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-400 text-sm font-medium mb-6">
            <FiZap /> Real-time polling platform
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Create Polls.<br />
            <span className="gradient-text">Collect Feedback.</span><br />
            See Results Live.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            PollWave is the Mentimeter-inspired platform to create polls, share them instantly,
            and watch responses flow in real-time — with beautiful analytics built in.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/signup')} className="btn-primary text-base px-8 py-3 flex items-center gap-2">
              Start for Free <FiArrowRight />
            </button>
            <Link to="/login" className="btn-secondary text-base">Sign In</Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="glass p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-11 h-11 bg-brand-600/20 border border-brand-500/30 rounded-xl flex items-center justify-center text-brand-400 text-xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 text-center text-gray-500 text-sm">
        © 2025 PollWave · Built with ❤️ for the hackathon
      </footer>
    </div>
  );
};

export default LandingPage;
