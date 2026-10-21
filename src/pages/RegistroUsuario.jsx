import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUserLogic } from '../utils/storage.js';

export default function RegistroUsuario() {
  const [form, setForm] = useState({ name: '', email: '', pass: '', age: '', ref: '' });
  const navigate = useNavigate();
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (registerUserLogic(form.name, form.email, form.pass, parseInt(form.age), form.ref)) {
      navigate('/login');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Registro de Usuario</h2>
        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          * Requisito: Solo mayores de 18 años. Usa tu correo @duoc.cl para obtener un 20% de descuento de por vida.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Nombre Completo:</label>
          <input type="text" required value={form.name} onChange={set('name')} />

          <label>Correo Electrónico:</label>
          <input type="email" required placeholder="ejemplo@duoc.cl" value={form.email} onChange={set('email')} />

          <label>Contraseña:</label>
          <input type="password" required value={form.pass} onChange={set('pass')} />

          <label>Edad (Años):</label>
          <input type="number" required min="1" value={form.age} onChange={set('age')} />

          <label>Código de Referido (Opcional):</label>
          <input type="text" placeholder="Ej: REF123" value={form.ref} onChange={set('ref')} />

          <button type="submit" className="btn-green" style={{ marginTop: '1.5rem', width: '100%' }}>Crear Cuenta</button>
        </form>
      </div>
    </div>
  );
}
