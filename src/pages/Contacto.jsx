import { useState } from 'react';

export default function Contacto() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mensaje enviado. Te responderemos a la brevedad.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Contacto y Soporte Técnico</h2>
        <form onSubmit={handleSubmit}>
          <label>Tu Nombre:</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label>Tu Correo:</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <label>Mensaje:</label>
          <textarea rows="4" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />

          <button type="submit" className="btn-blue" style={{ marginTop: '1rem', width: '100%' }}>Enviar Consulta</button>
        </form>
      </div>
    </div>
  );
}
