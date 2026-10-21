import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../utils/storage.js';
import { isCritical } from '../../utils/inventory.js';
import { clp, hasOffer } from '../../utils/pricing.js';

export default function AdminProductos() {
  const [products, setProducts] = useState(() => getProducts());

  const handleDelete = (code) => {
    deleteProduct(code);
    setProducts(getProducts());
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2>Gestión de Productos</h2>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/productos/criticos" className="btn-blue">⚠ Stock crítico</Link>
          <Link to="/admin/productos/reportes" className="btn-blue">Reportes</Link>
          <Link to="/admin/productos/nuevo" className="btn-green">+ Nuevo Producto</Link>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.code}>
                  <td>{p.code}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>
                    {hasOffer(p) ? <>{clp(p.offerPrice)} <span className="badge text-bg-danger">Oferta</span></> : clp(p.price)}
                  </td>
                  <td>
                    {p.stock ?? 0}{' '}
                    {isCritical(p) && <span className="badge text-bg-warning">{(p.stock ?? 0) === 0 ? 'Agotado' : 'Crítico'}</span>}
                  </td>
                  <td>
                    <Link to={`/admin/productos/editar?code=${p.code}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Editar</Link>{' '}
                    <button onClick={() => handleDelete(p.code)} className="btn-danger">Eliminar</button>
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
