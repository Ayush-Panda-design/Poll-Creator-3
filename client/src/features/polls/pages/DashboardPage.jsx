import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPolls, deletePoll, publishPoll } from '../pollSlice';
import { motion } from 'framer-motion';
import { FiPlus, FiBarChart2, FiShare2, FiTrash2, FiEdit, FiEye, FiZap } from 'react-icons/fi';
import { SkeletonList } from '../../../components/loaders/SkeletonCard';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatDate, timeUntilExpiry } from '../../../utils/formatters';
import { buildPollUrl, copyToClipboard } from '../../../utils/helpers';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { polls, loading } = useSelector((s) => s.polls);
  const { user }           = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchPolls()); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this poll? This cannot be undone.')) return;
    await dispatch(deletePoll(id));
    toast.success('Poll deleted');
  };

  const handlePublish = async (id) => {
    const res = await dispatch(publishPoll(id));
    if (publishPoll.fulfilled.match(res)) toast.success('Poll results published!');
    else toast.error('Failed to publish');
  };

  const handleShare = async (pollCode) => {
    const url = buildPollUrl(pollCode);
    const ok  = await copyToClipboard(url);
    toast.success(ok ? 'Link copied to clipboard!' : url);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Polls</h1>
          <p className="text-gray-400 mt-1">Manage and monitor your polls</p>
        </div>
        <Link to="/polls/create">
          <Button icon={<FiPlus />}>Create Poll</Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Polls',     value: polls.length,                                     color: 'text-brand-400' },
          { label: 'Active',          value: polls.filter((p) => p.status === 'active').length, color: 'text-emerald-400' },
          { label: 'Total Responses', value: polls.reduce((s, p) => s + (p.totalResponses || 0), 0), color: 'text-purple-400' },
          { label: 'Published',       value: polls.filter((p) => p.isPublished).length,        color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="glass p-5">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Poll list */}
      {loading ? (
        <SkeletonList count={3} />
      ) : polls.length === 0 ? (
        <div className="card text-center py-20">
          <div className="w-16 h-16 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-400 text-3xl">
            <FiZap />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No polls yet</h3>
          <p className="text-gray-400 mb-6">Create your first poll and start collecting responses.</p>
          <Link to="/polls/create"><Button>Create your first poll</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll, i) => (
            <motion.div
              key={poll._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card hover:border-brand-500/30 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="font-semibold text-white text-lg truncate">{poll.title}</h3>
                    <Badge status={poll.status} />
                    {poll.isPublished && <span className="badge badge-published">Published</span>}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                    <span>{poll.questions?.length || 0} questions</span>
                    <span className="text-emerald-400 font-medium">{poll.totalResponses || 0} responses</span>
                    <span>Created {formatDate(poll.createdAt)}</span>
                    {poll.expiresAt && (
                      <span className={timeUntilExpiry(poll.expiresAt) === 'Expired' ? 'text-red-400' : 'text-amber-400'}>
                        ⏱ {timeUntilExpiry(poll.expiresAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => handleShare(poll.pollCode)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <FiShare2 /> Share
                  </button>
                  <Link to={`/polls/${poll._id}/analytics`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <FiBarChart2 /> Analytics
                  </Link>
                  <Link to={`/polls/${poll._id}/edit`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <FiEdit /> Edit
                  </Link>
                  {!poll.isPublished && poll.totalResponses > 0 && (
                    <button onClick={() => handlePublish(poll._id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-amber-400 hover:bg-amber-500/10 transition-all">
                      <FiEye /> Publish
                    </button>
                  )}
                  <button onClick={() => handleDelete(poll._id)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
