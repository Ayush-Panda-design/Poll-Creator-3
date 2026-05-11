import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPollById, updatePoll } from '../pollSlice';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Spinner from '../../../components/ui/Spinner';

const EditPollPage = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { currentPoll, loading } = useSelector((s) => s.polls);
  const [form, setForm] = useState(null);

  useEffect(() => {
    dispatch(fetchPollById(id)).then((res) => {
      if (fetchPollById.fulfilled.match(res)) {
        const p = res.payload.poll;
        setForm({
          title: p.title, description: p.description || '', isAnonymous: p.isAnonymous,
          requiresAuth: p.requiresAuth, expiresAt: p.expiresAt ? p.expiresAt.slice(0, 16) : '',
          questions: p.questions.map((q) => ({ question: q.question, options: q.options, required: q.required })),
        });
      }
    });
  }, [id]);

  if (!form) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const updateField  = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const updateQ      = (i, key, val) => { const qs = [...form.questions]; qs[i] = { ...qs[i], [key]: val }; updateField('questions', qs); };
  const updateOption = (qi, oi, val) => { const qs = [...form.questions]; const opts = [...qs[qi].options]; opts[oi] = val; qs[qi] = { ...qs[qi], options: opts }; updateField('questions', qs); };
  const addOption    = (qi) => updateQ(qi, 'options', [...form.questions[qi].options, '']);
  const removeOption = (qi, oi) => updateQ(qi, 'options', form.questions[qi].options.filter((_, i) => i !== oi));
  const addQuestion  = () => updateField('questions', [...form.questions, { question: '', options: ['', ''], required: true }]);
  const removeQuestion = (i) => updateField('questions', form.questions.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, expiresAt: form.expiresAt || null, questions: form.questions.map((q) => ({ ...q, options: q.options.filter(Boolean) })) };
    const res = await dispatch(updatePoll({ id, data: payload }));
    if (updatePoll.fulfilled.match(res)) { toast.success('Poll updated!'); navigate('/dashboard'); }
    else toast.error(res.payload || 'Update failed');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-8">
        <button type="button" onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
          <FiArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Edit Poll</h1>
        </div>
        <Button type="submit" loading={loading}>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-white">Poll Details</h2>
            <Input label="Title *" value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Description</label>
              <textarea className="input-field resize-none h-20" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Expiry</label>
              <input type="datetime-local" className="input-field" value={form.expiresAt} onChange={(e) => updateField('expiresAt', e.target.value)} />
            </div>
          </div>

          {form.questions.map((q, qi) => (
            <div key={qi} className="card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-400">Question {qi + 1}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updateQ(qi, 'required', !q.required)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${q.required ? 'border-brand-500/50 bg-brand-600/20 text-brand-400' : 'border-white/10 text-gray-400'}`}>
                    {q.required ? 'Mandatory' : 'Optional'}
                  </button>
                  {form.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-all">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <input className="input-field" value={q.question} onChange={(e) => updateQ(qi, 'question', e.target.value)} placeholder="Question text..." required />
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-600 flex-shrink-0" />
                    <input className="input-field flex-1 py-2" value={opt} onChange={(e) => updateOption(qi, oi, e.target.value)} placeholder={`Option ${oi + 1}`} />
                    {q.options.length > 2 && (
                      <button type="button" onClick={() => removeOption(qi, oi)} className="text-red-400 p-1.5 rounded hover:bg-red-500/10 transition-all flex-shrink-0"><FiTrash2 size={14} /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => addOption(qi)} className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 mt-1 transition-colors">
                  <FiPlus size={14} /> Add option
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:border-brand-500/50 hover:text-brand-400 transition-all flex items-center justify-center gap-2">
            <FiPlus /> Add Question
          </button>
        </div>

        <div className="card space-y-5 h-fit sticky top-6">
          <h2 className="font-semibold text-white">Settings</h2>
          {[
            { label: 'Anonymous Responses', desc: 'No login required', key: 'isAnonymous' },
            { label: 'Require Login',       desc: 'Authenticated users only', key: 'requiresAuth' },
          ].map(({ label, desc, key }) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-surface-border last:border-0">
              <div><p className="text-sm font-medium text-white">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
              <button type="button" onClick={() => updateField(key, !form[key])}
                className={`relative w-11 h-6 rounded-full transition-all ${form[key] ? 'bg-brand-600' : 'bg-gray-700'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form[key] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
          <Button type="submit" loading={loading} className="w-full">Save Changes</Button>
        </div>
      </div>
    </form>
  );
};

export default EditPollPage;
