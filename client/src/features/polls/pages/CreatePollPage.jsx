import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../pollSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiArrowLeft, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const emptyQuestion = () => ({ question: '', options: ['', ''], required: true });

const CreatePollPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { loading } = useSelector((s) => s.polls);

  const [form, setForm] = useState({
    title: '', description: '', isAnonymous: true, requiresAuth: false,
    expiresAt: '', questions: [emptyQuestion()],
  });

  const updateForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const updateQuestion = (qIdx, key, val) => {
    const qs = [...form.questions];
    qs[qIdx] = { ...qs[qIdx], [key]: val };
    updateForm('questions', qs);
  };

  const updateOption = (qIdx, oIdx, val) => {
    const qs  = [...form.questions];
    const opts = [...qs[qIdx].options];
    opts[oIdx] = val;
    qs[qIdx]  = { ...qs[qIdx], options: opts };
    updateForm('questions', qs);
  };

  const addOption    = (qIdx) => updateQuestion(qIdx, 'options', [...form.questions[qIdx].options, '']);
  const removeOption = (qIdx, oIdx) => {
    const opts = form.questions[qIdx].options.filter((_, i) => i !== oIdx);
    updateQuestion(qIdx, 'options', opts);
  };
  const addQuestion    = () => updateForm('questions', [...form.questions, emptyQuestion()]);
  const removeQuestion = (qIdx) => updateForm('questions', form.questions.filter((_, i) => i !== qIdx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Poll title required'); return; }
    const invalid = form.questions.find((q) => !q.question.trim() || q.options.filter(Boolean).length < 2);
    if (invalid) { toast.error('Each question needs text + at least 2 non-empty options'); return; }

    const payload = {
      ...form,
      expiresAt: form.expiresAt || null,
      questions: form.questions.map((q) => ({ ...q, options: q.options.filter(Boolean) })),
    };

    const res = await dispatch(createPoll(payload));
    if (createPoll.fulfilled.match(res)) {
      toast.success('Poll created!');
      navigate('/dashboard');
    } else {
      toast.error(res.payload || 'Failed to create poll');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Create Poll</h1>
          <p className="text-gray-400 text-sm mt-0.5">Build your poll and share it with the world</p>
        </div>
        <Button type="submit" loading={loading}>Publish Poll</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Poll Details */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-white text-lg">Poll Details</h2>
            <Input label="Poll Title *" placeholder="What's this poll about?" value={form.title}
              onChange={(e) => updateForm('title', e.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Description (optional)</label>
              <textarea className="input-field resize-none h-20" placeholder="Add context for your respondents..."
                value={form.description} onChange={(e) => updateForm('description', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Expiry Date & Time (optional)</label>
              <input type="datetime-local" className="input-field" value={form.expiresAt}
                onChange={(e) => updateForm('expiresAt', e.target.value)} />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <h2 className="font-semibold text-white text-lg">Questions</h2>
            <AnimatePresence>
              {form.questions.map((q, qIdx) => (
                <motion.div key={qIdx} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                  className="card space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-400">Question {qIdx + 1}</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateQuestion(qIdx, 'required', !q.required)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                          q.required ? 'border-brand-500/50 bg-brand-600/20 text-brand-400' : 'border-white/10 text-gray-400 hover:border-white/30'
                        }`}>
                        {q.required ? <FiToggleRight /> : <FiToggleLeft />}
                        {q.required ? 'Mandatory' : 'Optional'}
                      </button>
                      {form.questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestion(qIdx)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <input className="input-field" placeholder={`Question ${qIdx + 1} text...`}
                    value={q.question} onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)} required />

                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Options (single choice)</label>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
                        <input className="input-field flex-1 py-2" placeholder={`Option ${oIdx + 1}`}
                          value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} />
                        {q.options.length > 2 && (
                          <button type="button" onClick={() => removeOption(qIdx, oIdx)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0">
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => addOption(qIdx)}
                      className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 mt-2 transition-colors">
                      <FiPlus size={14} /> Add option
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button type="button" onClick={addQuestion}
              className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:border-brand-500/50 hover:text-brand-400 transition-all flex items-center justify-center gap-2">
              <FiPlus /> Add Question
            </button>
          </div>
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          <div className="card space-y-5 sticky top-6">
            <h2 className="font-semibold text-white text-lg">Settings</h2>

            <div className="flex items-center justify-between py-3 border-b border-surface-border">
              <div>
                <p className="text-sm font-medium text-white">Anonymous Responses</p>
                <p className="text-xs text-gray-400 mt-0.5">Don't require login to respond</p>
              </div>
              <button type="button" onClick={() => updateForm('isAnonymous', !form.isAnonymous)}
                className={`relative w-11 h-6 rounded-full transition-all ${form.isAnonymous ? 'bg-brand-600' : 'bg-gray-700'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.isAnonymous ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-white">Require Login</p>
                <p className="text-xs text-gray-400 mt-0.5">Only authenticated users</p>
              </div>
              <button type="button" onClick={() => updateForm('requiresAuth', !form.requiresAuth)}
                className={`relative w-11 h-6 rounded-full transition-all ${form.requiresAuth ? 'bg-brand-600' : 'bg-gray-700'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.requiresAuth ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="pt-2 border-t border-surface-border space-y-1 text-sm text-gray-400">
              <p>📝 {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}</p>
              <p>{form.isAnonymous ? '🔓 Anonymous responses' : '🔐 Authenticated only'}</p>
              {form.expiresAt && <p>⏱ Expires {new Date(form.expiresAt).toLocaleDateString()}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full">Create Poll</Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreatePollPage;
