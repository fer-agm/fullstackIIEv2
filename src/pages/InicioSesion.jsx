import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserByEmail } from '../utils/storage.js';

export default function InicioSesion() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = getUserByEmail(email);

    if (user && user.password === pass) {
      login(user);
      alert(`¡Bienvenido ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } else {
      alert('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Iniciar Sesión</h2>

        <div style={{ background: '#1e1e1e', padding: '0.8rem', borderLeft: '3px solid var(--accent-green)', margin: '1rem 0', fontSize: '0.85rem' }}>
          <strong>Credenciales de prueba:</strong><br />
          • <strong>Administrador:</strong> admin@levelup.cl | clave: admin<br />
          • <strong>Cliente Duoc:</strong> estudiante@duoc.cl | clave: 123
        </div>

        <form onSubmit={handleSubmit}>
          <label>Correo Electrónico:</label>
          <input type="email" required placeholder="admin@levelup.cl" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Contraseña:</label>
          <input type="password" required placeholder="admin" value={pass} onChange={(e) => setPass(e.target.value)} />

          <button type="submit" className="btn-blue" style={{ marginTop: '1.5rem', width: '100%' }}>Ingresar</button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ color: 'var(--accent-green)' }}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
