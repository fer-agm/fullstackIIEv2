import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/ordenes', label: 'Órdenes', icon: '🧾' },
  { to: '/admin/productos', label: 'Productos', icon: '📦' },
  { to: '/admin/categorias', label: 'Categorías', icon: '🏷️' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
  { to: '/admin/reportes', label: 'Reportes', icon: '📈' },
  { to: '/admin/perfil', label: 'Perfil', icon: '👤' },
];

// Layout del panel: barra superior + menú lateral. Solo accede un administrador.
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const alerted = useRef(false);
  const isAdmin = !!user && user.role === 'admin';

  useEffect(() => {
    if (!isAdmin && !alerted.current) {
      alerted.current = true;
      alert('Acceso restringido para administradores.');
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <header className="navbar navbar-dark d-print-none">
        <span className="brand-logo">LEVEL-UP GAMER <small style={{ fontSize: '0.7rem', color: 'var(--accent-blue)' }}>ADMIN</small></span>
        <div className="d-flex align-items-center gap-2">
          <span className="user-badge d-none d-sm-inline">👤 {user.name}</span>
          <button className="btn btn-outline-light btn-sm d-lg-none" onClick={() => setOpen(!open)}>☰ Menú</button>
        </div>
      </header>

      <div className="container-fluid flex-grow-1">
        <div className="row">
          <aside className={`col-lg-2 py-3 admin-sidebar d-lg-block d-print-none ${open ? 'd-block' : 'd-none'}`}>
            <div className="d-flex flex-column gap-1" onClick={() => setOpen(false)}>
              {LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `admin-link${isActive ? ' active' : ''}`}>
                  {l.icon} {l.label}
                </NavLink>
              ))}
            </div>
            <hr />
            <div className="d-grid gap-2">
              <Link to="/" className="btn btn-dark btn-sm">🏪 Tienda</Link>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          </aside>

          <main className="col-lg-10 py-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
