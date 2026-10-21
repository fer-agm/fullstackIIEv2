import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getUsers, deleteUser } from '../../utils/storage.js';

export default function AdminUsuarios() {
  const { user: session } = useAuth();
  const [users, setUsers] = useState(() => getUsers());

  const handleDelete = (email) => {
    if (session && session.email.toLowerCase() === email.toLowerCase()) {
      alert('No puedes eliminar tu propia cuenta mientras tienes la sesión iniciada.');
      return;
    }
    deleteUser(email);
    setUsers(getUsers());
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Gestión de Usuarios</h2>
        <Link to="/admin/usuarios/nuevo" className="btn-blue">+ Nuevo Usuario</Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Edad</th>
                <th>Rol</th>
                <th>Puntos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.age}</td>
                  <td>{u.role}</td>
                  <td>{u.points}</td>
                  <td>
                    <Link to={`/admin/usuarios/editar?email=${encodeURIComponent(u.email)}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                    <Link to={`/admin/usuarios/historial?email=${encodeURIComponent(u.email)}`} className="btn-green" style={{ fontSize: '0.8rem' }}>Historial</Link>{' '}
                    <button onClick={() => handleDelete(u.email)} className="btn-danger">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
