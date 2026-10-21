import { Link } from 'react-router-dom';

const ICONS = {
  'Juegos de Mesa': '🎲',
  Accesorios: '🎧',
  Consolas: '🎮',
  'Computadores Gamers': '🖥️',
  'Sillas Gamers': '💺',
  Mouse: '🖱️',
  Mousepad: '🟦',
  'Poleras Personalizadas': '👕',
};

export default function CategoryTile({ name, count, active }) {
  return (
    <div className="col">
      <Link
        to={`/categorias?cat=${encodeURIComponent(name)}`}
        className="d-block text-center text-decoration-none h-100"
        style={{
          background: '#181818',
          border: `1px solid ${active ? 'var(--accent-green)' : '#2a2a2a'}`,
          borderRadius: '8px',
          padding: '1rem 0.5rem',
          color: 'var(--text-main)',
        }}
      >
        <div style={{ fontSize: '2rem' }}>{ICONS[name] || '🕹️'}</div>
        <strong style={{ fontSize: '0.9rem' }}>{name}</strong>
        <div className="product-meta">{count} producto{count === 1 ? '' : 's'}</div>
      </Link>
    </div>
  );
}
