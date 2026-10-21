const VARIANTS = {
  primary: { background: 'var(--accent-blue)', color: '#fff' },
  success: { background: '#198754', color: '#fff' },
  warning: { background: '#ffc107', color: '#000' },
  danger: { background: '#dc3545', color: '#fff' },
};

export default function StatCard({ title, value, sub, variant = 'primary' }) {
  return (
    <div className="col">
      <div style={{ ...VARIANTS[variant], borderRadius: '8px', padding: '1rem' }} className="h-100">
        <div style={{ fontWeight: 'bold' }}>{title}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.8rem' }}>{sub}</div>}
      </div>
    </div>
  );
}
