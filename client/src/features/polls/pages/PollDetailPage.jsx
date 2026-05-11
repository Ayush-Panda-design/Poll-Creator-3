import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchPollById, publishPoll, deletePoll } from '../pollSlice';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiBarChart2, FiShare2, FiEdit, FiTrash2, FiMonitor } from 'react-icons/fi';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import { formatDate, timeUntilExpiry } from '../../../utils/formatters';
import { buildPollUrl, copyToClipboard } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const PollDetailPage = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { currentPoll: poll, loading } = useSelector((s) => s.polls);

  useEffect(() => { dispatch(fetchPollById(id)); }, [id]);

  if (loading || !poll) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const handleShare   = async () => { const ok = await copyToClipboard(buildPollUrl(poll.pollCode)); toast.success(ok ? 'Link copied!' : buildPollUrl(poll.pollCode)); };
  const handlePublish = async () => { const res = await dispatch(publishPoll(id)); if (publishPoll.fulfilled.match(res)) toast.success('Results published!'); };
  const handleDelete  = async () => { if (!confirm('Delete poll?')) return; await dispatch(deletePoll(id)); navigate('/dashboard'); };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard" className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all"><FiArrowLeft size={20} /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{poll.title}</h1>
            <Badge status={poll.status} />
            {poll.isPublished && <span className="badge badge-published">Published</span>}
          </div>
          {poll.description && <p className="text-gray-400 text-sm mt-1">{poll.description}</p>}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap mb-8">
        <Button icon={<FiShare2 />} variant="secondary" onClick={handleShare}>Share Link</Button>
        <Link to={`/polls/${id}/analytics`}><Button icon={<FiBarChart2 />} variant="secondary">Analytics</Button></Link>
        <Link to={`/polls/${id}/edit`}><Button icon={<FiEdit />} variant="secondary">Edit</Button></Link>
        <Link to={`/polls/${id}/present`}><Button icon={<FiMonitor />} variant="secondary">Present</Button></Link>
        {!poll.isPublished && poll.totalResponses > 0 && (
          <Button variant="primary" onClick={handlePublish}>Publish Results</Button>
        )}
        <Button icon={<FiTrash2 />} variant="danger" onClick={handleDelete}>Delete</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Responses', value: poll.totalResponses || 0, color: 'text-brand-400' },
          { label: 'Questions',       value: poll.questions?.length || 0, color: 'text-purple-400' },
          { label: 'Poll Code',       value: poll.pollCode, color: 'text-emerald-400' },
          { label: 'Time Left',       value: timeUntilExpiry(poll.expiresAt) || '∞', color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="glass p-5">
            <p className="text-gray-400 text-sm">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Questions preview */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-4">Questions</h2>
        <div className="space-y-4">
          {poll.questions?.map((q, i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl">
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="font-medium text-white">{i + 1}. {q.question}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${q.required ? 'bg-brand-600/20 text-brand-400' : 'bg-gray-700 text-gray-400'}`}>
                  {q.required ? 'Required' : 'Optional'}
                </span>
              </div>
              <div className="space-y-1.5 pl-4">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-3.5 h-3.5 rounded-full border border-gray-500" />
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollDetailPage;
