import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getProducts, getUsers, deleteProduct, deleteUser } from '../utils/storage.js';

export default function AdminHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => getProducts());
  const [users, setUsers] = useState(() => getUsers());
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

  const handleDeleteProduct = (code) => {
    deleteProduct(code);
    setProducts(getProducts());
  };
  const handleDeleteUser = (email) => {
    deleteUser(email);
    setUsers(getUsers());
  };

  return (
    <div className="container">
      <h2>Panel de Administración</h2>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Gestión de Productos</h3>
          <Link to="/admin/productos/nuevo" className="btn-green">+ Nuevo Producto</Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.code}>
                <td>{p.code}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toLocaleString('es-CL')}</td>
                <td>
                  <Link to={`/admin/productos/editar?code=${p.code}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                  <button onClick={() => handleDeleteProduct(p.code)} className="btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Gestión de Usuarios</h3>
          <Link to="/admin/usuarios/nuevo" className="btn-blue">+ Nuevo Usuario</Link>
        </div>
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
                  <button onClick={() => handleDeleteUser(u.email)} className="btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
