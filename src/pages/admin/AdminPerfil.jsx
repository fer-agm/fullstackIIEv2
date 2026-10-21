import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { getUserByEmail, updateUser } from '../../utils/storage.js';

export default function AdminPerfil() {
  const { user, login } = useAuth();
  const current = getUserByEmail(user.email) || user;

  const [form, setForm] = useState({ name: current.name, age: current.age, currentPass: '', newPass: '', confirmPass: '' });
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = { ...current, name: form.name.trim(), age: parseInt(form.age) };

    if (form.newPass || form.currentPass || form.confirmPass) {
      if (form.currentPass !== current.password) {
        alert('La contraseña actual no es correcta.');
        return;
      }
      if (form.newPass.length < 4) {
        alert('La nueva contraseña debe tener al menos 4 caracteres.');
        return;
      }
      if (form.newPass !== form.confirmPass) {
        alert('La confirmación no coincide con la nueva contraseña.');
        return;
      }
      updated.password = form.newPass;
    }

    updateUser(updated);
    login(updated); // mantiene la sesión sincronizada
    setForm({ ...form, currentPass: '', newPass: '', confirmPass: '' });
    alert('Perfil actualizado correctamente.');
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <div className="card">
        <h2>Mi Perfil</h2>
        <form onSubmit={handleSubmit}>
          <label>Correo (No editable):</label>
          <input type="email" value={current.email} readOnly style={{ opacity: 0.6 }} />

          <label>Nombre Completo:</label>
          <input type="text" required value={form.name} onChange={set('name')} />

          <label>Edad:</label>
          <input type="number" required min="18" value={form.age} onChange={set('age')} />

          <h5 className="mt-4">Cambiar contraseña (opcional)</h5>
          <label>Contraseña actual:</label>
          <input type="password" value={form.currentPass} onChange={set('currentPass')} />
          <label>Nueva contraseña:</label>
          <input type="password" value={form.newPass} onChange={set('newPass')} />
          <label>Confirmar nueva contraseña:</label>
          <input type="password" value={form.confirmPass} onChange={set('confirmPass')} />

          <button type="submit" className="btn-blue" style={{ marginTop: '1.5rem', width: '100%' }}>Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}
