import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { motion } from 'framer-motion';
import { FiHome, FiPlus, FiLogOut, FiUser, FiBarChart2, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/dashboard',    icon: <FiHome />,     label: 'Dashboard' },
  { to: '/polls/create', icon: <FiPlus />,     label: 'New Poll' },
];

const DashboardLayout = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { user }   = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface-card border-r border-surface-border
        flex flex-col transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-surface-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">P</div>
            <span className="font-bold text-xl gradient-text">PollWave</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {link.icon}<span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-surface-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm">
            <FiLogOut /><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-surface-card/80 backdrop-blur-md border-b border-surface-border px-6 py-4 flex items-center gap-4 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-white"><FiMenu size={22} /></button>
          <span className="font-bold text-lg gradient-text">PollWave</span>
        </header>

        <div className="flex-1 p-6 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
