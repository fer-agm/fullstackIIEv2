import { Link } from 'react-router-dom';
import { getOrders } from '../../utils/storage.js';
import { clp } from '../../utils/pricing.js';
import OrderStatusBadge from '../../components/admin/OrderStatusBadge.jsx';

export default function AdminOrdenes() {
  const orders = [...getOrders()].reverse(); // más recientes primero

  return (
    <div>
      <h2>Órdenes / Boletas</h2>
      <div className="card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Aún no hay órdenes.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>#{o.id}</td>
                    <td>{new Date(o.date).toLocaleString('es-CL')}</td>
                    <td>{o.customer.nombre} {o.customer.apellidos}</td>
                    <td>{o.customer.correo}</td>
                    <td>{clp(o.total)}</td>
                    <td><OrderStatusBadge status={o.status} /></td>
                    <td><Link to={`/admin/ordenes/${o.id}`} className="btn-blue" style={{ fontSize: '0.8rem' }}>Ver boleta</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
