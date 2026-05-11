import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { connectSocket } from '../../../socket/socket';
import { SOCKET_EVENTS } from '../../../utils/constants';
import { buildPollUrl, copyToClipboard } from '../../../utils/helpers';
import Spinner from '../../../components/ui/Spinner';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const PublicPollPage = () => {
  const { pollCode } = useParams();
  const [poll, setPoll]             = useState(null);
  const [loading, setLoading]       = useState(true);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [expired, setExpired]       = useState(false);
  const [error, setError]           = useState('');
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await api.get(`/polls/public/${pollCode}`);
        setPoll(res.data.poll);
      } catch (err) {
        if (err.response?.status === 410) setExpired(true);
        else setError(err.response?.data?.message || 'Poll not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [pollCode]);

  useEffect(() => {
    if (!poll) return;
    const socket = connectSocket();
    socket.emit(SOCKET_EVENTS.JOIN_POLL, poll._id);
    socket.on(SOCKET_EVENTS.PARTICIPANT_COUNT, ({ count }) => setParticipants(count));
    socket.on(SOCKET_EVENTS.POLL_EXPIRED, () => setExpired(true));
    return () => {
      socket.emit(SOCKET_EVENTS.LEAVE_POLL, poll._id);
      socket.off(SOCKET_EVENTS.PARTICIPANT_COUNT);
      socket.off(SOCKET_EVENTS.POLL_EXPIRED);
    };
  }, [poll]);

  const handleSelect = (qIdx, option) => setAnswers((a) => ({ ...a, [qIdx]: option }));

  const handleSubmit = async () => {
    // Validate mandatory questions
    const missing = poll.questions
      .map((q, i) => ({ ...q, index: i }))
      .filter((q) => q.required && !answers[q.index]);
    if (missing.length) {
      toast.error(`Please answer: "${missing[0].question}"`);
      return;
    }

    const payload = poll.questions.map((_, qIdx) => ({
      questionIndex: qIdx,
      selectedOption: answers[qIdx] || null,
    }));

    try {
      setSubmitting(true);
      await api.post(`/responses/${poll._id}`, { answers: payload });
      setSubmitted(true);
      toast.success('Response submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)  return <div className="min-h-screen bg-surface flex items-center justify-center"><Spinner size="lg" /></div>;
  if (expired)  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="card text-center max-w-md w-full">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="text-2xl font-bold text-white mb-2">Poll Expired</h2>
        <p className="text-gray-400">This poll is no longer accepting responses.</p>
      </div>
    </div>
  );
  if (error)    return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="card text-center max-w-md w-full">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">Poll Not Found</h2>
        <p className="text-gray-400">{error}</p>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 rounded-full blur-[100px]" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card text-center max-w-md w-full relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-5xl mb-4">🎉</motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Thank you!</h2>
        <p className="text-gray-400 mb-6">Your response has been recorded successfully.</p>
        {poll.isPublished && (
          <Button onClick={() => window.location.href = `/poll/${pollCode}/results`} variant="secondary">View Results</Button>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-surface-border py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="font-bold gradient-text">PollWave</span>
          </div>
          {participants > 0 && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {participants} viewing
            </span>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">{poll.title}</h1>
            {poll.description && <p className="text-gray-400">{poll.description}</p>}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              {poll.isAnonymous && <span>🔓 Anonymous</span>}
              <span>{poll.questions?.length} question{poll.questions?.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="space-y-6">
            {poll.questions?.map((q, qIdx) => (
              <motion.div key={qIdx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qIdx * 0.1 }} className="card">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-semibold text-white">
                    <span className="text-brand-400 mr-2">{qIdx + 1}.</span>{q.question}
                  </h3>
                  {q.required && <span className="text-xs text-red-400 flex-shrink-0">Required</span>}
                </div>
                <div className="space-y-2">
                  {q.options.map((option, oIdx) => (
                    <button key={oIdx} onClick={() => handleSelect(qIdx, option)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                        answers[qIdx] === option
                          ? 'border-brand-500 bg-brand-600/20 text-white'
                          : 'border-surface-border text-gray-300 hover:border-white/30 hover:bg-white/5'
                      }`}>
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                        answers[qIdx] === option ? 'border-brand-500 bg-brand-500' : 'border-gray-600'
                      }`} />
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <Button onClick={handleSubmit} loading={submitting} className="w-full" size="lg">
              Submit Response
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicPollPage;
