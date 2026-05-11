import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../../services/api';
import { CHART_COLORS } from '../../../utils/helpers';
import Spinner from '../../../components/ui/Spinner';

const PublicResultsPage = () => {
  const { pollCode } = useParams();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/polls/public/results/${pollCode}`);
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Results not available');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pollCode]);

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><Spinner size="lg" /></div>;
  if (error)   return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="card text-center max-w-md">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">Results Not Available</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    </div>
  );

  const { poll, analytics } = data;

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-border py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="font-bold gradient-text">PollWave</span>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <span className="badge badge-published mb-4">★ Results Published</span>
            <h1 className="text-3xl font-bold text-white mb-3">{poll.title}</h1>
            {poll.description && <p className="text-gray-400 mb-4">{poll.description}</p>}
            <p className="text-gray-500 text-sm">{analytics?.totalResponses ?? 0} total responses</p>
          </div>
          <div className="space-y-6">
            {analytics?.questionStats?.map((qs, i) => {
              const chartData = Object.entries(qs.optionCounts || {}).map(([name, value]) => ({ name, value }));
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card">
                  <p className="text-xs text-brand-400 font-semibold uppercase tracking-wide mb-1">Question {i + 1}</p>
                  <h3 className="text-lg font-semibold text-white mb-4">{qs.questionText}</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={chartData} margin={{ left: -20 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2a2a45', borderRadius: 10, color: '#fff' }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {chartData.map((_, ci) => <Cell key={ci} fill={CHART_COLORS[ci % CHART_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {Object.entries(qs.optionCounts || {}).map(([opt, count], oi) => (
                      <div key={oi} className="flex items-center gap-3">
                        <span className="text-sm text-gray-300 w-28 truncate">{opt}</span>
                        <div className="flex-1 bg-white/5 rounded-full h-2">
                          <div className="h-full rounded-full" style={{ width: `${qs.optionPercentages?.[opt] ?? 0}%`, background: CHART_COLORS[oi % CHART_COLORS.length] }} />
                        </div>
                        <span className="text-sm font-semibold text-white w-10 text-right">{qs.optionPercentages?.[opt] ?? 0}%</span>
                        <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicResultsPage;
