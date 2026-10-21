import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts, deleteCategory } from '../../utils/storage.js';

export default function AdminCategorias() {
  const [categories, setCategories] = useState(() => getCategories());
  const products = getProducts();

  const handleDelete = (name) => {
    const count = products.filter((p) => p.category === name).length;
    if (count > 0) {
      alert(`No se puede eliminar "${name}": tiene ${count} producto(s) asociados.`);
      return;
    }
    deleteCategory(name);
    setCategories(getCategories());
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Gestión de Categorías</h2>
        <Link to="/admin/categorias/nueva" className="btn-green">+ Nueva Categoría</Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Productos</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {categories.map((name) => (
                <tr key={name}>
                  <td>{name}</td>
                  <td>{products.filter((p) => p.category === name).length}</td>
                  <td>
                    <Link to={`/admin/categorias/editar?name=${encodeURIComponent(name)}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                    <button onClick={() => handleDelete(name)} className="btn-danger">Eliminar</button>
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
