import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiRefreshCw, FiMonitor, FiShare2 } from 'react-icons/fi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import api from '../../../services/api';
import { connectSocket, getSocket } from '../../../socket/socket';
import { SOCKET_EVENTS } from '../../../utils/constants';
import { CHART_COLORS, buildPollUrl, copyToClipboard } from '../../../utils/helpers';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const AnalyticsPage = () => {
  const { id } = useParams();
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [participants, setParticipants] = useState(0);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/analytics/${id}`);
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const socket = connectSocket();
    socket.emit(SOCKET_EVENTS.JOIN_POLL, id);
    socket.emit('subscribe_analytics', id);

    socket.on(SOCKET_EVENTS.ANALYTICS_UPDATE, (updated) => {
      setData((prev) => prev ? { ...prev, stats: updated } : prev);
    });

    socket.on(SOCKET_EVENTS.NEW_RESPONSE, ({ totalResponses }) => {
      setData((prev) => prev ? { ...prev, stats: { ...prev.stats, totalResponses } } : prev);
    });

    socket.on(SOCKET_EVENTS.PARTICIPANT_COUNT, ({ count }) => setParticipants(count));

    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, id);
      socket.off(SOCKET_EVENTS.ANALYTICS_UPDATE);
      socket.off(SOCKET_EVENTS.NEW_RESPONSE);
      socket.off(SOCKET_EVENTS.PARTICIPANT_COUNT);
    };
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!data)   return <div className="text-center py-20 text-gray-400">No analytics data available.</div>;

  const { poll, stats } = data;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <Link to="/dashboard" className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"><FiArrowLeft size={20} /></Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white truncate">{poll?.title}</h1>
          <p className="text-gray-400 text-sm mt-0.5">Analytics Dashboard</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button icon={<FiRefreshCw />} variant="secondary" onClick={fetchAnalytics}>Refresh</Button>
          <Link to={`/polls/${id}/present`}><Button icon={<FiMonitor />} variant="secondary">Present</Button></Link>
          <Button icon={<FiShare2 />} variant="secondary" onClick={async () => { const ok = await copyToClipboard(buildPollUrl(poll.pollCode)); toast.success(ok ? 'Link copied!' : 'Failed'); }}>Share</Button>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Responses', value: stats?.totalResponses ?? 0,          color: 'text-brand-400', icon: '📊' },
          { label: 'Live Participants', value: participants,                         color: 'text-emerald-400', icon: '🟢' },
          { label: 'Questions',        value: stats?.questionStats?.length ?? 0,   color: 'text-purple-400', icon: '❓' },
          { label: 'Poll Code',        value: poll?.pollCode ?? '—',              color: 'text-amber-400', icon: '🔑' },
        ].map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass p-5">
            <p className="text-gray-400 text-sm">{s.icon} {s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Per-question charts */}
      {stats?.questionStats?.length === 0 && (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-xl font-semibold mb-2">No responses yet</p>
          <p className="text-sm">Share the poll link and watch results appear in real-time.</p>
          <div className="mt-4 text-brand-400 font-mono text-lg">{buildPollUrl(poll?.pollCode)}</div>
        </div>
      )}

      <div className="space-y-6">
        {stats?.questionStats?.map((qs, i) => {
          const chartData = Object.entries(qs.optionCounts || {}).map(([name, value]) => ({ name, value }));
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-2">
                <div>
                  <p className="text-xs text-brand-400 font-semibold uppercase tracking-wide mb-1">Question {i + 1}</p>
                  <h3 className="text-lg font-semibold text-white">{qs.questionText}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="text-emerald-400 font-medium">{qs.totalAnswered} answered</span>
                  <span>{qs.skipped} skipped</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar chart */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Vote Count</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 10, color: '#fff' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, ci) => <Cell key={ci} fill={CHART_COLORS[ci % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Distribution</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {chartData.map((_, ci) => <Cell key={ci} fill={CHART_COLORS[ci % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 10, color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Option breakdown */}
              <div className="mt-6 space-y-2">
                {Object.entries(qs.optionCounts || {}).map(([opt, count], oi) => {
                  const pct = qs.optionPercentages?.[opt] ?? 0;
                  return (
                    <div key={oi} className="flex items-center gap-3">
                      <span className="text-sm text-gray-300 w-32 truncate">{opt}</span>
                      <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 + oi * 0.05 }}
                          className="h-full rounded-full"
                          style={{ background: CHART_COLORS[oi % CHART_COLORS.length] }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-white w-10 text-right">{pct}%</span>
                      <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnalyticsPage;
