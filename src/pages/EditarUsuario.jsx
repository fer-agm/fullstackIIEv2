import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getUserByEmail, updateUser } from '../utils/storage.js';

export default function EditarUsuario() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user: sessionUser, login } = useAuth();
  const email = params.get('email');
  const [original] = useState(() => getUserByEmail(email));

  const [form, setForm] = useState({
    name: original?.name ?? '',
    age: original?.age ?? '',
    role: original?.role ?? 'user',
    points: original?.points ?? '',
  });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...original,
      name: form.name,
      age: parseInt(form.age),
      role: form.role,
      points: parseInt(form.points),
    };
    updateUser(updated);
    // si el admin se edita a sí mismo, mantener la sesión sincronizada
    if (sessionUser && sessionUser.email.toLowerCase() === updated.email.toLowerCase()) login(updated);
    alert('Usuario actualizado correctamente.');
    navigate('/admin/usuarios');
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo (No editable):</label>
          <input type="email" value={original?.email ?? ''} readOnly style={{ opacity: 0.6 }} />

          <label>Nombre Completo:</label>
          <input type="text" required value={form.name} onChange={set('name')} />

          <label>Edad:</label>
          <input type="number" required min="18" value={form.age} onChange={set('age')} />

          <label>Rol:</label>
          <select value={form.role} onChange={set('role')}>
            <option value="user">Usuario Cliente</option>
            <option value="admin">Administrador</option>
          </select>

          <label>Puntos LevelUp:</label>
          <input type="number" required min="0" value={form.points} onChange={set('points')} />

          <button type="submit" className="btn-blue" style={{ marginTop: '1.5rem', width: '100%' }}>Actualizar Usuario</button>
        </form>
      </div>
    </div>
  );
}
