import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { clp } from '../utils/pricing.js';

export default function Header() {
  const { user, logout } = useAuth();
  const { subtotal } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  const level = user ? (user.points >= 500 ? 'Leyenda' : user.points >= 200 ? 'Pro Gamer' : 'Novato') : '';

  return (
    <header className="navbar navbar-expand-lg navbar-dark d-print-none">
      <Link to="/" className="brand-logo">LEVEL-UP GAMER</Link>

      <button
        className="navbar-toggler"
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className={`navbar-collapse collapse ${open ? 'show' : ''}`}>
        <nav className="navbar-nav ms-lg-auto me-lg-3 align-items-lg-center" onClick={() => setOpen(false)}>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/categorias">Categorías</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" style={{ color: 'var(--accent-green)' }}>Panel Admin</Link>
          )}
        </nav>

        <div className="d-flex flex-wrap align-items-center gap-2 mt-2 mt-lg-0">
          <Link
            to="/carrito"
            className="btn-green"
            style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
            onClick={() => setOpen(false)}
          >
            🛒 Carrito {clp(subtotal)}
          </Link>

          {user ? (
            <span className="user-badge">
              👤 {user.name} ({user.role.toUpperCase()}) |{' '}
              {user.isDuoc ? '🎓 20% Descuento Duoc' : 'Estándar'} |{' '}
              💎 {user.points} Pts ({level}) |{' '}
              <a href="#" onClick={handleLogout} style={{ color: 'red', marginLeft: '5px' }}>Salir</a>
            </span>
          ) : (
            <span className="user-badge">
              Invitado | <Link to="/login" style={{ color: 'var(--accent-green)' }} onClick={() => setOpen(false)}>Iniciar Sesión</Link>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
