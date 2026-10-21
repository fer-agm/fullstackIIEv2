import { Link } from 'react-router-dom';

export default function AdminTile({ to, icon, title, desc }) {
  return (
    <div className="col">
      <Link
        to={to}
        className="d-block text-center text-decoration-none h-100"
        style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '1rem', color: 'var(--text-main)' }}
      >
        <div style={{ fontSize: '1.8rem' }}>{icon}</div>
        <strong>{title}</strong>
        <div className="product-meta">{desc}</div>
      </Link>
    </div>
  );
}
