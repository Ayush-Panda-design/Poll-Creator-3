const Badge = ({ status }) => {
  const map = {
    active:    'badge-active',
    expired:   'badge-expired',
    draft:     'badge-draft',
    published: 'badge-published',
  };
  const labels = { active: '● Active', expired: '✕ Expired', draft: '○ Draft', published: '★ Published' };
  return <span className={map[status] || 'badge bg-gray-500/20 text-gray-400'}>{labels[status] || status}</span>;
};

export default Badge;
